import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, StatusBar, Image, TextInput, Dimensions, TouchableOpacity, ScrollView, Pressable, Modal, Platform } from 'react-native';
import {
  OIconButton, OButton, ODropDown,
  SafeAreaContainerLayout
} from '@ui'
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useLanguage } from "@components"
import DatePicker from 'react-native-date-picker';
import moment, { months } from "moment";
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;
import { moderateScale, normalize } from "../../providers/Responsive";

import FeatherIcon from 'react-native-vector-icons/Feather';
import { SignupUserDetails as SignupUserDetailsControler } from './signupuserDetailsControler'
import { useTheme } from 'styled-components/native';

export const BackgroundCheckUI = (props: any) => {
  const theme = useTheme();

  const [confirmModal, setConfirmModal] = useState(false)
  const [, t] = useLanguage();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  let { oncheckingProgressModal, oncheckProfileModal, backgroundChecks, formstate } = props
  const refRBSheet = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['1%', '50%', '100%'], []);

  // Handle sheet changes
  const handleSheetChanges = useCallback((index) => {
    console.log('BottomSheet Index:', index);

  }, [])

  const [dateDetails, setdateDetails] = useState({
    month: '',
    day: '',
    year: ''
  })

  const styles = StyleSheet.create({
    header: {
      // marginBottom: normalize(10),
      justifyContent: 'space-between',
      paddingTop: 10,      // marginTop:40
    },
    arrowLeft: {
      maxWidth: normalize(40),
      height: normalize(25),
      justifyContent: Platform.OS == 'android' ? 'flex-start' : 'flex-end',
      paddingHorizontal: Platform.OS == 'android' ? 0 : 10,
      paddingLeft:10
      // marginBottom: normalize(25),
    },
    container: {
      flex: 1,
      height: Dimensions.get('window').height,
      backgroundColor: '#FFFFFF'
      // width: Dimensions.get('window').width,
      // alignItems:'center'
      // marginLeft: 30,
      // marginTop: 30,
    },
    title_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(22),
      marginHorizontal: Platform.OS == 'android' ? 0 : normalize(15),
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
      marginHorizontal: Platform.OS == 'android' ? 0 : normalize(15),
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
      marginHorizontal: Platform.OS == 'android' ? 0 : normalize(15),
      marginTop: normalize(20),
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(13),
      gap: moderateScale(8),
      paddingBottom: moderateScale(4)
    },
    input_sty: {
      marginTop: normalize(4),
      marginHorizontal: Platform.OS == 'android' ? 0 : normalize(15),
      paddingHorizontal: normalize(10),
      // paddingVertical:moderateScale(17),
      borderRadius: normalize(12),
      maxHeight: Platform.OS === 'android' ? 60 : 48,
      minHeight: Platform.OS === 'android' ? 60 : 48,
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
      marginHorizontal: Platform.OS == 'android' ? 0 : normalize(15),
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
      height: Platform.OS === 'android' ? 60 : 44,
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
    console.log(moment(date).format('DD/MM/YYYY'), 'date fdeofkoekf')
  }, [date])


  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>

        <KeyboardView
          enabled
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView>
            {/* <SafeAreaContainerLayout> */}

            <View style={[styles?.container, { marginTop: Platform.OS == 'ios' ? 40 : 0 }]}>
              <View style={[styles.header, {
                //  marginTop: Platform.OS == 'ios' ? 20 : 0
              }]}>
                <OIconButton
                  icon={theme.images.general.arrow_left}
                  borderColor={theme?.colors.clear}
                  iconStyle={{ width: 20, height: 20, tintColor: '#000000' }}
                  style={styles.arrowLeft}
                  onClick={() => props?.navigation?.goBack()}

                />
                <Text></Text>
              </View>

              <Text
                allowFontScaling={false}
                style={{ ...styles.title_txt, color: theme?.colors.logintext, fontSize: 23 }}>{t('SAFETY_BACKGROUND_CHECK', 'To ensure everyone’s safety, we must perform a background check')}</Text>

              <View style={{ ...styles.box_view }}>
                <AntDesignIcon
                  name='checkcircle'
                  size={14}
                  color='#EE4140'
                />
                {/* <Icon name={'checkcircle'} type="AntDesign" color={colors.buttonColor} size={14} /> */}
                <Text style={{ ...styles.backcheck_txt, color: theme?.colors.logintext, fontSize: 14, lineHeight: 20 }}>{t('SAFETY_EVERYONE_OUR_PLATFORM', 'To ensure the safety of everyone on our platform.')}</Text>
              </View>

              <View style={{ ...styles.box_view, marginTop: 13 }}>
                <AntDesignIcon
                  name='checkcircle'
                  size={14}
                  color='#EE4140'
                />
                {/* <Icon name={'checkcircle'} type="AntDesign" color={colors.buttonColor} size={14} /> */}
                <Text style={{ ...styles.backcheck_txt, color: theme?.colors.logintext, fontSize: 14, lineHeight: 20 }}>{t('PERSONAL_INFORMATION_PROTECTED', 'Your personal information is always protected.')}</Text>
              </View>

              <View style={{ ...styles.box_view, marginTop: 13 }}>
                <AntDesignIcon
                  name='checkcircle'
                  size={14}
                  color='#EE4140'
                />
                {/* <Icon name={'checkcircle'} type="AntDesign" color={colors.buttonColor} size={14} /> */}
                <Text style={{ ...styles.backcheck_txt, color: theme?.colors.logintext, fontSize: 14, lineHeight: 20 }}>{t('CREDIT_SCORE_AFFECTED', 'Your credit score will not be affected.')}</Text>
              </View>


              <Text style={{ ...styles.inputTitle_txt, color: theme?.colors.logintext }}>{t('SOCIAL_SECURITY_NUMBER', 'Social Security Number')}</Text>
              <TextInput
                placeholder={t('ENTER_NUMBER', '111-11-1111')}
                value={formstate?.backgroundCheck?.social_securitynumber}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, '');

                  // Format the text
                  let formatted = '';
                  if (cleaned.length <= 3) {
                    formatted = cleaned;
                  } else if (cleaned.length <= 5) {
                    formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
                  } else if (cleaned.length <= 9) {
                    formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
                  } else {
                    // Limit input to 9 digits
                    formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
                  }
                  backgroundChecks('social_number', formatted)
                }}
                style={{ ...styles.input_sty, backgroundColor: theme?.colors.loginInputbackground, }}

                maxLength={12}
                keyboardType='number-pad'

              />
              <Text
                allowFontScaling={false}
                style={{
                  ...styles.halfinputTitle_txt, color: theme?.colors.logintext, marginHorizontal: Platform.OS == 'android' ? 0 : 20,
                  marginTop: 20
                }}>{t('DATE_OF_BIRTH', 'Date of Birth')}</Text>
              <View style={{ ...styles.main_view, marginTop: 3 }}>

                <DatePicker
                  modal
                  open={open}
                  date={date}
                  mode="date"
                  onConfirm={(selectedDate) => {
                    setOpen(false);
                    setDate(selectedDate);
                    backgroundChecks('date', selectedDate)
                  }}
                  onCancel={() => setOpen(false)}
                />
                <View>
                  {/* <Text style={{ ...props?.styles.halfinputTitle_txt, color: props?.theme?.colors.logintext }}>Zip</Text> */}
                  <TouchableOpacity style={{
                    marginTop: 4,
                    paddingHorizontal: 10,
                    borderRadius: 20,
                    height: 45,
                    width: 130,
                    backgroundColor: theme?.colors.loginInputbackground,
                    justifyContent: 'center',
                    alignItems: 'center', flexDirection: 'row'
                  }}
                    onPress={() => setOpen(true)}
                  >
                    <TextInput
                      value={
                        moment(moment(date).format('DD/MM/YYYY')?.split('/')[1], 'MM').format('MMMM')


                      }
                      onChangeText={(t) => setOpen(true)}
                      placeholder={t('MONTH', 'Month')}
                      style={{ backgroundColor: theme?.colors.loginInputbackground, width: '70%', color: '#979B9D' }}
                      keyboardType='phone-pad'

                    />
                    <FeatherIcon
                      name="chevron-down"
                      color='#979B9D'
                      size={20}
                    />
                  </TouchableOpacity>

                </View>
                <View>
                  {/* <Text style={{ ...props?.styles.halfinputTitle_txt, color: props?.theme?.colors.logintext }}>Zip</Text> */}
                  <TouchableOpacity
                    onPress={() => setOpen(true)}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginTop: 4,
                      paddingHorizontal: 10,
                      borderRadius: 20,
                      height: 45,
                      width: 100,
                      backgroundColor: theme?.colors.loginInputbackground,
                      // width:70
                    }}>
                    <TextInput
                      value={moment(date).format('DD/MM/YYYY')?.split('/')[0]}
                      // value={formstate?.address?.zip}
                      onChangeText={(t) => setOpen(true)}
                      placeholder={t('DATE', 'Date')}
                      style={{
                        backgroundColor: theme?.colors.loginInputbackground, width: '70%', color: '#979B9D'
                      }}
                      keyboardType='phone-pad'

                    />
                    <FeatherIcon
                      name="chevron-down"
                      color='#979B9D'
                      size={20}
                    />
                  </TouchableOpacity>

                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => setOpen(true)}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginTop: 4,
                      paddingHorizontal: 10,
                      borderRadius: 20,
                      height: 45,
                      width: 100,
                      backgroundColor: theme?.colors.loginInputbackground,
                      // width:70
                    }}>
                    {/* <Text style={{ ...props?.styles.halfinputTitle_txt, color: props?.theme?.colors.logintext }}>Zip</Text> */}
                    <TextInput
                      value={moment(date).format('DD/MM/YYYY')?.split('/')[2]}
                      // value={formstate?.address?.zip}
                      onChangeText={(t) => setOpen(true)}
                      placeholder={t('YEAR', 'Year')}
                      style={{ backgroundColor: theme?.colors.loginInputbackground, width: '70%', color: '#979B9D' }}
                      keyboardType='phone-pad'

                    />
                    <FeatherIcon
                      name="chevron-down"
                      color='#979B9D'
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{
                bottom: 80,
                position: 'absolute',
                width: Platform.OS == 'android' ? '100%' : '90%',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <OButton
                  onClick={() => { refRBSheet.current?.expand() }}
                  text={t('CONFIRM', 'Confirm')}
                  bgColor={theme.colors.primary}
                  borderColor={theme.colors.primary}
                  textStyle={styles.btnText}
                  imgRightSrc={null}
                  isDisabled={formstate?.backgroundCheck?.social_securitynumber != '' ? false : true}

                  //   isLoading={formState?.loading || loading}
                  style={styles.btn}
                // parentStyle={{

                // }}
                // isDisabled={formState?.}

                />
              </View>

              <BottomSheet
                ref={refRBSheet}
                index={0} // Default index
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                // onChange={handleSheetChanges}
                enablePanDownToClose={true}

              >
                <BottomSheetView style={{

                  // paddingTop: 20
                }} >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <View></View>
                    <TouchableOpacity style={{ paddingRight: 15, zIndex: 9000 }} onPress={() => refRBSheet.current?.close()}>
                      <AntDesignIcon
                        name='close'
                        size={22}
                      />
                      {/* <Icon name={'close'} type={'AntDesign'} color={props?.theme?.colors.logintext } size={22} /> */}
                    </TouchableOpacity>
                  </View>
                  <View style={{
                    paddingHorizontal: 4
                  }}>
                    <View style={{}}>
                      <Text style={{ ...styles.modaltitle_txt, color: theme?.colors.logintext, textAlign: 'center' }}>{t('CONFIRMATION', 'Confirmation')}</Text>

                    </View>
                    <Text
                      style={{ ...styles.deteils_txt, color: theme?.colors.logintext }}
                    >{t('CONFIRMATION_MSG', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam justo viverra sed velit in faucibus quis enim mauris. A, purus magna dolor ornare leo, morbi. Quis tincidunt pretium, consectetur nisi, sapien risus. Purus magnis pretium egestas dolor. In massa pellentesque elementum massa. Ut arcu eget orci id in leo tincidunt tellus. Dignissim id enim, lorem nibh sed duis maecenas mauris, magna. Amet, donec viverra vitae vulputate molestie placerat feugiat aliquet. In cursus ipsum odio elit arcu. Adipiscing amet sed amet lobortis. Proin sodales integer dui vivamus pharetra eu. Ac tellus feugiat amet non consequat. Imperdiet risus habitasse quisque purus vel mattis nibh.Ultrices consectetur fermentum molestie ut id nisi, rhoncus in. Senectus condimentum dictum.')}</Text>
                  </View>
                  <View style={{
                    padding: 10
                  }}>
                    <OButton
                      onClick={() => {
                        props?.navigation?.navigate('CustomerProfileComfiem')
                      }}
                      text={t('AGREE_AND_CONTINUE', 'Agree and Contiue')}
                      bgColor={theme.colors.primary}
                      borderColor={theme.colors.primary}
                      textStyle={styles.btnText}
                      imgRightSrc={null}
                    //   isLoading={formState?.loading || loading}
                    // style={props?.styles.btn}
                    // parentStyle={{

                    // }}

                    />
                  </View>
                </BottomSheetView>
              </BottomSheet>
            </View>
            {/* </SafeAreaContainerLayout> */}
          </ScrollView>
        </KeyboardView>
      </GestureHandlerRootView>
    </>
  )
}


export const CustomerBackgroundCheck = (props: any) => {

  const SignupUserDetailsProps = {
    ...props,
    UIComponent: BackgroundCheckUI
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

