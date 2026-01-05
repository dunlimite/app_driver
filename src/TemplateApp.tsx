/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import { LogBox, StatusBar, Platform } from 'react-native';
import { NavigationContainer, getPathFromState, getStateFromPath } from '@react-navigation/native';
import { OrderingProvider } from 'ordering-components-external/native';
import SplashScreen from 'react-native-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OToast, Alert, ThemeProvider, FacebookPixel } from 'ordering-ui-native-release';
import { AnalyticsSegment } from 'ordering-ui-native-release/themes/original';
import RootNavigator from './navigators/RootNavigator';

import { navigationRef } from './navigators/NavigationRef';

import settings from './config.js';
import theme from './theme.json';
import UpdatedThemeProvider from './contexts/UpdatedThemeProvider';
import { PermissionsProvider } from './contexts/UpdatedThemeProvider/PermissionsContext';
import DeviceInfo from 'react-native-device-info';

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Non-serializable values were found in the navigation state.',
  'Setting a timer',
  'The `value` prop is required for the `<Context.Provider>`',
  "Can't perform a React state update",
  'Remote debugger',
  'Task orphaned for request',
  "JSON value '<null>'",
  'VirtualizedLists should never be nested',
  'Could not receive settings from Segment',
  'No info about this app'
]);

theme.images = {
  logos: {
    logotype: require('./assets/images/logotype.png'),
    logotypeInvert: require('./assets/images/logo-long.png'),
  },
  tutorials: {
    slide1: require('./assets/images/slide1.png'),
    slide2: require('./assets/images/slide2.png'),
    slide3: require('./assets/images/slide3.png'),
    slide4: require('./assets/images/slide4.png'),
    slide5: require('./assets/images/slide5.png'),
    slide6: require('./assets/images/slide6.png'),
  },
  general: {
    homeHero: require('./assets/images/home-hero.png'),
    appointment: require('./assets/images/appointment.png'),
    notFound: require('./assets/images/not-found.png'),
    emptyActiveOrders: require('./assets/images/empty-active-orders.png'),
    emptyPastOrders: require('./assets/images/empty-past-orders.png'),
    menu: require('./assets/icons/menu.png'),
    lunch: require('./assets/icons/lunch.png'),
    arrow_up: require('./assets/icons/arrow_up.png'),
    arrow_left: require('./assets/icons/arrow_left.png'),
    arrow_right: require('./assets/icons/arrow_right.png'),
    arrow_down: require('./assets/icons/arrow_down.png'),
    map: require('./assets/icons/map.png'),
    marker: require('./assets/images/marker.png'),
    email: require('./assets/icons/ic_email.png'),
    lock: require('./assets/icons/ic_lock.png'),
    camera: require('./assets/icons/ic_camera.png'),
    support: require('./assets/icons/help.png'),
    trash: require('./assets/icons/ic_trash.png'),
    phone: require('./assets/icons/phone.png'),
    mail: require('./assets/icons/mail.png'),
    chat: require('./assets/icons/chat.png'),
    user: require('./assets/icons/menu-user.png'),
    menulogout: require('./assets/icons/menu-logout.png'),
    cash: require('./assets/icons/cash.png'),
    carddelivery: require('./assets/icons/card-delivery.png'),
    paypal: require('./assets/icons/paypal.png'),
    stripe: require('./assets/icons/stripe.png'),
    stripecc: require('./assets/icons/cc-stripe.png'),
    stripes: require('./assets/icons/stripe-s.png'),
    stripesb: require('./assets/icons/stripe-sb.png'),
    creditCard: require('./assets/icons/credit-card.png'),
    google: require('./assets/icons/ic_google.png'),
    pin: require('./assets/icons/ic_location_pin.png'),
    tag_home: require('./assets/icons/tag_home.png'),
    tag_building: require('./assets/icons/tag_building.png'),
    tag_heart: require('./assets/icons/tag_heart.png'),
    tag_plus: require('./assets/icons/tag_plus.png'),
    option_normal: require('./assets/icons/option_normal.png'),
    option_checked: require('./assets/icons/option_checked.png'),
    chevron_right: require('./assets/icons/chevron-right.png'),
    chevron_left: require('./assets/icons/chevron-left.png'),
    clock: require('./assets/icons/ic_clock.png'),
    pencil: require('./assets/icons/ic_pencil.png'),
    search: require('./assets/icons/ic_search.png'),
    star: require('./assets/icons/ic_star.png'),
    info: require('./assets/icons/ic_info.png'),
    close: require('./assets/icons/ic_close.png'),
    minus: require('./assets/icons/ic_minus_circle.png'),
    plus: require('./assets/icons/ic_plus_circle.png'),
    radio_nor: require('./assets/icons/ic_radio_nor.png'),
    radio_act: require('./assets/icons/ic_radio_act.png'),
    check_act: require('./assets/icons/ic_check_act.png'),
    check_nor: require('./assets/icons/ic_check_nor.png'),
    half_l: require('./assets/icons/ic_half_l.png'),
    half_f: require('./assets/icons/ic_full.png'),
    half_r: require('./assets/icons/ic_half_r.png'),
    drop_up: require('./assets/icons/ic_drop_up.png'),
    drop_down: require('./assets/icons/ic_drop_down.png'),
    logout: require('./assets/icons/ic_logout.png'),
    language: require('./assets/icons/ic_language.png'),
    ic_help: require('./assets/icons/ic_help.png'),
    enter: require('./assets/icons/ic_enter.png'),
    attach: require('./assets/icons/ic_attach.png'),
    tiktok: require('./assets/icons/tiktok.png'),
    image: require('./assets/icons/ic_image.png'),
    help: require('./assets/images/help.png'),
    noNetwork: require('./assets/images/no-network.png'),
    applePayMark: require('./assets/images/apple_pay_mark.png'),
    googlePayMark: require('./assets/images/google_pay_mark.png'),
    driverPng: require('./assets/images/driver.png'),
    heart: require('./assets/gifs/heart.json'),

  },
  backgrounds: {
    business_list_header: require('./assets/images/business_list_banner.jpg'),
  },
  order: {
    status0: require('./assets/images/status-0.png'),
    status1: require('./assets/images/status-1.png'),
    status2: require('./assets/images/status-2.png'),
    status3: require('./assets/images/status-3.png'),
    status4: require('./assets/images/status-4.png'),
    status5: require('./assets/images/status-5.png'),
    status6: require('./assets/images/status-6.png'),
    status7: require('./assets/images/status-7.png'),
    status8: require('./assets/images/status-8.png'),
    status9: require('./assets/images/status-9.png'),
    status10: require('./assets/images/status-10.png'),
    status11: require('./assets/images/status-11.png'),
    status12: require('./assets/images/status-12.png'),
    status13: require('./assets/images/status-13.png'),
  },
  tabs: {
    explorer: require('./assets/icons/tab_explor.png'),
    promotions: require('./assets/icons/tab_promotions.png'),
    my_carts: require('./assets/icons/tab_mycarts.png'),
    orders: require('./assets/icons/tab_orders.png'),
    profile: require('./assets/icons/tab_profile.png'),
    wallets: require('./assets/icons/tab_wallet.png'),
  },
  categories: {
    all: require('./assets/images/categories/category-all.png'),
  },
  dummies: {
    product: require('./assets/images/dummies/product.png'),
    businessHeader: require('./assets/images/dummies/business.jpg'),
    businessLogo: require('./assets/images/dummies/store.png'),
    driverPhoto:
      'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://www.freeiconspng.com/thumbs/driver-icon/driver-icon-14.png',
    customerPhoto:
      'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png',
    loyaltyLevel: require('./assets/images/loyalty_level.png')
  },
  orderTypes: {
    type1: require('./assets/images/ordertypes/delivery.png'),
    type2: require('./assets/images/ordertypes/pickup.png'),
    type3: require('./assets/images/ordertypes/eatin.png'),
    type4: require('./assets/images/ordertypes/curbside.png'),
    type5: require('./assets/images/ordertypes/drivethru.png'),
    type7: require('./assets/images/ordertypes/cateringdelivery.png'),
    type8: require('./assets/images/ordertypes/cateringpickup.png'),
  },
};

