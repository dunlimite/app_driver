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

// ─── Sound Player ─────────────────────────────────────────────────────────────
jest.mock('react-native-sound-player', () => ({
  playUrl: jest.fn(),
  playSoundFile: jest.fn(),
  stop: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  seek: jest.fn(),
  addEventListener: jest.fn(),
}));

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

// ─── iPhone X Helper ──────────────────────────────────────────────────────────
jest.mock('react-native-iphone-x-helper', () => ({
  isIphoneX: jest.fn(() => false),
  ifIphoneX: jest.fn((iphoneXStyle, regularStyle) => regularStyle),
  getStatusBarHeight: jest.fn(() => 0),
  getBottomSpace: jest.fn(() => 0),
}));

// ─── Maps ─────────────────────────────────────────────────────────────────────
jest.mock('react-native-maps', () => {
  const React = require('react');
  const MapView = (props) => React.createElement('MapView', props);
  MapView.Marker = (props) => React.createElement('Marker', props);
  MapView.Polyline = (props) => React.createElement('Polyline', props);
  return { __esModule: true, default: MapView, ...MapView };
});

// ─── Background Timer ─────────────────────────────────────────────────────────
jest.mock('react-native-background-timer', () => ({
  runBackgroundTimer: jest.fn(),
  stopBackgroundTimer: jest.fn(),
  setTimeout: jest.fn(),
  clearTimeout: jest.fn(),
  setInterval: jest.fn(),
  clearInterval: jest.fn(),
}));

// ─── OneSignal ────────────────────────────────────────────────────────────────
jest.mock('react-native-onesignal', () => ({
  setAppId: jest.fn(),
  promptForPushNotificationsWithUserResponse: jest.fn(),
  setNotificationOpenedHandler: jest.fn(),
  setNotificationWillShowInForegroundHandler: jest.fn(),
}));
