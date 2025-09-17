import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, StatusBar, Image, TextInput, Dimensions, TouchableOpacity, ScrollView, Pressable, Modal, Platform, Alert } from 'react-native';
import {
  OIconButton, OButton, ODropDown, Container, SafeAreaContainerLayout
} from '@ui'
import { useLanguage } from "@components"
// import { moderateScale } from "../../providers/Responsive";
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { moderateScale, normalize } from "../../providers/Responsive";
import { useTheme } from 'styled-components/native';

import styled from 'styled-components/native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { DrawerContentScrollView } from '@react-navigation/drawer';
import { SignupUserDetails as SignupUserDetailsControler } from './signupuserDetailsControler'

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;
const CustomerDiscloserUI = (props: any) => {
  // let { ondriverdiscloserModal, onbackgroundCheckModal } = props
  const [, t] = useLanguage();
  const [driveragreenmentModal, setdriveragreementmodal] = useState(false)

  const [backgroundCheck, setbackroundCheck] = useState(false)
  const [dlvrAgreement, setdlvragreement] = useState(false)
  const refRBSheet = useRef<BottomSheet>(null);
  const refRBSheetdiscloser = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['1%', '50%', '100%'], []);

  const [bottomsheetActiveinde, setbottomsheetactiveinde] = useState(0)
  const theme = useTheme();

  // Handle sheet changes
  const handleSheetChanges = useCallback((index) => {
    console.log('BottomSheet Index:', index);
  }, []);

  const styles = StyleSheet.create({
    header: {
      // marginBottom: normalize(10),
      justifyContent: 'space-between',
      // paddingTop: 10
      // marginTop:40
    },
    arrowLeft: {
      maxWidth: normalize(40),
      height: normalize(25),
      justifyContent: 'flex-end',
      // paddingHorizontal: 10
      // marginBottom: normalize(25),
    },
    container: {
      flex: 1,
      height: Dimensions.get('window').height,
      // width: Dimensions.get('window').width,
      backgroundColor: '#FFFFFF',
      width: '100%'
      // alignItems:'center'
      // marginLeft: 30,
      // marginTop: 30
    },
    title_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(22),
      // marginHorizontal: normalize(15),
      // fontWeight: '400',
      // textAlign:'left'
      // marginTop: normalize(40)
    },
    title_txt_dsicloser: {
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(22),
      // marginHorizontal: normalize(15),
      // marginTop: normalize(40)
    },
    messege_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(15),
      fontWeight: '400'

    },
    box_view: {
      marginTop: normalize(14),
      // marginHorizontal: normalize(15),
      alignItems: 'center',
      flexDirection: 'row',
    },
    location_header: {
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(15),
      fontWeight: '400',
      textAlign: 'center'

    },
    top_view: {
      // marginHorizontal: normalize(15),
      marginTop: normalize(7),
      flexDirection: 'row',
      width: '90%',
      overflow: 'hidden'
    },
    Icon_position: {
      position: 'absolute',
      bottom: 2,
      left: normalize(110)
    },
    inputTitle_txt: {
      // marginHorizontal: normalize(15),
      marginTop: normalize(20),
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(13),
      gap: moderateScale(8),
      margin: 0,
      paddingBottom: moderateScale(4)
    },
    input_sty: {
      marginTop: normalize(4),
      // marginHorizontal: normalize(15),
      paddingHorizontal: normalize(10),
      // paddingVertical:moderateScale(17),
      borderRadius: normalize(12),
      maxHeight: 48,
      minHeight: 48
    },
    halfinputTitle_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(13),
      // fontWeight: '400'
      gap: moderateScale(8)
    },
    halfinput_sty: {
      marginTop: normalize(4),
      paddingHorizontal: normalize(10),
      borderRadius: normalize(20),
      maxHeight: 48,
      minHeight: 48,
      width: normalize(130)

    },
    main_view: {
      // marginHorizontal: normalize(15),
      marginTop: normalize(20),
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 6
    },

    signin_txt: {
      textAlign: 'center',
      fontSize: normalize(15),
      fontFamily: 'Outfit-Regular'
    },
    btn: {
      borderRadius: 7.6,
      height: Platform.OS === 'android' ? 60 : 48,
      left: 0,
      width: '100%',
      marginHorizontal: 16
    },
    btnText: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Outfit-Regular',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 18,

    },
    banner_txt: {
      height: normalize(300),
      width: normalize(300),
      resizeMode: 'contain',
      alignSelf: 'center'
    },
    backcheck_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(13),
      marginLeft: normalize(7)
    },
    // box_view: {
    //   marginTop: normalize(10),
    //   marginHorizontal: normalize(15),
    //   alignItems: 'center',
    //   flexDirection: 'row',
    // },
    photoinput_sty: {
      marginTop: normalize(4),
      // marginHorizontal: normalize(15),
      paddingHorizontal: normalize(10),
      borderRadius: normalize(20),
      height: normalize(100),
      alignItems: 'center',
      justifyContent: 'center'
    },
    take_pic_txt: {
      textAlign: 'center',
      fontSize: normalize(13),
      fontFamily: 'Outfit-Regular',
      fontWeight: '500'
    },
    box_view_closer: {
      marginTop: normalize(25),
      // marginHorizontal: normalize(15),
      paddingHorizontal: normalize(10),
      borderRadius: normalize(12),
      height: normalize(50),
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    summery_discloder: {
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(12),
      color: '#979B9D',
      fontWeight: '400',
      paddingHorizontal: 12,
      marginTop: 14,
      lineHeight: 18

    },
    modalContainer: {
      padding: normalize(15),
      alignSelf: 'center',
      // height: height/1.1,
      // borderTopLeftRadius: normalize(20),
      // borderTopRightRadius: normalize(20),
      backgroundColor: '#fff'
    },
    modal_top: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: normalize(20),
      padding: normalize(15)
    },
    modaltitle_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(20),
    },
    headerTitle_txt: {
      // marginTop: normalize(25),
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(13),
      padding: normalize(15)
    },
    deteils_txt: {
      // marginTop: normalize(25),
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(12),
      fontWeight: '400',
      padding: normalize(15),
      lineHeight: 20
    },
    icon_position: {
      position: 'absolute',
      right: 0
    },
    //   modalContainer: {
    //     padding: moderateScale(15),
    //     alignSelf: 'center',
    //     height: height / 1.8,
    //     width: width,
    //     borderTopLeftRadius: moderateScale(20),
    //     borderTopRightRadius: moderateScale(20),
    //     backgroundColor: '#fff'
    // },
    titlesub_txt: {
      // fontFamily: FONTS.Outfit.regular,
      fontSize: normalize(12),
      marginTop: normalize(10),
      textAlign: 'center',
      // marginHorizontal: normalize(15),
      fontFamily: 'Outfit-Regular'
    },
    card_view: {
      // marginHorizontal: normalize(15),
      padding: normalize(10),
      borderRadius: normalize(10),
      borderWidth: normalize(0.3),
      marginTop: normalize(10),
      flexDirection: 'row',
    },
    inner_card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginLeft: normalize(10),
      flex: 1
    },
    icon_view: {
      height: normalize(34),
      width: normalize(34),
      borderRadius: normalize(7),
      alignItems: 'center',
      justifyContent: 'center',
    },
    progress: {
      width: 200,
      height: 200,
      borderColor: '#EE4140',
      borderWidth: 5,
      borderRadius: 100,
      backgroundColor: '#F4F5F6'
    },
    user_circle: {
      height: normalize(150),
      width: normalize(150),
      borderRadius: normalize(100),
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: normalize(20)
    },

    retake_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(13),
      marginTop: normalize(15),
      textAlign: 'center'
    },
    line: {
      borderWidth: normalize(0.3),
      width: '90%',
      alignSelf: 'center',
      marginTop: normalize(40)
    },
    img_icon: {
      height: normalize(24),
      width: normalize(24)
    },
    condition_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(12),
      textAlign: 'center'
    },
    input: {
      height: 50,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      fontSize: 16,
    },
    aling_view: {
      width: normalize(90),
      alignItems: 'center',
    }
  })
  // useEffect(() =>{
  //   Alert.alert('Alert Title', 'My Alert Msg', [
  //     {
  //       text: 'Cancel',
  //       onPress: () => console.log('Cancel Pressed'),
  //       style: 'cancel',
  //     },
  //     {text: 'OK', onPress: () => console.log('OK Pressed')},
  //   ]);
  // },[])
  useEffect(() => {
    if (backgroundCheck) {
      refRBSheetdiscloser.current?.close()
    }
  }, [backgroundCheck])

  useEffect(() => {
    if (dlvrAgreement) {
      refRBSheet.current?.close()
    }
  }, [dlvrAgreement])

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>

        {/* <Container> */}
        <View style={[styles?.container,
          //  { marginTop: Platform.OS == 'ios' ? 40 : 0 }
        ]}>
          <View style={[styles.header, { marginTop: Platform.OS == 'ios' ? 0 : 0 }


          ]}>
            <OIconButton
              icon={theme.images.general.arrow_left}
              borderColor={theme?.colors.clear}
              iconStyle={{ width: 20, height: 20, tintColor: '#000000' }}
              style={styles.arrowLeft}
              onClick={() => props?.navigation?.goBack()}

            // onClick={() => {
            //   ondriverdiscloserModal()
            //   ondriverInsuranceModal()
            // }}
            />
            <Text></Text>
          </View>

          <Text style={{ ...styles.title_txt_dsicloser, color: theme?.colors.logintext }}>{t('REVIEW_THE_BACKGROUND', 'Please review the background')}
            {t('CHECK_DISCLOSURES', 'check disclosures')}</Text>

          <TouchableOpacity
            onPress={() => refRBSheetdiscloser.current?.expand()}
            // onPress={() => NavigationService.navigate('BackCheckConsent')}
            style={{ ...styles.box_view_closer, backgroundColor: theme?.colors.loginInputbackground }}>
            <Text style={{ ...styles.backcheck_txt, color: '#EE4140' }}>{t('BACKGROUND_CHECK_CONSENT', 'Background Check Consent')}</Text>

            <AntDesignIcon
              name='checkcircle'
              color={backgroundCheck ? '#EE4140' : '#C1C3C4'}
              size={20}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              refRBSheet.current?.expand()
              // setdriveragreementmodal(!driveragreenmentModal)
              // refRBSheet.current?.expand()
            }}
            style={{
              ...styles.box_view_closer,
              marginTop: moderateScale(10),
              backgroundColor: theme?.colors.loginInputbackground
            }}>
            <Text style={{ ...styles.backcheck_txt, color: '#EE4140' }}>{t('DLVRDRIVE_AGREEMENT', 'DLVRdrive Agreement')}</Text>

            <AntDesignIcon
              name='checkcircle'
              color={dlvrAgreement ? '#EE4140' : '#C1C3C4'}

              size={20}
            />


          </TouchableOpacity>
          <View style={{
            marginTop: 10,
            padding: Platform.OS === 'android' ? 0 : 10
          }}>
            <Text style={[styles.summery_discloder, { fontSize: Platform.OS === 'android' ? 14 : 12, lineHeight: 18 }]}>
              {t('DISCLOSURES_MSG', 'By clicking "Next", I acknowledge that i have read and agree to the Background check Disclosure, Additional Disclosures, and authorise DLVRdrive to order reports about me. I will automatically receive a free copy of my customer report.')}
            </Text>
          </View>

          <View style={{
            bottom: 120,
            position: 'absolute',
            width: '90%',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <OButton
              onClick={() => {
                props?.navigation?.navigate('CustomerBackgroundCheck')
                // ondriverdiscloserModal()
                // onbackgroundCheckModal()
              }}
              // onClick={() => onbackgroundCheckModal()}
              text={t('NEXT', 'Next')}
              bgColor={theme.colors.primary}
              borderColor={theme.colors.primary}
              textStyle={styles.btnText}
              imgRightSrc={null}

              //   isLoading={formState?.loading || loading}
              style={styles.btn}
              isDisabled={(backgroundCheck && dlvrAgreement) ? false : true}

            />
          </View>

          <BottomSheet
            ref={refRBSheetdiscloser}
            // snapPoints={[650, '100%']}
            index={bottomsheetActiveinde} // Default index
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            // onChange={handleSheetChanges}
            enablePanDownToClose={true}
          >
            <BottomSheetScrollView  >

              <View style={styles.modal_top}>
                <Text style={{ ...styles.modaltitle_txt, color: theme?.colors.logintext }}>{t('BACK_GROUND_CHECK_CONSENT', 'Background Check Consent')}</Text>
                <TouchableOpacity
                  onPress={() => { refRBSheetdiscloser.current.close() }}

                >
                  <AntDesignIcon
                    name='close'
                    size={22}
                    color='#000000'
                  />
                </TouchableOpacity>
              </View>


              <Text
                style={{ ...styles.deteils_txt, color: '#EE4140' }}
              >{t('DLVRDRIVE_AGREEMENT_MSG', 'DLVRDRIVE_AGREEMENT_MSG')}</Text>

              <Text
                style={{ ...styles.deteils_txt, color: '#000000' }}
              >
                {t('BACKGROUND_CHECK_CONSENT_MSG2', 'Important: Please review this agreement carefully, specifically the mutual arbitration provision in section 11. Unless you opt out of arbitration as provided below, this agreement requires the parties to resolve disputes through final and binding arbitration on an individual basis to the fullest extent permitted by law. by accepting this agreement, you acknowledge that you have read, understood, and voluntarily agreed to all of the terms of this agreement, including the mutual arbitration provision, and that you have taken time and sought any assistance needed to comprehend and consider the consequences of this important bussines decision.')}
              </Text>

              <View style={{
                // bottom: 30,
                // position: 'absolute',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 10
              }}>
                <OButton
                  onClick={() => {
                    setbackroundCheck(!backgroundCheck)
                    // ondriverdiscloserModal()
                    // onbackgroundCheckModal()
                  }}

                  // onClick={() => ondriverdiscloserModal()}
                  text={t('CONFIRM_AND_CONTINUE', 'Confirm and Continue')}
                  bgColor={theme.colors.primary}
                  borderColor={theme.colors.primary}
                  textStyle={styles.btnText}
                  imgRightSrc={null}
                  //   isLoading={formState?.loading || loading}
                  style={[styles.btn, { borderRadius: 29, width: '100%' }]}
                // parentStyle={{
                //   position: 'absolute',
                //   bottom: 70
                // }}
                // isDisabled={formState?.}

                />
              </View>
              {/* </View> */}
              {/* </View> */}
            </BottomSheetScrollView >
          </BottomSheet>
          <BottomSheet
            ref={refRBSheet}
            // snapPoints={[650, '100%']}
            index={bottomsheetActiveinde} // Default index
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            // onChange={handleSheetChanges}
            enablePanDownToClose={true}
          >
            <BottomSheetScrollView  >
              {/* <View > */}
              {/* <View style={styles.modalContainer}> */}
              <View style={styles.modal_top}>
                <Text style={{ ...styles.modaltitle_txt, color: theme?.colors.logintext }}>{t('DLVRDRIVE_AGREEMENT', 'DLVRdrive Agreement')}</Text>
                <TouchableOpacity
                  onPress={() => { refRBSheet.current.close() }}

                >
                  <AntDesignIcon
                    name='close'
                    size={22}
                    color='#000000'
                  />
                </TouchableOpacity>
              </View>

              <Text style={{ ...styles.headerTitle_txt, color: theme?.colors.logintext }}>{t('DLVRDRIVE_AGREEMENT_EFFECTIVE', 'Effective December 15.2020')}</Text>

              <Text
                style={{ ...styles.deteils_txt, color: '#EE4140' }}
              >{t('DLVRDRIVE_AGREEMENT_MSG', 'DLVRDRIVE_AGREEMENT_MSG')}</Text>

              <Text
                style={{ ...styles.deteils_txt, color: '#000000' }}
              >
                {t('DLVRDRIVE_AGREEMENT_MSG2', 'Important: Please review this agreement carefully, specifically the mutual arbitration provision in section 11. Unless you opt out of arbitration as provided below, this agreement requires the parties to resolve disputes through final and binding arbitration on an individual basis to the fullest extent permitted by law. by accepting this agreement, you acknowledge that you have read, understood, and voluntarily agreed to all of the terms of this agreement, including the mutual arbitration provision, and that you have taken time and sought any assistance needed to comprehend and consider the consequences of this important bussines decision.')}
              </Text>

              <View style={{
                // bottom: 30,
                // position: 'absolute',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 10
              }}>
                <OButton
                  onClick={() => {
                    setdlvragreement(!dlvrAgreement)
                    // ondriverdiscloserModal()
                    // onbackgroundCheckModal()
                  }}

                  // onClick={() => ondriverdiscloserModal()}
                  text={t('CONFIRM_AND_CONTINUE', 'Confirm and Continue')}
                  bgColor={theme.colors.primary}
                  borderColor={theme.colors.primary}
                  textStyle={styles.btnText}
                  imgRightSrc={null}
                  //   isLoading={formState?.loading || loading}
                  style={[styles.btn, { borderRadius: 29, width: '100%' }]}
                // parentStyle={{
                //   position: 'absolute',
                //   bottom: 70
                // }}
                // isDisabled={formState?.}

                />
              </View>
              {/* </View> */}
              {/* </View> */}
            </BottomSheetScrollView >
          </BottomSheet>

        </View>
        {/* </Container> */}
      </GestureHandlerRootView>
    </>
  )
}

export const CustomerDiscloser = (props: any) => {

  const SignupUserDetailsProps = {
    ...props,
    UIComponent: CustomerDiscloserUI
  }
  return (
    <>
      {/* <SafeAreaContainerLayout> */}
      <SignupUserDetailsControler
        {...SignupUserDetailsProps}
      />
      {/* </SafeAreaContainerLayout> */}

    </>
  )
}
