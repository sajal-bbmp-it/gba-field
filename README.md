This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Running different environments (local / test / prod)

The app has three environments. Each one reads its own env file from the project root:

| `APP_ENV` | File         | Header badge  | Used by default for                   |
| --------- | ------------ | ------------- | ------------------------------------- |
| `local`   | `.env.local` | `LOCAL BUILD` | Debug builds (`npm start`, Jest)      |
| `test`    | `.env.test`  | `TEST BUILD`  | Only when you set `APP_ENV=test`      |
| `prod`    | `.env.prod`  | _(none)_      | Release builds (when `APP_ENV` unset) |

### One-time setup

The `.env.*` files are git-ignored. Create each one from the template and fill in `API_BASE_URL`:

```sh
cp .env.example .env.local   # ENV_LABEL=Local
cp .env.example .env.test    # ENV_LABEL=Test
cp .env.example .env.prod    # ENV_LABEL=   (leave empty so prod shows no badge)
```

Values are baked into the JS bundle at build time, so **never put secrets in these files**. If `API_BASE_URL` still contains `CHANGE-ME`, the app shows a red `UNCONFIGURED BUILD` badge.

### How the environment is picked

- **Debug builds** load JS from Metro, so the environment is whatever **Metro** was started with. The `npm run android` and `npm run ios` commands don't change it.
- **Release builds** bundle the JS during the native build. They use `APP_ENV` from the shell, or `prod` if it isn't set.

Changing `APP_ENV` or any `.env.*` file automatically clears Metro's cache. You only need to **restart Metro** (stop it and start it again).

### Debug (development) builds

Start Metro with the environment you want, then run the app in a second terminal:

```sh
# Local
npm start                      # Metro with APP_ENV=local
npm run android                # or: npm run ios

# Test
npm run start:test             # Metro with APP_ENV=test
npm run android                # or: npm run ios

# Prod API in a debug build (rarely needed)
APP_ENV=prod npx react-native start
```

### Release builds: Android

```sh
# Prod
npm run android:release
# same as: APP_ENV=prod npx react-native run-android --mode release

# Test
APP_ENV=test npx react-native run-android --mode release
```

To build an APK or AAB without installing it:

```sh
cd android
APP_ENV=test ./gradlew assembleRelease   # APK -> android/app/build/outputs/apk/release/
APP_ENV=prod ./gradlew bundleRelease     # AAB -> android/app/build/outputs/bundle/release/
```

### Release builds: iOS

Install pods first (see Step 2), then:

```sh
# Prod
APP_ENV=prod npx react-native run-ios --mode Release

# Test
APP_ENV=test npx react-native run-ios --mode Release
```

**Building or archiving from Xcode:** Xcode doesn't see your terminal's `APP_ENV`, so a Release build or archive uses `prod`. To build a test release from Xcode, create `ios/.xcode.env.local` (git-ignored) with:

```sh
export APP_ENV=test
```

**Delete that line before archiving a prod build.**

### Notes

- `APP_ENV` must be exactly `local`, `test` or `prod`. Any other value fails the build.
- All environments share the same app ID (`in.gov.gba.field`). Installing one build replaces whatever build is already on the device.
- **Android Studio:** a Release build run from Android Studio also falls back to `prod`. To build test, use the commands above.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
