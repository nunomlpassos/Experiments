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

@CapacitorPlugin(name = "RewardedAds")
public class RewardedAdsPlugin extends Plugin {
  private static final String TEST_REWARDED_AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917";
  private static final String RELEASE_REWARDED_AD_UNIT_ID = "ca-app-pub-4314734514343043/2398232500";

  private RewardedAd rewardedAd;
  private boolean isLoading;
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
      MobileAds.initialize(getContext(), initializationStatus -> {});
      loadRewardedAd();
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

      if (rewardedAd != null) {
        showLoadedRewardedAd();
        return;
      }

      schedulePendingShowTimeout();
      loadRewardedAd();
    });
  }

  @PluginMethod
  public void prepareRewardedAd(PluginCall call) {
    getActivity().runOnUiThread(() -> {
      loadRewardedAd();

      JSObject result = new JSObject();
      result.put("loaded", rewardedAd != null);
      result.put("loading", isLoading);
      call.resolve(result);
    });
  }

  private void loadRewardedAd() {
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
}
