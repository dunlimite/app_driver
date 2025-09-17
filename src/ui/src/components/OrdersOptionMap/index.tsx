import React, { useEffect, useState, useRef, useCallback, useMemo, useReducer } from 'react';
import { View, Pressable, StyleSheet, ScrollView, RefreshControl, Platform, Text, Animated, Image, TouchableOpacity, Dimensions, Modal, SafeAreaView, Linking } from 'react-native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontistoIcon from 'react-native-vector-icons/Fontisto'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import RNRestart from 'react-native-restart'
import { useTheme } from 'styled-components/native';
import MapView, { Heatmap, Marker, Polyline } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import MapViewDirections from "react-native-maps-directions";
import RBSheet from 'react-native-raw-bottom-sheet';
import { moderateScale } from '../../providers/Responsive';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  IconWrapper,
  StatusItems,
  ItemHeader,
  ItemStatus,
  ItemContent,
  TimerInputWrapper,
  OverLine
} from './styles';
import { OrdersOptionParams } from '../../types';
import { _retrieveStoreData, _setStoreData, _removeStoreData } from '../../providers/StoreUtil'
import { getCurrenySymbol } from '../../utils';

import { useLanguage, useUtils, useConfig, useSession, useApi } from '@components';
import { OrderListGroups } from './OrderListGroups';
import {
  DeviceOrientationMethods,
  NotificationSetting,
  useOfflineActions,
  OText, OButton, OModal, OInput, OIcon,
  NewOrderNotification,
  LoginCheckDriverDelivery
} from '@ui'
import { OrderDetailsMap } from '../OrderDetailsMap';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useNavigation } from "@react-navigation/native";
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

const { useDeviceOrientation, PORTRAIT } = DeviceOrientationMethods

