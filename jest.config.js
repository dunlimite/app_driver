module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Runs BEFORE the test framework — global mocks and polyfills
  setupFiles: ['<rootDir>/jest/setup.js'],

  // Transform these node_modules packages that ship as ES Modules
  transformIgnorePatterns: [
    'node_modules/(?!(' +
    'react-native' +
    '|@react-native' +
    '|@react-native-community' +
    '|@react-navigation' +
    '|react-native-gesture-handler' +
    '|react-native-reanimated' +
    '|react-native-safe-area-context' +
    '|react-native-screens' +
    '|react-native-vector-icons' +
    '|react-native-linear-gradient' +
    '|react-native-sound-player' +
    '|@gorhom' +
    ')/)',
  ],
}
