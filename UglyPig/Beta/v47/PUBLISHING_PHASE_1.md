# Publishing Phase 1

## Current Base

- Source: `Alfa/v46.1`
- Phase branch/folder: `Beta/v47`
- Internal game version: `v47`
- Android version code: `47`
- Android version name: `0.1.0-alpha.1`
- Compile SDK: `36`
- Target SDK: `36`
- Developer/studio name: `Barnun`
- Current app name: `Fugitive Pig`
- Current application ID: `com.barnun.fugitivepig`
- Upload key: `C:\Users\nuno_\Documents\Barnun\secrets\android\fugitive-pig-upload-key.jks`
- Local signing properties: `C:\Users\nuno_\Documents\Barnun\secrets\android\fugitive-pig-signing.properties`

## Must Decide Before First Play Store Submission

- Support email.
- Privacy policy URL.
- Whether the game is targeted to children, adults, or a general audience.
- Ad model:
  - rewarded ad for Continue,
  - optional interstitial at Game Over,
  - no gameplay banner by default.

## Recommended Next Edits

- Add a Privacy menu/link before ads go live.
- Add AdMob only with test IDs first.
- Add UMP consent flow before loading ads in EEA/UK/Switzerland.
- Back up the upload key and signing properties outside the repo.
- Do not commit the real signing properties file or print the passwords in chat/logs.

## Build Commands

```powershell
npm ci
npm run build
npx cap sync android
cd android
.\gradlew.bat bundleRelease
```

The Play Store upload artifact is an `.aab` from `android/app/build/outputs/bundle/release/`, not the debug APK used for direct testing.
