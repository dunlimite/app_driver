/**
 * Jest Setup File
 * This file runs BEFORE the test framework is installed.
 * Use CommonJS (require) syntax here - no ES imports.
 */

// ─── Gesture Handler Mock ─────────────────────────────────────────────────────
require('react-native-gesture-handler/jestSetup');

// ─── Reanimated Mock ──────────────────────────────────────────────────────────
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => { };
  return Reanimated;
});

// ─── Native Animated Helper ───────────────────────────────────────────────────
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// ─── Async Storage ────────────────────────────────────────────────────────────
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// ─── Splash Screen ────────────────────────────────────────────────────────────
jest.mock('react-native-splash-screen', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

// ─── Device Info ──────────────────────────────────────────────────────────────
jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '1.0.0'),
  getBuildNumber: jest.fn(() => '1'),
  getUniqueId: jest.fn(() => 'test-unique-id'),
  isEmulator: jest.fn(() => Promise.resolve(false)),
  getSystemVersion: jest.fn(() => '14.0'),
}));

// ─── Firebase App ─────────────────────────────────────────────────────────────
jest.mock('@react-native-firebase/app', () => ({
  default: jest.fn(),
}));

// ─── Firebase Crashlytics ─────────────────────────────────────────────────────
jest.mock('@react-native-firebase/crashlytics', () => () => ({
  log: jest.fn(),
  recordError: jest.fn(),
  setCrashlyticsCollectionEnabled: jest.fn(),
}));

// ─── React Native Vector Icons ────────────────────────────────────────────────
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// ─── NetInfo ──────────────────────────────────────────────────────────────────
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

// ─── Safe Area Context ────────────────────────────────────────────────────────
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));