const TemplateApp = () => {
  const appVersion = DeviceInfo.getVersion()
  const appName = DeviceInfo.getApplicationName()
  const userAgent = appName + '/' + appVersion + ' (' + Platform.OS + ')'

  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  const CustomStatusBar = ({ backgroundColor, barStyle = 'dark-content' }: any) => {
    return (
      <StatusBar
        animated={true}
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
    )
  }

  const linking = {
    prefixes: [`${settings.app_scheme}://`],
    config: {
      screens: {
        MyAccount: {
          screens: {
            BottomTab: 'home',
            Business: 'store/:store/:category?/:categoryId?/:product?/:productId?',
            CheckoutNavigator: 'checkout/:cartUuid',
            OrderDetails: 'order/:orderId'
          }
        },
        NotFound: '*'
      }
    }
  };

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor={theme.colors.backgroundPage} />
      <ThemeProvider theme={theme}>
        <OrderingProvider settings={{ ...settings, userAgent: userAgent }} Alert={Alert}>
          <AnalyticsSegment />
          <FacebookPixel />
          <NavigationContainer ref={navigationRef} linking={linking}>
            <PermissionsProvider>
              <UpdatedThemeProvider theme={theme}>
                <RootNavigator />
              </UpdatedThemeProvider>
            </PermissionsProvider>
          </NavigationContainer>
          <OToast />
        </OrderingProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default TemplateApp;
