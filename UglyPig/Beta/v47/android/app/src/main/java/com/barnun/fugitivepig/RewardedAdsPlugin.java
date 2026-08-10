package com.barnun.fugitivepig;

import android.content.pm.ApplicationInfo;
import android.os.Handler;
import android.os.Looper;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

import java.util.ArrayList;
import java.util.List;

@CapacitorPlugin(name = "RewardedAds")
public class RewardedAdsPlugin extends Plugin {
  private static final String TEST_REWARDED_AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917";
  private static final String RELEASE_REWARDED_AD_UNIT_ID = "ca-app-pub-4314734514343043/2398232500";

  private RewardedAd rewardedAd;
  private boolean isLoading;
  private boolean consentFlowInProgress;
  private boolean mobileAdsInitialized;
  private ConsentInformation consentInformation;
  private final List<AdsReadyCallback> pendingAdsReadyCallbacks = new ArrayList<>();
  private PluginCall pendingShowCall;
  private boolean rewardEarned;
  private final Handler mainHandler = new Handler(Looper.getMainLooper());
  private final Runnable pendingShowTimeout = () -> {
    if (pendingShowCall != null && rewardedAd == null) {
      rejectPendingShowCall("Rewarded ad was not ready in time.");
    }
  };

  @Override
  public void load() {
    getActivity().runOnUiThread(() -> {
      ensureAdsCanLoad(new AdsReadyCallback() {
        @Override
        public void onReady() {
          loadRewardedAd();
        }

        @Override
        public void onUnavailable(String message) {
          // Ads stay disabled until UMP says they can be requested.
        }
      });
    });
  }

  @PluginMethod
  public void showRewardedAd(PluginCall call) {
    getActivity().runOnUiThread(() -> {
      if (pendingShowCall != null) {
        call.reject("A rewarded ad is already being shown.");
        return;
      }

      pendingShowCall = call;
      ensureAdsCanLoad(new AdsReadyCallback() {
        @Override
        public void onReady() {
          if (rewardedAd != null) {
            showLoadedRewardedAd();
            return;
          }

          schedulePendingShowTimeout();
          loadRewardedAd();
        }

        @Override
        public void onUnavailable(String message) {
          rejectPendingShowCall(message);
        }
      });
    });
  }

  @PluginMethod
  public void prepareRewardedAd(PluginCall call) {
    getActivity().runOnUiThread(() -> {
      ensureAdsCanLoad(new AdsReadyCallback() {
        @Override
        public void onReady() {
          loadRewardedAd();

          JSObject result = new JSObject();
          result.put("loaded", rewardedAd != null);
          result.put("loading", isLoading);
          call.resolve(result);
        }

        @Override
        public void onUnavailable(String message) {
          call.reject(message);
        }
      });
    });
  }

  private void loadRewardedAd() {
    if (!canRequestAds()) return;
    if (isLoading || rewardedAd != null) return;

    isLoading = true;
    RewardedAd.load(
      getContext(),
      getRewardedAdUnitId(),
      new AdRequest.Builder().build(),
      new RewardedAdLoadCallback() {
        @Override
        public void onAdFailedToLoad(LoadAdError loadAdError) {
          isLoading = false;
          rewardedAd = null;
          rejectPendingShowCall("Rewarded ad failed to load: " + loadAdError.getMessage());
        }

        @Override
        public void onAdLoaded(RewardedAd loadedRewardedAd) {
          isLoading = false;
          rewardedAd = loadedRewardedAd;
          if (pendingShowCall != null) {
            showLoadedRewardedAd();
          }
        }
      }
    );
  }

  private void showLoadedRewardedAd() {
    if (rewardedAd == null || pendingShowCall == null) return;

    cancelPendingShowTimeout();
    rewardEarned = false;
    RewardedAd adToShow = rewardedAd;
    rewardedAd = null;

    adToShow.setFullScreenContentCallback(new FullScreenContentCallback() {
      @Override
      public void onAdDismissedFullScreenContent() {
        if (pendingShowCall != null) {
          if (rewardEarned) {
            JSObject result = new JSObject();
            result.put("rewarded", true);
            pendingShowCall.resolve(result);
          } else {
            pendingShowCall.reject("Rewarded ad was closed before the reward was earned.");
          }
          pendingShowCall = null;
        }
        loadRewardedAd();
      }

      @Override
      public void onAdFailedToShowFullScreenContent(AdError adError) {
        rejectPendingShowCall("Rewarded ad failed to show: " + adError.getMessage());
        loadRewardedAd();
      }
    });

    adToShow.show(getActivity(), rewardItem -> rewardEarned = true);
  }

