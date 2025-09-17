import React, { useEffect, useState } from "react";
import { useTheme } from 'styled-components/native';
import { useLanguage, useApi } from "@components"
import { View, Text, StyleSheet, StatusBar, Image, TextInput, Dimensions, TouchableOpacity, ScrollView, Pressable, Modal, Platform } from 'react-native';
import { moderateScale } from "../../providers/Responsive";
import styled from 'styled-components/native';

import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  OButton, OInput, OModal, OIconButton, OText,
  PhoneInputNumber,
  VerifyPhone, Container,
  Loader,SafeAreaContainerLayout
} from '@ui'
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SignupUserDetails as SignupUserDetailsControler } from './signupuserDetailsControler'

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;
const VehicleListUI = (props: any) => {

  let { onclosevehicleModal, ondriverlisenceModal, deliveryType, formstate } = props;
  const [selectedVehicle, setSelectedVehicle] = useState(null); // State to track the selected item
  const theme = useTheme();
  const [, t] = useLanguage();
  const [ordering] = useApi();
  const [vehicleList, setVehicleList] = useState([])
  const [loading, setloading] = useState(false)
  const vahicalData = [
    {
      icon: <MaterialIcon
        name='pedal-bike'
        size={20}
        color='#26374B'
      />,
      type: 'MaterialIcons',
      title: 'Bicycle',
    },
    {
      icon: <FontAwesome
        name="car"
        size={20}
        color='#26374B'
      />,
      type: 'Ionicons',
      title: 'Car',
    },
    {
      icon: <FontAwesome5Icon
        name='motorcycle'
        size={20}
        color='#26374B'
      />,
      type: 'FontAwesome',
      title: 'Motorcycle',
    },
    {
      icon: <MaterialCommunityIcons
        name='shoe-formal'
        size={20}
        color='#26374B'
      />,
      type: 'MaterialCommunityIcons',
      title: 'Foot',
    },
    {
      icon: <MaterialIcon

        name='bike-scooter'
        size={20}
        color='#26374B'
      />,
      type: 'Fontisto',
      title: 'Scooter',
    },
    {
      icon: <FeatherIcon
        name='truck'
        size={20}
        color='#26374B'
      />,
      type: 'Feather',
      title: 'Truck',
    },
    {
      icon: <MaterialCommunityIcons
        name='van-passenger'
        size={20}
        color='#26374B'
      />,
      type: 'MaterialCommunityIcons',
      title: 'Van',
    }
  ];

  const styles = StyleSheet.create({
    container: {
      // paddingHorizontal: 10,
      // height: '100%'t: '100%'eight: Dimensions.get('window').height,
      // paddingHorizontal: 10,
      height: '100%',

    },
    card_view: {
      // marginHorizontal: moderateScale(15),
      padding: moderateScale(10),
      borderRadius: moderateScale(15),
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: moderateScale(10),
    },
    backcheck_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: moderateScale(15),
      fontWeight: '400'
    },
    inner_card: {
      marginLeft: moderateScale(10),
      flexDirection: 'row',
      justifyContent: 'space-between',
      flex: 1,
      alignItems: 'center',
    },
    header: {
      marginBottom: moderateScale(30),
      display: 'flex',
      flexDirection: 'row',
      // marginHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ECEEEF',
      paddingTop: 10,
      // width:Dimensions.get('window').width

      // marginTop:40
    },
    arrowLeft: {
      maxWidth: moderateScale(40),
      height: moderateScale(25),
      justifyContent: 'flex-end',
      // paddingHorizontal: 10
      // marginBottom: moderateScale(20),
    },
    btn: {
      borderRadius: 7.6,
      height: Platform.OS === 'android' ? 60 : 44,
      left: 0,
      width: '100%',
      marginHorizontal: 10
    },
    btnText: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Outfit-Regular',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 18,

    },

  });



  const handleSelectVehicle = (title: any) => {
    setSelectedVehicle((prev) => (prev === title ? null : title));
  };

  useEffect(() => {
    setSelectedVehicle(formstate?.deliveryType)
  }, [])
  const loadVehicleList = async () => {
    setloading(true);
    try {
      const res = await fetch('https://plugins-development.ordering.co/' + ordering.project + '/vehicle_settings.php', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          option: '0',
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const vehicleList = await res.json();
      setVehicleList(vehicleList?.data || []);
      setloading(false)
    } catch (error) {
      console.error("Error loading vehicle list:", error);
    } finally {
      setloading(false); // Ensure loading is reset even if an error occurs
    }
  };

  useEffect(() => {
    // console.log(ordering?.root)
    loadVehicleList()
  }, [])

  useEffect(() => {
    console.log(loading, 'loading///..')
  }, [loading])
  return (
    <>


      <View style={[styles.container, { marginTop: Platform.OS == 'ios' ? 10 : 0, padding: 0}]}>

        <View style={[styles.header]}>

          <OIconButton
            icon={theme.images.general.arrow_left}
            borderColor={theme.colors.clear}
            iconStyle={{ width: 20, height: 20, tintColor: '#000000' }}
            style={styles.arrowLeft}
                       onClick={() => props?.navigation?.goBack()}

          />

          <Text style={{
            textAlign: 'center',
            width: '80%',
            fontSize: 17,
            color: theme?.colors.logintext,
            fontFamily: 'Oufit',
            fontWeight: '400'

          }}>{t('YOUR_VEHICLE', 'Your Vehicle')}</Text>
        </View>

        {
          loading ? (


            // <View style={{
            //   justifyContent: 'center',
            //   alignItems: 'center',
            // }}  >

            <Loader />
            // </View>
          )
            :
            (
              <>
                <View>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 15,
                      color: '#979B9D',
                      fontWeight: '400'
                    }}
                  >{t('OFFERED_BASED_VEHICLE', 'You’ll be offered deliveries based on your vehicle')}</Text>
                </View>
                {/* <Container style={{

                }}> */}
                  {vehicleList.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{ ...styles.card_view, backgroundColor: theme?.colors.loginInputbackground }}
                      onPress={() => {
                        // handleSelectVehicle(item?.name)
                        setSelectedVehicle(item?.name)
                        deliveryType(item?.name)
                      }}
                    >
                      {/* <Icon
              name={item.icon}
              type={item.type}
              size={20}
              color={colors.primaryFontColor}
            /> */}
                      <View style={styles.inner_card}>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}>
                          <Image

                            source={{ uri: item?.img_url }}
                            style={{
                              width: 22,
                              height: 22
                            }}
                            resizeMode='cover'
                          />
                          <Text style={{ ...styles.backcheck_txt, color: theme?.colors.logintext, marginLeft: 10 }}>
                            {item?.name}
                          </Text>
                        </View>

                        {selectedVehicle === item?.name && (
                          <AntDesignIcon
                            name='checkcircle'
                            size={16}
                            color='#EE4140'
                          />

                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                {/* </Container> */}
                <View style={{
                  bottom: Platform.OS == 'ios' ? 150 : 60,
                  position: 'absolute',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10
                }}>
                  <OButton

                    text={t('NEXT', 'Next')}
                    bgColor={theme.colors.primary}
                    borderColor={theme.colors.primary}
                    textStyle={styles.btnText}
                    imgRightSrc={null}
                    //   isLoading={formState?.loading || loading}
                    style={styles.btn}
                    // parentStyle={{

                    // }}
                    isDisabled={formstate?.deliveryType !== '' ? false : true}
                    onClick={() => {
                      props?.navigation?.navigate('CustomerLisence')

                    }}
                  />
                </View>
              </>
            )


        }


      </View>



    </>
  )
}


export const CustomerVehicleList = (props: any) => {

  const SignupUserDetailsProps = {
    ...props,
    UIComponent: VehicleListUI
  }
  return (
    <>
     <SafeAreaContainerLayout>
     <SignupUserDetailsControler
        {...SignupUserDetailsProps}
      />
     </SafeAreaContainerLayout>

    </>
  )
}
