//Components
import { AcceptOrRejectOrder } from './src/components/AcceptOrRejectOrder';
import { BusinessController } from './src/components/BusinessController';
import { BusinessProductList } from './src/components/BusinessProductList';
import { Chat } from './src/components/Chat';
import { FloatingButton } from './src/components/FloatingButton';
import { ForgotPasswordForm } from './src/components/ForgotPasswordForm';
import { GoogleMap } from './src/components/GoogleMap';
import { Home } from './src/components/Home';
import { LanguageSelector } from './src/components/LanguageSelector';
import { LoginForm } from './src/components/LoginForm';
import { LogoutButton } from './src/components/LogoutButton';
import { MessagesOption } from './src/components/MessagesOption';
import { NetworkError } from './src/components/NetworkError';
import { NotFoundSource } from './src/components/NotFoundSource';
import { OrderMessage } from './src/components/OrderMessage';
import { OrderDetailsDelivery } from './src/components/OrderDetails/Delivery';
import { OrdersOption } from './src/components/OrdersOption';
import { OrdersOptionMap } from './src/components/OrdersOptionMap';
import { OrdersListManager } from './src/components/OrdersListManager';
import { OrdersOptionStatus } from './src/components/OrdersOptionStatus';
import { OrdersOptionBusiness } from './src/components/OrdersOptionBusiness';
import { OrdersOptionCity } from './src/components/OrdersOptionCity';
import { OrdersOptionDate } from './src/components/OrdersOptionDate';
import { OrdersOptionDelivery } from './src/components/OrdersOptionDelivery';
import { OrdersOptionDriver } from './src/components/OrdersOptionDriver';
import { OrdersOptionPaymethod } from './src/components/OrdersOptionPaymethod';
import { OrderSummary } from './src/components/OrderSummary';
import { PhoneInputNumber } from './src/components/PhoneInputNumber';
import { PreviousMessages } from './src/components/PreviousMessages';
import { PreviousOrders } from './src/components/PreviousOrders';
import { ProductItemAccordion } from './src/components/ProductItemAccordion';
import { ReviewCustomer } from './src/components/ReviewCustomer'
import { SearchBar } from './src/components/SearchBar';
import { SignupForm } from './src/components/SignupForm';
import { PhoneNumberVerify } from './src/components/PhoneNumberverify'
import { StoresList } from './src/components/StoresList';
import { UserFormDetailsUI } from './src/components/UserFormDetails';
import { UserProfileForm } from './src/components/UserProfileForm';
import { VerifyPhone } from './src/components/VerifyPhone';
import { DriverMap } from './src/components/DriverMap';
import { MapViewUI as MapView } from './src/components/MapView'
import { NewOrderNotification } from './src/components/NewOrderNotification';
import { DriverSchedule } from './src/components/DriverSchedule';
import { ScheduleBlocked } from './src/components/ScheduleBlocked';
import { OrderDetailsLogistic } from './src/components/OrderDetailsLogistic'
import { NotificationSetting } from './src/components/NotificationSetting'
import { Sessions } from './src/components/Sessions';
import { WebsocketStatus } from './src/components/WebsocketStatus';
import { DriverEarnings } from './src/components/DriverEarnings';
// import { SignUpDriver } from './src/components/SignupUserDetails';
import { Loader } from './src/components/Loader';
import { WithDraMethod } from './src/components/WithdrawMethod'
import { Payout } from './src/components/Payout'
import { DriverMessage } from './src/components/DriverMessage'
import {LoginCheckDriverDelivery} from './src/components/DriverCheckBeforeDeliver'
//OComponents
import {
  OText,
  OButton,
  OInput,
  OIcon,
  OFab,
  OIconButton,
  OTextarea,
  OAlert,
  OAlertOriginal,
  OModal,
  OToast,
  OLink,
  ODropDown,
  ODropDownCalendar
} from './src/components/shared';

