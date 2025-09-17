import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, Platform, StatusBar } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from 'styled-components/native';
import OTPTextInput from "react-native-otp-textinput";
import { Container, FormInput } from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ToastType,
  useToast,
  useLanguage,
} from '@components';
import { ForgotPasswordForm as ForgotPasswordController } from './ForgotPasswordForm';
import { OButton, OInput, OText, OIconButton } from '../shared';
import { normalize, moderateScale } from '../../providers/Responsive';
import { SafeAreaContainerLayout } from '@ui';
import styled from 'styled-components/native';
const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding-top:${Platform.OS === 'android' ? StatusBar?.currentHeight : 0};
`;
const ForgotPasswordUI = (props: any) => {
  const { navigation, formState, handleForgotPasswordMail, forgotStep, verificationCode, setVerificationCode, handleSubmitOtp,
    newPassword,
    setNewPassword,
    handleSavePassword,
    setEmailSent,
    emailSent,
    sendOtp
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();
  const { control, handleSubmit, errors } = useForm();
  const [passwordSee, setPasswordSee] = useState(false);
  const [conPasswordSee, setConPasswordSee] = useState(false);
  const [emailFor, setEmailFor] = useState(null);
  const otpInputRef = useRef(null);
  const inputRef = useRef<any>(null);
  const inputConRef = useRef<any>(null);
  const [conPassword, setConPassword] = useState(null);

  const [reSendCode, setReSendCode] = useState(false);

  const handleChangeOtp = (values: any) => {
    setVerificationCode(values)
  }

  const onSubmit = (values: any) => {
    setEmailSent(values.email);
    handleForgotPasswordMail && handleForgotPasswordMail(values.email);
  };


  const handleChangeInputPassword = (value: any) => {
    setNewPassword(value);
  };
  const handleChangeInputConPassword = (value: any) => {
    setConPassword(value);
  };

  const handleChangePassword = (value: any) => {
    if (newPassword.length < 8) {
      showToast(ToastType.Error, "The Password must be at least 8 characters");
      return;
    }
    if (newPassword !== conPassword) {
      showToast(ToastType.Error, "Please enter correct password!");
      return;
    }
    handleSavePassword && handleSavePassword()
  };
  const [timeLeft, setTimeLeft] = useState(120);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleChangeInputEmail = (value: any, onChange: any) => {
    setEmailFor(value);
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setReSendCode(true)
    }
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [timeLeft]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);
      let stringError = '';
      list.map((item: any, i: number) => {
        stringError +=
          i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: Dimensions.get('window').height,
      backgroundColor: '#FFFFFF'
      // width: Dimensions.get('window').width,
      // alignItems:'center'
      // marginLeft: 30,
      // marginTop: 30,
    },
    header: {
      marginTop: 0,
      marginBottom: 30,
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    headingtext: {
      fontFamily: 'Outfit-Regular',
      fontStyle: 'normal',
      color: theme.colors.logintext,
      fontSize: moderateScale(26),
      fontWeight: '400',
      marginTop: moderateScale(50)
    },
    labletext: {
      fontFamily: 'Outfit-Regular',
      fontStyle: 'normal',
      color: theme.colors.logintext,
      fontSize: moderateScale(14),
      // fontWeight: '400',
      marginTop: 20,
      paddingBottom: moderateScale(4)
    },
    arrowLeft: {
      maxWidth: 40,
      height: 25,
      justifyContent: 'flex-end',
    },
    confirmemiatest: {
      fontFamily: 'Outfit-Regular',
      color: '#979B9D',
      fontSize: 15,
      fontWeight: '400',
      // marginTop: 5,
      // width: '100%'
    },
    inputStyle: {
      marginTop: moderateScale(4),
      // marginHorizontal: 15,
      paddingHorizontal: moderateScale(17),
      // paddingVertical: moderateScale(17),
      borderRadius: moderateScale(12),
      maxHeight: Platform.OS === 'android' ? 60 : 48,
      minHeight: Platform.OS === 'android' ? 60 : 48,
      width: '100%',
      backgroundColor: theme?.colors.loginInputbackground,
      marginBottom: 20
    },
    ButtonText: {
      color: theme.colors.primaryContrast,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 17,
    },
    button: {
      borderRadius: 7.6,
      height: Platform.OS === 'android' ? 60 : 44,
      left: 0,
      width: Platform.OS == 'android' ? '100%' : '100%',
      marginHorizontal: Platform.OS == 'android' ? 0 : 16

    },
    timer: {
      fontSize: 15,
      fontWeight: "400",
      color: "#61BAD3", // Red color,
    },
    inputlable: {
      fontFamily: 'Outfit-Regular',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 15,
      color: theme.colors.logintext,
      marginBottom: 3

    },
    input: {
      color: theme.colors.arrowColor,
      marginBottom: 20,
      borderWidth: 1,
      borderRadius: 12,
      // borderColor: theme.colors.inputSignup,
      backgroundColor: theme.colors.loginInputbackground,
      minHeight: 48,
      maxHeight: 48
    },
    otpContainer: {
      marginBottom: 20,
      justifyContent: 'space-evenly'
      // paddingRight:40

    },
    otpInput: {
      width: 47,
      height: 47,
      borderWidth: 1,
      borderColor: "#E5E7E9",
      textAlign: "center",
      fontSize: 18,
      borderRadius: 12,
      backgroundColor: "#fff",
      borderBottomColor: '#E5E7E9',
      borderLeftColor: '#E5E7E9',
      borderTopColor: '#E5E7E9',
      borderRightColor: '#E5E7E9',
      borderBottomWidth: 1,
      color: '#1B3E70'
      //  border


      // shadowColor:'#FFFFFF',
      // shadowOpacity:0,
      // shadowOffset:0

      // marginHorizontal: 5,
    },
  });

  return (

    <SafeAreaContainer>
      <Container>
      <View style={[styles?.container, { marginTop: Platform.OS == 'ios' ? 40 : 0 }]}>
        <View style={styles.header}>
          <OIconButton
            icon={theme.images.general.arrow_left}
            borderColor={theme.colors.clear}
            iconStyle={{ width: 20, height: 20 }}
            style={styles.arrowLeft}
            onClick={() => navigation?.canGoBack() && navigation.goBack()}
          />

        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            style={{
              width: 250,
              height: 50,
            }}

            source={theme?.images?.logos?.logo}

          />
        </View>
        <OText style={styles.headingtext}>
          {t('FORGOT_PASSWORD', 'Forgot password?')}
        </OText>

        {forgotStep === 1 && (
          <FormInput >
            <OText style={styles.labletext}>
              {t('EMAIL_ADDRESS', 'Email Address')}
            </OText>
            <Controller
              control={control}
              render={({ onChange, value }: any) => (
                <OInput
                  placeholder={t('SAMPLE_GMAIL', 'Sample@mail.com')}
                  placeholderTextColor={theme.colors.arrowColor}
                  style={styles.inputStyle}
                  // icon={theme.images.logos.emailInputIcon}
                  onChange={(e: any) => {
                    handleChangeInputEmail(e, onChange);
                  }}
                  value={value}
                  autoCapitalize="none"
                  autoCorrect={false}
                  type="email-address"
                  selectionColor={theme.colors.primary}
                  color={theme.colors.textGray}
                  autoCompleteType="email"
                  returnKeyType="done"
                />
              )}
              name="email"
              rules={{
                required: t(
                  'VALIDATION_ERROR_EMAIL_REQUIRED',
                  'The field Email is required',
                ).replace('_attribute_', t('EMAIL', 'Email')),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t(
                    'INVALID_ERROR_EMAIL',
                    'Invalid email address',
                  ).replace('_attribute_', t('EMAIL', 'Email')),
                },
              }}
              defaultValue=""
            />
            <OText
              size={16}
              weight="normal"
              style={{ ...styles.confirmemiatest, marginBottom: 30 }}>
              {t(
                'FORGOT_PASSWORD_CONFIMATION_CODE',
                "We'll send an email with a 6 digit confimation code",
              )}
            </OText>


          </FormInput>
        )}
        <View style={{
          bottom: 80,
          position: 'absolute',
          width: Platform.OS == 'android' ? '100%' : '90%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {
            forgotStep === 1 && (
              <OButton
                text={
                  t('NEXT', 'Next')
                }
                parentStyle={{
                  bottom: 100,
                  position: 'absolute',
                  width: '100%'
                }}
                textStyle={styles.ButtonText}
                style={styles.button}
                bgColor={
                  (!emailFor || emailSent && !formState.result?.error)
                    ? theme.colors.disabled
                    : theme.colors.primary
                }
                borderColor={
                  (!emailFor || emailSent && !formState.result?.error)
                    ? theme.colors.disabled
                    : theme.colors.primary
                }
                isLoading={formState.loading}
                onClick={
                  (!emailFor || emailSent && !formState.result?.error)
                    ? () => { }
                    : handleSubmit(onSubmit)
                }
              />
            )
          }
        </View>

        {forgotStep === 2 && (
          <>

            <OText weight="600" style={[styles.confirmemiatest, { marginTop: moderateScale(20), lineHeight: 24 }]}>
              {t('EMAIL_SIX_DIGIT_CODE', 'We have sent an email with a 6 digit confirmation code to the following email')}
            </OText>
            <OText style={{
              color: theme.colors.logintext
            }}> {emailSent}</OText>
            <View style={{
              marginTop: moderateScale(20),
            }}>
              <OTPTextInput

                ref={otpInputRef}
                inputCount={6} // Number of digits in the OTP
                containerStyle={styles.otpContainer} // Container styling
                textInputStyle={styles.otpInput} // Individual box styling
                handleTextChange={(otp) => handleChangeOtp(otp)} // Optional: track OTP changes
                tintColor='#FFFFFF'
              />
            </View>
            <View style={{
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center'
            }}>
              <OText size={26} weight="600" style={styles.confirmemiatest}>
                {t('NOT_RECEIVE_CODE', 'I didn’t receive a code ?')}
              </OText>
              {!reSendCode && (
                <OText style={styles.timer}> {t('RETRY_AFTER', 'Retry after')} {formatTime(timeLeft)} </OText>
              )}
              {reSendCode && (
                <TouchableOpacity

                  onPress={() => handleForgotPasswordMail()}>
                  <OText style={styles.timer}>{t('RESEND_CODE', 'Resend a Code')}</OText>
                </TouchableOpacity>
              )}
            </View>



          </>
        )}
        <View style={{
          bottom: 80,
          position: 'absolute',
          width: Platform.OS == 'android' ? '100%' : '90%',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {
            forgotStep === 2 && (
              <OButton
                text={
                  t('CONFIRM', 'Confirm')
                }
                textStyle={styles.ButtonText}
                style={styles.button}
                parentStyle={{
                  bottom: 100,
                  position: 'absolute'
                }}
                bgColor={
                  (!verificationCode || sendOtp !== verificationCode)
                    ? theme.colors.disabled
                    : theme.colors.primary
                }
                borderColor={
                  (!verificationCode || sendOtp !== verificationCode)
                    ? theme.colors.disabled
                    : theme.colors.primary
                }
                isLoading={formState.loading}
                onClick={
                  (!verificationCode || sendOtp !== verificationCode)
                    ? () => { }
                    : handleSubmitOtp
                }
              />
            )
          }
        </View>

        {forgotStep === 3 && (
          <>
            <Controller
              control={control}
              render={({ onChange, value }: any) => (
                <>
                  <View>
                    <OText style={styles.inputlable}>{t('NEW_PASSWORD', 'New Password')}</OText>
                  </View>
                  <OInput
                    isSecured={!passwordSee ? true : false}
                    placeholder={t('NEW_PASSWORD', 'New Password')}
                    placeholderTextColor={theme.colors.arrowColor}
                    style={styles.input}
                    // icon={theme.images.logos.passwordInputIcon}
                    iconColor={theme.colors.arrowColor}
                    iconCustomRight={
                      !passwordSee ? (
                        <MaterialCommunityIcons
                          name="eye-outline"
                          size={24}
                          color={theme.colors.arrowColor}
                          onPress={() => setPasswordSee(!passwordSee)}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="eye-off-outline"
                          size={24}
                          color={theme.colors.arrowColor}
                          onPress={() => setPasswordSee(!passwordSee)}
                        />
                      )
                    }
                    selectionColor={theme.colors.primary}
                    color={theme.colors.textGray}
                    value={value}
                    forwardRef={inputRef}
                    onChange={(val: any) => {
                      handleChangeInputPassword(val);
                    }}
                    returnKeyType="done"
                  />
                </>

              )}
              name="password"
              rules={{
                required: t(
                  'VALIDATION_ERROR_PASSWORD_REQUIRED',
                  'The field Password is required',
                ).replace('_attribute_', t('PASSWORD', 'Password')),
              }}
              defaultValue=""
            />

            <Controller
              control={control}
              render={({ onChange, value }: any) => (
                <>
                  <View>
                    <OText style={styles.inputlable}>{t('CONFIRM_PASSWORD', 'Confirm Password')}</OText>
                  </View>
                  <OInput
                    isSecured={!conPasswordSee ? true : false}
                    placeholder={t('CONFIRM_PASSWORD', 'Confirm Password')}
                    placeholderTextColor={theme.colors.arrowColor}
                    style={styles.input}
                    // icon={theme.images.logos.passwordInputIcon}
                    iconColor={theme.colors.arrowColor}
                    iconCustomRight={
                      !conPasswordSee ? (
                        <MaterialCommunityIcons
                          name="eye-outline"
                          size={24}
                          color={theme.colors.arrowColor}
                          onPress={() => setConPasswordSee(!conPasswordSee)}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="eye-off-outline"
                          size={24}
                          color={theme.colors.arrowColor}
                          onPress={() => setConPasswordSee(!conPasswordSee)}
                        />
                      )
                    }
                    selectionColor={theme.colors.primary}
                    color={theme.colors.textGray}
                    value={value}
                    forwardRef={inputConRef}
                    onChange={(val: any) => {
                      handleChangeInputConPassword(val);
                    }}
                    returnKeyType="done"
                  />
                </>

              )}
              name="conpassword"
              rules={{
                required: t(
                  'VALIDATION_ERROR_PASSWORD_REQUIRED',
                  'The field Password is required',
                ).replace('_attribute_', t('PASSWORD', 'Password')),
              }}
              defaultValue=""
            />



          </>
        )}
        <View style={{
          bottom: 80,
          position: 'absolute',
          width: Platform.OS == 'android' ? '100%' : '90%',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {
            forgotStep === 3 && (
              <OButton
                text={
                  t('SET', 'Set')
                }
                textStyle={styles.ButtonText}
                style={styles.button}
                parentStyle={{
                  bottom: 100,
                  position: 'absolute'
                }}
                bgColor={
                  (!newPassword && !conPassword)
                    ? theme.colors.disabled
                    : theme.colors.primary
                }
                borderColor={
                  (!newPassword && !conPassword)
                    ? theme.colors.disabled
                    : theme.colors.primary
                }
                isLoading={formState.loading}
                onClick={
                  (!newPassword && !conPassword)
                    ? () => { }
                    : handleChangePassword
                }
              />
            )
          }
        </View>
      </View>
      </Container>
    </SafeAreaContainer>
  );
};

export const ForgotPasswordForm = (props: any) => {
  const ForgotPasswordProps = {
    ...props,
    UIComponent: ForgotPasswordUI,
  };
  return <ForgotPasswordController {...ForgotPasswordProps} />;
};
