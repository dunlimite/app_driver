import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar, Image, TextInput, Dimensions, TouchableOpacity, ScrollView, Pressable, Modal, ImageBackground, Platform } from 'react-native';
import {
  OIconButton, OButton, ODropDown, Container,
  Loader,
  SafeAreaContainerLayout
} from '@ui'
import { useLanguage } from "@components"
import styled from 'styled-components/native';
import SelectDropdown from 'react-native-select-dropdown'
const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;
import { useTheme } from 'styled-components/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import { moderateScale, normalize } from "../../providers/Responsive";
import { SignupUserDetails as SignupUserDetailsControler } from './signupuserDetailsControler'

import DatePicker from 'react-native-date-picker';
import moment from "moment";
// import { navigate } from "@";
export const DriverInsuranceDetailsUI = (props: any) => {
  const {
    stateDetails
  } = props
  const [, t] = useLanguage();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  let { ondriverInsuranceModal, ondriverlisenceModal, ondriverdiscloserModal, onbackgroundCheckModal, formstate, driverinsuranceImgeUplaod, driverinsurance } = props
  const theme = useTheme();

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
      marginTop: 5
      // paddingHorizontal: 10
      // marginBottom: normalize(25),
    },
    container: {
      flex: 1,
      height: Dimensions.get('window').height,
      // width: Dimensions.get('window').width,
      backgroundColor: '#FFFFFF'
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
      margin: 0,
      paddingBottom: moderateScale(4)
    },
    input_sty: {
      marginTop: normalize(4),
      // marginHorizontal: normalize(15),
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
      height: Platform.OS === 'android' ? 60 : 44,
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


  return (
    <>
      {/* <KeyboardView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
    <SafeAreaContainerLayout> */}
      <ScrollView>
        <Modal
          visible={props?.submitloading}
          transparent={true}
        >
          <Loader />
        </Modal>

        <View style={[styles?.container,
          // { marginTop: Platform.OS == 'ios' ? 40 : 0 }

        ]}>
          <View style={[styles.header, {
            // marginTop: Platform.OS == 'ios' ? 20 : 0
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

          <Text style={{ ...styles.title_txt, color: theme?.colors.logintext, paddingTop: moderateScale(0) }}>{t('ADD_INSURANCE_INFORMATION', 'Add your insurance information')}</Text>

          <Text style={{ ...styles.inputTitle_txt, color: theme?.colors.logintext }}>{t('POLICY_NUMBER', 'Policy Number')}</Text>
          <TextInput
            placeholder={t('ENTER_NUMBER', 'Enter number')}
            style={{ ...styles.input_sty, backgroundColor: theme?.colors.loginInputbackground }}

            value={formstate?.driverinsurance?.insuranceNumber}

            onChangeText={(t) => driverinsurance('lisence_number', t)}
          />

          <Text style={{ ...styles.inputTitle_txt, color: theme?.colors.logintext }}>{t('COMPANY_NAME', 'Company Name')}</Text>
          <TextInput
            placeholder={t('COMPANY_NAME', 'Company Name')}
            style={{ ...styles.input_sty, backgroundColor: theme?.colors.loginInputbackground }}

            value={formstate?.driverinsurance?.companyName}

            onChangeText={(t) => driverinsurance('company_name', t)}
          />

          <View style={styles.main_view}>
            <View>
              <Text style={{ ...styles.halfinputTitle_txt, color: theme?.colors.logintext }}>{t('STATE', 'State')}</Text>
              {/* <TextInput
                  value={formstate?.driverinsurance?.state}
                  onChangeText={(t) => driverinsurance('state', t)}
                  //  onChangeText={(t) => handlechangeInput('city', t)}
                  placeholder='Enter State'
                  style={{ ...props?.styles.halfinput_sty, backgroundColor: props?.theme?.colors.loginInputbackground }}

                /> */}
              <SelectDropdown
                data={stateDetails}
                onSelect={(selectedItem: any) => {
                  driverinsurance('state', selectedItem.value)
                  console.log("Selected State:", selectedItem.value);
                }}
                defaultButtonText={t('SELECT_A_STATE', 'Select a State')}
                buttonTextAfterSelection={(selectedItem: any) => selectedItem.label} // Show label after selection
                rowTextForSelection={(item: any) => item.label} // Show label in dropdown
                buttonStyle={{
                  maxHeight: 48,
                  minHeight: 48,
                  backgroundColor: theme?.colors.loginInputbackground,
                  // padding: 20,
                  borderRadius: 20,
                  width: moderateScale(130),
                  marginTop: moderateScale(4)
                }}

                buttonTextStyle={{
                  textAlign: "left",
                  fontSize: 16,
                  //  color: '#979B9D',
                  fontFamily: 'Outfit-Regular',
                  color: theme?.colors?.logintext

                }}
                dropdownStyle={{
                  borderRadius: 5,
                }}
                renderDropdownIcon={() => {
                  return (
                    <>
                      <FeatherIcon
                        size={20}
                        color='#979B9D'
                        name='chevron-down'
                      />
                    </>
                  )
                }}
              />
            </View>
            <View >
              <Text style={{ ...styles.halfinputTitle_txt, color: theme?.colors.logintext }}>{t('EXP_DATE', 'Exp Date')}</Text>
              <TouchableOpacity style={{
                maxHeight: 48,
                minHeight: 48,
                backgroundColor: theme?.colors.loginInputbackground,
                // padding: 20,
                borderRadius: 27,
                width: moderateScale(130),
                marginTop: moderateScale(4),

                // backgroundColor: props?.theme?.colors.loginInputbackground,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
              }} onPress={() => setOpen(true)}>
                <TextInput
                  value={moment(date).format('MM/DD/YYYY')}
                  onChangeText={(t) => setOpen(true)}
                  placeholder={t('EXP_DATE', 'Exp Date')}
                  style={{
                    backgroundColor: theme?.colors.loginInputbackground, width: '80%', color: theme?.colors?.logintext


                  }}

                />
                <FeatherIcon
                  name="chevron-down"
                  color='#979B9D'
                  size={20}
                />
              </TouchableOpacity>

              <DatePicker
                modal
                open={open}
                date={date}
                mode="date"
                onConfirm={(selectedDate) => {
                  setOpen(false);
                  setDate(selectedDate);
                  driverinsurance('date', selectedDate)
                }}
                onCancel={() => setOpen(false)}
              />

              {/* <ODropDown
                          style={{ ...styles.halfinput_sty, backgroundColor: theme?.colors.loginInputbackground }}
                          isModal
                          bgcolor={theme.colors.inputDisabled}
                          textcolor={theme.colors.unselectText}
                          placeholder={t('SELECT_CITY', 'Select City')}
                          dropViewMaxHeight={200}

                          selectType='city'
                        /> */}


            </View>

          </View>
          <Text style={{ ...styles.inputTitle_txt, color: theme?.colors.logintext }}>{t('SUBMIT_PICTURE', 'Submit a Picture')}</Text>
          <TouchableOpacity
            onPress={() => driverinsuranceImgeUplaod()}
            style={{ ...styles.photoinput_sty, backgroundColor: theme?.colors.loginInputbackground }}>

            <ImageBackground
              source={{ uri: formstate?.driverinsurance?.image }}
              style={styles.photoinput_sty}
            >
              <Text style={{ ...styles.take_pic_txt, color: '#979B9D' }}>{t('TAKE_PICTURE', 'Take a Picture')}</Text>

            </ImageBackground>
          </TouchableOpacity>

          <View style={{
            bottom: 120,
            position: 'absolute',
            width:  Platform.OS == 'android' ? '93%' : '90%',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <OButton
              onClick={() => {
                // ondriverdiscloserModal();
                // ondriverInsuranceModal();

                props?.navigation?.navigate('CustomerDiscloser')
              }}
              text={t('NEXT', 'Next')}
              bgColor={theme.colors.primary}
              borderColor={theme.colors.primary}
              textStyle={styles.btnText}
              imgRightSrc={null}
              //   isLoading={formState?.loading || loading}
              style={styles.btn}
              isDisabled={
                formstate?.driverinsurance?.insuranceNumber != '' &&
                  formstate?.driverinsurance?.state != ''
                  ? false : true
              }

            />
          </View>
        </View>
      </ScrollView>
    </>
  )
}

export const CustomerInsurance = (props: any) => {

  const SignupUserDetailsProps = {
    ...props,
    UIComponent: DriverInsuranceDetailsUI
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