// context
import { ThemeProvider, useTheme } from './src/context/Theme'
import { OfflineActionsContext, OfflineActionsProvider, useOfflineActions } from './src/context/OfflineActions'

//layouts
import { Container } from './src/layouts/Container';
import { SafeAreaContainer } from './src/layouts/SafeAreaContainer';
import { SafeAreaContainerLayout } from './src/layouts/SafeAreaContainer';

// hooks
import { useLocation } from './src/hooks/useLocation';
import { useCountdownTimer } from './src/hooks/useCountdownTimer';
import { DeviceOrientationMethods, LANDSCAPE, PORTRAIT, useDeviceOrientation } from './src/hooks/DeviceOrientation';

// providers
import { StoreMethods } from './src/providers/StoreUtil';
import { SignUpDriver } from './src/components/DriverSignup';
import { SignupDetails } from './src/components/SignupUserDetails';
import { CustomerDiscloser } from './src/components/SignupUserDetails/CustomerDiscloser';
import { CustomerUserDetails } from './src/components/SignupUserDetails/UserDetails';
import { CustomerLisence } from './src/components/SignupUserDetails/Driverlisence';
import { CustomerVehicleList } from './src/components/SignupUserDetails/VehicleList';
import { CustomerInsurance } from './src/components/SignupUserDetails/DriverInsuranceDetails';

import { CustomerBackgroundCheck } from './src/components/SignupUserDetails/BackgroundCheck';
import { CustomerprofileConfirm } from './src/components/SignupUserDetails/PhotoConfirmationpage';
import { CheckProgreess } from './src/components/SignupUserDetails/CheckingProgress';

export {
  //Components
  AcceptOrRejectOrder,
  BusinessController,
  BusinessProductList,
  Chat,
  DriverMap,
  FloatingButton,
  ForgotPasswordForm,
  GoogleMap,
  Home,
  LanguageSelector,
  LoginForm,
  LogoutButton,
  MessagesOption,
  MapView,
  NewOrderNotification,
  NetworkError,
  NotFoundSource,
  OrderDetailsDelivery,
  OrderMessage,
  OrdersOption,
  OrdersOptionMap,
  OrdersListManager,
  OrdersOptionStatus,
  OrdersOptionBusiness,
  OrdersOptionCity,
  OrdersOptionDate,
  OrdersOptionDelivery,
  OrdersOptionDriver,
  OrdersOptionPaymethod,
  OrderSummary,
  PhoneInputNumber,
  PreviousMessages,
  PreviousOrders,
  ProductItemAccordion,
  ReviewCustomer,
  SafeAreaContainerLayout,
  SearchBar,
  Sessions,
  SignupForm,
  StoresList,
  UserFormDetailsUI,
  UserProfileForm,
  VerifyPhone,
  DriverSchedule,
  ScheduleBlocked,
  OrderDetailsLogistic,
  NotificationSetting,
  WebsocketStatus,
  //OComponents
  OAlert,
  OAlertOriginal,
  OButton,
  OIcon,
  OIconButton,
  OInput,
  OLink,
  OFab,
  OModal,
  OToast,
  OText,
  OTextarea,
  ODropDown,
  ODropDownCalendar,
  //layouts
  Container,
  SafeAreaContainer,
  // hooks
  useLocation,
  useCountdownTimer,
  DeviceOrientationMethods,
  LANDSCAPE,
  PORTRAIT,
  useDeviceOrientation,
  //context
  ThemeProvider,
  useTheme,
  OfflineActionsContext,
  OfflineActionsProvider,
  useOfflineActions,
  // providers
  StoreMethods,
  SignUpDriver,
  PhoneNumberVerify,
  SignupDetails,
  DriverEarnings,
  Loader, WithDraMethod,
  Payout,
  DriverMessage,
  LoginCheckDriverDelivery,
  CustomerDiscloser,
  CustomerUserDetails,
  CustomerLisence,
  CustomerVehicleList,
  CustomerInsurance,
  CustomerBackgroundCheck,
  CustomerprofileConfirm,
  CheckProgreess


};
