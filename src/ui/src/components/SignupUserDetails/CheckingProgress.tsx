import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar, Image, TextInput, Dimensions, TouchableOpacity, ScrollView, Pressable, Modal, Platform } from 'react-native';
import {
  OIconButton, OButton, ODropDown,
  SafeAreaContainerLayout
} from '@ui'
import { useTheme } from 'styled-components/native';

import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useLanguage } from "@components"
import { FontAwesome5IconButton } from "react-native-vector-icons/FontAwesome5";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
// import { navigate } from '../../../../navigators/NavigationRef';
import * as Progress from 'react-native-progress';
import { formatSeconds } from '../../utils/index';
import { useNavigation } from "@react-navigation/native";
import { moderateScale, normalize } from "../../providers/Responsive";
import { SignupUserDetails as SignupUserDetailsControler } from './signupuserDetailsControler'

const theme = useTheme();

 const CXheckingProgressUI = (props: any) => {
  const [, t] = useLanguage();

  const [sucessfull, setsucessfull] = useState(true)

  let { navigation } = props
  const [progress, setProgress] = useState(0);
  let navigationD = useNavigation()
  // Simulate progress update
  useEffect(() => {
    if (progress >= 1) {
      setsucessfull(false)
      return;

    }// Stop when progress reaches 100%

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1; // Ensure it doesn't go over 100%
        }
        return prev + 0.1; // Increase progress by 10%
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [progress]);
const styles = StyleSheet.create({
     header: {
       // marginBottom: normalize(10),
       justifyContent: 'space-between',
      //  paddingTop: 10
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
       backgroundColor:'#FFFFFF'
       // alignItems:'center'
       // marginLeft: 30,
       // marginTop: 30
     },
     title_txt: {
       fontFamily: 'Outfit-Regular',
       fontSize: normalize(22),
       paddingTop:10
       // marginHorizontal: normalize(15),
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
       margin:0,
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
  return (
    <>
    <SafeAreaContainerLayout>
      <View style={[styles?.container, { marginTop: Platform.OS == 'ios' ? 80 : 0 }]}>
        {/* <View style={[styles.header,{ marginTop: Platform.OS == 'ios' ? 20 : 0 }]}>
          <OIconButton
            icon={theme.images.general.arrow_left}
            borderColor={theme?.colors.clear}
            iconStyle={{ width: 20, height: 20, tintColor: '#1B3E70' }}
            style={styles.arrowLeft}
            onClick={() => onhneaddressmodal()}
          />
          <Text></Text>
        </View> */}
        <Text style={{ ...styles.title_txt, color: theme?.colors.logintext, textAlign: 'center' }}>{t('CHECKING_YOUR_BACKGROUND', 'Checking Your Background')}</Text>

        {
          props?.submitImcomplete ? (
            <>
              {
                progress >= 1 ?
                  <Text style={{ ...styles.titlesub_txt, color: '#7D8793' }}>Hmm... Something went wrong.</Text>
                  :
                  null
              }
            </>
          )
            :
            (
              <>
                {
                  progress >= 1 ?
                    <Text style={{ ...styles.titlesub_txt, color: '#7D8793' }}>{t('SUCCESS_NOW_GET_STARTED', 'Success. You may now get started!')}</Text>
                    :
                    null

                }
              </>
            )
        }





        <View style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 70,
          marginBottom: 10,
          display: 'flex'
        }}>
          <Progress.Circle
            size={200}
            progress={progress}
            showsText={true}
            formatText={() => {
              return (
                <View>

                  <Text style={{
                    fontSize: 35,
                    color: '#EE4140',
                    fontWeight: '400',
                    fontFamily: 'Outfit', textAlign: 'center'
                  }}>{Math.min(100, Math.round(progress * 100))} %</Text>


                  {
                    props?.submitImcomplete ?
                      (
                        <>
                          {


                            progress >= 1 ?
                              <Text style={{
                                fontSize: 17,
                                color: '#E15B5D',
                                fontWeight: '400',
                                fontFamily: 'Outfit', textAlign: 'center'
                              }}>

                                Review is failed.

                              </Text>

                              :
                              null
                          }
                        </>
                      )
                      :
                      (
                        <>
                          {


                            progress >= 1 ?
                              <Text style={{
                                fontSize: 17,
                                color: '#1B3E70',
                                fontWeight: '400',
                                fontFamily: 'Outfit', textAlign: 'center'
                              }}>

                                {t('REVIEW_IS', 'Review is')} {'\n'} {t('SUCCESSFUL', 'successful')}!

                              </Text>
                              :
                              null
                          }
                        </>
                      )

                  }
                </View>
              )
            }}
            thickness={8}
            color="#EE4140"
          // fill="#F4F5F6"
          // thickness	={}
          />
        </View>
        {/* <TouchableOpacity style={{ ...props?.styles.card_view }}>
          <View style={{ ...props?.styles.icon_view, backgroundColor: props?.theme?.colors.loginInputbackground }}>
            <FontAwesome5Icon
              name='car'
              size={10}
              color="#979B9D"
            />
          </View>
          <View style={{ ...props?.styles.inner_card }}>
            <Text style={{ color: props?.theme?.colors.logintext, fontSize: 14 }}>Add your vehicle information</Text>
            <AntDesignIcon
              name='right'
              color='#979B9D'
              size={20}
            />
          </View>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          style={{ ...props?.styles.card_view }}>
          <View style={{ ...props?.styles.icon_view, backgroundColor: props?.theme?.colors.loginInputbackground }}>


          </View>
          <View style={{ ...props?.styles.inner_card }}>
            <Text style={{ color: props?.theme?.colors.logintext, fontSize: 13 }}>Learn how to Make Money Quicker</Text>
            <AntDesignIcon
              name='right'
              color='#979B9D'
              size={20}
            />
          </View>
        </TouchableOpacity> */}

        <View style={{
          bottom: 80,
          position: 'absolute',
         width: Platform.OS == 'android' ? '100%' : '90%',
          alignItems: 'center',
          justifyContent: 'center'
        }}>


          <OButton
            onClick={() => {
              // console.log('clikifhjid')
              // props?.oncheckProfileModal()
              // props?.onaddressModalClose()
              // props?.oncheckingProgressModal()
              // navigation?.navigate('Login')
              // console.log(navigation?.navigate('Login'), 'navifghsdjfhsdj')
              // props?.gotologin()
              // navigation?.navigate('Login')
              navigation.replace('Login')
              // navigation.reset({
              //   index: 0,
              //   routes: [{ name: 'Login' }],
              // });
            }}
            text={props?.submitImcomplete ? 'Restart' : t('GET_STARTED', 'Get Started')}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
            textStyle={styles.btnText}
            imgRightSrc={null}
            //   isLoading={formState?.loading || loading}
            style={styles.btn}
            // parentStyle={{

            // }}
            isDisabled={sucessfull}

          />
        </View>

      </View>
      </SafeAreaContainerLayout>
    </>
  )
}

export const  CheckProgreess = (props:any) =>{

  let checkProgress ={

        ...props,
        UIComponent: CXheckingProgressUI

  }

  return (
    <>
    {/* <SafeAreaContainerLayout> */}
    <SignupUserDetailsControler
    {...checkProgress}
    />
    {/* </SafeAreaContainerLayout> */}
    </>
  )
}
