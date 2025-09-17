import React, { useState } from "react";
import { useTheme } from 'styled-components/native';
import { View, Text, StyleSheet, StatusBar, Image, TextInput, Dimensions, TouchableOpacity, ScrollView, Pressable, Modal } from 'react-native';
import {
  OButton, OInput, OModal, OIconButton, OText,
  PhoneInputNumber,
  VerifyPhone
} from '@ui'
import { PhoneNumberVerify as PhoneNumberverifyControler, useLanguage } from "@components"
import { normalize } from "../../providers/Responsive";
import { OTPVerify } from "./OtpVerify";
const PhoneNumberVerifyUI = (props: any) => {
  const { navigation } = props
  const theme = useTheme();
  const [, t] = useLanguage();

  const [otpverifymodal, setotpverifymodal] = useState(false)
  const styles = StyleSheet.create({
    header: {
      marginBottom: normalize(30),
      justifyContent: 'space-between',
      // marginTop:40
    },
    arrowLeft: {
      maxWidth: normalize(40),
      height: normalize(25),
      justifyContent: 'flex-end',
      marginBottom: normalize(25),
    },
    container: {
      flex: 1,
      height: Dimensions.get('window').height,
    },
    title_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: normalize(30),
      // marginHorizontal: 15,
      marginTop: normalize(20),
      fontWeight: '400'
    },
    inputTitle_txt: {
      // marginHorizontal: 15,
      marginTop: 15,
      fontFamily: 'Outfit-Regular',
      fontSize: 15,
      fontWeight: '400'
    },
    input_sty: {
      marginTop: 4,
      // marginHorizontal: 15,
      paddingHorizontal: 7,
      borderRadius: 12,
      height: 45,
      width: '100%'
    },
    messege_txt: {
      fontFamily: 'Outfit',
      fontSize: normalize(15),
      marginTop: 7,
      fontWeight: '400'
    },
    btn: {
      borderRadius: 7.6,
      height: normalize(44),
      left: 0,
      width: '100%'
    },
    btnText: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Outfit',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 18,

    },
  })

  let modalprops = {
    ...props,
    onmodalclose: () => setotpverifymodal(!otpverifymodal)
  }
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <OIconButton
            icon={theme.images.general.arrow_left}
            borderColor={theme.colors.clear}
            iconStyle={{ width: 20, height: 20 }}
            style={styles.arrowLeft}
            onClick={() => navigation?.canGoBack() && navigation?.goBack()}
          />
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              style={{
                width: 250,
                height: 50,
              }}

              source={theme?.images?.logos?.logo}

            />
          </View>
        </View>

        <Text style={{ ...styles.title_txt, color: theme?.colors.logintext }}>What's Your Number?</Text>

        <Text style={{ ...styles.inputTitle_txt, color: theme?.colors.logintext }}>Phone number</Text>
        <TextInput
          placeholder='Enter your Number'
          style={{ ...styles.input_sty, backgroundColor: theme?.colors.loginInputbackground }}
          keyboardType='number-pad'
        // maxLength={10}
        />
        <Text style={{ ...styles.messege_txt, color: '#979B9D' }}>We'll send you a code to verify your phone</Text>

        <OButton
          onClick={() => setotpverifymodal(!otpverifymodal)}
          text={t('SEND_CODE', 'Send a Code')}
          bgColor={theme.colors.primary}
          borderColor={theme.colors.primary}
          textStyle={styles.btnText}
          imgRightSrc={null}
          //   isLoading={formState?.loading || loading}
          style={styles.btn}
          parentStyle={{
            bottom: 100,
            position: 'absolute'
          }}
        // isDisabled={formState?.}

        />

        <Modal
          animationType="slide"
          style={{
            height: '100%',
            flex: 1,
            position: 'absolute',
            zIndex: 9999,

          }}

          visible={otpverifymodal}
        // onClose={() => setIsModalVisible(false)}
        >

          <OTPVerify
            {...modalprops}
          />


        </Modal>
      </View>

    </>
  )
}

export const PhoneNumberVerify = (props: any) => {

  const verifyProps = {
    ...props,
    UIComponent: PhoneNumberVerifyUI
  }

  return (
    <>
      <PhoneNumberverifyControler
        {...verifyProps} />
    </>
  )
}

