module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Runs BEFORE the test framework — global mocks and polyfills
  setupFiles: ['<rootDir>/jest/setup.js'],

  // Transform ALL react-native ecosystem packages that ship as ES Modules.
  // Using a single broad pattern to avoid adding packages one-by-one.
  transformIgnorePatterns: [
    'node_modules/(?!(' +
    'react-native' +
    '|@react-native' +
    '|@react-native-async-storage' +
    '|@react-native-clipboard' +
    '|@react-native-community' +
    '|@react-native-firebase' +
    '|@react-navigation' +
    '|@gorhom' +
    '|@stripe' +
    '|@fatnlazycat' +
    '|@twotalltotems' +
    '|react-native-app-intro-slider' +
    '|react-native-awesome-alerts' +
    '|react-native-awesome-loading' +
    '|react-native-background-fetch' +
    '|react-native-background-timer' +
    '|react-native-calendar-picker' +
    '|react-native-country-picker-modal' +
    '|react-native-date-picker' +
    '|react-native-developer-options' +
    '|react-native-device-info' +
    '|react-native-document-picker' +
    '|react-native-elements' +
    '|react-native-fast-image' +
    '|react-native-geocoding' +
    '|react-native-geolocation-service' +
    '|react-native-gesture-handler' +
    '|react-native-gifted-chat' +
    '|react-native-google-places-autocomplete' +
    '|react-native-html-to-pdf' +
    '|react-native-image-picker' +
    '|react-native-intersection-observer' +
    '|react-native-iphone-x-helper' +
    '|react-native-keyboard-aware-scroll-view' +
    '|react-native-lightbox-v2' +
    '|react-native-linear-gradient' +
    '|react-native-loading-spinner-overlay' +
    '|react-native-map-link' +
    '|react-native-maps' +
    '|react-native-maps-directions' +
    '|react-native-modal' +
    '|react-native-onesignal' +
    '|react-native-otp-textinput' +
    '|react-native-paper' +
    '|react-native-permissions' +
    '|react-native-phone-number-input' +
    '|react-native-picker-select' +
    '|react-native-print' +
    '|react-native-progress' +
    '|react-native-raw-bottom-sheet' +
    '|react-native-reanimated' +
    '|react-native-recaptcha-that-works' +
    '|react-native-restart' +
    '|react-native-safe-area-context' +
    '|react-native-screens' +
    '|react-native-select-dropdown' +
    '|react-native-sensors' +
    '|react-native-signature-canvas' +
    '|react-native-sound-player' +
    '|react-native-splash-screen' +
    '|react-native-svg' +
    '|react-native-swipe-gestures' +
    '|react-native-vector-icons' +
    '|react-native-webview' +
    '|rn-config-reader' +
    '|rn-placeholder' +
    '|rn-swipe-button' +
    '|toggle-react-native' +
    '|toggle-switch-react-native' +
    ')/)',
  ],
}
