import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Pressable, StyleSheet, ScrollView, Alert, Text, Platform, Linking, TouchableOpacity, Dimensions, SafeAreaView, Modal } from 'react-native';

import { useTheme } from 'styled-components/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { OrderDetailsContainer, Comments, OrderDetailsproducts, Header } from './styles';
import { OrderDetailsParams } from '../../types';
import { _retrieveStoreData, _setStoreData, _removeStoreData } from '../../providers/StoreUtil'
import { getCurrenySymbol } from '../../utils';
import { USER_TYPE } from '../../config/constants';
import {
  useLanguage,
  useToast,
  useSession,
  ToastType,
  useUtils,
  useConfig,
  useApi,
} from '@components';

import { OrderDetails as OrderDetailsConTableoller } from './OrderDetails';
// import { Modal, Provider, Portal } from 'react-native-paper';
import {
  OButton, OText, OModal, OIcon, OInput, OTextarea, Chat,
  Loader
} from '@ui'
import { normalize, moderateScale } from '../../providers/Responsive';
import FeatherIcon from 'react-native-vector-icons/Feather';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Sides } from '../OrdersListManager/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SwipeButton from 'rn-swipe-button';
// import Modal from "react-native-modal";

const OrderDetailsMapUI = (props: any) => {
  const {
    handleUpdateOrderData,
    handleUpdateReceipt,
    handleChangeOrderStatus,
    handelCloseDetails,
    handleMarkerPress,
    showPickupComplete,
    showDeliveryComplete,
    navigation,
    handleDeliveryReceipt,
    messages,
    setMessages,
    handleopendetails,
    readMessages,
    messagesReadList,
    permissions,
    askLocationPermission,
    driverLocation,
    actions,
    updateDriverPosition,
    driverUpdateLocation,
    setDriverUpdateLocation,
    orderTitle,
    appTitle,
    handleClickLogisticOrder,
    forceUpdate,
    getPermissions,
    orderAssingId,
    isGrantedPermissions,
    imageuploadLoading,
    setStatusComplete,
    forcetorender,
    // openActiveOrderMaps,
    openActiveOrderMapsPickupcom
  } = props;
  const theme = useTheme();
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();
  const [{ parsePrice, optimizeImage }] = useUtils();
  const [{ configs }] = useConfig();
  const [ordering] = useApi()
  const { order } = props.order
  const [session] = useSession();
  const [openOrderDetails, setOpenOrderDetails] = useState(false)
  const viewRef = useRef<any>(null);
  const textTareaRef = useRef<any>();
  const scrollViewRef = useRef<any>(null);
  const [comments, setComments] = useState('');
  const [delaymin, setDelaymin] = useState('0:0');
  const [pickupReceipt, setPickupReceipt] = useState(null);
  const [receiptVal, setReceiptVal] = useState(0);

  const [openOrderMessage, setOpenOrderMessage] = useState(false)
  const [imagemodal, setimagemodal] = useState(false)
  const [, forceUpdates] = useState(0);

  const styles = StyleSheet.create({
    loadButton: {
      borderRadius: 7.6,
      height: 44,
      marginRight: 10,
      marginBottom: 10,
      marginTop: 5,
    },
    loadButtonText: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
    },
    inputStyle: {
      marginBottom: 25,
      borderRadius: 12,
      backgroundColor: theme.colors?.loginInputbackground,
      marginTop: 10,
      minHeight: 48,
      maxHeight: 48
    },
    btnBackArrow: {
      borderWidth: 0,
      width: '35%',
      height: 32,
      tintColor: theme.colors.textGray,
      backgroundColor: theme.colors.clear,
      borderColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      paddingLeft: 0,
      paddingRight: 0,
      // marginBottom: 30,
      // marginTop: Platform.OS === 'ios' ? 60 : 30
    },
    businessdetail: {
      flexDirection: 'row',
      // width:Dimensions.get('window').width,
      justifyContent: 'space-evenly',
      // gap: 6,
      borderBottomColor: '#ECEEEF',
      borderBottomWidth: 1,
      padding: 10,
      paddingHorizontal: moderateScale(14)
    },
    businesstitle: {
      fontSize: moderateScale(20),
      color: '#1B3E70',
      fontFamily: 'Outfit-Regular',
      fontWeight: '400',

    },
    businesslale: {
      color: '#515C69',
      fontSize: 15,
      fontWeight: '400', padding: 10
    },
    pickup_details: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#F4F5F6',
      padding: 10,
      // margin:moderateScale(14)
    }
  });


  const openMaps = (lat: number, lng: number) => {
    const label = "Destination"; // Optional label
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`, // Opens Apple Maps
      android: `google.navigation:q=${lat},${lng}`, // Opens Google Maps
    });

    if (url) {
      Linking.openURL(url).catch((err) => console.error("An error occurred", err));
    }
  };

  const handleSubmitData = () => {
    handleUpdateOrderData && handleUpdateOrderData(delaymin, comments)

  }
  const handelConfirmOrder = async () => {
    handleMarkerPress && handleMarkerPress(order)
    handelCloseDetails && handelCloseDetails()
  }
  const handelDeliveryOrder = async () => {
    console.log('orders')
    // if (navigation?.navigate) {
    handelCloseDetails && handelCloseDetails()
    forcetorender()
    navigation?.navigate('MyOrders')

    // } else {
    //   navigation.goBack()
    // }
  }

  const handleFocus = () => {
    viewRef?.current?.measure((x: any, y: any) => {
      scrollViewRef?.current?.scrollTo({ x: 0, y });
    });
  };
  const handleChangeInput = (e: any) => {
    console.log(e)
    setDelaymin(e)
  };


  const handleimageFromcamera = () => {
    // setimagemodal(false)
    const options = {
      mediaType: 'photo',
      maxHeight: 200,
      maxWidth: 200,
      includeBase64: true,
    };
    // handleopendetails()
    launchCamera(options, handleImageResponse)
  }


  const handleimageFromlibrary = () => {
    // handelCloseDetails && handelCloseDetails()
    const options = {
      mediaType: 'photo',
      maxHeight: 200,
      maxWidth: 200,
      includeBase64: true,
    };
    launchImageLibrary(options, handleImageResponse)
    // handelCloseDetails && handelCloseDetails()

  }


  const handleImagePicker = (val: any) => {
    setReceiptVal(val)
    setimagemodal(true)

    // handleDeliveryReceipt('https://media.istockphoto.com/id/529664572/photo/fruit-background.jpg?s=612x612&w=0&k=20&c=K7V0rVCGj8tvluXDqxJgu0AdMKF8axP0A15P-8Ksh3I=');
  };

  //SWIPE

  let forceResetLastButton: any = null;
  let forceCompleteCallback: any = null;
  const [finishSwipeAnimDuration, setFinishSwipeAnimDuration] = useState(400)

  const forceCompleteButtonCallback = useCallback(() => {
    setFinishSwipeAnimDuration(0)
    forceCompleteCallback()
  }, [])

  const forceResetButtonCallback = useCallback(() => {
    forceResetLastButton()
    setInterval(() => setFinishSwipeAnimDuration(400), 1000)
  }, [])

  // Function to handle the image response
  const handleImageResponse = (image: any) => {
    const response = image?.assets?.[0];
    if (response?.didCancel) {
      setimagemodal(false)
    } else if (response?.errorMessage) {
      setimagemodal(false)
      console.log('ImagePicker Error: ', response.errorMessage);
      showToast(ToastType.Error, response.errorMessage);
    } else {
      if (response?.uri) {
        const url = `data:${response.type};base64,${response.base64}`;
        //console.log('Selected Image URL:', url);
        if (receiptVal === 1) {
          setimagemodal(false)
          setPickupReceipt(url)
          handleUpdateReceipt(url);
          // handelCloseDetails && handelCloseDetails()

        }
        if (receiptVal === 2) {
          setimagemodal(false)
          handleDeliveryReceipt(url);
          // handelCloseDetails && handelCloseDetails()

        }
      } else {
        showToast(ToastType.Error, 'Image not found');
      }
    }
  };


  // useEffect(() => {
  //   if (!imagemodal) {
  //     setimagemodal(false)
  //   }
  //   if (imagemodal) {
  //     setimagemodal(true)
  //   } else {
  //     setimagemodal(false)
  //   }
  // }, [imagemodal])

  useEffect(() => {
    if (showDeliveryComplete) {
      setTimeout(async () => {
        // setStatusComplete(false)
        await handelDeliveryOrder()

      }, 2000);
    }
  }, [showDeliveryComplete])

  useEffect(() => {
    if (showPickupComplete) {
      setTimeout(async () => {
        await handelConfirmOrder()
        openActiveOrderMapsPickupcom()
      }, 2000);
    }
  }, [showPickupComplete])
  return (
    <>
      {/* <OModal
        open={true}
        // onClose={() => handleOpenMapView()}
        entireModal
        customClose>
        <DriverMap
          navigation={navigation}
          order={order}
          // orderStatus={getOrderStatus(order?.status, t)?.value || ''}
          // location={locationMarker}
          readOnly
          updateDriverPosition={updateDriverPosition}
          driverUpdateLocation={driverUpdateLocation}
          setDriverUpdateLocation={setDriverUpdateLocation}
        // handleViewActionOrder={handleViewActionOrder}
        // isBusinessMarker={isBusinessMarker}
        // isToFollow={isToFollow}
        // showAcceptOrReject={
        //   showFloatButtonsAcceptOrReject[order?.status]
        // }
        // handleOpenMapView={handleOpenMapView}
        />
      </OModal> */}
      <Modal
        transparent={true}
        visible={imageuploadLoading}
      >

        <Loader />
      </Modal>
      {
        imagemodal ?
          (
            <Modal
              animationType="slide"
              transparent={true}
              visible={imagemodal}
              onRequestClose={() => {
                setimagemodal(false)
              }}
              onDismiss={() => setimagemodal(!imagemodal)}
              // contentContainerStyle={{
              //   backgroundColor: "#FFFFFF00",
              //   justifyContent: 'center',
              //   alignItems: 'center'
              // }}
              style={{
                backgroundColor: "#FFFFFF00",
              }}
            >
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "rgba(0, 0, 0, 0.5)"

              }}>
                <Pressable
                  onPress={() => {
                    setimagemodal(false)
                    // clsoeima()
                    // handelCloseDetails && handelCloseDetails()

                    // setTimeout(() => setimagemodal(false), 1000)
                    // forceUpdates(prev => prev + 1); // Force re-render
                  }}
                >
                  <EntypoIcon
                    name='cross'
                    size={20}
                    color='#000'
                  />
                </Pressable>
                {/* <View style={{}}> */}
                <TouchableOpacity style={{
                  width: moderateScale(200),
                  height: moderateScale(50),
                  backgroundColor: '#FC3A38',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: '#FFFFFF'
                }}
                  onPress={() => handleimageFromlibrary()}
                >
                  <Text style={{
                    fontSize: 19,
                    color: '#FFFFFF',
                    fontWeight: '400',
                    fontFamily: 'Outfit-Regular'
                  }}>{t('OPEN_GALLERY', 'Open Gallery')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  width: moderateScale(200),
                  height: moderateScale(50),
                  backgroundColor: '#FC3A38',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 15,
                  borderWidth: 2,
                  borderColor: '#FFFFFF'
                }}
                  onPress={() => handleimageFromcamera()}
                >
                  <Text style={{
                    fontSize: 19,
                    color: '#FFFFFF',
                    fontWeight: '400',
                    fontFamily: 'Outfit-Regular'
                  }}>{t('TAKE_PICTURE_RECEIPT', 'Take Picture of Receipt')}</Text>
                </TouchableOpacity>
              </View>

              {/* </View> */}
            </Modal>
          )
          : null
      }


      {!openOrderDetails && order && (

        <OrderDetailsContainer>

          <View style={[styles?.businessdetail]}>

            <OIcon
              url={optimizeImage(order?.business?.logo, 'h_300,c_limit')}
              src={!order?.business?.logo && theme.images.dummies.businessLogo}
              width={60}
              height={60}
              style={{ borderRadius: 10 }}
            />
            <View style={{
              paddingLeft: moderateScale(10)
              // backgroundColor:'#000'
            }}>
              <OText
                size={14}

                style={styles?.businesstitle}
              >
                {order?.business?.name}
              </OText>
              <View style={{
                flexDirection: 'row',
                // alignItems: 'center',
                maxWidth: '90%',

              }}>
                <EntypoIcon
                  name='location-pin'
                  size={16}
                  color='#7D8793'
                />
                <OText
                  size={14}
                  style={{
                    color: '#7D8793',
                    fontSize: 13,
                    // flexWrap:'wrap',
                    // maxWidth:'70%'

                  }}
                >
                  {order?.business?.address}
                </OText>
              </View>

            </View>
            {/* <View style={{
              height: 34,
              width: 34,
              backgroundColor: '#7D8793',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <AntDesignIcon
                name='question'
                size={20}
                color='#FFFFFF'
              />
            </View>*/}
          </View>

          <View style={{ width: '100%', padding: 10, paddingTop: 15, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{
              backgroundColor: '#F4F5F6',
              borderRadius: 12,
              width: moderateScale(170),
              height: moderateScale(47),
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {(order?.status === 0 || order?.status === 13 || order?.status === 4 || order?.status === 7 || order?.status === 8 || order?.status === 9) ? (
                <Text style={{
                  fontSize: 15,
                  color: '#EE4140',
                  fontWeight: '400'
                }}>{t('ORDER_PREPAID', 'Order is prepaid')}</Text>
              ) : (
                <Text style={{
                  fontSize: 15,
                  color: '#EE4140',
                  fontWeight: '400'
                }}>{t('ORDER_COMPLETED', 'Order is completed')}</Text>
              )}
            </View>
            <View style={{
              flexDirection: 'row',
              gap: 10
            }}>
              <TouchableOpacity onPress={() => setOpenOrderMessage(true)}>


                <FeatherIcon
                  name='message-square'
                  color='#26374B'
                  size={27}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openMaps(order?.business?.location?.lat, order?.business?.location?.lng)}>


                <FeatherIcon
                  name='map'
                  color='#26374B'
                  size={27}
                />
              </TouchableOpacity>
            </View>


          </View>
          <OText
            size={14}
            style={styles?.businesslale}
          >
            {t('PICKUP_ORDER', 'Pick up Order:')}
          </OText>
          <View style={{
            paddingHorizontal: moderateScale(8)
          }}>
            <View style={styles?.pickup_details}>
              <View style={{
                flexDirection: 'row',
                width: '40%',
                justifyContent: 'space-between',

              }}>
                <View style={{
                  flexDirection: 'column',
                }}>
                  <OText
                    style={{
                      fontSize: 12,
                      color: '#979B9D',
                      fontWeight: '400'
                    }}

                  >
                    {t('ORDER_ID', 'Order ID:')}
                  </OText>
                  <Text style={{
                    color: '#F79568',
                    fontSize: moderateScale(15),
                    fontWeight: '400',
                    fontFamily: 'Outfit-Regular'
                  }}>{order?.id}</Text>
                </View>
                <View style={{
                  flexDirection: 'column',
                }}>
                  <OText
                    style={{
                      fontSize: 12,
                      color: '#979B9D',
                      fontWeight: '400'
                    }}
                  >
                    {t('NAME', 'Name')}:
                  </OText>
                  <Text

                    style={{
                      color: '#1B3E70',
                      fontSize: moderateScale(15),
                      fontWeight: '400',
                      fontFamily: 'Outfit-Regular'
                    }}
                  >{order?.customer?.name}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setOpenOrderDetails(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <OText

                  style={{
                    color: '#1B3E70',
                    fontSize: moderateScale(15),
                    fontWeight: '400',
                    fontFamily: 'Outfit-Regular'
                  }}
                >
                  {t('DETAILS', 'Details')}
                </OText>
                <FeatherIcon
                  name='chevron-right'
                  size={20}
                  color='#1B3E70'
                />
              </TouchableOpacity>
            </View>
          </View>


          {(order?.status === 0 || order?.status === 8) && (
            <>
              <OText
                style={styles?.businesslale}
              >
                {t('NOTE_BUSINESS', 'Note from business:')}
              </OText>
              <View style={{
                paddingHorizontal: moderateScale(8)
              }}>
                <View style={{
                  padding: 10,
                  backgroundColor: '#F4F5F6'

                }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    <View style={{
                      backgroundColor: '#1B3E70',
                      width: 5,
                      height: 5,
                      borderRadius: 100
                    }}></View>
                    <OText
                      style={{
                        color: '#1B3E70',
                        fontSize: 15,
                        fontWeight: '400',
                        marginLeft: 5
                      }}
                    >
                      {order?.order_source}
                    </OText>
                  </View>

                </View>
              </View>
              <OText
                style={styles?.businesslale}
              >
                {t('RECEIPTS', 'Receipts')}
              </OText>
              <View style={{
                paddingHorizontal: moderateScale(8)
              }}>
                <View style={{
                  backgroundColor: '#F4F5F6',
                  width: '100%',
                  padding: 10
                }}>

                  {!order?.pickup_receipt && (
                    <OText
                      style={{
                        color: '#ECB800',
                        fontSize: 15,
                        fontWeight: '400',
                        // padding: 10
                      }}
                    >
                      {t('NO_RECEIPTS_ADDED', 'No Receipt is Added')}
                    </OText>
                  )}
                  {order?.pickup_receipt && (
                    <OIcon
                      url={optimizeImage(order?.pickup_receipt, 'h_300,c_limit')}
                      width={100}
                      height={100}
                      style={{ borderRadius: 7.2 }}
                    />
                  )}
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    //  padding:10,
                    marginTop: 14
                  }}>
                    <OText
                      style={{

                        color: '#1B3E70',
                        fontSize: moderateScale(15),
                        fontWeight: '400',
                        fontFamily: 'Outfit-Regular'
                      }}
                    >
                      {t('TOTAL', 'Total')}:
                    </OText>
                    <Text style={{

                      color: '#1B3E70',
                      fontSize: moderateScale(15),
                      fontWeight: '400',
                      fontFamily: 'Outfit-Regular'
                    }}>
                      {parsePrice(order?.summary?.total ?? order?.total, { currency: getCurrenySymbol(order?.currency) })}
                      <TouchableOpacity
                        onPress={() => setOpenOrderDetails(true)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        <FeatherIcon
                          name='chevron-right'
                          size={18}
                          color='#1B3E70'
                        />
                      </TouchableOpacity>
                    </Text>
                  </View>
                </View>
              </View>


            </>
          )}
          {order?.status === 9 && (
            <>
              <OText
                size={14}
                color={theme.colors.textGray}
                style={{ marginLeft: 5 }}
              >
                {t('END_ADDRESS', 'End Address')}
              </OText>
              <OText
                size={14}
                color={theme.colors.textGray}
                style={{ marginLeft: 5 }}
              >
                {order?.customer?.address}
              </OText>
            </>
          )}
        </OrderDetailsContainer>

      )}

      {openOrderDetails && order && (
        <OrderDetailsContainer>
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 10,
            paddingHorizontal: moderateScale(10)

          }}>
            <TouchableOpacity onPress={() => setOpenOrderDetails(false)} style={styles.btnBackArrow}>
              <OIcon src={theme.images.general.arrow_left} color='#000000' />
            </TouchableOpacity>
            <OText
              style={{
                color: '#1B3E70',
                fontSize: 17,
                fontWeight: '400'
              }}
            >
              {t('ORDER_DETAILS', 'Order Details')}
            </OText>
          </View>

          <View style={{
            padding: 10,
            flexDirection: 'row',
            top: 0,
            borderBottomColor: '#ECEEEF',
            borderBottomWidth: 1
          }}>
            <View style={{
              height: 74,
              width: 74,
              backgroundColor: '#E5E7E9',
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {order?.customer?.photo && (
                <OIcon
                  url={optimizeImage(order?.customer?.photo, 'h_300,c_limit')}
                  width={60}
                  height={60}
                  style={{ borderRadius: 10 }}
                />
              )}
              {!order?.customer?.photo && (
                <MaterialIcon
                  name='person'
                  size={50}
                  color='#FFFFFF'
                />
              )}
            </View>
            <View style={{
              marginLeft: 20
            }}>
              <Text
                style={{
                  fontSize: moderateScale(22),
                  fontFamily: 'Outfit-Regular',
                  color: '#1B3E70',
                  fontWeight: '400'
                }}
              >{order?.customer?.name}</Text>
              <Text style={{
                fontSize: 15,
                color: '#7D8793',
                fontFamily: 'Outfit-Regular',
                fontWeight: '400'

              }}>#{order?.id}</Text>
            </View>
          </View>
          {order?.status === 8 && (
            <>
              <View style={{
                padding: 10
              }}>

                <OText
                  style={styles?.businesslale}
                >
                  {t('ORDER_PREPARATION_TIME', 'Order preparation time (in min)')}
                </OText>
                <View style={{
                  backgroundColor: '#F4F5F6',
                  borderRadius: moderateScale(20),
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}>
                  <OInput
                    placeholder={'00:00'}
                    type="number-pad"
                    onChange={(e: any) => {
                      handleChangeInput(e);
                    }}
                    style={{
                      width: '70%',
                      backgroundColor: '#F4F5F6',
                      borderWidth: 0
                    }}
                    // style={styles.inputStyle}
                    editable={true}
                    selectionColor={theme.colors.primary}
                    placeholderTextColor={theme.colors.textGray}
                    color={theme.colors.textGray}
                  />
                  <OButton
                    onClick={() => handleSubmitData()}
                    text={t('SUBMIT', 'Submit')}
                    imgRightSrc={null}
                    textStyle={styles.loadButtonText}
                    style={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0
                    }}
                    // style={styles.loadButton}
                    bgColor={theme.colors.primary}
                    borderColor={theme.colors.primary}
                  />
                </View>

                {delaymin !== '0:0' && (
                  <Comments ref={viewRef}>
                    <OTextarea
                      textTareaRef={textTareaRef}
                      autoFocus
                      onFocus={handleFocus}
                      placeholder={t(
                        'PLEASE_TYPE_YOUR_COMMENTS_IN_HERE_DELAY',
                        'Please type your comments for delay',
                      )}
                      value={comments}
                      onChange={setComments}
                    />
                  </Comments>
                )}
              </View>
            </>
          )}
          <OText
            style={{
              paddingLeft: moderateScale(14),
              fontFamily: 'Outfit-Regular',
              // color:'#000000',
              // fontWeight:'500'
            }}
          >
            Order list:
          </OText>
          <View style={{
            padding: 10
          }}>
            {order?.products?.length > 0 &&
              order?.products.map((product: any, i: number) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 15,
                    borderRadius: 20,
                    backgroundColor: '#F4F5F6',
                    // marginTop: 13
                  }}
                  key={product?.id || i}>
                  <OText
                    style={{
                      fontSize: 15,
                      color: '#1B3E70',
                      fontWeight: '400',
                      fontFamily: 'Outfit-Regular'
                    }}
                  >
                    {product?.name}
                  </OText>
                  <OText
                    style={{
                      fontSize: 15,
                      color: '#F79568',
                      fontWeight: '400',
                      fontFamily: 'Outfit-Regular'
                    }}
                  >
                    {product?.quantity}X
                  </OText>
                </View>
              ))}
          </View>
          {
            order?.chcreditdata?.length > 0 && order?.chcreditdata?.filter(chcre => chcre?.cus_type === 2)?.map(chcre => (
              <View key={chcre.cus_type} style={{
                padding: 20,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.20,
                shadowRadius: 1.41,

                elevation: 1.6,
                // backgroundColor: '#ffffff'
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <OText mBottom={4} style={{
                    fontSize: 15,
                    color: '#1B3E70',
                    fontWeight: '400',
                    fontFamily: 'Outfit-Regular'
                  }}>
                    {`${chcre.type === '2' ? t('EXTRA_CHARGED', 'Extra Charged') : t('Credit', 'Credit')} `}


                  </OText>
                  <OText mBottom={4} style={{
                    fontSize: 15,
                    color: '#EE4140',
                    fontWeight: '400',
                    fontFamily: 'Outfit-Regular'
                  }}>
                    {parsePrice(chcre?.amount)}
                  </OText>
                </View>


                <OText style={{
                  paddingTop: 7, fontSize: 15,
                  color: '#979B9D',
                  fontWeight: '400',
                  fontFamily: 'Outfit-Regular', lineHeight: 24
                }} >
                  {`${t('REASON', 'Reason')}: ${chcre.reason}`}
                </OText>

              </View>
            ))
          }
        </OrderDetailsContainer>
      )}
      {!order?.pickup_receipt && order?.picture_at_pickup === "true" && order?.status === 8 && (
        <View style={{ bottom: Platform.OS == 'ios' ? 30 : 0, padding: 30 }} >
          <SwipeButton
            disableResetOnTap
            forceReset={(reset: any) => {
              forceResetLastButton = reset
            }}
            finishRemainingSwipeAnimationDuration={finishSwipeAnimDuration}
            forceCompleteSwipe={(forceComplete: any) => {
              forceCompleteCallback = forceComplete

            }}
            onSwipeSuccess={() => handleImagePicker(1)}
            railBorderColor='#FFFFFF'
            // railFillBackgroundColor: PropTypes.string,
            // railFillBorderColor: PropTypes.string,
            railBackgroundColor="#EE4140"
            railStyles={{
              backgroundColor: '#EE4140',
              borderColor: '#FFFFFF',
              borderWidth: 0,
              paddingLeft: 6,
              paddingTop: 5,
              paddingBottom: 5

              // borderWidth:0
            }}
            railFillBorderColor='#FFFFFF'
            thumbIconComponent={() => {
              return (
                <>
                  <FeatherIcon
                    name='chevron-right'
                    color='#FFFFFF'
                    size={25}
                  />

                </>
              )
            }}
            disabledThumbIconBorderColor='#EE4140'
            thumbIconBorderColor='#EE4140'
            thumbIconBackgroundColor='#FFFFFF4D'
            // thumbIconImageSource={require('@/assets/images/react-logo.png')}
            title="Picked Up"
            titleStyles={{
              color: '#FFFFFF',
              fontWeight: '400',
              fontSize: 17
            }}
          />

        </View>


      )}

      {((order?.picture_at_pickup !== "true" && !order?.pickup_receipt) || (order?.picture_at_pickup === "true" && order?.pickup_receipt)) && order?.status === 8 && (
        <View style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 18
        }}>
          <OButton
            onClick={() => handleChangeOrderStatus(9, [order?.id])}
            text={t('CONFIRM_PICKED_UP', 'Confirm Pickup')}
            imgRightSrc={null}
            textStyle={styles.loadButtonText}
            style={styles.loadButton}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
          />


        </View>


      )}
      {/* {order?.status === 9 && (
        <View style={{ bottom: Platform.OS == 'ios' ? 30 : 0, padding: 30 }}>

          <SwipeButton
            disableResetOnTap
            forceReset={(reset: any) => {
              forceResetLastButton = reset
            }}
            finishRemainingSwipeAnimationDuration={finishSwipeAnimDuration}
            forceCompleteSwipe={(forceComplete: any) => {
              forceCompleteCallback = forceComplete

            }}
            onSwipeSuccess={() => handleImagePicker(2)}
            railBorderColor='#FFFFFF'
            // railFillBackgroundColor: PropTypes.string,
            // railFillBorderColor: PropTypes.string,
            railBackgroundColor="#EE4140"
            railStyles={{
              backgroundColor: '#EE4140',
              borderColor: '#FFFFFF',
              borderWidth: 0,
              paddingLeft: 6,
              paddingTop: 5,
              paddingBottom: 5

              // borderWidth:0
            }}
            railFillBorderColor='#FFFFFF'
            thumbIconComponent={() => {
              return (
                <>
                  <FeatherIcon
                    name='chevron-right'
                    color='#FFFFFF'
                    size={25}
                  />

                </>
              )
            }}
            disabledThumbIconBorderColor='#EE4140'
            thumbIconBorderColor='#EE4140'
            thumbIconBackgroundColor='#FFFFFF4D'
            // thumbIconImageSource={require('@/assets/images/react-logo.png')}
            title="Swipe to complete"
            titleStyles={{
              color: '#FFFFFF',
              fontWeight: '400',
              fontSize: 17
            }}
          />
        </View>
      )} */}
      {!order?.delivery_receipt && order?.picture_at_delivery === "true" && order?.status === 9 && (
        <View style={{ bottom: Platform.OS == 'ios' ? 30 : 0, padding: 30 }}>

          <SwipeButton
            disableResetOnTap
            forceReset={(reset: any) => {
              forceResetLastButton = reset
            }}
            finishRemainingSwipeAnimationDuration={finishSwipeAnimDuration}
            forceCompleteSwipe={(forceComplete: any) => {
              forceCompleteCallback = forceComplete

            }}
            onSwipeSuccess={() => handleImagePicker(2)}
            railBorderColor='#FFFFFF'
            // railFillBackgroundColor: PropTypes.string,
            // railFillBorderColor: PropTypes.string,
            railBackgroundColor="#EE4140"
            railStyles={{
              backgroundColor: '#EE4140',
              borderColor: '#FFFFFF',
              borderWidth: 0,
              paddingLeft: 6,
              paddingTop: 5,
              paddingBottom: 5

              // borderWidth:0
            }}
            railFillBorderColor='#FFFFFF'
            thumbIconComponent={() => {
              return (
                <>
                  <FeatherIcon
                    name='chevron-right'
                    color='#FFFFFF'
                    size={25}
                  />

                </>
              )
            }}
            disabledThumbIconBorderColor='#EE4140'
            thumbIconBorderColor='#EE4140'
            thumbIconBackgroundColor='#FFFFFF4D'
            // thumbIconImageSource={require('@/assets/images/react-logo.png')}
            title="Swipe to complete"
            titleStyles={{
              color: '#FFFFFF',
              fontWeight: '400',
              fontSize: 17
            }}
          />
        </View>
      )}

      {((order?.picture_at_delivery !== "true" && !order?.delivery_receipt) || (order?.picture_at_delivery === "true" && order?.delivery_receipt)) && order?.status === 9 && (
        <View style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 18
        }}>
          <OButton
            onClick={() => handleChangeOrderStatus(11, [order?.id])}
            text={t('CONFIRM_DELIVERY', 'Confirm Delivery')}
            imgRightSrc={null}
            textStyle={styles.loadButtonText}
            style={styles.loadButton}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
          />


        </View>


      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPickupComplete}
      // style={{
      //   zIndex:10000
      // }}
      >
        <TouchableOpacity
          // onPress={handelConfirmOrder}
          style={{
            flex: 1,
            backgroundColor: '#EE4140E5',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          {/* <View> */}
          <View style={{
            width: moderateScale(90),
            height: moderateScale(90),
            borderRadius: 100,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <EntypoIcon
              name='check'
              size={50}
              color='#EE4140'
            />
          </View>

          <Text style={{
            fontSize: moderateScale(30),
            fontFamily: 'Outfit-Regular',
            fontWeight: '400',
            color: '#FFFFFF',
            // zIndex:1000
          }}>{t('PICKUP_COMPLETED', 'Pick up is completed')}</Text>


          <Text style={{
            fontSize: moderateScale(17),
            fontFamily: 'Outfit-Regular',
            fontWeight: '400',
            color: '#FFFFFF'
          }}>{t('LETS_DROP_OFF', 'Now let’s drop off')}</Text>
        </TouchableOpacity>
        {/* </View> */}

      </Modal>
      {/* {showPickupComplete && (
        <>
          <TouchableOpacity onPress={handelConfirmOrder}>
            <OText
              size={14}
              color={theme.colors.textGray}
              style={{ marginLeft: 5 }}
            >
              Pickup is completed
            </OText>
            <OText
              size={14}
              color={theme.colors.textGray}
              style={{ marginLeft: 5 }}
            >
              Now let's drop off
            </OText>
          </TouchableOpacity>
        </>
      )} */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeliveryComplete}
      >
        <TouchableOpacity
          // onPress={handelDeliveryOrder}
          style={{
            flex: 1,
            backgroundColor: '#EE4140E5',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          {/* <View> */}
          <View style={{
            width: moderateScale(90),
            height: moderateScale(90),
            borderRadius: 100,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <EntypoIcon
              name='check'
              size={50}
              color='#EE4140'
            />
          </View>

          <Text style={{
            fontSize: moderateScale(30),
            fontFamily: 'Outfit-Regular',
            fontWeight: '400',
            color: '#FFFFFF'
          }}>{t('ORDER_FINISHED', 'Order is finished')}</Text>


          <Text style={{
            fontSize: moderateScale(17),
            fontFamily: 'Outfit-Regular',
            fontWeight: '400',
            color: '#FFFFFF'
          }}>{t('GOOD_JOB_KEEP_ON', 'Good job. Keep on!')}</Text>
        </TouchableOpacity>
        {/* </View> */}

      </Modal>
      {/* {showDeliveryComplete && (
        <>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <OText
              size={14}
              color={theme.colors.textGray}
              style={{ marginLeft: 5 }}
            >
              Order is finished
            </OText>
            <OText
              size={14}
              color={theme.colors.textGray}
              style={{ marginLeft: 5 }}
            >
              Good job. Keep on!
            </OText>
          </TouchableOpacity>
        </>
      )} */}
      {openOrderMessage && (
        <>
          <OText
          >
            test
          </OText>
          <OModal
            open={openOrderMessage}
            order={order}
            title={`${t('INVOICE_ORDER_NO', 'Order No.')} ${order.id}`}
            entireModal
            onClose={() => setOpenOrderMessage(false)}>
            <Chat
              type={USER_TYPE.BUSINESS}
              orderId={order?.id}
              messages={messages}
              order={order}
              setMessages={setMessages}
            />
          </OModal>
        </>
      )}
    </>
  );
};

export const OrderDetailsMap = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    UIComponent: OrderDetailsMapUI,

  };
  return <OrderDetailsConTableoller {...orderDetailsProps} />;
};