  private void rejectPendingShowCall(String message) {
    if (pendingShowCall == null) return;
    cancelPendingShowTimeout();
    pendingShowCall.reject(message);
    pendingShowCall = null;
  }

  private void schedulePendingShowTimeout() {
    cancelPendingShowTimeout();
    mainHandler.postDelayed(pendingShowTimeout, 12000);
  }

  private void cancelPendingShowTimeout() {
    mainHandler.removeCallbacks(pendingShowTimeout);
  }

  private String getRewardedAdUnitId() {
    boolean isDebuggable = (getContext().getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
    return isDebuggable ? TEST_REWARDED_AD_UNIT_ID : RELEASE_REWARDED_AD_UNIT_ID;
  }

  private void ensureAdsCanLoad(AdsReadyCallback callback) {
    if (canRequestAds()) {
      initializeMobileAdsIfNeeded(callback);
      return;
    }

    pendingAdsReadyCallbacks.add(callback);
    gatherConsentIfNeeded();
  }

  private void gatherConsentIfNeeded() {
    if (consentFlowInProgress) return;

    consentFlowInProgress = true;
    consentInformation = UserMessagingPlatform.getConsentInformation(getContext());
    ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();

    consentInformation.requestConsentInfoUpdate(
      getActivity(),
      params,
      () -> UserMessagingPlatform.loadAndShowConsentFormIfRequired(
        getActivity(),
        formError -> {
          consentFlowInProgress = false;
          if (formError != null && !canRequestAds()) {
            notifyAdsUnavailable("Consent form error: " + formError.getMessage());
            return;
          }

          if (canRequestAds()) {
            initializeMobileAdsIfNeeded(new AdsReadyCallback() {
              @Override
              public void onReady() {
                notifyAdsReady();
              }

              @Override
              public void onUnavailable(String message) {
                notifyAdsUnavailable(message);
              }
            });
            return;
          }

          notifyAdsUnavailable("User consent is required before requesting ads.");
        }
      ),
      requestConsentError -> {
        consentFlowInProgress = false;
        if (canRequestAds()) {
          initializeMobileAdsIfNeeded(new AdsReadyCallback() {
            @Override
            public void onReady() {
              notifyAdsReady();
            }

            @Override
            public void onUnavailable(String message) {
              notifyAdsUnavailable(message);
            }
          });
          return;
        }

        notifyAdsUnavailable("Consent update error: " + requestConsentError.getMessage());
      }
    );
  }

  private boolean canRequestAds() {
    return consentInformation != null && consentInformation.canRequestAds();
  }

  private void initializeMobileAdsIfNeeded(AdsReadyCallback callback) {
    if (mobileAdsInitialized) {
      if (callback != null) callback.onReady();
      return;
    }

    mobileAdsInitialized = true;
    MobileAds.initialize(getContext(), initializationStatus -> {
      if (callback != null) callback.onReady();
    });
  }

  private void notifyAdsReady() {
    List<AdsReadyCallback> callbacks = new ArrayList<>(pendingAdsReadyCallbacks);
    pendingAdsReadyCallbacks.clear();
    for (AdsReadyCallback callback : callbacks) {
      callback.onReady();
    }
  }

  private void notifyAdsUnavailable(String message) {
    List<AdsReadyCallback> callbacks = new ArrayList<>(pendingAdsReadyCallbacks);
    pendingAdsReadyCallbacks.clear();
    for (AdsReadyCallback callback : callbacks) {
      callback.onUnavailable(message);
    }
  }

  private interface AdsReadyCallback {
    void onReady();
    void onUnavailable(String message);
  }
}
