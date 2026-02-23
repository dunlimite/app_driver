/**
 * jest/setup.js
 * Runs BEFORE each test suite. Mocks all native React Native packages
 * so Jest (Node.js) doesn't try to load platform binaries.
 * Use CommonJS require() — no ES import syntax here.
 */

// ─────────────────────────────────────────────────────────────────────────────
// GESTURE HANDLER (must be first)
// ─────────────────────────────────────────────────────────────────────────────
require('react-native-gesture-handler/jestSetup');

// ─────────────────────────────────────────────────────────────────────────────
// @UI — Mock the entire barrel to break circular dependency
// src/ui/index.tsx → Delivery.tsx → OrderContentComponent.tsx → @ui (circular)
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('@ui', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  const noop = () => { };
  const MockComp = ({ children }) => React.createElement(View, null, children);
  const MockHook = jest.fn(() => [{}]);

  return {
    // ── Components ───────────────────────────────────────────────────────────
    AcceptOrRejectOrder: MockComp,
    BusinessController: MockComp,
    BusinessProductList: MockComp,
    Chat: MockComp,
    DriverMap: MockComp,
    FloatingButton: MockComp,
    ForgotPasswordForm: MockComp,
    GoogleMap: MockComp,
    Home: MockComp,
    LanguageSelector: MockComp,
    LoginForm: MockComp,
    LogoutButton: MockComp,
    MessagesOption: MockComp,
    MapView: MockComp,
    NewOrderNotification: MockComp,
    NetworkError: MockComp,
    NotFoundSource: MockComp,
    OrderDetailsDelivery: MockComp,
    OrderMessage: MockComp,
    OrdersOption: MockComp,
    OrdersOptionMap: MockComp,
    OrdersListManager: MockComp,
    OrdersOptionStatus: MockComp,
    OrdersOptionBusiness: MockComp,
    OrdersOptionCity: MockComp,
    OrdersOptionDate: MockComp,
    OrdersOptionDelivery: MockComp,
    OrdersOptionDriver: MockComp,
    OrdersOptionPaymethod: MockComp,
    OrderSummary: MockComp,
    PhoneInputNumber: MockComp,
    PreviousMessages: MockComp,
    PreviousOrders: MockComp,
    ProductItemAccordion: MockComp,
    ReviewCustomer: MockComp,
    SafeAreaContainerLayout: MockComp,
    SearchBar: MockComp,
    Sessions: MockComp,
    SignupForm: MockComp,
    StoresList: MockComp,
    UserFormDetailsUI: MockComp,
    UserProfileForm: MockComp,
    VerifyPhone: MockComp,
    DriverSchedule: MockComp,
    ScheduleBlocked: MockComp,
    OrderDetailsLogistic: MockComp,
    NotificationSetting: MockComp,
    WebsocketStatus: MockComp,
    DriverEarnings: MockComp,
    Loader: MockComp,
    WithDraMethod: MockComp,
    Payout: MockComp,
    DriverMessage: MockComp,
    LoginCheckDriverDelivery: MockComp,
    SignUpDriver: MockComp,
    PhoneNumberVerify: MockComp,
    SignupDetails: MockComp,
    CustomerDiscloser: MockComp,
    CustomerUserDetails: MockComp,
    CustomerLisence: MockComp,
    CustomerVehicleList: MockComp,
    CustomerInsurance: MockComp,
    CustomerBackgroundCheck: MockComp,
    CustomerprofileConfirm: MockComp,
    CheckProgreess: MockComp,
    // ── OComponents ──────────────────────────────────────────────────────────
    OText: ({ children }) => React.createElement(Text, null, children),
    OButton: ({ onPress, text }) => React.createElement(TouchableOpacity, { onPress }, React.createElement(Text, null, text)),
    OInput: MockComp,
    OIcon: MockComp,
    OFab: MockComp,
    OIconButton: MockComp,
    OTextarea: MockComp,
    OAlert: MockComp,
    OAlertOriginal: MockComp,
    OModal: MockComp,
    OToast: MockComp,
    OLink: MockComp,
    ODropDown: MockComp,
    ODropDownCalendar: MockComp,
    // ── Layouts ───────────────────────────────────────────────────────────────
    Container: MockComp,
    SafeAreaContainer: MockComp,
    // ── Hooks ─────────────────────────────────────────────────────────────────
    useLocation: jest.fn(() => [{ location: null }, noop]),
    useCountdownTimer: jest.fn(() => [{ timer: 0 }, noop]),
    useDeviceOrientation: jest.fn(() => [{ orientation: 'portrait', dimensions: { width: 390, height: 844 } }]),
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape',
    DeviceOrientationMethods: {
      PORTRAIT: 'portrait',
      LANDSCAPE: 'landscape',
      useDeviceOrientation: jest.fn(() => [{ orientation: 'portrait', dimensions: { width: 390, height: 844 } }]),
    },
    // ── Context ───────────────────────────────────────────────────────────────
    ThemeProvider: MockComp,
    useTheme: jest.fn(() => ({ colors: {}, fonts: {} })),
    OfflineActionsContext: {},
    OfflineActionsProvider: MockComp,
    useOfflineActions: jest.fn(() => [{}]),
    // ── Providers ─────────────────────────────────────────────────────────────
    StoreMethods: MockComp,
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// @COMPONENTS — Mock the entire barrel (ordering-components library)
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('@components', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockComp = ({ children }) => React.createElement(View, null, children);
  const MockHook = jest.fn(() => [{}]);
  const MockContextHook = jest.fn(() => [{ configs: {}, user: {}, token: null }, jest.fn()]);

  return {
    // ── Contexts / Hooks ──────────────────────────────────────────────────────
    useApi: jest.fn(() => [{ project: 'test' }, jest.fn()]),
    useLanguage: jest.fn(() => [{ language: 'en' }, jest.fn((key, fallback) => fallback || key)]),
    useConfig: jest.fn(() => [{ configs: {} }, jest.fn()]),
    useSession: jest.fn(() => [{ user: null, token: null, loading: false }, jest.fn()]),
    useOrder: jest.fn(() => [{ loading: false, options: {} }, jest.fn()]),
    useUtils: jest.fn(() => [{ parsePrice: jest.fn(v => `$${v}`), parseNumber: jest.fn(v => v) }, jest.fn()]),
    useEvent: jest.fn(() => [{ emit: jest.fn(), on: jest.fn(), off: jest.fn() }, jest.fn()]),
    useBusiness: jest.fn(() => [{ business: null }, jest.fn()]),
    useCustomer: jest.fn(() => [{ customer: null }, jest.fn()]),
    useToast: jest.fn(() => [{ toasts: [] }, jest.fn()]),
    useWebsocket: jest.fn(() => [{ socket: null }, jest.fn()]),
    useOrderingTheme: jest.fn(() => [{ theme: {} }, jest.fn()]),
    useValidationFields: jest.fn(() => [{ fields: {} }, jest.fn()]),
    // ── Providers ─────────────────────────────────────────────────────────────
    ApiProvider: MockComp,
    SessionProvider: MockComp,
    OrderProvider: MockComp,
    ConfigProvider: MockComp,
    LanguageProvider: MockComp,
    BusinessProvider: MockComp,
    EventProvider: MockComp,
    ToastProvider: MockComp,
    OrderingProvider: MockComp,
    WebsocketProvider: MockComp,
    ValidationFieldsProvider: MockComp,
    OrderingThemeProvider: MockComp,
    // ── Components ────────────────────────────────────────────────────────────
    OrderDetails: MockComp,
    LoginForm: MockComp,
    SignupForm: MockComp,
    UserFormDetails: MockComp,
    // ── Constants ─────────────────────────────────────────────────────────────
    CODES: {},
  };
});



// ─────────────────────────────────────────────────────────────────────────────
// REANIMATED
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => { };
  return Reanimated;
});

