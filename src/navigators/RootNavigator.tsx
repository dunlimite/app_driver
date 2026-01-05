import React, { useState, useEffect } from 'react';
import { Platform, Vibration, AppState, Alert as NativeAlert, BackHandler, Linking } from 'react-native';
import VersionCheck from 'react-native-version-check'
import { createStackNavigator } from '@react-navigation/stack';
import { useOrder, useSession, useConfig, useApi, useWebsocket, useLanguage } from 'ordering-components-external/native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import OneSignal from 'react-native-onesignal';
import NetInfo from '@react-native-community/netinfo'

dayjs.extend(isSameOrAfter);
dayjs.extend(utc);

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Forgot from '../pages/ForgotPassword';
import Home from '../pages/Home';
import IntroductoryTutorial from '../pages/IntroductoryTutorial';
import AddressForm from '../pages/AddressForm';
import MomentOption from '../pages/MomentOption';
import Splash from '../pages/Splash';
import BusinessList from '../pages/BusinessesListing';
import BusinessProductsList from '../pages/BusinessProductsList';
import NotFound from '../pages/NotFound';
import HomeNavigator from './HomeNavigator';
import settings from '../config.js';
import * as RootNavigation from '../navigators/NavigationRef';
import {
  _retrieveStoreData,
  _setStoreData,
  orderTypeList
} from 'ordering-ui-native-release/themes/original';
import OrderTypes from '../pages/OrderTypes';
import ProductDetails from '../pages/ProductDetails';
import UpsellingPage from '../pages/UpsellingPage';
import UserVerification from '../pages/UserVerification';
import NetworkError from '../pages/NetworkError';
import BusinessPreorder from '../pages/BusinessPreorder';

