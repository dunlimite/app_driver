module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Runs BEFORE the test framework — use for polyfills and global mocks
  setupFiles: ['<rootDir>/jest/setup.js'],

  // Runs AFTER jest is set up — for library-level setup (e.g. gesture handler)
  setupFilesAfterFramework: [
    '@react-native/jest/setup',
  ],

  // Tell Jest to transform these RN packages (they ship as ES modules)
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
    '|@gorhom' +
    ')/)',
  ],
}