// Suppress Animated: useNativeDriver warning
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// ─────────────────────────────────────────────────────────────────────────────
// @REACT-NATIVE-ASYNC-STORAGE
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// ─────────────────────────────────────────────────────────────────────────────
// @REACT-NATIVE-CLIPBOARD
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('@react-native-clipboard/clipboard', () => ({
  getString: jest.fn(() => Promise.resolve('')),
  setString: jest.fn(),
  hasString: jest.fn(() => Promise.resolve(false)),
}));

// ─────────────────────────────────────────────────────────────────────────────
// @REACT-NATIVE-COMMUNITY/NETINFO
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
  useNetInfo: jest.fn(() => ({ isConnected: true })),
}));

// ─────────────────────────────────────────────────────────────────────────────
// @REACT-NATIVE-FIREBASE/APP
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('@react-native-firebase/app', () => ({
  default: jest.fn(),
  apps: [],
  initializeApp: jest.fn(),
}));

// ─────────────────────────────────────────────────────────────────────────────
// @REACT-NATIVE-FIREBASE/CRASHLYTICS
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('@react-native-firebase/crashlytics', () => () => ({
  log: jest.fn(),
  recordError: jest.fn(),
  crash: jest.fn(),
  setAttribute: jest.fn(),
  setUserId: jest.fn(),
  setCrashlyticsCollectionEnabled: jest.fn(),
}));