const Stack = createStackNavigator();
const RootNavigator = () => {
  const [{ auth, user, loading: sessionLoading, token }] = useSession();
  const [orderStatus, { changeMoment }] = useOrder();
  const [ordering] = useApi()
  const socket = useWebsocket()
  const [{ configs, loading: configsLoading }] = useConfig();
  const [, t] = useLanguage()
  const [loaded, setLoaded] = useState(false);
  const [productLogin, setProductLogin] = useState<any>({});
  const [orderIdParam, setOrderIdParam] = useState(null)
  const [cartUuidParam, setCartUuidParam] = useState(null)
  const [storeParam, setStoreParam] = useState(null)
  const [productParam, setProductParam] = useState<any>(null)

  const [oneSignalState, setOneSignalState] = useState<any>({
    notification_app: settings.notification_app,
  });
  const [isTutorial, setTutorial] = useState(settings.show_tutorials);
  const [isPushLoading, setIsPushLoading] = useState({ loading: true });
  const [connectionState, setConnectionState] = useState<{
    connection_status: boolean;
  } | null>(null);
  const [appState, setAppState] = useState(AppState.currentState)

  const isEmailVerifyRequired = auth && configs?.verification_email_required?.value === '1' && !user?.email_verified
  const isPhoneVerifyRequired = auth && configs?.verification_phone_required?.value === '1' && !user?.phone_verified
  const isUserVerifyRequired = isEmailVerifyRequired || isPhoneVerifyRequired
  const isEnableAppVersionCheck = configs?.app_version?.value === '1'
  const isGuest = user?.guest_id

  const validDate = (date: any) => {
    if (!date) {
      return;
    }
    const _date = dayjs(date, 'YYYY-MM-DD HH:mm').isSameOrAfter(dayjs(), 'day')
      ? dayjs(date).format('YYYY-MM-DD HH:mm')
      : dayjs().format('YYYY-MM-DD HH:mm');
    return _date;
  };

  const oneSignalSetup = async () => {
    setIsPushLoading({ loading: true });
    const data = {
      appId: configs?.onesignal_orderingapp_id?.value,
      externalId: `${ordering?.project}-${user?.id}`,
      email: user?.email,
      cellphone: user?.cellphone
        ? user?.country_phone_code
          ? `+${user?.country_phone_code} ${user?.cellphone}`
          : user?.cellphone
        : ''
    }
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId(data.appId);

    data.email && OneSignal.setEmail(data.email, null, () => {
      OneSignal.setExternalUserId(data.externalId)
    });

    data.cellphone && OneSignal.setSMSNumber(data.cellphone, null, () => {
      OneSignal.setExternalUserId(data.externalId)
    })

    OneSignal.setExternalUserId(data.externalId);

    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      console.log('Prompt response:', response);
    });

    const deviceState: any = await OneSignal.getDeviceState();
    setOneSignalState({
      ...oneSignalState,
      notification_token: deviceState?.userId,
    });

    if (deviceState?.userId) {
      _setStoreData('notification_state', {
        ...oneSignalState,
        notification_token: deviceState?.userId,
      });
    }

    OneSignal.setNotificationOpenedHandler(({ notification }: any) => {
      if (notification?.additionalData?.order_uuid) {
        RootNavigation.navigate('OrderDetails', {
          orderId: notification?.additionalData?.order_uuid,
          isFromRoot: true,
        });
      }
    });

    OneSignal.addSubscriptionObserver((event: any) => {
      setOneSignalState({
        ...oneSignalState,
        notification_token: event?.to?.userId,
      });
      if (!event?.to?.isSubscribed) {
        OneSignal.addTrigger('prompt_ios', 'true');
      }
    });

    setIsPushLoading({ loading: false });
  };

  useEffect(() => {
    if (!loaded && !orderStatus.loading && !isPushLoading.loading) {
      setLoaded(true);
    }
  }, [orderStatus, isPushLoading]);

  useEffect(() => {
    const setTutorialLocal = async () => {
      const data = await _retrieveStoreData('isTutorial');
      if (data === false) {
        setTutorial(false);
      }
    };
    setTutorialLocal();
  }, [isTutorial]);

  useEffect(() => {
    if (!sessionLoading && !isPushLoading.loading && !auth) {
      setLoaded(!auth);
    }
  }, [sessionLoading, isPushLoading]);

  useEffect(() => {
    const _currentDate = dayjs
      .utc(validDate(orderStatus.options?.moment))
      .local();
    if (!_currentDate) {
      return;
    }
    const selected = dayjs(_currentDate, 'YYYY-MM-DD HH:mm');
    const now = dayjs();
    const secondsDiff = selected.diff(now, 'seconds');
    const checkTime = setTimeout(() => {
      changeMoment(null);
    }, secondsDiff * 1000);

    return () => {
      clearTimeout(checkTime);
    };
  }, [orderStatus.options?.moment]);

  useEffect(() => {
    if (configsLoading) {
      return;
    }
    if (configs?.onesignal_orderingapp_id?.value && auth) {
      oneSignalSetup();
    }
    if (!configs?.onesignal_orderingapp_id?.value || !auth) {
      setIsPushLoading({ loading: false });
    }
  }, [configsLoading, configs, auth]);

  const subscribePushNotifications = async () => {
    setIsPushLoading({ loading: true });
    try {
      const url = `${ordering.root}/users/${user.id}/notification_tokens`
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          token: oneSignalState.notification_token,
          user_id: user.id,
          app: oneSignalState.notification_app,
        })
      })
      setIsPushLoading({ loading: false });
    } catch (err) {
      setIsPushLoading({ loading: false });
    }
  }

  useEffect(() => {
    if (auth && oneSignalState.notification_token) {
      subscribePushNotifications()
    }
  }, [oneSignalState.notification_token, auth]);

  let netInfoSuscription: any = null
  useEffect(() => {
    netInfoSuscription = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      netInfoSuscription && netInfoSuscription()
    }
  }, []);

  const handleConnectivityChange = (state: any) => {
    setConnectionState({ connection_status: state.isConnected });
  };

  useEffect(() => {
    if (!orderStatus.loading) {
      const getCountryCode = async () => {
        const data = await _retrieveStoreData('country-code');
        const localCountryCode = orderStatus?.options?.address?.country_code ?? data

        if (localCountryCode) {
          ordering?.setCountryCode(localCountryCode)
        }
      }

      getCountryCode()
    }
  }, [orderStatus])

  useEffect(() => {
    if (!token) return
    const handleVibrationEffect = (value: any) => {
      const status = [7, 11, 19]
      const triggerVibrate = status.find(s => s === value?.status)

      triggerVibrate && Vibration.vibrate()
    }

    socket.on('update_order', (e: any) => handleVibrationEffect(e))
    return () => {
      socket.off('update_order', (e: any) => handleVibrationEffect(e))
    }
  }, [socket, user])

  useEffect(() => {
    const appStateListener: any = AppState.addEventListener(
      'change',
      nextAppState => { setAppState(nextAppState) },
    );
    return () => {
      appStateListener?.remove();
    };
  }, [])

  const checkUpdateNeeded = async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate();
      if (updateNeeded?.isNeeded) {
        NativeAlert.alert(
          t('PLEASE_UPDATE', 'Please update'),
          t('APP_UPDATE_MESSAGE', 'You will have to update your app to the latest version to continue using.'),
          [
            {
              text: t('UPDATE', 'Update'),
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeeded.storeUrl)
              }
            }
          ],
          {
            cancelable: true
          }
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    if (isEnableAppVersionCheck && appState === 'active') {
      checkUpdateNeeded();
    }
  }, [appState, isEnableAppVersionCheck])

  React.useEffect(() => {
    if (RootNavigation?.navigationRef?.current?.getState) {
      const params = RootNavigation?.navigationRef?.current?.getState()
      const myAccountRoute = params?.routes?.find((route: any) => route.name === 'MyAccount')
      if (myAccountRoute?.state?.routes?.length > 0) {
        myAccountRoute?.state?.routes?.map((route: any) => {
          if (route.params?.orderId) {
            setOrderIdParam(route.params?.orderId)
          }
          if (route.params?.cartUuid) {
            setCartUuidParam(route.params?.cartUuid)
          }
          if (route.params?.store) {
            setStoreParam(route.params?.store)
          }
          if (route.params?.productId && route.params?.categoryId) {
            setProductParam(
              {
                categoryId: route?.params?.categoryId,
                businessId: route?.params?.store,
                productId: route?.params?.productId
              }
            )
          }
        })
      }
    }
    return () => {
      setOrderIdParam(null)
      setCartUuidParam(null)
      setStoreParam(null)
      setProductParam(null)
    }
  }, [RootNavigation?.navigationRef?.current, auth, loaded])

  return (
    <Stack.Navigator>
      {!loaded && (
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
      )}
      {loaded && connectionState?.connection_status && (
        <>
          {!auth ? (
            <>
              {isTutorial ? (
                <Stack.Screen
                  name="IntroductoryTutorial"
                  component={IntroductoryTutorial}
                  options={{ headerShown: false }}
                  initialParams={{ setTutorial }}
                />
              ) : (
                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{ headerShown: false }}
                />
              )}
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
                listeners={{
                  state: (e: any) => {
                    const store_slug = e.data?.state?.routes.find(
                      (object: any) => object?.params?.store_slug,
                    )?.params?.store_slug
                    const params = store_slug ? { store_slug } : {}
                    setProductLogin({
                      ...e.data.state.routes.find(
                        (object: any) => object?.params?.product,
                      )?.params?.product,
                      ...params
                    });
                  },
                }}
                initialParams={{ notification_state: oneSignalState }}
              />
              <Stack.Screen
                name="Signup"
                component={Signup}
                options={{ headerShown: false }}
                initialParams={{ notification_state: oneSignalState }}
              />
              <Stack.Screen
                name="Forgot"
                component={Forgot}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AddressForm"
                component={AddressForm}
                options={{ headerShown: false }}
                initialParams={{ businessSlug: settings?.businessSlug }}
              />
              <Stack.Screen
                name="BusinessList"
                component={BusinessList}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Business"
                component={BusinessProductsList}
                options={{ headerShown: false }}
                initialParams={{ setProductLogin }}
              />
              <Stack.Screen
                name="MomentOption"
                component={MomentOption}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="OrderTypes"
                component={OrderTypes}
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
                name="BusinessPreorder"
                component={BusinessPreorder}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              {isUserVerifyRequired && !isGuest ? (
                <Stack.Screen
                  name="UserVerification"
                  component={UserVerification}
                  options={{ headerShown: false }}
                />
              ) : (
                <Stack.Screen
                  name="MyAccount"
                  component={HomeNavigator}
                  options={{ headerShown: false }}
                  initialParams={{ productLogin, orderIdParam, cartUuidParam, storeParam, productParam }}
                />
              )}
            </>
          )}
        </>
      )}
      {connectionState?.connection_status === false ? (
        <Stack.Screen
          name='NetworkError'
          component={NetworkError}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name='NotFound'
          component={NotFound}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};
export default RootNavigator;
