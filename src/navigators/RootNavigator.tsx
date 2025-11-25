import React, { useState, useEffect, useContext } from 'react';
import { Platform, AppState, Vibration, View, NativeModules, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import OneSignal from 'react-native-onesignal';
// import BackgroundGeolocation, { Subscription } from "react-native-background-geolocation";
import { RESULTS, request, requestMultiple } from 'react-native-permissions';
import NetInfo from '@react-native-community/netinfo';
import RNConfigReader from 'rn-config-reader';

dayjs.extend(isSameOrAfter);
dayjs.extend(utc);

import { useLocation } from '../hooks/useLocation';
import settings from '../config.json';
import * as RootNavigation from '../navigators/NavigationRef';

import {
  useSession,
  useConfig,
  useOrder,
  useApi,
  useLanguage,
  useWebsocket,
  useToast,
  ToastType
} from '@components';

import HomeNavigator from './HomeNavigator';
import IntroductoryTutorial from '../pages/IntroductoryTutorial';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Forgot from '../pages/ForgotPassword';
import Signup from '../pages/Signup';
import VerifyPhoneNumber from '../pages/PhoneNumberVerify'
import Splash from '../pages/Splash';
import { PermissionsContext } from '../context/PermissionsContext';
import { ScheduleBlocked } from '../pages/ScheduleBlocked';
import RequestPermissions from '../pages/RequestPermissions';
import { StoreMethods } from '../providers/StoreUtil';
import moment from 'moment';
import SignupUserDetails from '../pages/SignupUserDetails';
import NetworkError from '../pages/NetworkError';
// import { CustomerDiscloser } from '@';
import CustomerDiscloserDetials from '../pages/CustomerDiscloser';
import {CustomerUserDetails ,CustomerLisence ,CustomerVehicleList ,CustomerInsurance ,CustomerBackgroundCheck ,CustomerprofileConfirm ,CheckProgreess} from '../ui/index';

const { _setStoreData, _retrieveStoreData, _removeStoreData } = StoreMethods

const Stack = createStackNavigator();

const RootNavigator = () => {
  const [languageState, t] = useLanguage();
  const socket = useWebsocket()
  const [{ user, auth, loading: sessionLoading, token }, { logout, refreshUserInfo }] = useSession();
  const [orderStatus, { handleLogEvent }] = useOrder();
  const [{ configs, loading: configsLoading }] = useConfig();
  const [ordering] = useApi()
  const [, { showToast }] = useToast()

  const isDriverLoginValidated = configs?.driver_login_validation?.value === '1'

  const [isTutorial, setTutorial] = useState(settings.show_tutorials)

  const { followUserLocation, getCurrentLocation } = useLocation();
  const { permissions, checkLocationPermission, getPermissions, isGrantedPermissions } = useContext(PermissionsContext);

  let netInfoSuscription: any = null;

  const [orderId, setOrderId] = useState({
    id: null,
    assignId: null,
    group_id: null
  });
  const [loaded, setLoaded] = useState(false);
  const [isPushLoading, setIsPushLoading] = useState({ loading: true });
  const [oneSignalState, setOneSignalState] = useState<any>({
    notification_app: settings.notification_app,
  });
  const [connectionState, setConnectionState] = useState<{
    type: string;
    connection_status: boolean;
    isInternetReachable?: boolean
  } | null>(null);
  const [permissionsState, setPermissionsState] = useState({
    isGranted: false,
    isDenied: false,
    isLoading: true,
    error: null,
  });
  const [enabled, setEnabled] = useState({ enabled: false, ready: false });
  const [blockedSchedule, setBlockedSchedule] = useState(false)
  const [nextSchedule, setNextSchedule] = useState<any>({ schedule: null, day: null })
  const [loadingSchedule, setLoadingSchedule] = useState(true)

  const updateDriverLocation = async () => {
    if (!user) return
    try {
      const location = await getCurrentLocation()
      if (!location?.latitude || !location?.longitude) {
        showToast(t('ERROR_UPDATING_COORDS', 'Error updating coords'), ToastType.Error)
        return
      }
      await fetch(`${ordering.root}/users/${user.id}/locations`, {
        method: 'POST',
        body: JSON.stringify({
          location: JSON.stringify({ lat: location.latitude, lng: location.longitude, mock: location.mocked, v: '1.0' }),
          driver_id: user.id
        }),
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      })
    } catch { }
  }

  const _handleAppStateChange = async (nextAppState: any) => {
    auth && settings?.validate_developer_mode && handleIsDeveloperMode()
    if (nextAppState === 'active' || nextAppState.match(/inactive|background/)) {
      updateDriverLocation()
      user?.id && refreshUserInfo()
    }
    if (nextAppState === 'active' && permissionsState.isDenied && Platform.OS === 'ios') {
      checkPermissions(true)
    }
    if (nextAppState === 'background' && loaded) {
      handleLogEvent(JSON.stringify([{
        event: 'set_app_in_background',
        author_id: user?.id,
        data: { platform: Platform.OS }
      }]))
    }
  }

  const handleConnectivityChange = (state: any) => {
    setConnectionState({ connection_status: state.isConnected, isInternetReachable: state.isInternetReachable, type: state.type });
  };

  const oneSignalSetup = async () => {
    setIsPushLoading({ loading: true });
    OneSignal.setLogLevel(6, 0);
    const data = {
      appId: configs?.onesignal_deliveryapp_id?.value,
      externalId: `${ordering?.project}-${user?.id}`,
      email: user?.email,
      cellphone: user?.cellphone
        ? user?.country_phone_code
          ? `+${user?.country_phone_code} ${user?.cellphone}`
          : user?.cellphone
        : ''
    }

    OneSignal.setNotificationOpenedHandler(({ notification }: any) => {
      setOrderId({
        id: notification?.additionalData?.order_id,
        assignId: notification?.additionalData?.assign_request_id,
        group_id: notification?.additionalData?.order_group_id
      })
    });

    OneSignal.addSubscriptionObserver((event: any) => {
      if (event?.to?.userId) {
        setOneSignalState({
          ...oneSignalState,
          notification_token: event?.to?.userId,
        });
        _setStoreData('notification_state', {
          ...oneSignalState,
          notification_token: event?.to?.userId,
        });
      }
      if (!event.to?.isSubscribed) {
        OneSignal.addTrigger('prompt_ios', 'true');
      }
    });

    OneSignal.setAppId(data.appId);

    data.email && OneSignal.setEmail(data.email, null, () => {
      OneSignal.setExternalUserId(data.externalId)
    });

    data.cellphone && OneSignal.setSMSNumber(data.cellphone, null, () => {
      OneSignal.setExternalUserId(data.externalId)
    })

    OneSignal.setExternalUserId(data.externalId);

    const deviceState: any = await OneSignal.getDeviceState();

    if (!deviceState?.hasNotificationPermission) {
      OneSignal.addTrigger("notification_prompt", "true")
    }

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

    setIsPushLoading({ loading: false });
  };

  const checkPermissions = async (removeDenied: boolean) => {
    try {
      const permissions = getPermissions()
      const titlePermission = !RNConfigReader?.driver_location_permission_title || RNConfigReader?.driver_location_permission_title === 'ALLOW_DRIVER_APP_ACCESS_LOCATION' ? 'Allow Driver App to access this device\'s location even when closed or not in use?' : RNConfigReader?.driver_location_permission_title
      const descriptionPermission = !RNConfigReader?.description_driver_location_permission || RNConfigReader?.description_driver_location_permission === 'DESCRIPTION_DRIVER_APP_ACCESS_LOCATION' ? 'This app collects location data for locate drivers, stores and customers' : RNConfigReader?.description_driver_location_permission
      const requestMultipleRes = getPermissions().map(async (permission: any) => {
        if (permission === 'android.permission.ACCESS_FINE_LOCATION') {
          const response = await request(permission, {
            title: titlePermission,
            message: descriptionPermission,
            buttonPositive: 'Ok'
          })
          return response
        } else {
          const response = await request(permission)
          return response
        }
      })
      const isPermissionsGranted = permissions.every(async (perm: any) => await requestMultipleRes[perm] === RESULTS.GRANTED)
      if (isPermissionsGranted) {
        setPermissionsState({
          ...permissionsState,
          isGranted: true,
          isDenied: removeDenied ? false : permissionsState.isDenied,
          isLoading: false
        })

      } else {
        setPermissionsState({
          ...permissionsState,
          isDenied: true,
          isLoading: false
        })
      }

    } catch (error: any) {
      setPermissionsState({
        ...permissionsState,
        isLoading: false,
        error
      })
    }
  }

  const permissionsSetup = async () => {
    try {
      setPermissionsState({
        ...permissionsState,
        isLoading: true,
      });
      const requestMultipleRes = await requestMultiple(getPermissions());

      checkPermissions(false)

    } catch (error: any) {
      setPermissionsState({
        ...permissionsState,
        isLoading: false,
        error,
      });
    }
  };

  useEffect(() => {
    if (loaded && auth) {
      if (orderId?.assignId && !orderId?.group_id) {
        RootNavigation.navigate('OrderDetailsLogistic', {
          orderAssingId: orderId?.assignId,
          isFromRoot: true,
        });
      }
      if (orderId?.id && !orderId?.assignId && !orderId?.group_id) {
        RootNavigation.navigate('OrderDetails', {
          orderId: orderId?.id,
          isDriverNotification: true,
          isFromRoot: true,
        });
      }
      setOrderId({
        id: null,
        assignId: null,
        group_id: null
      });
    }
  }, [loaded, JSON.stringify(orderId)]);

  useEffect(() => {
    if (!loaded && !orderStatus.loading && !isPushLoading.loading && !loadingSchedule) {
      setLoaded(true);
    }
  }, [orderStatus, isPushLoading, loadingSchedule]);

  useEffect(() => {
    if (!sessionLoading && !isPushLoading.loading && !auth) {
      setLoaded(!auth);
    }
  }, [sessionLoading, isPushLoading]);

  useEffect(() => {
    if (configsLoading) {
      return;
    }
    if (configs?.onesignal_deliveryapp_id?.value && auth) {
      oneSignalSetup();
    }
    if (!configs?.onesignal_deliveryapp_id?.value || !auth) {
      setIsPushLoading({ loading: false });
    }
  }, [configsLoading, configs?.onesignal_deliveryapp_id?.value, auth]);

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

  useEffect(() => {
    const setTutorialLocal = async () => {
      const data = await _retrieveStoreData('isTutorial');
      if (data === false) {
        setTutorial(false);
        permissionsSetup();
      }
    };
    setTutorialLocal();
  }, [isTutorial])

  useEffect(() => {
    if (permissions?.locationStatus === 'unavailable') {
      checkLocationPermission()
    }
  }, [permissions?.locationStatus])

  useEffect(() => {
    const _event = AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      _event.remove()
    };
  }, [])

  useEffect(() => {
    const netInfoSubscription = NetInfo.addEventListener(handleConnectivityChange);

    // Check network status when the app becomes active
    const appStateListener = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        const netInfoState = await NetInfo.fetch();
        handleConnectivityChange(netInfoState);
      }
    });

    return () => {
      netInfoSubscription();
      appStateListener.remove();
    };
  }, []);

  useEffect(() => {
    const handleGetInternetReachable = async () => {
      if (!connectionState?.isInternetReachable && connectionState?.type === 'none') {
        await _setStoreData('disconnected_at', JSON.stringify(moment().format('YYYY-MM-DD hh:mm:s')))
      }
      const disconnected_at = await _retrieveStoreData('disconnected_at');
      if (connectionState?.isInternetReachable && disconnected_at) {
        handleLogEvent(JSON.stringify([{
          event: 'turn_off_mobile_data',
          author_id: user?.id,
          data: { at_local: disconnected_at, platform: Platform.OS }
        }]))
        await _removeStoreData('disconnected_at')
      }
    }
    handleGetInternetReachable()
  }, [connectionState?.isInternetReachable, connectionState?.type])

  const handleBackgroundGeolocation = async () => {
    if (!permissionsState.isGranted) {
      setPermissionsState({
        ...permissionsState,
        isLoading: false,
      });
      return;
    }

    if (!token) {
      BackgroundGeolocation.removeListeners();
      return;
    }

    followUserLocation();
    const onLocation: Subscription = BackgroundGeolocation.onLocation((location: any) => {
      console.log(location)
    })

    const onHttpChange: Subscription = BackgroundGeolocation.onHttp((response: any) => {
      console.log(
        '[http] - ',
        response.success,
        response.status,
        response.responseText,
      );
      updateDriverLocation()
      if (!response.success && response.status === 401) {
        logout()
      }
    });

    const backgroundGeolocation = await BackgroundGeolocation.ready({
      reset: true,
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 25,
      foregroundService: true,
      allowIdenticalLocations: false,
      httpRootProperty: 'location',
      locationTemplate:
        '{"lat":<%= latitude %>,"lng":<%= longitude %>, "mock": <%= mock %>, "v": "1.0"}',
      autoSync: true,
      stopOnTerminate: true,
      startOnBoot: true,
      preventSuspend: true,
      locationUpdateInterval: 40000,
      fastestLocationUpdateInterval: 20000,
      stationaryRadius: 10,
      notification: {
        title: 'Background tracking enabled',
        text: 'Important for delivery real time location',
      },
      url: `${ordering.root}/users/${user.id}/locations`,
      extras: { driver_id: user.id },
      headers: {
        Authorization: 'Bearer ' + token,
      },
      locationAuthorizationAlert: {
        titleWhenNotEnabled: t('MOBILE_LOCATION_NOT_ENABLED', 'Mobile location not enabled'),
        titleWhenOff: t('MOBILE_LOCATION_OFF', 'Mobile location off'),
        instructions: t('MOBILE_LOCATION_NOT_ENABLED_DESC', 'Enable location for tracking your orders'),
        cancelButton: t('CANCEL', 'Cancel'),
        settingsButton: t('MOBILE_IOS_SETTINGS', 'Open Settings'),
      },
      locationAuthorizationRequest: 'Always',
      backgroundPermissionRationale: {
        title: t('TITLE_BACKGROUND_LOCATION_PERMISSION', 'Allow {applicationName} to access to this device\'s location when closed or not in use?'),
        message:
          t('MESSAGE_BACKGROUND_LOCATION_PERMISSION', 'If you would like to receive a notification when you are at {applicationName} compatible venue then you\'ll need to enable background tracking location permission'),
        positiveAction: t('POSITIVE_ACTION_LOCATION_PERMISSION', 'Change to "Allow all the time"'),
        negativeAction: t('CANCEL', 'Cancel'),
      }
    })
    if (backgroundGeolocation) {
      setEnabled({ enabled: backgroundGeolocation.enabled, ready: true })
      console.log("- BackgroundGeolocation is configured and ready: ", backgroundGeolocation.enabled);
    }
    return () => {
      onLocation.remove();
      onHttpChange.remove()
    }
  }
  // useEffect(() => {
  //   if (languageState?.loading) return
  //   handleBackgroundGeolocation()
  // }, [permissionsState.isGranted, token, languageState?.loading])

  // useEffect(() => {
  //   if (!enabled.enabled && enabled.ready && user?.enabled) {
  //     BackgroundGeolocation.start();
  //   } else if (!enabled.ready || !auth || !user?.enabled) {
  //     BackgroundGeolocation.stop();
  //   }
  // }, [enabled.ready, auth, user?.enabled, enabled.enabled]);

  useEffect(() => {
    if (user) {
      if (user?.schedule && user?.schedule?.some((item: any) => item?.enabled)) {
        const currentDate = dayjs()
        const currentDay = dayjs().day(); // returns cardinal number of the (week) seven days
        let lapse = null
        const schedules = user.schedule
        const today = schedules?.find((item: any, i: number) => i === currentDay)
        if (today?.enabled) {
          lapse = today.lapses.find((lapse: any) => {
            const from = currentDate.hour(lapse.open.hour).minute(lapse.open.minute)
            const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
            return currentDate.unix() >= from.unix() && currentDate.unix() <= to.unix()
          })
          if (!lapse) {
            const nextLapse = today.lapses.find((lapse: any) => {
              const from = currentDate.hour(lapse.open.hour).minute(lapse.open.minute)
              return currentDate.unix() <= from.unix()
            })
            // disable user
            if (nextLapse) {
              setNextSchedule({ schedule: nextLapse, day: currentDay })
            } else {
              getNextSchedules(currentDay, schedules)
            }
            setBlockedSchedule(true)
          }
        } else {
          // disable user
          getNextSchedules(currentDay, schedules)
          setBlockedSchedule(true)
        }
        setLoadingSchedule(false)
      } else {
        setLoadingSchedule(false)
      }
    } else {
      setBlockedSchedule(false)
      setNextSchedule({ schedule: null, day: null })
    }
  }, [user])

  const getNextSchedules = (currentDay: number, schedules: any) => {
    if (currentDay === 6) {
      setNextSchedule({ schedule: schedules.find((item: any) => item.enabled)?.lapses[0], day: schedules.findIndex((item: any) => item.enabled) })
    } else {
      let j = 0
      for (let i = currentDay; i < currentDay + 6; i++) {
        if (i >= 6) {
          if (schedules[j]?.enabled) {
            setNextSchedule({ schedule: schedules[j]?.lapses[0], day: j })
            return
          }
          j++
        } else {
          if (schedules[i]?.enabled) {
            setNextSchedule({ schedule: schedules[i]?.lapses[0], day: i })
            return
          }
        }
      }
    }
  }

  useEffect(() => {
    if (!token) return
    const handleVibrationEffect = (value: any) => {
      (value?.driver && value?.history[0]?.data[0]?.attribute === 'driver_id' && value?.history[0]?.data[0]?.old === null) && Vibration.vibrate()
    }

    socket.on('update_order', (e: any) => handleVibrationEffect(e))
    return () => {
      socket.off('update_order', (e: any) => handleVibrationEffect(e))
    }
  }, [socket, user])

  useEffect(() => {
    if (auth && settings.validate_developer_mode) {
      handleIsDeveloperMode()
    }
  }, [auth, loaded])

  const handleIsDeveloperMode = async () => {
    const isDeveloperModeEnabled = async (): Promise<boolean> => {
      if (Platform.OS === 'android') {
        return NativeModules.DeveloperOptions?.isDeveloperModeEnabled?.();
      } else {
        throw Error('Platform not supported');
      }
    }

    const isDeveloperMode = await isDeveloperModeEnabled()
    if (isDeveloperMode) {
      logout()
      Alert.alert(
        t('DEVELOPER_MODE', 'Developer mode'),
        t('PLEASE_DISABLE_DEVELOPER_MODE', 'Please disable developer mode for sign in'),
        [{
          text: t('GO_TO_SETTINGS', 'Go to settings'),
          onPress: async () => await NativeModules.DeveloperOptions?.openDeveloperSettings(),
        },
        { text: 'OK', onPress: () => { } },]
      )
    }
  }

  return (
    <View
      style={{ flex: 1 }}
      onTouchEnd={() => updateDriverLocation()}
    >
      <Stack.Navigator


      >
        {(!loaded || permissionsState.isLoading) && (
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{ headerShown: false, presentation: 'modal' }}
          />
        )}

        {loaded && !permissionsState.isLoading  && connectionState?.isInternetReachable &&(
          <>
            {!auth ? (
              <>
                {isTutorial ? (
                  <Stack.Screen
                    name="IntroductoryTutorial"
                    component={IntroductoryTutorial}
                    options={{ headerShown: false }}
                    initialParams={{ setTutorial }}
                  />) : (
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
                  initialParams={{ notification_state: oneSignalState }}
                />
                <Stack.Screen
                  name="Forgot"
                  component={Forgot}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Signup"
                  component={Signup}
                  options={{ headerShown: false }}
                  initialParams={{ notification_state: oneSignalState }}
                />
                <Stack.Screen
                  name="PhonenumberVerify"
                  component={VerifyPhoneNumber}
                  options={{ headerShown: false }}
                  initialParams={{ notification_state: oneSignalState }}
                />
                <Stack.Screen
                  name="SignupuserDetails"
                  component={SignupUserDetails}
                  options={{ headerShown: false }}
                  initialParams={{ notification_state: oneSignalState }}
                />
                <Stack.Screen
                  name="CustomerDiscloser"
                  component={CustomerDiscloserDetials}
                  options={{ headerShown: false }}
                  initialParams={{ notification_state: oneSignalState }}
                />
                <Stack.Screen
                  name="Customeruserdetials"
                  component={CustomerUserDetails}
                  options={{ headerShown: false }}
                  initialParams={{ notification_state: oneSignalState }}
                />

                  <Stack.Screen
                  name="CustomerLisence"
                  component={CustomerLisence}
                  options={{ headerShown: false }}
                  initialParams={{ notification_state: oneSignalState }}
                />


                  <Stack.Screen
                  name="CustomerVehicleList"
                  component={CustomerVehicleList}
                  options={{ headerShown: false }}
                  initialParams={{ notification_state: oneSignalState }}
                />
                <Stack.Screen
                  name="CustomerInsurance"
                  component={CustomerInsurance}
                  options={{ headerShown: false }}
                  initialParams={{ notification_state: oneSignalState }}
                />
                 <Stack.Screen
                  name="CustomerBackgroundCheck"
                  component={CustomerBackgroundCheck}
                  options={{ headerShown: false }}
                  initialParams={{ notification_state: oneSignalState }}
                />

                <Stack.Screen
                  name="CustomerProfileComfiem"
                  component={CustomerprofileConfirm}
                  options={{ headerShown: false }}
                  initialParams={{ notification_state: oneSignalState }}
                />

                 <Stack.Screen
                  name="checkProgress"
                  component={CheckProgreess}
                  options={{ headerShown: false }}
                  initialParams={{ notification_state: oneSignalState }}
                />
              </>
            ) : (
              <>
                {blockedSchedule && isDriverLoginValidated ? (
                  <Stack.Screen
                    name="ScheduleBlocked"
                    component={ScheduleBlocked}
                    options={{ headerShown: false }}
                    initialParams={{ nextSchedule }}
                  />
                ) : (
                  <Stack.Screen
                    name="MyAccount"
                    component={HomeNavigator}
                    options={{ headerShown: false }}
                  />
                )}
              </>
            )}
          </>
        )}
        {connectionState?.isInternetReachable === false && (
          <Stack.Screen
            name='NetworkError'
            component={NetworkError}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </View>
  );
};

export default RootNavigator;