// ─────────────────────────────────────────────────────────────────────────────
// @GORHOM/BOTTOM-SHEET
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children }) => React.createElement(View, null, children),
    BottomSheetModal: ({ children }) => React.createElement(View, null, children),
    BottomSheetModalProvider: ({ children }) => React.createElement(View, null, children),
    BottomSheetScrollView: ({ children }) => React.createElement(View, null, children),
    BottomSheetFlatList: ({ children }) => React.createElement(View, null, children),
    BottomSheetView: ({ children }) => React.createElement(View, null, children),
    useBottomSheet: jest.fn(() => ({ expand: jest.fn(), collapse: jest.fn(), close: jest.fn() })),
    useBottomSheetModal: jest.fn(() => ({ present: jest.fn(), dismiss: jest.fn() })),
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// @STRIPE/REACT-STRIPE-JS
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => children,
  CardElement: 'CardElement',
  useStripe: jest.fn(() => ({ confirmPayment: jest.fn() })),
  useElements: jest.fn(() => ({ getElement: jest.fn() })),
  loadStripe: jest.fn(() => Promise.resolve(null)),
}));

// ─────────────────────────────────────────────────────────────────────────────
// @TWOTALLTOTEMS/REACT-NATIVE-OTP-INPUT
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('@twotalltotems/react-native-otp-input', () => 'OTPInput');

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-APP-INTRO-SLIDER
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-app-intro-slider', () => 'AppIntroSlider');

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-AWESOME-ALERTS
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-awesome-alerts', () => 'AwesomeAlert');

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-AWESOME-LOADING
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-awesome-loading', () => 'AwesomeLoading');

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-BACKGROUND-FETCH
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-background-fetch', () => ({
  configure: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  finish: jest.fn(),
  scheduleTask: jest.fn(),
  STATUS_AVAILABLE: 2,
  STATUS_RESTRICTED: 1,
  STATUS_DENIED: 0,
  FETCH_RESULT_NEW_DATA: 0,
  FETCH_RESULT_NO_DATA: 1,
  FETCH_RESULT_FAILED: 2,
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-BACKGROUND-TIMER
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-background-timer', () => ({
  runBackgroundTimer: jest.fn(),
  stopBackgroundTimer: jest.fn(),
  setTimeout: jest.fn(),
  clearTimeout: jest.fn(),
  setInterval: jest.fn(),
  clearInterval: jest.fn(),
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-CALENDAR-PICKER
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-calendar-picker', () => 'CalendarPicker');

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-COUNTRY-PICKER-MODAL
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-country-picker-modal', () => ({
  __esModule: true,
  default: 'CountryPicker',
  getAllCountries: jest.fn(() => Promise.resolve([])),
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-DATE-PICKER
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-date-picker', () => 'DatePicker');

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-DEVELOPER-OPTIONS
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-developer-options', () => ({
  DevMenu: 'DevMenu',
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-DEVICE-INFO
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '1.0.0'),
  getBuildNumber: jest.fn(() => '1'),
  getUniqueId: jest.fn(() => Promise.resolve('test-unique-id')),
  getUniqueIdSync: jest.fn(() => 'test-unique-id'),
  isEmulator: jest.fn(() => Promise.resolve(false)),
  isEmulatorSync: jest.fn(() => false),
  getSystemVersion: jest.fn(() => '14.0'),
  getSystemVersionSync: jest.fn(() => '14.0'),
  getModel: jest.fn(() => 'iPhone'),
  getModelSync: jest.fn(() => 'iPhone'),
  getBrand: jest.fn(() => 'Apple'),
  getBrandSync: jest.fn(() => 'Apple'),
  getDeviceId: jest.fn(() => 'TestDeviceId'),
  getDeviceIdSync: jest.fn(() => 'TestDeviceId'),
  getApplicationName: jest.fn(() => 'App Driver'),
  getApplicationNameSync: jest.fn(() => 'App Driver'),
  getBundleId: jest.fn(() => 'com.deliveryapp'),
  getBundleIdSync: jest.fn(() => 'com.deliveryapp'),
  hasNotch: jest.fn(() => false),
  hasNotchSync: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  isTabletSync: jest.fn(() => false),
  getCarrier: jest.fn(() => Promise.resolve('unknown')),
  getIPAddress: jest.fn(() => Promise.resolve('0.0.0.0')),
  getMacAddress: jest.fn(() => Promise.resolve('02:00:00:00:00:00')),
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-DOCUMENT-PICKER
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-document-picker', () => ({
  pick: jest.fn(() => Promise.resolve([{ uri: 'file://test.pdf', name: 'test.pdf', type: 'application/pdf', size: 1024 }])),
  pickSingle: jest.fn(() => Promise.resolve({ uri: 'file://test.pdf', name: 'test.pdf' })),
  pickMultiple: jest.fn(() => Promise.resolve([])),
  isCancel: jest.fn(() => false),
  isInProgress: jest.fn(() => false),
  types: {
    allFiles: 'public.item',
    images: 'public.image',
    pdf: 'com.adobe.pdf',
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-ELEMENTS
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-elements', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Button: (props) => React.createElement(TouchableOpacity, { onPress: props.onPress }, React.createElement(Text, null, props.title)),
    Input: (props) => React.createElement(View, null),
    Avatar: 'Avatar',
    Card: ({ children }) => React.createElement(View, null, children),
    ListItem: ({ children }) => React.createElement(View, null, children),
    Icon: 'Icon',
    ThemeProvider: ({ children }) => children,
    useTheme: jest.fn(() => ({ theme: {} })),
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-FAST-IMAGE
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-fast-image', () => {
  const React = require('react');
  const { Image } = require('react-native');
  const FastImage = (props) => React.createElement(Image, props);
  FastImage.resizeMode = { contain: 'contain', cover: 'cover', stretch: 'stretch', center: 'center' };
  FastImage.priority = { low: 'low', normal: 'normal', high: 'high' };
  FastImage.cacheControl = { immutable: 'immutable', web: 'web', cacheOnly: 'cacheOnly' };
  FastImage.preload = jest.fn();
  FastImage.clearMemoryCache = jest.fn(() => Promise.resolve());
  FastImage.clearDiskCache = jest.fn(() => Promise.resolve());
  return { __esModule: true, default: FastImage };
});

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-GEOCODING
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-geocoding', () => ({
  init: jest.fn(),
  from: jest.fn(() => Promise.resolve({ results: [{ geometry: { location: { lat: 0, lng: 0 } } }] })),
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-GEOLOCATION-SERVICE
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-geolocation-service', () => ({
  getCurrentPosition: jest.fn((success) =>
    success({ coords: { latitude: 0, longitude: 0, accuracy: 1, altitude: 0, heading: 0, speed: 0 } })
  ),
  watchPosition: jest.fn(() => 1),
  clearWatch: jest.fn(),
  stopObserving: jest.fn(),
  requestAuthorization: jest.fn(() => Promise.resolve('granted')),
  AuthorizationResult: { GRANTED: 'granted', DENIED: 'denied', DISABLED: 'disabled' },
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-GIFTED-CHAT
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-gifted-chat', () => ({
  GiftedChat: 'GiftedChat',
  Bubble: 'Bubble',
  InputToolbar: 'InputToolbar',
  Send: 'Send',
  SystemMessage: 'SystemMessage',
  MessageText: 'MessageText',
  Avatar: 'Avatar',
  Day: 'Day',
  Time: 'Time',
  IMessage: {},
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-GOOGLE-PLACES-AUTOCOMPLETE
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-google-places-autocomplete', () => ({
  GooglePlacesAutocomplete: 'GooglePlacesAutocomplete',
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-HTML-TO-PDF
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-html-to-pdf', () => ({
  convert: jest.fn(() => Promise.resolve({ filePath: '/tmp/test.pdf', numberOfPages: 1, base64: '' })),
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-IMAGE-PICKER
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn((_, callback) => callback({ assets: [{ uri: 'file://photo.jpg' }] })),
  launchImageLibrary: jest.fn((_, callback) => callback({ assets: [{ uri: 'file://photo.jpg' }] })),
  MediaType: { photo: 'photo', video: 'video', mixed: 'mixed' },
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-INTERSECTION-OBSERVER
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-intersection-observer', () => ({
  InView: 'InView',
  useInView: jest.fn(() => [null, false]),
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-KEYBOARD-AWARE-SCROLL-VIEW
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const React = require('react');
  const { ScrollView } = require('react-native');
  return {
    KeyboardAwareScrollView: ({ children, ...props }) => React.createElement(ScrollView, props, children),
    KeyboardAwareFlatList: ({ children, ...props }) => React.createElement(ScrollView, props, children),
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-LIGHTBOX-V2
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-lightbox-v2', () => 'Lightbox');

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-LINEAR-GRADIENT
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-linear-gradient', () => 'LinearGradient');

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-LOADING-SPINNER-OVERLAY
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-loading-spinner-overlay', () => 'Spinner');

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-MAP-LINK
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-map-link', () => ({
  showLocation: jest.fn(() => Promise.resolve()),
  getApps: jest.fn(() => Promise.resolve([])),
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-MAPS
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MapView = ({ children, ...props }) => React.createElement(View, props, children);
  MapView.Marker = ({ children, ...props }) => React.createElement(View, props, children);
  MapView.Polyline = (props) => React.createElement(View, props);
  MapView.Polygon = (props) => React.createElement(View, props);
  MapView.Circle = (props) => React.createElement(View, props);
  MapView.Callout = ({ children }) => React.createElement(View, null, children);
  MapView.UrlTile = (props) => React.createElement(View, props);
  return {
    __esModule: true,
    default: MapView,
    Marker: MapView.Marker,
    Polyline: MapView.Polyline,
    Polygon: MapView.Polygon,
    Circle: MapView.Circle,
    Callout: MapView.Callout,
    UrlTile: MapView.UrlTile,
    PROVIDER_GOOGLE: 'google',
    PROVIDER_DEFAULT: null,
    AnimatedRegion: jest.fn(() => ({
      timing: jest.fn(),
      spring: jest.fn(),
      stopAnimation: jest.fn(),
    })),
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-MAPS-DIRECTIONS
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-maps-directions', () => 'MapViewDirections');

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-MODAL
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-modal', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, isVisible }) =>
      isVisible ? React.createElement(View, null, children) : null,
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-ONESIGNAL
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-onesignal', () => ({
  setAppId: jest.fn(),
  promptForPushNotificationsWithUserResponse: jest.fn(),
  setNotificationOpenedHandler: jest.fn(),
  setNotificationWillShowInForegroundHandler: jest.fn(),
  setExternalUserId: jest.fn(),
  removeExternalUserId: jest.fn(),
  sendTag: jest.fn(),
  deleteTag: jest.fn(),
  getTags: jest.fn(() => Promise.resolve({})),
  getDeviceState: jest.fn(() => Promise.resolve({ userId: 'test-id', pushToken: 'test-token' })),
  disablePush: jest.fn(),
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-OTP-TEXTINPUT
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-otp-textinput', () => 'OtpInput');

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-PAPER
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Provider: ({ children }) => children,
    Button: ({ children, onPress }) => React.createElement(TouchableOpacity, { onPress }, React.createElement(Text, null, children)),
    TextInput: 'TextInput',
    Card: ({ children }) => React.createElement(View, null, children),
    Title: ({ children }) => React.createElement(Text, null, children),
    Paragraph: ({ children }) => React.createElement(Text, null, children),
    Divider: 'Divider',
    Avatar: { Icon: 'AvatarIcon', Image: 'AvatarImage', Text: 'AvatarText' },
    ActivityIndicator: 'ActivityIndicator',
    Modal: 'Modal',
    Portal: { Host: ({ children }) => children, Provider: ({ children }) => children },
    Surface: ({ children }) => React.createElement(View, null, children),
    Chip: 'Chip',
    FAB: 'FAB',
    Snackbar: 'Snackbar',
    ProgressBar: 'ProgressBar',
    RadioButton: {
      Group: ({ children }) => React.createElement(View, null, children),
      Item: 'RadioButtonItem',
      Android: 'RadioButtonAndroid',
    },
    Switch: 'Switch',
    Checkbox: { Item: 'CheckboxItem', Android: 'CheckboxAndroid' },
    useTheme: jest.fn(() => ({ colors: {}, fonts: {} })),
    DefaultTheme: { colors: {}, fonts: {} },
    MD3LightTheme: { colors: {}, fonts: {} },
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-PERMISSIONS
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-permissions', () => ({
  RESULTS: {
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    GRANTED: 'granted',
    BLOCKED: 'blocked',
    LIMITED: 'limited',
  },
  PERMISSIONS: {
    ANDROID: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
      ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
      ACCESS_BACKGROUND_LOCATION: 'android.permission.ACCESS_BACKGROUND_LOCATION',
      CAMERA: 'android.permission.CAMERA',
      READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
      WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE',
      READ_CONTACTS: 'android.permission.READ_CONTACTS',
      CALL_PHONE: 'android.permission.CALL_PHONE',
    },
    IOS: {
      LOCATION_WHEN_IN_USE: 'ios.permission.LOCATION_WHEN_IN_USE',
      LOCATION_ALWAYS: 'ios.permission.LOCATION_ALWAYS',
      CAMERA: 'ios.permission.CAMERA',
      PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY',
      CONTACTS: 'ios.permission.CONTACTS',
      MICROPHONE: 'ios.permission.MICROPHONE',
    },
  },
  check: jest.fn(() => Promise.resolve('granted')),
  request: jest.fn(() => Promise.resolve('granted')),
  requestMultiple: jest.fn(() => Promise.resolve({})),
  checkMultiple: jest.fn(() => Promise.resolve({})),
  checkNotifications: jest.fn(() => Promise.resolve({ status: 'granted', settings: {} })),
  requestNotifications: jest.fn(() => Promise.resolve({ status: 'granted', settings: {} })),
  openSettings: jest.fn(() => Promise.resolve()),
  openLimitedPhotoLibraryPicker: jest.fn(() => Promise.resolve()),
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-PHONE-NUMBER-INPUT
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-phone-number-input', () => 'PhoneInput');

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-PICKER-SELECT
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-picker-select', () => 'RNPickerSelect');

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-PRINT
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-print', () => ({
  print: jest.fn(() => Promise.resolve()),
  printToFile: jest.fn(() => Promise.resolve({ filePath: '/tmp/test.pdf' })),
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-PROGRESS
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-progress', () => ({
  Bar: 'ProgressBar',
  Circle: 'ProgressCircle',
  Pie: 'ProgressPie',
  CircleSnail: 'ProgressCircleSnail',
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-RAW-BOTTOM-SHEET
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-raw-bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  const RBSheet = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({ open: jest.fn(), close: jest.fn() }));
    return React.createElement(View, null, props.children);
  });
  return { __esModule: true, default: RBSheet };
});

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-RECAPTCHA-THAT-WORKS & @FATNLAZYCAT/REACT-NATIVE-RECAPTCHA-V3
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-recaptcha-that-works', () => ({
  __esModule: true,
  default: 'Recaptcha',
}));
jest.mock('@fatnlazycat/react-native-recaptcha-v3', () => ({
  useReCaptcha: jest.fn(() => ({ executeCaptcha: jest.fn(() => Promise.resolve('token')) })),
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-RESTART
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-restart', () => ({
  Restart: jest.fn(),
  default: { Restart: jest.fn() },
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-SAFE-AREA-CONTEXT
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => React.createElement(View, null, children),
    SafeAreaView: ({ children }) => React.createElement(View, null, children),
    SafeAreaConsumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 }),
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
    useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
    initialWindowMetrics: { insets: { top: 0, left: 0, bottom: 0, right: 0 }, frame: { x: 0, y: 0, width: 390, height: 844 } },
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-SCREENS
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  Screen: 'Screen',
  ScreenContainer: 'ScreenContainer',
  NativeScreen: 'NativeScreen',
  NativeScreenContainer: 'NativeScreenContainer',
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-SELECT-DROPDOWN
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-select-dropdown', () => 'SelectDropdown');

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-SENSORS
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-sensors', () => ({
  accelerometer: { subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) },
  gyroscope: { subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) },
  magnetometer: { subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) },
  barometer: { subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) },
  setUpdateIntervalForType: jest.fn(),
  SensorTypes: { accelerometer: 'accelerometer', gyroscope: 'gyroscope' },
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-SIGNATURE-CANVAS
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-signature-canvas', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({ readSignature: jest.fn(), clearSignature: jest.fn() }));
    return React.createElement(View, null);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-SOUND-PLAYER
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-sound-player', () => ({
  playUrl: jest.fn(),
  playSoundFile: jest.fn(),
  loadUrl: jest.fn(),
  loadSoundFile: jest.fn(),
  stop: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  seek: jest.fn(),
  getInfo: jest.fn(() => Promise.resolve({ currentTime: 0, duration: 0 })),
  addEventListener: jest.fn(),
  unmount: jest.fn(),
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-SPLASH-SCREEN
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-splash-screen', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-SVG
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-svg', () => ({
  Svg: 'Svg',
  Circle: 'Circle',
  Ellipse: 'Ellipse',
  G: 'G',
  Text: 'Text',
  TSpan: 'TSpan',
  TextPath: 'TextPath',
  Path: 'Path',
  Polygon: 'Polygon',
  Polyline: 'Polyline',
  Line: 'Line',
  Rect: 'Rect',
  Use: 'Use',
  Image: 'Image',
  Symbol: 'Symbol',
  Defs: 'Defs',
  LinearGradient: 'LinearGradient',
  RadialGradient: 'RadialGradient',
  Stop: 'Stop',
  ClipPath: 'ClipPath',
  Pattern: 'Pattern',
  Mask: 'Mask',
  default: 'Svg',
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-SWIPE-GESTURES
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-swipe-gestures', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, ...props }) => React.createElement(View, props, children),
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-VECTOR-ICONS (all common sets)
// ─────────────────────────────────────────────────────────────────────────────
const mockIcon = 'Icon';
jest.mock('react-native-vector-icons/MaterialIcons', () => mockIcon);
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => mockIcon);
jest.mock('react-native-vector-icons/FontAwesome', () => mockIcon);
jest.mock('react-native-vector-icons/FontAwesome5', () => mockIcon);
jest.mock('react-native-vector-icons/Ionicons', () => mockIcon);
jest.mock('react-native-vector-icons/AntDesign', () => mockIcon);
jest.mock('react-native-vector-icons/Entypo', () => mockIcon);
jest.mock('react-native-vector-icons/EvilIcons', () => mockIcon);
jest.mock('react-native-vector-icons/Feather', () => mockIcon);
jest.mock('react-native-vector-icons/Foundation', () => mockIcon);
jest.mock('react-native-vector-icons/Octicons', () => mockIcon);
jest.mock('react-native-vector-icons/SimpleLineIcons', () => mockIcon);
jest.mock('react-native-vector-icons/Zocial', () => mockIcon);

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-WEBVIEW
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-webview', () => ({
  __esModule: true,
  default: 'WebView',
  WebView: 'WebView',
}));

