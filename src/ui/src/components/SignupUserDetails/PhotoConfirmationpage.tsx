import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, Image, TextInput, Dimensions, TouchableOpacity, ScrollView, Pressable, Modal, ImageBackground, Platform } from 'react-native';
import {
  OIconButton, OButton, ODropDown, Container,
  Loader,
  SafeAreaContainerLayout
} from '@ui'
import { useLanguage } from "@components"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

import { SignupUserDetails as SignupUserDetailsControler } from './signupuserDetailsControler'
import { useTheme } from 'styled-components/native';



import { normalize, moderateScale } from "../../providers/Responsive";
import FeatherIcon from 'react-native-vector-icons/Feather';

const PhotoConfimationPageUI = (props: any) => {
  const [, t] = useLanguage();
  let { oncheckingProgressModal, usersprofileImageUplaod, formstate, handlesubmitsignup, submitImcomplete } = props

  const theme = useTheme();

  const styles = StyleSheet.create({
    header: {
      // marginBottom: normalize(10),
      justifyContent: 'space-between',
      paddingTop: 10
      // marginTop:40
    },
    arrowLeft: {
      maxWidth: normalize(40),
      height: normalize(25),
      justifyContent: 'flex-end',
      paddingHorizontal: 10
      // marginBottom: normalize(25),
    },
    container: {
      flex: 1,
      height: Dimensions.get('window').height,
      backgroundColor: '#FFFFFF'
      // width: Dimensions.get('window').width,
      // alignItems:'center'
      // marginLeft: 30,
      // marginTop: 30
    },
    title_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(22),
      marginHorizontal: normalize(15),
      // fontWeight: '400',
      // textAlign:'left'
      // marginTop: normalize(40)
    },
    title_txt_dsicloser: {
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(22),
      marginHorizontal: normalize(15),
      // marginTop: normalize(40)
    },
    messege_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(15),
      fontWeight: '400'

    },
    box_view: {
      marginTop: normalize(14),
      marginHorizontal: normalize(15),
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
      marginHorizontal: normalize(15),
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
      marginHorizontal: normalize(15),
      marginTop: normalize(20),
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(13),
      gap: moderateScale(8),
      paddingBottom: moderateScale(4)
    },
    input_sty: {
      marginTop: normalize(4),
      marginHorizontal: normalize(15),
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
      marginHorizontal: normalize(15),
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
      height:  Platform.OS === 'android' ?  60 : 44,
      left: 0,
     width: Platform.OS == 'android' ? '93%' : '100%',
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
      marginHorizontal: normalize(15),
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
      marginHorizontal: normalize(15),
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
      marginHorizontal: normalize(15),
      fontFamily: 'Outfit-Regular'
    },
    card_view: {
      marginHorizontal: normalize(15),
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

  useEffect(() => {
    if (props?.submitform) {


    }
  }, [props?.submitform])

  useEffect(() => {
    if (submitImcomplete) {
      props?.navigation.navigate('checkProgress')

    }
  }, [submitImcomplete])
  return (
    <>
      <View style={[styles?.container, { marginTop: Platform.OS == 'ios' ? 20 : 0 }]}>

        {
          !submitImcomplete && (
            <Modal
              visible={props?.submitloading}
              transparent={true}
            >
              <Loader />
            </Modal>
          )
        }
        <View style={[styles.header, { marginTop: Platform.OS == 'ios' ? 20 : 0 }]}>
          <OIconButton
            icon={theme.images.general.arrow_left}
            borderColor={theme?.colors.clear}
            iconStyle={{ width: 20, height: 20, tintColor: '#000000' }}
            style={styles.arrowLeft}
            onClick={() => props?.navigation?.goBack()}

          />
          <Text></Text>
        </View>
        <Text style={{ ...styles.title_txt, color: theme?.colors.logintext, textAlign: 'center' }}>{t('TAKE_PROFILE_PHOTO', 'Take a profile photo')}</Text>

        {
          formstate?.userprofileimage ? (
            <View>

              <Image
                source={{ uri: formstate?.userprofileimage }}
                style={{
                  height: normalize(150),
                  width: normalize(150),
                  borderRadius: normalize(100),
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: normalize(20),

                }}
                resizeMode='cover'
              >

              </Image>
            </View>
          )
            :
            (
              <View style={{ ...styles.user_circle, backgroundColor: '#EE4140' }}>
                <FontAwesome5Icon
                  name='user'
                  color='#FFFFFF'
                  size={50}
                />
                {/* <Icon name={'user'} type={'FontAwesome'} color={'#fff'} size={50} /> */}
              </View>
            )

        }
        <TouchableOpacity
          onPress={() => usersprofileImageUplaod()}
        >
          <Text style={{ ...styles.retake_txt, color: '#EE4140' }}>{t('RETAKE_PHOTO', 'Retake a Photo')}</Text>
        </TouchableOpacity>


        <View style={{ ...styles.line, borderColor: '#F4F5F6' }} />

        <Text style={{ ...styles.titlesub_txt, color: theme?.colors.logintext, lineHeight: 22, fontSize: 17 }}>{t('COMPLY_THESE_CONDITIONS', 'Please comply with these conditions')}</Text>

        <View style={styles.main_view}>
          <View style={styles.aling_view}>
            <Image source={require('../../../../assets/images/sunglass.png')} style={styles.img_icon} />
            <Text style={{ ...styles.condition_txt, color: theme?.colors.logintext }}>{t('SUNGLASS_HAT_MASK', 'No Sunglasses, Hat and Mask')}</Text>
          </View>
          <View style={styles.aling_view}>
            <Image source={require('../../../../assets/images/face.png')} style={styles.img_icon} />
            <Text style={{ ...styles.condition_txt, color: theme?.colors.logintext }}>{t('SHOW_FACE_SHOULDERS', 'Show Face and Shoulders')}</Text>
          </View>
          <View style={styles.aling_view}>
            <Image source={require('../../../../assets/images/sun.png')} style={styles.img_icon} />
            <Text style={{ ...styles.condition_txt, color: theme?.colors.logintext }}>{t('WELL_LIT_PLACE', 'In a Well-lit Place')}</Text>
          </View>

        </View>

        <View style={{
          bottom: 80,
          position: 'absolute',
          width: Platform.OS == 'android' ? '100%' : '90%',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {
            formstate?.userprofileimage ?
              (
                <OButton
                  onClick={() => {

                    handlesubmitsignup()

                  }}
                  text={t('SEND_VERIFICATION', 'Send For Verivication')}
                  bgColor={theme.colors.primary}
                  borderColor={theme.colors.primary}
                  textStyle={styles.btnText}
                  imgRightSrc={null}
                  isLoading={props?.submitloading}
                  style={styles.btn}
                  parentStyle={{
                    bottom: 100,
                    position: 'absolute'
                  }}
                />
              )
              :
              (
                <OButton
                  onClick={() => usersprofileImageUplaod()}
                  text={t('TAKE_PHOTO', 'Take a Photo')}
                  bgColor={theme.colors.primary}
                  borderColor={theme.colors.primary}
                  textStyle={styles.btnText}
                  imgRightSrc={null}
                  //   isLoading={formState?.loading || loading}
                  style={styles.btn}
                // parentStyle={{

                // }}
                // isDisabled={formState?.}

                />
              )
          }



        </View>
      </View>
    </>
  )
}

export const CustomerprofileConfirm = (props: any) => {

  const SignupUserDetailsProps = {
    ...props,
    UIComponent: PhotoConfimationPageUI
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
