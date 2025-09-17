import React, { useRef, useState } from "react";
import { useTheme } from 'styled-components/native';
import { View, Text, StyleSheet, StatusBar, Image, TextInput, Dimensions, TouchableOpacity, ScrollView, Pressable, Platform } from 'react-native';
import { moderateScale } from "../../providers/Responsive";
import {
  OIconButton, OButton
} from '@ui'
import { useLanguage } from "@components"

export const OTPVerify = (props: any) => {
  const theme = useTheme();
  const [, t] = useLanguage();

  const styles = StyleSheet.create({
    header: {
      marginBottom: moderateScale(30),
      justifyContent: 'space-between',
      marginTop: 20
    },
    arrowLeft: {
      maxWidth: moderateScale(40),
      height: moderateScale(25),
      justifyContent: 'flex-end',
      marginBottom: moderateScale(25),
      marginLeft: 20
    },
    container: {
      flex: 1,
      height: Dimensions.get('window').height,
      // marginHorizontal: 6

    },
    title_txt: {
      fontFamily: 'Outfit',
      fontSize: moderateScale(30),
      // marginHorizontal: 15,
      marginTop: moderateScale(20),
      fontWeight: '400',
      paddingHorizontal: 6
    },
    messege_txt: {
      fontFamily: 'Outfit',
      fontSize: moderateScale(15),
      marginTop: 7,
      fontWeight: '400',
      paddingHorizontal: 6
    },
    inputContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      width: Dimensions.get('screen').width,
      justifyContent: 'space-between',
      marginTop: moderateScale(25),
      paddingHorizontal: 16
    },
    otp_sty: {
      borderRadius: moderateScale(12),
      width: moderateScale(48),
      height: moderateScale(48),
      fontFamily: 'Outfit',
      fontSize: moderateScale(15),
      borderWidth: moderateScale(2)
    },
    forgetpassword_txt: {
      fontFamily: 'Outfit',
      fontSize: moderateScale(15),
      marginHorizontal: moderateScale(15),
      marginTop: moderateScale(15),
      fontWeight: '400'
    },
    btn: {
      borderRadius: 7.6,
      height: moderateScale(44),
      left: 0,
      width: '100%',
      marginHorizontal: 16


    },
    btnText: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Outfit',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 18,

    },

  })

  const [otp, setOtp] = useState(['', '', '', ''])
  const inputRefs = useRef([])


  const handleOtpChange = (value: any, index: number) => {
    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
    else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <OIconButton
            icon={theme.images.general.arrow_left}
            borderColor={theme.colors.clear}
            iconStyle={{ width: 20, height: 20 }}
            style={styles.arrowLeft}
            onClick={() => props?.onmodalclose()}
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
        <Text style={{ ...styles.title_txt, color: theme?.colors.logintext }}>Please verify your phone number</Text>

        <Text style={{ ...styles.messege_txt, color: '#979B9D' }}>We've sent a verification code to the number :
          <Text style={{ color: theme?.colors.logintext, marginTop: 10 }}>(874)-124-1245</Text></Text>

        <View style={styles.inputContainer}>

          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={{
                ...styles.otp_sty,
                backgroundColor: digit ? '#E5E7E9' : '#E5E7E9',
                color: theme?.colors.logintext,
                borderColor: digit ? 'rgba(238, 65, 64, 0.5)' : '#E5E7E9',
              }}
              value={digit}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={(value) => handleOtpChange(value, index)}
              ref={(ref) => (inputRefs.current[index] = ref)}
              textAlign="center"
            />
          ))}
        </View>

        <Text
          style={{
            ...styles.forgetpassword_txt,
            color: '#979B9D'
          }}>I didn't receive a code? <Text style={{ color: '#61BAD3' }}>Retry after 01:59</Text></Text>


        <View style={{
          bottom: 80,
          position: 'absolute',
          width: '90%',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <OButton
            onClick={() => props?.navigation?.navigate('SignupuserDetails')}
            text={t('VERYFY_OTP', 'Verify OTP')}
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
        </View>

      </View>

    </>
  )
}
