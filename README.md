# Ordering App

# Setup guide
Setup the environment (React Native CLI, stop at "Creating a new application" step):
https://reactnative.dev/docs/0.64/environment-setup?guide=native

Clone the repository:
```
git clone https://github.com/Ordering-Releases/Ordering-App.git
cd Ordering-App
```

run the command:
```
rm -rf node_modules/ yarn.lock  && yarn && cd ios/ && rm -rf Pods Podfile.lock && pod install
```
For iOS
Open Xcode 
```
cd ios
open ReactNativeAppsTemplate5.xcworkspace/
```
select a device and click the play icon

For Android 
Open Android Studio and click the play icon 

FAQ

Issue: If you found this error: [!] Unable to find a specification for `StripePayments (~> 23.3.0)` depended upon by `stripe-react-native`
Solution: run pod install --repo-update

