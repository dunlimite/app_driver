module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Runs BEFORE the test framework — global mocks and polyfills
  setupFiles: ['<rootDir>/jest/setup.js'],

  // Transform ALL react-native ecosystem packages that ship as ES Modules.
  // This broad pattern avoids adding packages one-by-one.
  transformIgnorePatterns: [
    'node_modules/(?!(' +
    // Core React Native
    'react-native' +
    '|@react-native' +
    '|@react-native-community' +
    // Navigation
    '|@react-navigation' +
    // Common RN libraries that use ESM
    '|react-native-iphone-x-helper' +
    '|react-native-sound-player' +
    '|react-native-gesture-handler' +
    '|react-native-reanimated' +
    '|react-native-safe-area-context' +
    '|react-native-screens' +
    '|react-native-vector-icons' +
    '|react-native-linear-gradient' +
    '|react-native-maps' +
    '|react-native-permissions' +
    '|react-native-fast-image' +
    '|react-native-image-picker' +
    '|react-native-document-picker' +
    '|react-native-device-info' +
    '|react-native-onesignal' +
    '|react-native-paper' +
    '|react-native-modal' +
    '|react-native-svg' +
    '|react-native-camera' +
    '|@gorhom' +
    '|@stripe' +
    ')/)',
  ],
}
