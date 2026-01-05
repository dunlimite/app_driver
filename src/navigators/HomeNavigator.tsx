import * as React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSession, useOrder, useConfig } from 'ordering-components-external/native';

import BottomNavigator from '../navigators/BottomNavigator';
import CheckoutNavigator from '../navigators/CheckoutNavigator';

import AddressList from '../pages/AddressList';
import AddressForm from '../pages/AddressForm';
import OrderDetails from '../pages/OrderDetails';
import MessageDetails from '../pages/MessageDetails';
import BusinessProductsList from '../pages/BusinessProductsList';
import ProductDetails from '../pages/ProductDetails';
import UpsellingPage from '../pages/UpsellingPage';
import ReviewOrder from '../pages/ReviewOrder';
import ReviewProducts from '../pages/ReviewProducts';
import ReviewDriver from '../pages/ReviewDriver';
import MomentOption from '../pages/MomentOption';
import OrderTypes from '../pages/OrderTypes';
import Splash from '../pages/Splash';
import { UserProfileForm } from 'ordering-ui-native-release/themes/original';
import Help from '../pages/Help';
import BusinessPreorder from '../pages/BusinessPreorder';
import Messages from '../pages/Messages'
import Wallets from '../pages/Wallets'
import Favorite from '../pages/Favorite';
import BusinessListingSearch from '../pages/BusinessListingSearch'
import Promotions from '../pages/Promotions'
import Sessions from '../pages/Sessions';
import MyOrders from '../pages/MyOrders';
import MultiOrdersDetails from '../pages/MultiOrdersDetails';
import Notificaions from '../pages/Notifications'
import CheckoutPage from '../pages/Checkout';
import Home from '../pages/Home';
import HelpOptions from '../pages/HelpOptions';

import { Container } from 'ordering-ui-native-release/themes/original';
import { HelpOrder } from '../components/HelpOrder'
import { HelpGuide } from '../components/HelpGuide'
import { HelpAccountAndPayment } from '../components/HelpAccountAndPayment'
import settings from '../config';

const Stack = createStackNavigator();

const HomeNavigator = (e: any) => {
  const { navigation } = e;

  const theme = useTheme();
  const [orderState] = useOrder();
  const [{ auth }] = useSession();
  const [{ configs }] = useConfig()

  const unaddressedTypes = configs?.unaddressed_order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []
  const isAllowUnaddressOrderType = unaddressedTypes.includes(orderState?.options?.type)

  const profileProps = {
    ...e,
    useSessionUser: true,
    useValidationFields: true,
    goToBack: () => navigation?.canGoBack() && navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) =>
      navigation.navigate(route, params),
  };

  React.useEffect(() => {
    if (e?.route?.params?.orderIdParam) {
      e.navigation.navigate('OrderDetails', { orderId: e?.route?.params?.orderIdParam })
    } else if (e?.route?.params?.cartUuidParam) {
      e.navigation.navigate('CheckoutNavigator', { screen: 'CheckoutPage', cartUuid: e?.route?.params?.cartUuidParam })
    } else if (e?.route?.params?.storeParam) {
      e.navigation.navigate('Business',
        {
          store: e?.route?.params?.storeParam,
          ...e?.route?.params?.productParam
        }
      )
    }
  }, [])

  const isChewLayout = true ?? theme?.business_view?.components?.header?.components?.layout?.type === 'chew'
  return (
    <Stack.Navigator>
      {!orderState.loading ||
        (orderState?.options?.user_id && orderState.loading) ||
        orderState?.options?.address?.location ? (
        <>
          {auth ? (
            <>
              {!orderState?.options?.address?.location && !isAllowUnaddressOrderType &&
                !orderState.loading ? (
                <>
                  <Stack.Screen
                    name="AddressListInitial"
                    component={AddressList}
                    options={{ headerShown: false }}
                    initialParams={{ afterSignup: true }}
                  />
                  <Stack.Screen
                    name="AddressFormInitial"
                    component={AddressForm}
                    options={{ headerShown: false }}
                    initialParams={{ afterSignup: true }}
                  />
                </>
              ) : (
                <>
                  {!!Object.keys(e?.route?.params?.productLogin || {})
                    ?.length && !settings?.businessSlug && (
                      <Stack.Screen
                        name="BusinessAfterLogin"
                        component={BusinessProductsList}
                        options={{ headerShown: false }}
                        initialParams={{
                          productLogin: e?.route?.params?.productLogin,
                        }}
                      />
                    )}
                  <Stack.Screen
                    name="BottomTab"
                    children={() => (
                      <View style={{ flex: 1, backgroundColor: theme.colors.backgroundPage }}>
                        <BottomNavigator />
                      </View>
                    )}
                    options={{ headerShown: false }}
                    initialParams={{ notification_state: e?.route?.params?.notification_state }}
                  />
                  <Stack.Screen
                    name="CheckoutNavigator"
                    component={CheckoutNavigator}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="OrderDetails"
                    component={OrderDetails}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="MessageDetails"
                    component={MessageDetails}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Business"
                    component={BusinessProductsList}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="ReviewOrder"
                    component={ReviewOrder}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="ReviewProducts"
                    component={ReviewProducts}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="ReviewDriver"
                    component={ReviewDriver}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="CheckoutPage"
                    component={CheckoutPage}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="MomentOption"
                    component={MomentOption}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="AddressList"
                    component={AddressList}
                    options={{ headerShown: false }}
                    initialParams={{ afterSignup: false, isGoBack: true }}
                  />
                  <Stack.Screen
                    name="AddressForm"
                    component={AddressForm}
                    options={{ headerShown: false }}
                    initialParams={{ afterSignup: false }}
                  />
                  <Stack.Screen
                    name="ProfileForm"
                    children={() => (
                      <KeyboardAvoidingView
                        enabled
                        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                      >
                        <Container>
                          <UserProfileForm {...profileProps} />
                        </Container>
                      </KeyboardAvoidingView>
                    )}
                    options={{ headerShown: false }}
                    initialParams={{ afterSignup: false }}
                  />
                  <Stack.Screen
                    name="Messages"
                    component={Messages}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Wallets"
                    component={Wallets}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Notifications"
                    component={Notificaions}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="ProductDetails"
                    component={ProductDetails}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="UpsellingPage"
                    component={UpsellingPage}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Favorite"
                    component={Favorite}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Help"
                    children={(props: any) => <Help {...props} />}
                    options={{ headerShown: false }}
                    initialParams={{ afterSignup: false }}
                  />
                  <Stack.Screen
                    name="HelpOptions"
                    component={HelpOptions}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="OrderTypes"
                    component={OrderTypes}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="BusinessPreorder"
                    component={BusinessPreorder}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="BusinessSearch"
                    component={BusinessListingSearch}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Promotions"
                    component={Promotions}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Sessions"
                    component={Sessions}
                    options={{ headerShown: false }}
                  />
                  {isChewLayout && (
                    <Stack.Screen
                      name="MyOrders"
                      component={MyOrders}
                      options={{ headerShown: false }}
                    />
                  )}
                  <Stack.Screen
                    name="MultiOrdersDetails"
                    component={MultiOrdersDetails}
                    options={{ headerShown: false }}
                  />
                </>
              )}
            </>
          ) : (
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
          )}
        </>
      ) : (
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default HomeNavigator;