// ─────────────────────────────────────────────────────────────────────────────
// RN-CONFIG-READER
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('rn-config-reader', () => ({
  __esModule: true,
  default: {
    API_URL: 'https://test-api.example.com',
    ENV: 'test',
    APP_NAME: 'App Driver Test',
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// RN-PLACEHOLDER
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('rn-placeholder', () => ({
  Placeholder: 'Placeholder',
  PlaceholderMedia: 'PlaceholderMedia',
  PlaceholderLine: 'PlaceholderLine',
  Fade: 'Fade',
  Shine: 'Shine',
  ShineOverlay: 'ShineOverlay',
}));

// ─────────────────────────────────────────────────────────────────────────────
// RN-SWIPE-BUTTON
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('rn-swipe-button', () => 'SwipeButton');

// ─────────────────────────────────────────────────────────────────────────────
// SOCKET.IO-CLIENT
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('socket.io-client', () => {
  const mockSocket = {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    connected: false,
    id: 'mock-socket-id',
  };
  return { __esModule: true, default: jest.fn(() => mockSocket), io: jest.fn(() => mockSocket) };
});

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE-REACT-NATIVE & TOGGLE-SWITCH-REACT-NATIVE
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('toggle-react-native', () => 'Toggle');
jest.mock('toggle-switch-react-native', () => 'ToggleSwitch');

// ─────────────────────────────────────────────────────────────────────────────
// IPHONE-X-HELPER
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-iphone-x-helper', () => ({
  isIphoneX: jest.fn(() => false),
  ifIphoneX: jest.fn((iphoneXStyle, regularStyle) => regularStyle ?? {}),
  getStatusBarHeight: jest.fn(() => 0),
  getBottomSpace: jest.fn(() => 0),
}));

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-MAPS DIRECTIONS
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-maps-directions', () => 'MapViewDirections');

// ─────────────────────────────────────────────────────────────────────────────
// REACT-NATIVE-BACKGROUND-FETCH
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('react-native-background-fetch', () => ({
  configure: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  finish: jest.fn(),
}));
