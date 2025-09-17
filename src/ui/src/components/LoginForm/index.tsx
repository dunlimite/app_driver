import React, { useEffect, useState, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Keyboard,
  View,
  Dimensions,
  ScrollView,
  Platform,
  NativeModules,
  Alert as AlertReactNative,
  Image, Text
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Recaptcha from 'react-native-recaptcha-that-works'
import ReCaptcha from '@fatnlazycat/react-native-recaptcha-v3'
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components/native';

import {
  LoginWith,
  ButtonsWrapper,
  FormInput,
  TabsContainer,
  OrSeparator,
  LineSeparator,
  RecaptchaButton
} from './styles';

import { LoginParams } from '../../types';
import { _setStoreData } from '../../providers/StoreUtil'
import { Otp } from './Otp'

import {
  ToastType,
  useToast,
  LoginForm as LoginFormController,
  useLanguage,
  useConfig,
  useApi
} from '@components';
import { normalize, moderateScale } from '../../providers/Responsive';

import {
  OText, OButton, OInput, OIconButton, OModal,
  PhoneInputNumber,
  VerifyPhone,
  OAlertOriginal as Alert
} from '@ui'
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginFormUI = (props: LoginParams) => {
  const {
    navigation,
    formState,
    handleButtonLoginClick,
    onNavigationRedirect,
    loginTab,
    useLoginByCellphone,
    useLoginByEmail,
    handleSendVerifyCode,
    verifyPhoneState,
    checkPhoneCodeState,
    handleCheckPhoneCode,
    setCheckPhoneCodeState,
    allowedLevels,
    useRootPoint,
    notificationState,
    handleReCaptcha,
    enableReCaptcha,
    onNavigationSignup,
    useLoginOtp,
    otpType,
    setOtpType,
    generateOtpCode,
    useLoginOtpEmail,
    useLoginOtpCellphone,
    validateDeveloperMode,
  } = props;

  const [ordering, { setOrdering }] = useApi();
  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const theme = useTheme();
  const [{ configs }] = useConfig();
  const { control, handleSubmit, errors, clearErrors, setValue, watch } = useForm();

  const scrollRefTab = useRef() as React.MutableRefObject<ScrollView>;
  const inputRef = useRef<any>(null);
  const inputMailRef = useRef<any>(null);

  const [projectName, setProjectName] = useState({ name: '', isFocued: false });
  const [passwordSee, setPasswordSee] = useState(false);
  const [isLoadingVerifyModal, setIsLoadingVerifyModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null,
    },
  });
  const [windowWidth, setWindowWidth] = useState(
    parseInt(parseFloat(String(Dimensions.get('window').width)).toFixed(0)),
  );
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'Portrait'
      : 'Landscape',
  );

  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const [recaptchaConfig, setRecaptchaConfig] = useState<any>({})
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)

  const recaptchaRef = useRef<any>({});

  const [willVerifyOtpState, setWillVerifyOtpState] = useState(false)
  const [alertState, setAlertState] = useState({ open: false, title: '', content: [] })
  const isOtpEmail = loginTab === 'otp' && otpType === 'email'
  const isOtpCellphone = loginTab === 'otp' && otpType === 'cellphone'

  const [isChecked, setIsChecked] = useState(false);

  const handleOpenRecaptcha = () => {
    setRecaptchaVerified(false)
    if (!recaptchaConfig?.siteKey) {
      showToast(ToastType.Error, t('NO_RECAPTCHA_SITE_KEY', 'The config doesn\'t have recaptcha site key'));
      return
    }
    if (!recaptchaConfig?.baseUrl) {
      showToast(ToastType.Error, t('NO_RECAPTCHA_BASE_URL', 'The config doesn\'t have recaptcha base url'));
      return
    }
    recaptchaRef.current.open()
  }

  const onRecaptchaVerify = (token: any) => {
    setRecaptchaVerified(true)
    handleReCaptcha({ code: token, version: recaptchaConfig?.version })
  }
  // remember functiom
  useEffect(() => {

    const loadCredentials = async () => {
      try {
        const remember = await AsyncStorage.getItem('remember');
        const value = JSON.parse(remember)
        console.log(value, 'remmerne//////////')
        if (value?.rememberMechekc == 'true') {
          setValue('email', value?.email);
          setValue('password', value?.password);
          setIsChecked(true);
        }
      } catch (error) {
        console.error("Failed to load credentials:", error);
      }
    };
    loadCredentials();
  }, [])

  useEffect(() => {
    if (configs && Object.keys(configs).length > 0 && enableReCaptcha) {
      if (configs?.security_recaptcha_type?.value === 'v3' &&
        configs?.security_recaptcha_score_v3?.value > 0 &&
        configs?.security_recaptcha_site_key_v3?.value
      ) {
        setRecaptchaConfig({
          version: 'v3',
          siteKey: configs?.security_recaptcha_site_key_v3?.value || null,
          baseUrl: configs?.security_recaptcha_base_url?.value || null
        })
        return
      }
      if (configs?.security_recaptcha_site_key?.value) {
        setRecaptchaConfig({
          version: 'v2',
          siteKey: configs?.security_recaptcha_site_key?.value || null,
          baseUrl: configs?.security_recaptcha_base_url?.value || null
        })
      }
    }
  }, [configs, enableReCaptcha])

  useEffect(() => {
    const projectInputInterval = setInterval(() => {
      if (projectName.name && useRootPoint && projectName.isFocued) {
        setOrdering({
          ...ordering,
          project: projectName.name
        })
      }
    }, 1500)
    return () => clearInterval(projectInputInterval);
  }, [projectName])

  const handleChangeTab = (val: string) => {
    setPhoneInputData({ ...phoneInputData, error: '' });
    clearErrors([val]);
    props.handleChangeTab(val);

    if (loginTab === 'email') {
      scrollRefTab?.current?.scrollToEnd && scrollRefTab.current?.scrollToEnd({ animated: true });
    }

    if (loginTab === 'cellphone') {
      scrollRefTab?.current?.scrollTo && scrollRefTab.current?.scrollTo({ animated: true });
    }
  };

  const handleChangeInputEmail = (value: string, onChange: any) => {
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
  };

  const handleLogin = async () => {
    if (loading) return;
    await setLoading(true);
    if (isChecked) {

      await AsyncStorage.setItem('remember', JSON.stringify({
        rememberMechekc: 'true',
        email: watch('email'),
        password: watch('password')
      }))

    } else {
      await AsyncStorage.setItem('remember', JSON.stringify({
        rememberMechekc: 'false',
        email: '',
        password: ''
      }))
    }
    await handleSubmit(onSubmit)();


  }
  const mainLogin = (values: any) => {
    if (loginTab === 'otp') {
      if (phoneInputData.error && (loginTab !== 'otp' || (otpType === 'cellphone' && loginTab === 'otp'))) {
        showToast(ToastType.Error, t('INVALID_PHONE_NUMBER', 'Invalid phone number'));
        return
      }
      if (loginTab === 'otp') {
        generateOtpCode({
          ...values,
          ...phoneInputData.phone
        })
      }
      setWillVerifyOtpState(true)
    } else {
      if (phoneInputData.error) {
        showToast(ToastType.Error, phoneInputData.error);
        return;
      }
      handleButtonLoginClick({
        ...values,
        ...phoneInputData.phone,
      });
    }
  }

  const isDeveloperModeEnabled = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      return NativeModules.DeveloperOptions?.isDeveloperModeEnabled?.();
    }
    return false
  }

  const onSubmit = async (values: any) => {
    Keyboard.dismiss();

    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return;
    }

    if (validateDeveloperMode) {
      const isDeveloperMode = await isDeveloperModeEnabled()
      if (isDeveloperMode) {
        AlertReactNative.alert(
          t('DEVELOPER_MODE', 'Developer mode'),
          t('PLEASE_DISABLE_DEVELOPER_MODE', 'Please disable developer mode for sign in'),
          [{
            text: t('GO_TO_SETTINGS', 'Go to settings'),
            onPress: async () => await NativeModules.DeveloperOptions?.openDeveloperSettings(),
          },
          { text: 'OK', onPress: () => { } },]
        )
        return
      }
    }

    if (values?.project_name) {
      setOrdering({
        ...ordering,
        project: values?.project_name
      })
      _setStoreData('project_name', values?.project_name)
      setFormValues({ ...values, ...phoneInputData.phone })
      setSubmitted(true)
      return
    }
    mainLogin(values)
  };

  const handleChangeOtpType = (type: string) => {
    handleChangeTab('otp')
    setOtpType(type)
  }

  const handleLoginOtp = async (code: string) => {
    if (loading) return;
    await setLoading(true)
    await handleButtonLoginClick({ code })
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      title: '',
      content: []
    })
  }

  const handleVerifyCodeClick = () => {
    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return;
    }

    if (
      !phoneInputData.error &&
      !phoneInputData.phone.country_phone_code &&
      !phoneInputData.phone.cellphone
    ) {
      showToast(
        ToastType.Error,
        t(
          'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
          'The field Mobile phone is required.',
        ),
      );
      return;
    }

    handleSendVerifyCode && handleSendVerifyCode(phoneInputData.phone);
    setIsLoadingVerifyModal(true);
  };

  useEffect(() => {
    if (!formState?.loading && formState?.result?.error) {
      if (formState.result?.result?.[0] === 'ERROR_AUTH_VERIFICATION_CODE') {
        setRecaptchaVerified(false)
        setSubmitted(false)
        setRecaptchaConfig({
          version: 'v2',
          siteKey: configs?.security_recaptcha_site_key?.value || null,
          baseUrl: configs?.security_recaptcha_base_url?.value || null
        })
        showToast(ToastType.Info, t('TRY_AGAIN', 'Please try again'))
        return
      }
      formState.result?.result && showToast(
        ToastType.Error,
        typeof formState.result?.result === 'string'
          ? formState.result?.result
          : formState.result?.result[0]
      )
      setSubmitted(false)
    }
    if (!formState?.loading && !formState?.result?.error) {
      setWillVerifyOtpState(false)
    }
  }, [formState]);

  useEffect(() => {
    if (verifyPhoneState && !verifyPhoneState?.loading) {
      if (verifyPhoneState.result?.error) {
        const message =
          typeof verifyPhoneState?.result?.result === 'string'
            ? verifyPhoneState?.result?.result
            : verifyPhoneState?.result?.result[0];
        verifyPhoneState.result?.result && showToast(ToastType.Error, message);
        setIsLoadingVerifyModal(false);
        return;
      }

      const okResult = verifyPhoneState.result?.result === 'OK';
      if (okResult) {
        !isModalVisible && setIsModalVisible(true);
        setIsLoadingVerifyModal(false);
      }
    }
  }, [verifyPhoneState]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);
      let stringError = '';

      if (phoneInputData.error) {
        list.unshift({ message: phoneInputData.error });
      }

      if (
        loginTab === 'cellphone' &&
        !phoneInputData.error &&
        !phoneInputData.phone.country_phone_code &&
        !phoneInputData.phone.cellphone
      ) {
        list.unshift({
          message: t(
            'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
            'The field Mobile phone is required.',
          ),
        });
      }

      list.map((item: any, i: number) => {
        stringError +=
          i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });

      showToast(ToastType.Error, stringError);
    }
  }, [errors]);

  useEffect(() => {
    if (loading && !formState?.loading) {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (ordering.project === null || !submitted || !useRootPoint) return
    const values: any = formValues
    if (values?.project_name) {
      delete values.project_name
    }
    mainLogin(values)
    setSubmitted(false)
  }, [ordering, submitted])

  useEffect(() => {
    if (checkPhoneCodeState?.result?.error) {
      setAlertState({
        open: true,
        content: t(checkPhoneCodeState?.result?.error, checkPhoneCodeState?.result?.error),
        title: ''
      })
    }
  }, [checkPhoneCodeState])

  Dimensions.addEventListener('change', ({ window: { width, height } }) => {
    setWindowWidth(
      parseInt(parseFloat(String(Dimensions.get('window').width)).toFixed(0)),
    );

    if (width < height) {
      setOrientation('Portrait');
    } else {
      setOrientation('Landscape');
    }
  });

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 40,
      height: Dimensions.get('window').height,
      // flex: 1,
      // padding: 20
    },
    rerember_view: {
      flexDirection: 'row',
      // marginHorizontal: 15,
      marginTop: 2,
      alignItems: 'center',
      paddingBottom: 3
    },
    resettext: {
      fontFamily: 'Outfit-Regular',
      fontStyle: 'normal',
      // fontWeight: '400',
      fontSize: moderateScale(14),
      color: '#E15B5D',
      marginBottom: 3

    },
    header: {
      marginBottom: 30,
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 20
    },
    arrowLeft: {
      maxWidth: 40,
      height: 25,
      justifyContent: 'flex-end',
      marginBottom: 25,
      paddingTop: 10
    },
    title: {
      fontFamily: 'Outfit-Regular',
      fontStyle: 'normal',
      // fontWeight: '400',
      fontSize: moderateScale(26),
      color: theme.colors.logintext,
      marginTop: moderateScale(60),
      marginBottom: 2
    },
    inputlable: {
      fontFamily: 'Outfit-Regular',
      fontStyle: 'normal',
      // fontWeight: '400',
      fontSize: moderateScale(14),
      color: theme.colors.logintext,
      marginBottom: 6

    },
    btnTab: {
      flex: 1,
      minWidth: 88,
      alignItems: 'center',
    },
    btnTabText: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontSize: 16,
      marginBottom: 10,
      paddingLeft: 8,
      paddingRight: 8,
    },
    input: {
      color: theme.colors.arrowColor,
      marginBottom: 20,
      borderWidth: 1,
      borderRadius: 12,
      // borderColor: theme.colors.inputSignup,
      backgroundColor: theme.colors.loginInputbackground,
      maxHeight: Platform.OS === 'android' ? 60 : 48,
      minHeight: Platform.OS === 'android' ? 60 : 48,
    },
    btn: {
      borderRadius: 7.6,
      height: Platform.OS === 'android' ? 60 : 44,
      left: 0,
      width: '100%'



    },
    btnText: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
    },
    btnFlag: {
      width: 79,
      borderWidth: 1,
      borderRadius: 7.6,
      marginRight: 9,
      borderColor: theme.colors.inputSignup,
    },
    textForgot: {
      color: theme.colors.arrowColor,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 16,
    },

    borderStyleBase: {
      width: 30,
      height: 45
    },
    borderStyleHighLighted: {
      borderColor: "#03DAC6",
    },
    underlineStyleBase: {
      width: 45,
      height: 60,
      borderWidth: 1,
      fontSize: 16
    },
    underlineStyleHighLighted: {
      borderColor: theme.colors.primary,
      color: theme.colors.primary,
      fontSize: 16
    },
  });


  // useEffect(() =>{
  // console.log(inputMailRef?.current,'mail ')
  // },[inputMailRef?.current])
  return (
    <>

      <View style={styles.container}>
        <View style={styles.header}>
          {/* <OIconButton
            icon={theme.images.general.arrow_left}
            borderColor={theme.colors.clear}
            iconStyle={{ width: 20, height: 20 ,tintColor:'#1B3E70'}}
            style={styles.arrowLeft}
            onClick={() => navigation?.canGoBack() && navigation.goBack()}
          /> */}
          <View style={{
            marginTop: 10,
            marginBottom: 8
          }}></View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              style={{
                width: 250,
                height: 50,
              }}

              source={theme?.images?.logos?.logo}

            />
          </View>

          <OText style={styles.title}>{t('LOGIN', 'Login')}</OText>
        </View>

        {/* {(Number(useLoginByEmail) + Number(useLoginByCellphone) + Number(useLoginOtpEmail) + Number(useLoginOtpCellphone) > 1) && (
        <LoginWith>
          <ScrollView
            ref={scrollRefTab}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal>
            <TabsContainer width={windowWidth - 42}>
              {useLoginByEmail && (
                <Pressable
                  style={styles.btnTab}
                  onPress={() => handleChangeTab('email')}>
                  <OText
                    style={styles.btnTabText}
                    color={
                      loginTab === 'email'
                        ? theme.colors.textGray
                        : theme.colors.unselectText
                    }
                    weight={loginTab === 'email' ? '600' : 'normal'}>
                    {t('BY_EMAIL', 'by Email')}
                  </OText>

                  <View
                    style={{
                      width: '100%',
                      borderBottomColor:
                        loginTab === 'email'
                          ? theme.colors.textGray
                          : theme.colors.tabBar,
                      borderBottomWidth: 2,
                    }}></View>
                </Pressable>
              )}

              {useLoginByCellphone && (
                <Pressable
                  style={styles.btnTab}
                  onPress={() => handleChangeTab('cellphone')}>
                  <OText
                    style={styles.btnTabText}
                    color={
                      loginTab === 'cellphone'
                        ? theme.colors.textGray
                        : theme.colors.unselectText
                    }
                    weight={loginTab === 'cellphone' ? '600' : 'normal'}>
                    {t('BY_PHONE', 'by Phone')}
                  </OText>

                  <View
                    style={{
                      width: '100%',
                      borderBottomColor:
                        loginTab === 'cellphone'
                          ? theme.colors.textGray
                          : theme.colors.tabBar,
                      borderBottomWidth: 2,
                    }}></View>
                </Pressable>
              )}

              {useLoginOtpEmail && (
                <Pressable
                  style={styles.btnTab}
                  onPress={() => handleChangeOtpType('email')}>
                  <OText
                    style={styles.btnTabText}
                    color={
                      isOtpEmail
                        ? theme.colors.textNormal
                        : theme.colors.disabled
                    }
                    weight={isOtpEmail ? 'bold' : 'normal'}>
                    {t('BY_OTP_EMAIL', 'By Otp Email')}
                  </OText>
                  <View
                    style={{
                      width: '100%',
                      borderBottomColor:
                        isOtpEmail
                          ? theme.colors.textGray
                          : theme.colors.tabBar,
                      borderBottomWidth: 2,
                    }} />
                </Pressable>
              )}
              {useLoginOtpCellphone && (
                <Pressable
                  style={styles.btnTab}
                  onPress={() => handleChangeOtpType('cellphone')}>
                  <OText
                    style={styles.btnTabText}
                    color={
                      isOtpCellphone
                        ? theme.colors.textNormal
                        : theme.colors.disabled
                    }
                    weight={isOtpCellphone ? 'bold' : 'normal'}>
                    {t('BY_OTP_PHONE', 'By Otp Phone')}
                  </OText>
                  <View
                    style={{
                      width: '100%',
                      borderBottomColor:
                      isOtpCellphone
                          ? theme.colors.textGray
                          : theme.colors.tabBar,
                      borderBottomWidth: 2,
                    }} />
                </Pressable>
              )}
            </TabsContainer>
          </ScrollView>
        </LoginWith>
      )} */}

        {(useLoginByCellphone || useLoginByEmail || useLoginOtp) && (
          <FormInput
          // windowheight={Dimensions.get('window').height}
          >
            {useRootPoint && (
              <Controller
                control={control}
                name='project_name'
                rules={{ required: t(`VALIDATION_ERROR_PROJECT_NAME_REQUIRED`, 'The field project name is required') }}
                defaultValue=""
                render={({ onChange, value }: any) => (
                  <OInput
                    name='project_name'
                    placeholderTextColor={theme.colors.arrowColor}
                    placeholder={t('PROJECT_NAME', 'Project Name')}
                    icon={theme.images.general.project}
                    iconColor={theme.colors.arrowColor}
                    onChange={(e: any) => {
                      setProjectName({ name: e?.target?.value, isFocued: true })
                      onChange(e?.target?.value);
                      setSubmitted(false);
                    }}
                    selectionColor={theme.colors.primary}
                    color={theme.colors.textGray}
                    value={value}
                    style={styles.input}
                    returnKeyType='next'
                    autoCorrect={false}
                    autoCapitalize='none'
                    onSubmitEditing={() => inputMailRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                )}
              />
            )}

            {(useLoginByEmail && loginTab === 'email') && (
              <Controller
                control={control}
                render={({ onChange, value }: any) => (
                  <>

                    <View>
                      <OText style={styles.inputlable}>{t('Email_Address', 'Email Address')}</OText>
                    </View>
                    <OInput
                      placeholder={t('sample@mail.com', 'sample@mail.com')}
                      placeholderTextColor={theme.colors.arrowColor}
                      style={styles.input}
                      // icon={theme.images.logos.emailInputIcon}
                      iconColor={theme.colors.arrowColor}
                      onChange={(e: any) => {
                        setProjectName({ ...projectName, isFocued: false })
                        handleChangeInputEmail(e, onChange);
                      }}
                      selectionColor={theme.colors.primary}
                      color={theme.colors.textGray}
                      value={value}
                      autoCapitalize="none"
                      autoCorrect={false}
                      type="email-address"
                      autoCompleteType="email"
                      forwardRef={inputMailRef}
                      returnKeyType="next"
                      onSubmitEditing={() => inputRef.current?.focus()}
                      blurOnSubmit={false}
                    />
                  </>
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
              />
            )}

            {((useLoginByCellphone && loginTab === 'cellphone') || (loginTab === 'otp' && otpType === 'cellphone')) && (
              <View style={{ marginBottom: 20 }}>
                <PhoneInputNumber
                  data={phoneInputData}
                  handleData={(val: any) => setPhoneInputData(val)}
                  flagProps={styles.btnFlag}
                  onSubmitEditing={() => null}
                  textInputProps={{
                    returnKeyType: 'next',
                    onSubmitEditing: () => inputRef?.current?.focus?.(),
                  }}
                />
              </View>
            )}

            {loginTab !== 'otp' && (
              <Controller
                control={control}
                render={({ onChange, value }: any) => (
                  <>
                    <View>
                      <OText style={styles.inputlable}>{t('PASSWORD', 'Password')}</OText>
                    </View>
                    <OInput
                      isSecured={!passwordSee ? true : false}
                      placeholder={t('PASSWORD_MSG', '8+ Characters, 1 capital letter')}
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
                      onChange={(val: any) => onChange(val)}
                      returnKeyType="done"
                      onSubmitEditing={() => !loading ? handleLogin() : {}}
                      blurOnSubmit
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
            )}

            <View style={styles.rerember_view}>
              {
                isChecked ? (
                  <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
                    <AntDesignIcon
                      name="checksquare"
                      size={24}
                      color='#EE4140'
                    />
                  </TouchableOpacity>

                )
                  :
                  <TouchableOpacity
                    onPress={() => setIsChecked(!isChecked)}
                  >
                    <MaterialCommunityIcons

                      name="checkbox-blank-outline"
                      size={24}
                      color='#979B9D'
                    />
                  </TouchableOpacity>

              }
              <Text style={{
                fontSize: moderateScale(14),
                fontFamily: 'Outfit-Regular',
                // fontWeight: '400',

                color: '#1B3E70',
                paddingLeft: 7
              }}>Remember Me</Text>
            </View>


            {onNavigationRedirect && loginTab !== 'otp' && (
              <Pressable
                style={{ marginRight: 'auto', marginBottom: 20, flexDirection: 'row', marginTop: 10 }}
                onPress={() => onNavigationRedirect('Forgot')}>
                <OText style={styles.inputlable}>
                  Forgot Password ?
                </OText>
                <OText style={[styles.resettext, { marginLeft: 5 }]}>
                  Reset
                </OText>

              </Pressable>
            )}
            {(enableReCaptcha && recaptchaConfig?.version) && (
              <>
                {recaptchaConfig?.version === 'v3' ? (
                  <ReCaptcha
                    url={recaptchaConfig?.baseUrl}
                    siteKey={recaptchaConfig?.siteKey}
                    containerStyle={{ height: 40 }}
                    onExecute={onRecaptchaVerify}
                    reCaptchaType={1}
                  />
                ) : (
                  <>
                    <TouchableOpacity
                      style={{ marginBottom: 15 }}
                      onPress={handleOpenRecaptcha}
                    >
                      <RecaptchaButton>
                        {recaptchaVerified ? (
                          <MaterialCommunityIcons
                            name="checkbox-marked"
                            size={26}
                            color={theme.colors.primary}
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name="checkbox-blank-outline"
                            size={26}
                            color={theme.colors.mediumGray}
                          />
                        )}
                        <OText size={14} mLeft={8}>{t('VERIFY_ReCAPTCHA', 'Verify reCAPTCHA')}</OText>
                      </RecaptchaButton>
                    </TouchableOpacity>
                    <Recaptcha
                      ref={recaptchaRef}
                      siteKey={recaptchaConfig?.siteKey}
                      baseUrl={recaptchaConfig?.baseUrl}
                      onVerify={onRecaptchaVerify}
                      onExpire={() => setRecaptchaVerified(false)}
                    />
                  </>)
                }
              </>
            )}


          </FormInput>
        )}
        {/* <View style={{

          width: '100%'
        }}> */}


        <OButton
          onClick={handleLogin}
          text={loginTab !== 'otp' ? t('LOGIN', 'Login') : t('GET_VERIFY_CODE', 'Get verify code')}
          bgColor={theme.colors.primary}
          borderColor={theme.colors.primary}
          textStyle={styles.btnText}
          imgRightSrc={null}
          isLoading={formState?.loading || loading}
          style={styles.btn}
          parentStyle={{
            bottom: Platform.OS == 'ios' ? 170 : 153,
            position: 'absolute',
          }}
        // isDisabled={formState?.}

        />
        {/* </View> */}
        <View style={{
          position: 'absolute',
          bottom: Platform.OS == 'ios' ? 90 : 90

        }}>
          <Pressable
            style={{ marginRight: 'auto', marginBottom: 20, flexDirection: 'row' }}
            onPress={() => onNavigationSignup()}>
            <OText style={styles.inputlable}>
              Don't have an account?
            </OText>
            <OText style={[styles.resettext, { marginLeft: 5 }]}>
              {t('CREATE_ACC_D', 'Create an account')}
            </OText>

          </Pressable>
        </View>


        {useLoginByCellphone &&
          loginTab === 'cellphone' &&
          configs &&
          Object.keys(configs).length > 0 &&
          (configs?.twilio_service_enabled?.value === 'true' ||
            configs?.twilio_service_enabled?.value === '1') && (
            <>
              <OrSeparator>
                <LineSeparator />
                <OText size={18} mRight={20} mLeft={20}>
                  {t('OR', 'Or')}
                </OText>
                <LineSeparator />
              </OrSeparator>

              <ButtonsWrapper mBottom={20}>
                <OButton
                  onClick={handleVerifyCodeClick}
                  text={t('GET_VERIFY_CODE', 'Get Verify Code')}
                  borderColor={theme.colors.primary}
                  style={styles.btn}
                  imgRightSrc={null}
                  isLoading={isLoadingVerifyModal}
                  indicatorColor={theme.colors.primary}
                />
              </ButtonsWrapper>
            </>
          )}

        <OModal
          open={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        >
          <VerifyPhone
            phone={phoneInputData.phone}
            verifyPhoneState={verifyPhoneState}
            checkPhoneCodeState={checkPhoneCodeState}
            handleCheckPhoneCode={handleCheckPhoneCode}
            setCheckPhoneCodeState={setCheckPhoneCodeState}
            handleVerifyCodeClick={handleVerifyCodeClick}
          />
        </OModal>
        <OModal
          open={willVerifyOtpState}
          onClose={() => setWillVerifyOtpState(false)}
          entireModal
          hideIcons
          title={t('ENTER_VERIFICATION_CODE', 'Enter verification code')}
        >
          <Otp
            willVerifyOtpState={willVerifyOtpState}
            setWillVerifyOtpState={setWillVerifyOtpState}
            handleLoginOtp={handleLoginOtp}
            onSubmit={handleLogin}
            setAlertState={setAlertState}
            formState={formState}
          />
        </OModal>
        <Alert
          open={alertState.open}
          content={alertState.content}
          title={alertState.title || ''}
          onAccept={closeAlert}
          onClose={closeAlert}
        />


      </View>

    </>
  );
};

export const LoginForm = (props: any) => {
  const loginProps = {
    ...props,
    isRecaptchaEnable: true,
    UIComponent: LoginFormUI,
  };

  return <LoginFormController {...loginProps} />;
};