const OrdersOptionMapUI = (props: any) => {
  const {
    navigation,
    rejectOrder,
    inProOrders,
    setCurrentFilters,
    tabs,
    combineTabs,
    setCombineTabsState,
    isNetConnected,
    currentTabSelected,
    setCurrentTabSelected,
    ordersGroup,
    setOrdersGroup,
    orderStatus,
    ordersFormatted,
    loadOrders,
    handelCancelFinding,
    selectedOrder,
    completedOrder,
    setSelectedOrder,
    handleMarkerPress,
    loadMoreOrders,
    onNavigationRedirect,
    onFiltered,
    handleClickOrder,
    isBusinessApp,
    handleClickLogisticOrder,
    logisticOrders,
    loadLogisticOrders,
    isLogisticActivated,
    handleChangeOrderStatus,
    handleSendCustomerReview,
    ordersFiltered,
    loadingChangeOrder,
    openOrderDetails,
    loadorder,
    pickupcompleted

  } = props;
  const theme = useTheme();
  const [, t] = useLanguage();
  const [ordering] = useApi()
  const [{ parsePrice }] = useUtils()
  const [configState] = useConfig()
  const [offlineActionsState] = useOfflineActions()
  const refRBSheet = useRef<RBSheet>(null);
  const refRBSheetlogincheck = useRef<RBSheet>(null);

  const navigationD = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const currentOrdersGroup = ordersGroup[currentTabSelected]
  const pendingOrders = currentOrdersGroup?.orders
  //console.log('pendingOrders')
  // console.log(pendingOrders?.length)
  const forceUpdateReducer = x => x + 1;

  const [openDriverTipEarned, setOpenDriverTipEarned] = useState('0')
  const [_, forceUpdate] = useReducer(forceUpdateReducer, 0);

  const isFocused = useIsFocused()
  const [orientationState] = useDeviceOrientation();
  const [openSearchModal, setOpenSearchModal] = useState(false)
  const [openSLASettingModal, setOpenSLASettingModal] = useState(false)
  const [slaSettingTime, setSlaSettingTime] = useState(6000)
  const [currentDeliveryType, setCurrentDeliveryType] = useState('Delivery')
  const [{ user }] = useSession();
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number }>({
    distance: 0,
    duration: 0,
  });
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: 45.6471861,
    longitude: -118.8247313,
  });
  const [mapRoatateHeading, setmapRoatateHeading] = useState()
  const [zoomlevel, setUserZoomlevel] = useState<number>()
  const mapRef = useRef<MapView>(null);
  const [heatedmapLatlanarray, setheatedmapArray] = useState([])

  const [zoom, setZoom] = useState(14); // Default zoom level
  const [modalvisileDriver, setdriverCheck] = useState(true)

  const animation = useRef(new Animated.Value(0)).current;
  const layers = 4; // number of pulsing layers
  const animations = useRef(
    [...Array(layers)].map(() => new Animated.Value(0))
  ).current;



  const animateCircle = (animation, delay) => {
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      ).start();
    }, delay);
  };
  const handelOpenActiveOrders = () => {
    navigation?.navigate('MyOrdersList', { refresh: Date.now() })
  }

  useEffect(() => {
    animations.forEach((anim, index) => {
      animateCircle(anim, index * 600); // stagger delay
    });

    return () => {
      animations.forEach(anim => anim.stopAnimation());
    };
  }, [currentOrdersGroup?.loading]);

  const getAnimatedStyle = (animation) => ({
    position: "absolute",
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 0],
    }),
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 3],
        }),
      },
    ],
  });


  const loadCre = async () => {
    const value = await AsyncStorage.getItem('driver_Confirm');
    if (value !== null) {
      setdriverCheck(false)
    } else if (value == null) {
      setdriverCheck(true)

    }

  }


  useEffect(() => {

    loadCre()
  }, [])
  const maximumZoomfactor = 1.25
  const minimizeZoomfactor = 0.75
  const onRefresh = () => {
    setRefreshing(true)

    // Fetch driver's location on refresh
    Geolocation.getCurrentPosition(
      (position) => {
        setDriverLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }
      },
      (error) => console.log(error),
      { enableHighAccuracy: true }
    );

    setTimeout(() => {
      if (navigation?.replace) {
        navigation?.replace('Orders')
      } else {
        navigation.goBack()
      }
      fetechHeatedLocationRadius()
      setRefreshing(false)
    }, 1000);
  };

  const handleRegionChangeCompleteMapRotate = async (region) => {
    if (region.heading !== undefined) {
      setmapRoatateHeading(region.heading);  // Save the user's manual rotation
    }

    if (mapRef.current) {
      let mapCamera = await mapRef.current.getCamera();
      setUserZoomlevel(mapCamera.zoom)
    }
  };
  const calculateLatDelta = (zoomLevel) => {
    // Formula to convert zoom level to latitudeDelta
    return 360 / Math.pow(2, zoomLevel);
  };

  const handleRegionChangeComplete = (region) => {
    const currentZoomLevel = Math.log2(360 / region.latitudeDelta); // Calculate current zoom level
    const maxAllowedZoomLevel = zoom * maximumZoomfactor; // Determine max zoom level
    const minimumAllowedZoomLevel = zoom * minimizeZoomfactor

    let newZoomlevel = currentZoomLevel

    //prevent excecding max zooming
    if (currentZoomLevel > maxAllowedZoomLevel) {
      newZoomlevel = maxAllowedZoomLevel
    }

    //pevent excecding min zooming
    if (currentZoomLevel < minimumAllowedZoomLevel) {
      newZoomlevel = minimumAllowedZoomLevel
    }
    // If the user zooms beyond the maximum allowed level, reset the zoom
    if (newZoomlevel !== currentZoomLevel) {
      const limitedRegion = {
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: calculateLatDelta(newZoomlevel),
        longitudeDelta: calculateLatDelta(newZoomlevel),
      };

      // Smoothly animate back to the allowed zoom level
      mapRef.current.animateToRegion(limitedRegion, 500);
    }
  };

  // fetch heated map radius
  const fetechHeatedLocationRadius = async () => {
    const res = await fetch('https://plugins-development.ordering.co/' + ordering.project + '/driverapp/get_hitmap_data.php', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({
        driver_id: props?.route?.params?.userId ?? user?.id
      })
    })
    const result = await res.json()
    setheatedmapArray(result?.data)
    // console.log(result?.data,driverLocation, 'heated map radius/////////////////////////.././.')
  }

  useEffect(() => {
    fetechHeatedLocationRadius()
  }, [])
  const handelOpenDetails = (order: any) => {
    console.log('open details')
    refRBSheet.current?.open()
  };
  const handelCloseDetails = () => {
    console.log('close details')
    refRBSheet.current?.close()
  };

  const handelRemoveDriverEarn = async () => {
    await AsyncStorage.removeItem('deliveryTip');
    setOpenDriverTipEarned(0)
  }
  const handelCheckDriverEarn = async () => {
    try {
      console.log('driver earn')
      const value = await AsyncStorage.getItem('deliveryTip');
      console.log(value)
      setOpenDriverTipEarned(value)
      setTimeout(() => {
        handelRemoveDriverEarn()
      }, 5000);
    } catch (e) {
      console.log(e)
    }
  };

  const orderTypes = (type: number) => type === 1
    ? t('DELIVERY', 'Delivery')
    : selectedOrder.delivery_type === 2
      ? t('PICKUP', 'Pickup')
      : selectedOrder.delivery_type === 3
        ? t('EAT_IN', 'Eat in')
        : selectedOrder.delivery_type === 4
          ? t('CURBSIDE', 'Curbside')
          : t('DRIVER_THRU', 'Driver thru')
  const styles = StyleSheet.create({
    header: {
      marginBottom: isBusinessApp ? 10 : 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    circleContainer: {
      position: 'absolute',
      left: Dimensions.get('window').width / 2 - 75,
      top: Dimensions.get('window').width / 2 - 300,
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontFamily: 'Outfit-Regular',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 26,
      color: theme.colors.textGray,
    },
    icons: {
      flexDirection: 'row',
    },
    tab: {
      fontFamily: 'Outfit-Regular',
      fontStyle: 'normal',
      fontSize: 14,
      paddingBottom: 10,
      marginBottom: -1,
      zIndex: 100,
      borderColor: theme.colors.textGray,
      textTransform: 'capitalize'
    },
    icon: {
      paddingBottom: 10,
      zIndex: 100,
      marginBottom: 5,
    },
    tagsContainer: {
      marginBottom: 20,
    },
    accept_buton: {
      width: 150,
      height: 150,
      backgroundColor: '#9A3031',
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tag: {
      fontFamily: 'Outfit-Regular',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 14,
    },
    orderid: {
      fontSize: 14,
      color: '#FFFFFF',
      textAlign: 'center'
    },
    acceptText: {
      fontSize: 25,
      color: '#FFFFFF',
      fontWeight: '700',
      textAlign: 'center',
      fontFamily: "Outfit-Regular"
    },
    clip_price: {
      width: 100,
      height: 43,
      backgroundColor: '#EE4140',
      borderRadius: 29,
      position: 'absolute',
      bottom: -17,
      justifyContent: 'center',
      alignItems: 'center'
    },
    pressable: {
      alignItems: 'center',
    },
    loadButton: {
      borderRadius: 7.6,
      height: 44,
      marginRight: 10,
      marginBottom: 10,
      marginTop: 5,
      fontFamily: 'Outfit-SemiBold'
    },
    loadButtonText: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Outfit-Regular',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 17,
    },
    inputStyle: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#DEE2E6',
      borderRadius: 7.6,
      marginBottom: 24
    },
    SLAwrapper: {
      flexDirection: 'row',
      marginBottom: 15
    },
    selectOption: {
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 40,
      width: '100%',
      paddingHorizontal: 15,
      backgroundColor: theme.colors.inputChat,
      borderRadius: 7.6,
    },
    buttonTextStyle: {
      textAlign: 'left',
      marginHorizontal: 0,
      fontSize: 16,
      lineHeight: 24,
      color: '#748194'
    },
    dropdownStyle: {
      borderWidth: 1,
      borderRadius: 8,
      paddingTop: 5,
      backgroundColor: '#fff',
      borderColor: theme.colors.lightGray,
      overflow: 'hidden',
      minHeight: 155
    },
    btnBackArrow: {
      borderWidth: 0,
      width: 32,
      height: 32,
      tintColor: theme.colors.textGray,
      backgroundColor: theme.colors.clear,
      borderColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      paddingLeft: 0,
      paddingRight: 0,
      marginBottom: 30,
      marginTop: Platform.OS === 'ios' ? 60 : 30
    },
    rowStyle: {
      display: 'flex',
      borderBottomWidth: 0,
      height: 36,
      alignItems: 'center',
      paddingHorizontal: 10
    },
    acceptButtonStyle: {
      borderRadius: 7.6,
      width: 130,
      height: 42,
    },
    map: { flex: 1 },
    errorMessage: {
      marginBottom: 10,
      color: theme.colors.error,
    },
    circle: {
      position: "absolute",
      width: 100,
      height: 100,
      borderRadius: 100,
      backgroundColor: "#f7adad",
    },
    circle2: {
      position: "absolute",
      width: 150,
      height: 150,
      borderRadius: 100,
      backgroundColor: "#EE4140",
    },
    marker: {
      width: 30,
      height: 30,
      borderRadius: 25,
      backgroundColor: "red",
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    menuviewMap: {
      zIndex: 1000,
      top: 90,
      left: 20,
      // width: '100%',
      position: 'absolute',
      gap: 10
    },
    order_complete: {
      zIndex: 2000,
      top: 90,
      right: 20,
      // width: '100%',
      position: 'absolute',
      gap: 10
    },
    order_complete_d: {
      zIndex: 2000,
      top: 14,
      right: 20,
      // width: '100%',
      position: 'absolute',
      gap: 10
    }


  });

  // login check
  const refRBSheetCLoginCheck = useRef<BottomSheet>(null);

  const isEqual = (array1: any, array2: any) => {
    return array1?.every((item: any) => array2.includes(item)) && array2?.every((item: any) => array1.includes(item))
  }

  const setDeiverCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const initialLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setDriverLocation(initialLocation);



        // Ensure map starts at the correct location
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            ...initialLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }
      },
      (error) => console.log("Error fetching initial location:", error),
      { enableHighAccuracy: true }
    );
  }
  useEffect(() => {
    console.log(55555)
    // Fetch the current location once when the component mounts
    Geolocation.getCurrentPosition(
      (position) => {
        const initialLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setDriverLocation(initialLocation);



        console.log(initialLocation, 'driver current')
        // Ensure map starts at the correct location
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            ...initialLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }
      },
      (error) => console.log("Error fetching initial location:", error),
      { enableHighAccuracy: true }
    );

    // Watch for location changes
    const watchId = Geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Only update if location has changed
        setDriverLocation((prevLocation) => {
          if (
            prevLocation &&
            prevLocation.latitude === newLocation.latitude &&
            prevLocation.longitude === newLocation.longitude
          ) {
            return prevLocation; // No need to update state if the location hasn't changed
          }

          // Animate map to new location
          if (mapRef.current) {
            mapRef.current.animateCamera({
              center: newLocation,
              heading: mapRoatateHeading, // Keep previous heading
              pitch: 0,
              zoom: zoomlevel,
            });
          }

          return newLocation;
        });
      },
      (error) => console.log("Error watching location:", error),
      {
        enableHighAccuracy: true,
        distanceFilter: 20,
        interval: 40000,
        fastestInterval: 30000,
      }
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);
  useEffect(() => {
    if (!mapRef.current || !pendingOrders?.length) return;

    const coordinates = pendingOrders.map((order: any) => ({
      latitude: order?.business?.location?.lat,
      longitude: order?.business?.location?.lng,
    }));

    // Add driver location
    coordinates.push({
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
    });

    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });

  }, [pendingOrders, driverLocation]);

  // / finding animated view
  // const scaleAnim = useRef(new Animated.Value(1)).current;
  // const opacityAnim = useRef(new Animated.Value(1)).current;

  // useEffect(() => {
  //   // Looping animation for scale and opacity
  //   Animated.loop(
  //     Animated.parallel([
  //       Animated.sequence([
  //         Animated.timing(scaleAnim, {
  //           toValue: 2.5,
  //           duration: 1500,
  //           useNativeDriver: true,
  //         }),
  //         Animated.timing(scaleAnim, {
  //           toValue: 1,
  //           duration: 0,
  //           useNativeDriver: true,
  //         }),
  //       ]),
  //       Animated.sequence([
  //         Animated.timing(opacityAnim, {
  //           toValue: 0,
  //           duration: 1500,
  //           useNativeDriver: true,
  //         }),

  //         Animated.timing(opacityAnim, {
  //           toValue: 1,
  //           duration: 0,
  //           useNativeDriver: true,
  //         }),
  //       ]),
  //     ])
  //   ).start();
  // }, [scaleAnim, opacityAnim, currentOrdersGroup?.loading]);

  const animation1 = new Animated.Value(0);
  const animation2 = new Animated.Value(0);
  const animation3 = new Animated.Value(0);

  const forcetorerender = () => {
    console.log('force update///////////////////////')
    forceUpdate()
    handelCheckDriverEarn()
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MyOrders' }],
      })
    )
    // navigation?.replace('Orders')
  }

  useEffect(() => {

  }, [_])
  // useEffect(() => {
  //   const animateCircle = (animation) => {
  //     Animated.loop(
  //       Animated.sequence([
  //         Animated.timing(animation, {
  //           toValue: 1,
  //           duration: 2000,
  //           useNativeDriver: true,
  //         }),
  //         Animated.timing(animation, {
  //           toValue: 0,
  //           duration: 0,
  //           useNativeDriver: true,
  //         }),
  //       ])
  //     ).start();
  //   };

  //   animateCircle(animation1);
  //   // setTimeout(() => animateCircle(animation2), 800);
  //   // setTimeout(() => animateCircle(animation3), 1600);
  // }, []);

  const animatedStyle = {
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 0],
    }),
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 3],
        }),
      },
    ],
  };

  // open active order lsit
  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 } // 🔑 infinite loop
    ).start();
  };

  useEffect(() => {
    startAnimation();

    return () => {
      animation.stopAnimation(); // cleanup if component unmounts
    };
  }, []);

  const openMapsWithMultipleStops = (locations: any) => {


    const origin = locations[0]?.address;
    const destination = locations[locations.length - 1]?.address
    const waypoints = locations
      .slice(1, -1)
      .map((loc) => `${loc.address}`)
      .join('|');

    console.log(origin, 'formaets adressss///????')

    const googleMapsUrl =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${encodeURIComponent(origin)}` +
      `&destination=${encodeURIComponent(destination)}` +
      (waypoints.length ? `&waypoints=${encodeURIComponent(waypoints)}` : '') +
      `&travelmode=driving`;

    const appleMapsUrl = `http://maps.apple.com/?saddr=Current+Location&daddr=${encodeURIComponent(
      [origin, ...locations.slice(1).map((l) => l.address)].join(' to: ')
    )}`;
    const url = Platform.select({
      ios: appleMapsUrl,
      android: googleMapsUrl,
    });

    Linking.openURL(url);


  };


  // check active order and open maos
  async function checkactiveOrderandopemMapsAccepted() {
    let address = await getAddressFromLatLng(driverLocation?.latitude, driverLocation?.longitude)

    const updatewd_array_orders = ordersGroup[currentTabSelected]

    const acceptedOrders = updatewd_array_orders?.orders?.filter(order => order?.status === 8)?.map(orders => ({
      address: orders?.business?.address
    }));

    console.log(acceptedOrders, 'accepted order///////')
    openMapsWithMultipleStops([
      { ...address },
      ...acceptedOrders
    ]);
  }

  async function getAddressFromLatLng(lat, lng) {

    // console.log('llllll')
    let apiKey = 'AIzaSyBNp8VGcaCxcHqGrlwbLfsgeyPFkUgU67Y'
    // const response = await fetch(
    //   `https://maps.googleapis.com/maps/api/geocode/json?latlng=${27.2887633},${-80.4355873}&key=AIzaSyBNp8VGcaCxcHqGrlwbLfsgeyPFkUgU67Y`
    // );

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    console.log(response, 'response.......>>>')
    const data = await response.json();
    return { address: data.results[0]?.formatted_address || `${lat},${lng}` }
    // return {address:'Pendleton, OR 97801, USA'}
  }

  // check active order and open maos
  async function checkactiveOrderandopemMapsPickup() {
    // setCurrentTabSelected('inProgress')
    //  await getAddressFromLatLng(27.2887633 , -80.4355873)
    let formatedAddress: any = []
    const updatedOrders = await pickupcompleted({ isFetchpickup: true });
    let address = await getAddressFromLatLng(driverLocation?.latitude, driverLocation?.longitude)

    const acceptedOrders = updatedOrders?.filter(order => order?.status === 9)?.map(orders => ({
      address: orders?.business?.address
    }));




    console.log(address, 'driver address......>>>')
    // console.log(formatedAddress, 'pick up compelte..../// order///////')
    openMapsWithMultipleStops([
      { ...address },
      ...acceptedOrders
    ]);

  }

  useEffect(() => {
    if (rejectOrder === true) {
      if (navigation?.replace) {
        navigation?.replace('Orders')
      } else {
        navigation.goBack()
      }
      //navigation?.replace('Orders')
    }
  }, [rejectOrder])

  useEffect(() => {
    // if (isFocused) {
    handelCheckDriverEarn()
    // } else {
    //   return
    // }

  }, [])
  const snapPoints = useMemo(() => ['1%', '50%', '100%'], []);

  const [bottomsheetActiveinde, setbottomsheetactiveinde] = useState(undefined)

  // Handle sheet changes
  const handleSheetChanges = useCallback((index) => {
    console.log('BottomSheet Index:', index);
  }, []);


  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>

        <ScrollView

          contentContainerStyle={{
            flexGrow: 1,

          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >


          <View style={{ height: '100%', width: '100%', position: 'absolute', left: 0, right: 0 }}>




            {selectedOrder && selectedOrder?.status === 0 && (
              <View style={[styles?.order_complete]}>
                <TouchableOpacity
                  onPress={() => handleChangeOrderStatus(6, [selectedOrder?.id])}
                  style={{
                    backgroundColor: '#EE4140',
                    padding: 10,
                    borderRadius: 29,
                    flexDirection: 'row'
                  }}>
                  <EntypoIcon
                    name='cross'
                    size={20}
                    color='#FFFFFF'
                  />
                  <Text style={{
                    fontSize: 15,
                    color: '#FFFFFF',
                    fontWeight: '400',
                    fontFamily: 'Outfit-Regular'
                  }}>{t('DECLINE', 'Decline')}</Text>
                </TouchableOpacity>
              </View>
            )}
            {openDriverTipEarned > '0' && (
              <View style={[styles.order_complete_d, { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 5, borderRadius: 12 }]}>

                <View style={{
                  backgroundColor: '#E5E7E9',
                  padding: 10,
                  borderRadius: 7,
                }}>
                  <Image
                    source={require('../../../../assets/images/ordercomplete.png')}
                    style={{
                      width: 35,
                      height: 35,
                      // borderRadius: 10,
                    }}
                  />
                </View>

                <Text style={{
                  width: '70%',
                  fontSize: 15,
                  color: '#EE4140',
                  fontWeight: '600',
                  fontFamily: 'Outfit-Regular'
                }}>{t('DELIVERY_COMPLETE_EARNED', 'Delivery Complete! You earned')} {parsePrice(openDriverTipEarned)} {t('EARNED_WITH_TIP', 'with tip.')}</Text>
              </View>
            )}

            <View style={[styles.menuviewMap]}>
              <TouchableOpacity
                onPress={() => navigationD?.openDrawer()
                }
                style={{
                  width: moderateScale(40),
                  height: moderateScale(40),
                  backgroundColor: '#FFFFFF',
                  borderRadius: 7,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                <FontAwesome5Icon
                  name='bars'
                  size={23}
                  color='#515C69'
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDeiverCurrentPosition()}
                style={{
                  width: moderateScale(40),
                  height: moderateScale(40),
                  backgroundColor: '#FFFFFF',
                  borderRadius: 7,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                <MaterialIcon
                  name='my-location'
                  size={25}
                  color='#515C69'
                />
              </TouchableOpacity>
            </View>
            {/* {
              modalvisileDriver ? (
                <Modal
                  visible={modalvisileDriver}
                >

                  <View style={{
                    padding: 20, flex: 1
                  }}>
                    <LoginCheckDriverDelivery
                      setdriverCheck={setdriverCheck}
                    />

                  </View>

                </Modal>
              )
                :
                null
            } */}

            <MapView

              ref={mapRef}
              style={[styles.map, { position: "relative" }]}
              mapType="standard"
              region={driverLocation ? {
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              } : {
                latitude: 45.6471861,
                longitude: -118.8247313,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              }}
              customMapStyle={[
                { elementType: "geometry", stylers: [{ color: "#e5eff5" }] },
                { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
                { featureType: "water", elementType: "geometry", stylers: [{ color: "#e5eff5" }] },
                { featureType: "road", elementType: "geometry", stylers: [{ color: "#B0D3E9" }] }
              ]}
              tintColor='#000000'
              provider='google'
              onRegionChangeComplete={handleRegionChangeCompleteMapRotate}
            // zoomEnabled={false} // Disables pinch-to-zoom and double-tap zoom

            >
              {/* // heated map featrure */}
              {heatedmapLatlanarray.length > 0 && (
                <Heatmap
                  points={heatedmapLatlanarray}
                  radius={50} // Size of heat spots
                  opacity={0.6} // Transparency level
                  gradient={{
                    colors: ['#E15B5D'],
                    startPoints: [0.2],
                    colorMapSize: 256,
                  }}
                />
              )}
              {/* Driver Location Marker */}
              {driverLocation && (
                <Marker
                  coordinate={driverLocation}
                  title="Driver Location"
                  pinColor="blue"
                >
                  <View style={{
                    height: 30,
                    width: 30,
                    position: 'absolute'
                  }}>
                    <Image

                      style={{
                        height: '100%',
                        width: '100%'
                      }}
                      resizeMode='contain'
                      source={require('../../../../assets/images/driverlocation.png')}
                    />
                  </View>
                </Marker>

              )}
              {/* Order Markers */}
              {pendingOrders && pendingOrders?.length > 0 && pendingOrders.map((order: any) => (
                <Marker
                  key={order.id}
                  coordinate={{
                    latitude: order?.business?.location?.lat,
                    longitude: order?.business?.location?.lng,
                  }}
                  title={order.id.toString()}
                  pinColor="red"
                  onPress={() => handleMarkerPress(order)}
                >
                  {(!selectedOrder || selectedOrder && selectedOrder.id !== order.id) && (
                    <View style={{
                      width: 70,
                      height: 24,
                      backgroundColor: order?.status === 8 ? "#E13C39" : "#ECB800",
                      borderRadius: 29,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: 5,
                      paddingRight: 5
                    }}>
                      <Text style={{
                        fontSize: 13,
                        color: '#FFFFFF',
                        fontWeight: '400',
                        textAlign: 'center',
                        fontFamily: 'Outfit-Regular'
                      }}>+ {parsePrice(order?.ordertotalearns, { currency: getCurrenySymbol(order?.currency) })}</Text>

                      {
                        Platform.OS === 'ios' ? (

                          <View

                            style={{
                              width: 0,
                              height: 0,
                              borderLeftWidth: 50, // Half of base width
                              borderRightWidth: 50, // Half of base width
                              borderBottomWidth: 100, // Height of the pyramid
                              borderLeftColor: "transparent",
                              borderRightColor: "transparent",
                              borderBottomColor: order?.status === 8 ? "#E13C39" : "#ECB800", // Color of the pyramid,


                            }}></View>

                        )
                          : null

                      }

                    </View>
                  )}
                  {selectedOrder && selectedOrder.id === order.id && (
                    <View style={{
                      height: 30,
                      width: 30,
                      // borderRadius:15
                    }}>
                      <Image
                        source={{ uri: selectedOrder.business.logo }}
                        resizeMode='contain'

                        style={{
                          height: '100%',
                          width: '100%',
                          borderRadius: 100
                        }}
                      />
                    </View>
                  )}
                </Marker>
              ))}

              {/* Destination Marker (Business Location) */}
              {/*{selectedOrder && (
            <Marker
              coordinate={{
                latitude: selectedOrder.business.location.lat,
                longitude: selectedOrder.business.location.lng,
              }}
              title="Destination"


            // image={selectedOrder.business.logo} // Replace with your destination icon
            >
              <View style={{
                height: 30,
                width: 30,
                // borderRadius:15
              }}>
                <Image
                  source={{ uri: selectedOrder.business.logo }}
                  resizeMode='contain'

                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 100
                  }}
                />
              </View>
            </Marker>
          )}*/}

              {/* Show route when an order is selected */}
              {selectedOrder && (
                <MapViewDirections
                  origin={{
                    latitude: driverLocation?.latitude,
                    longitude: driverLocation?.longitude,
                  }}
                  destination={{
                    latitude: selectedOrder?.business?.location?.lat,
                    longitude: selectedOrder?.business?.location?.lng,
                  }}
                  mode="DRIVING"
                  apikey='AIzaSyBNp8VGcaCxcHqGrlwbLfsgeyPFkUgU67Y'
                  strokeWidth={4}
                  strokeColor="red"
                  onReady={(result) => {
                    setRouteInfo({ distance: result.distance, duration: result.duration });
                  }}
                />
              )}

            </MapView>
            <View>

              {selectedOrder && (selectedOrder?.status === 0 || selectedOrder?.status === 4 || selectedOrder?.status === 7 || selectedOrder?.status === 8) && (
                <>

                  <>
                    <View style={{
                      zIndex: 1000,
                      bottom: 100,
                      width: '100%',
                      position: 'absolute',
                      justifyContent: 'center',
                      alignItems: 'center', display: 'flex',
                      flexDirection: 'column',
                    }}>

                      {(selectedOrder?.status === 0 || selectedOrder?.status === 7 || selectedOrder?.status === 4) && (
                        <View style={{

                          justifyContent: 'center',
                          alignItems: 'center', display: 'flex',
                          flexDirection: 'column',
                          width: '100%'
                        }}>
                          <OText style={{
                            backgroundColor: '#EE4140',
                            padding: 5,
                            borderRadius: 29,
                            fontSize: 15,
                            fontWeight: '400',
                            fontFamily: 'Outfit-Regular',
                            color: '#FFFFFF',
                            marginBottom: 10
                          }}>{routeInfo.duration.toFixed(2)} min</OText>


                          <View style={styles.accept_buton}>


                            <TouchableOpacity
                              // onPress={() => }
                              onPress={async () => {
                                try {
                                  await handleChangeOrderStatus(8, [selectedOrder?.id]);
                                  checkactiveOrderandopemMapsAccepted()
                                } catch (error) {
                                  console.error("Error updating order or opening maps", error);
                                }
                              }}

                            >
                              <OText style={styles.orderid}> #{selectedOrder?.id}</OText>
                              <OText style={styles.acceptText}>{t('ACCEPT', 'Accept')}</OText>
                              <OText style={{
                                fontSize: 14,
                                color: '#FFFFFF',
                                textAlign: 'center'
                              }}>{orderTypes(selectedOrder.delivery_type)}</OText>

                            </TouchableOpacity>

                          </View>
                          <View style={styles.clip_price}>
                            <OText
                              style={{
                                fontSize: 20,
                                color: '#FFFFFF',
                                textAlign: 'center',
                                fontWeight: '700'
                              }}
                              mBottom={4}>
                              {parsePrice(selectedOrder?.ordertotalearns, { currency: getCurrenySymbol(selectedOrder?.currency) })}
                            </OText>
                          </View>

                        </View>
                      )}
                      <View style={{
                        marginTop: 20
                      }}>
                        <OButton
                          onClick={handelOpenDetails}
                          text={t('ORDER_DETAILS', 'Order Details')}
                          imgRightSrc={theme?.images?.general?.chevronDown}
                          textStyle={styles.loadButtonText}
                          style={styles.loadButton}
                          bgColor={theme.colors.primary}
                          borderColor={theme.colors.primary}
                          imgRightStyle={{
                            marginRight: -10,
                            tintColor: '#FFFFFF'
                          }}

                        />
                      </View>
                    </View>
                  </>

                </>
              )}
              <RBSheet
                ref={refRBSheet}
                height={Platform.OS === 'android' ? Dimensions.get('screen').height * 0.83 : 800}
                openDuration={250}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                  wrapper: {
                    backgroundColor: 'transparent',
                    // borderTopLeftRadius:10
                    // :Dimensions.get('window').width
                  },
                  container: {
                    borderTopLeftRadius: 50, // Rounded corners on top
                    borderTopRightRadius: 50, // Rounded corners on top

                  },
                  draggableIcon: {
                    backgroundColor: '#000',
                  },
                }}
                customModalProps={{
                  animationType: 'slide',
                  statusBarTranslucent: true,
                }}
                customAvoidingViewProps={{
                  enabled: false,
                }}
              >
                <OrderDetailsMap
                  order={selectedOrder ?? completedOrder}
                  navigation={navigation}
                  handelCloseDetails={handelCloseDetails}
                  handleMarkerPress={handleMarkerPress}
                  driverAndBusinessId={true}
                  handleopendetails={handelOpenDetails}
                  forcetorender={forcetorerender}
                  // openActiveOrderMapsAccepted={checkactiveOrderandopemMapsAccepted}
                  openActiveOrderMapsPickupcom={checkactiveOrderandopemMapsPickup}

                />

              </RBSheet>
              {selectedOrder && selectedOrder?.status === 9 && (
                <View style={{
                  zIndex: 1000, position: 'absolute',
                  bottom: 60, justifyContent: 'center',
                  alignItems: 'center', display: 'flex',
                  flexDirection: 'column',
                  width: '100%',

                }}>
                  <OText
                    size={14}
                    color={theme.colors.textGray}
                    style={{ marginLeft: 5 }}
                  >
                    {selectedOrder?.customer?.address}
                  </OText>
                  <OText
                    size={14}
                    color={theme.colors.textGray}
                    style={{ marginLeft: 5 }}
                  >
                    {selectedOrder?.customer?.name}
                  </OText>
                  <OButton
                    onClick={handelOpenDetails}
                    text={t('ORDER_DETAILS', 'Order Details')}
                    imgRightSrc={null}
                    textStyle={styles.loadButtonText}
                    style={styles.loadButton}
                    bgColor={theme.colors.primary}
                    borderColor={theme.colors.primary}
                  />

                </View>
              )}
              {completedOrder && (
                <View style={{
                  zIndex: 1000, position: 'absolute',
                  bottom: 60, justifyContent: 'center',
                  alignItems: 'center', display: 'flex',
                  flexDirection: 'column',
                  width: '100%'
                }}>
                  <OButton
                    onClick={handelOpenDetails}
                    text={t('ORDER_DETAILS', 'Order Details')}
                    imgRightSrc={null}
                    textStyle={styles.loadButtonText}
                    style={styles.loadButton}
                    bgColor={theme.colors.primary}
                    borderColor={theme.colors.primary}
                  />

                </View>
              )}


              {!selectedOrder && currentOrdersGroup?.loading && (
                <>
                  <View style={{
                    zIndex: 1000, position: 'absolute',
                    bottom: 60, justifyContent: 'center',
                    alignItems: 'center', display: 'flex',
                    flexDirection: 'column',
                    width: '100%'
                  }}>
                    <OText>{t('FINDING_ORDERS', 'Finding Orders...')}</OText>
                    <TouchableOpacity>
                      <OButton
                        onClick={handelCancelFinding}
                        text={t('CANCEL', 'Cancel')}
                        imgRightSrc={null}
                        textStyle={styles.loadButtonText}
                        style={styles.loadButton}
                        bgColor={theme.colors.primary}
                        borderColor={theme.colors.primary}
                      />
                    </TouchableOpacity>
                  </View>

                </>


              )}
              {/* {
              !selectedOrder && currentOrdersGroup?.loading && ( */}
              {/* <View style={{
              zIndex: 1000, position: 'absolute',
              bottom: 300, justifyContent: 'center',
              alignItems: 'center', display: 'flex',
              flexDirection: 'column',
              width: '100%'
            }}>

              <>
                <Animated.View
                  style={[
                    styles.circle,
                    {
                      transform: [{ scale: scaleAnim }],
                      opacity: opacityAnim,
                    },
                  ]}
                />
                <View style={styles.marker} >
                  <EntypoIcon
                    name='direction'
                    color='#FFFFFF'
                    size={20}
                  />
                </View>
              </>



            </View> */}
              {
                currentOrdersGroup?.loading && (
                  <View style={{
                    zIndex: 1000, position: 'absolute',
                    bottom: 300, justifyContent: 'center',
                    alignItems: 'center', display: 'flex',
                    flexDirection: 'column',
                    width: '100%'
                  }}>
                    <View style={styles.circleContainer}>

                      {animations.map((anim, i) => (
                        <Animated.View
                          key={i}
                          style={[styles.circle, getAnimatedStyle(anim)]}
                        />
                      ))}
                      {/* <Animated.View style={[styles.circle, animatedStyle]} /> */}
                      <View style={styles.marker} >
                        <EntypoIcon
                          name='direction'
                          color='#FFFFFF'
                          size={20}
                        />
                      </View>
                    </View>
                  </View>
                )
              }
              {/* )} */}
              {!selectedOrder && !completedOrder && !currentOrdersGroup?.loading && !inProOrders && (
                <>
                  <View style={{
                    zIndex: 1000, position: 'absolute',
                    bottom: 60, justifyContent: 'center',
                    alignItems: 'center', display: 'flex',
                    flexDirection: 'column',
                    width: '100%'
                  }}>

                    <OText
                      style={{
                        fontSize: 19,
                        fontWeight: '400',
                        color: '#2B3847',
                        textAlign: 'center',
                        fontFamily: 'Outfit-Regular',
                        marginBottom: 20
                      }}
                    >{t('GREATE_DAY_START', 'Such a great day to start')} {'\n'} {t('EARN_WITH_US', 'Earn with us')}</OText>
                    <TouchableOpacity>
                      <OButton
                        onClick={() => loadOrders && loadOrders({ newFetch: true })}
                        text={t('START_FINDING_ORDERS', 'Start finding orders')}
                        imgRightSrc={null}
                        textStyle={styles.loadButtonText}
                        style={styles.loadButton}
                        bgColor={theme.colors.primary}
                        borderColor={theme.colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
              {!selectedOrder && !completedOrder && !currentOrdersGroup?.loading && inProOrders && (
                <>
                  <View style={{
                    zIndex: 1000, position: 'absolute',
                    bottom: 60, justifyContent: 'center',
                    alignItems: 'center', display: 'flex',
                    flexDirection: 'column',
                    width: '100%'
                  }}>

                    <OText
                      style={{
                        fontSize: 19,
                        fontWeight: '400',
                        color: '#2B3847',
                        textAlign: 'center',
                        fontFamily: 'Outfit-Regular',
                        marginBottom: 20
                      }}
                    >{t('GREATE_DAY_START', 'Such a great day to start')} {'\n'} {t('EARN_WITH_US', 'Earn with us')}</OText>
                    <TouchableOpacity>
                      <OButton
                        onClick={handelOpenActiveOrders}
                        text={t('ACTIVE_ORDERS', 'Active orders')}
                        imgRightSrc={null}
                        textStyle={styles.loadButtonText}
                        style={styles.loadButton}
                        bgColor={theme.colors.primary}
                        borderColor={theme.colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}

            </View>
          </View>
        </ScrollView>
        {/* </SafeAreaView> */}
        <NewOrderNotification isBusinessApp={isBusinessApp} />
      </GestureHandlerRootView>
    </>
  );
};

export const OrdersOptionMap = (props: OrdersOptionParams) => {
  const [, t] = useLanguage();
  const [configState] = useConfig()
  const [, offlineMethods] = useOfflineActions()

  const [checkNotificationStatus, setCheckNotificationStatus] = useState({ open: false, checked: false })

  const ordersProps = {
    ...props,
    UIComponent: OrdersOptionMapUI,
    useDefualtSessionManager: true,
    asDashboard: true,
    isIos: Platform.OS === 'ios',
  };

  return (<>
    <OrderListGroups {...ordersProps} />
    {props?.checkNotification && (
      <NotificationSetting checkNotificationStatus={checkNotificationStatus}
        setCheckNotificationStatus={setCheckNotificationStatus} />
    )}
  </>);
};

OrdersOptionMap.defaultProps = {
  isNetConnected: true
}
