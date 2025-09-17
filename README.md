# OrderingPlus - App Driver

## Description

This repository is an app Driver template using functional components. It includes a submodule from another repository.

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

- Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.
- Ensure you have Xcode or Android Studio installed.
> Android https://developer.android.com/studio. Android Studio Instructions https://developer.android.com/studio/install
- Install node version recommended: `v18.13.0`
- Install Java version 17. You can install it [here](https://www.oracle.com/java/technologies/downloads)
> For Android:
> 1. Set the JAVA and ANDROID_STUDIO environment variables.
> 2. Run the simulator https://d.pr/i/AGAKVt
> 3. Turn on the Device simulator https://d.pr/i/WPeXHb

> For iOS:
> 1. Set the JAVA environment variables
> 2. Install Xcode
> 3. Install cocoapods https://guides.cocoapods.org/using/getting-started.html
> 4. Run the simulator, preferably iOS last version

## Clone repository

1. Open your Terminal
2. Clone repository writing:
```
git clone --recursive https://github.com/OrderingPlus/app-driver.git
```
3. Enter the downloaded repository folder
```
cd app-driver
```
4. Run
```
rm -rf node_modules yarn.lock && yarn
```
4.a For iOS: Run
```
cd ios && pod install --repo-update && cd ..
```
4.b For Android: Run
```
cd android && ./gradlew clean && cd ..
```

## Step 1: Start your Application

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 2: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `TemplateApp.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your Driver App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Format code

run `yarn lint` to execute the linter.

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.
> If you previously installed a global react-native-cli package, please remove it as it may cause unexpected issues:
```bash
   npm uninstall -g react-native-cli @react-native-community/cli
```
- **ERROR WITH NODE VERSION:** You need to use node version => 16
  > node version recommended: v18.13.0
- **ERROR WITH Java VERSION:** You need to use Java version => 17
- **ERROR RUNNING ON DEVICE:** For any error running the app on a device you can check [this docs](https://reactnative.dev/docs/running-on-device)
- You may encounter conflicts when installing CocoaPods if the gem version is not updated or not the required version for CocoaPods. If this happens, you need to update your gem versions, following the conflicts mentioned by the terminal. For example:
`ERROR: Error installing cocoapods: The last version of activesupport (>= 5.0, < 8) to support your Ruby & RubyGems was 6.1.7.7`. Try installing it with `gem install activesupport -v 6.1.7.7` and then running the current command again. activesupport requires Ruby version `>= 2.7.0`. The current Ruby version is `2.6.10.210`

Therefore, you would need to add the following command to the terminal (which is the same as mentioned in the terminal error):
```
gem install drb -v 2.0.6
```

- If you encounter a permissions problem while trying to install the gem version you need, such as the following error: `ERROR: While executing gem ... (Gem::FilePermissionError)`. You don't have write permissions for the `/Library/Ruby/Gems/2.6.0 directory`.

Then you need to grant permissions, which you can do with the following command:
```
export GEM_HOME="$HOME/.gem"
```

With this, you should have permissions, and you can reinstall the gem version you need (This should be the version mentioned in the gem version error.): `gem install drb -v 2.0.6`

After that, try running again:
```
gem install cocoapods
```

You can follow the information in this [link](https://guides.cocoapods.org/using/getting-started.html)

---
- `Error: Failed to build iOS project. "xcodebuild" exited with error code '70'`. To debug build logs further, consider building your app with Xcode.app, by opening `'deliveryApp.xcworkspace'`.
- Command failed with exit code 1. https://d.pr/i/i2Mbgu
> This error may occur because the iOS version you are using is not compatible. Please try using a higher version of iOS. I encountered the error with iOS 15.1, which was resolved using iOS 17.4 (the last one installed).
> 1. Make sure that you have the iOS version enabled in `Xcode/Settings/Platforms` https://d.pr/i/1ixZIF https://d.pr/i/eYGyN2.
> 2. Once enabled, add or open a simulator with that version in Xcode/Open developer tool/Simulator https://d.pr/i/2p4X2b.
> 3. Within the simulator, go to File/New simulator https://d.pr/i/WiJDPG, and choose iOS 17.4 (the last one) as the version https://d.pr/i/yecsKu.

- Error on Android: Failed to install the app. Make sure you have an Android emulator running or a device connected.
> - Ensure you have run the simulator https://d.pr/i/AGAKVt, and you turned on the Device simulator https://d.pr/i/WPeXHb



# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
