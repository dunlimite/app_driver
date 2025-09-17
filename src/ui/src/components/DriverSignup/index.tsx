import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, StatusBar, Image, TextInput, Dimensions, TouchableOpacity, ScrollView, Pressable, Modal, Platform } from 'react-native';
import { useTheme } from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { navigate } from '../../../../navigators/NavigationRef';
import { normalize, moderateScale } from '../../providers/Responsive';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import { moderateScale } from "../../providers/Responsive";

import {
    OButton, OInput, OModal, OIconButton, OText,
    PhoneInputNumber,
    VerifyPhone
} from '@ui'
import {
    useLanguage,
    ToastType,
    useToast,
} from '@components';
import { WebView } from 'react-native-webview';
import { DriverSignup as DrivcersignupControler } from './SignupController'
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
const SignUpDriverUI = (props: any) => {



    const { navigation,
        formstep,
        otpref,
        otp,
        otpvalue,
        handleinputchanges,
        formstate,
        setformstatep,
        handlesignupclick,
        handlesendotp,
        handleOtpchange,
        loadingState


    } = props
    const theme = useTheme();
    const [, t] = useLanguage();
    const styles = StyleSheet.create({
        header: {
            marginBottom: 7,
            justifyContent: 'space-between',
            width: '100%'
        },
        arrowLeft: {
            maxWidth: normalize(40),
            height: normalize(25),
            justifyContent: 'flex-end',
            marginBottom: normalize(8),
            paddingTop: 10
        },
        title: {
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: moderateScale(26),
            color: theme.colors.textGray,
        },
        container: {

            paddingBottom: 40,
            height: Dimensions.get('window').height,
            // flex: 1,
            // padding: 20,
            alignItems: 'center',

            // paddingLeft: moderateScale(10),
            // paddingRight: moderateScale(10)
            // width:Dimensions.get('window').width
        },
        logo_sty: {
            height: moderateScale(70),
            width: moderateScale(22),
            resizeMode: 'contain',
            alignSelf: 'center'
        },
        title_txt: {
            fontFamily: 'Outfit-Regular',
            fontSize: moderateScale(27),
            // marginHorizontal: moderateScale(15),
            marginTop: moderateScale(10)
        },
        inputTitle_txt: {
            // marginHorizontal: 15,
            marginTop: moderateScale(15),
            fontFamily: 'Outfit-Regular',
            fontSize: moderateScale(15),
            // fontWeight: '400',
            gap: moderateScale(8)
            // marginBottom: moderateScale(3)
        },
        input_sty: {
            marginTop: moderateScale(4),
            // marginHorizontal: 15,
            paddingHorizontal: moderateScale(17),
            // paddingVertical: moderateScale(17),
            borderRadius: moderateScale(12),
            maxHeight: Platform.OS === 'android' ? 60 : 48,
            minHeight: Platform.OS === 'android' ? 60 : 48,
            width: '100%'

        },
        password_view: {
            marginTop: moderateScale(4),
            // marginHorizontal: 15,
            paddingHorizontal: moderateScale(17),
            // paddingVertical: moderateScale(17),
            borderRadius: moderateScale(12),
            maxHeight: 48,
            minHeight: 48,

            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        password_input_sty: {
            paddingHorizontal: moderateScale(12),
            // paddingVertical:moderateScale(24),
            borderRadius: moderateScale(12),
            maxHeight: 48,
            minHeight: 48,
            width: '100%',
        },
        forgetpassword_txt: {
            fontFamily: 'Outfit-Regular',
            fontSize: moderateScale(14),
            marginHorizontal: moderateScale(2),
            marginTop: 10,

        },
        button_sty: {
            // width: width - 30,
            height: moderateScale(47),
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: moderateScale(45),
            marginHorizontal: moderateScale(12),
            borderRadius: moderateScale(15)
        },
        signin_txt: {
            textAlign: 'center',
            fontSize: moderateScale(15),
            fontFamily: 'Outfit'
        },
        alreadyacc_txt: {
            fontFamily: 'Outfit-Regular',
            fontSize: moderateScale(13),
            marginHorizontal: moderateScale(15),
            marginTop: moderateScale(15),
            marginBottom: moderateScale(20),
            textAlign: 'center'
        },
        rerember_view: {
            flexDirection: 'row',
            // marginHorizontal: 15,
            marginTop: moderateScale(30),
            alignItems: 'center'
        },
        btn: {
            borderRadius: 7.6,
            height: Platform.OS === 'android' ? 60 : 44,
            // left: 0,
            width: '100%'



        },
        btnText: {
            color: theme.colors.inputTextColor,
            fontFamily: 'Outfit-Regular',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: moderateScale(15),
        },
        resettext: {
            fontFamily: 'Outfit-Regular',
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: moderateScale(14),
            color: '#E15B5D',
            marginBottom: 3,
            marginLeft: 4

        },
        inputlable: {
            fontFamily: 'Outfit-Regular',
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: moderateScale(14),
            color: theme.colors.logintext,
            marginBottom: 3

        },
        messege_txt: {
            fontFamily: 'Outfit-Regular',
            fontSize: moderateScale(15),
            paddingTop: moderateScale(14),
            fontWeight: '400',
            paddingHorizontal: 6
        },
        inputContainer: {
            flexDirection: 'row',
            alignSelf: 'flex-start',
            width: Dimensions.get('screen').width,
            justifyContent: 'space-between',
            marginTop: moderateScale(25),
            paddingRight: 50
            // borderBlockColor:'#000000'
            // paddingHorizontal: 16
        },
        otp_sty: {
            // borderRadius: moderateScale(12),
            width: '80%',
            height: '80%',
            fontFamily: 'Outfit-Regular',
            fontSize: moderateScale(15),
            // borderWidth: moderateScale(2),
            // borderColor: theme?.colors?.loginInputbackground,

        },
    });

    const [, { showToast }] = useToast();

    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120);
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };
    const [openWebview, setOpenWebview] = useState(false);
    const webviewRef = useRef<any>(null)
    const [reSendCode, setReSendCode] = useState(false);

    useEffect(() => {
        // if (formstep == 2 && formstep == 1) {
        //     return
        // }
        if (formstate?.otp == '') return
        if (timeLeft === 0) {
            setReSendCode(true)
        }
        if (timeLeft <= 0) return;

        const timer = setTimeout(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearTimeout(timer); // Cleanup on unmount
    }, [timeLeft, formstate?.otp]);

    useEffect(() => {
        setTimeLeft(120)
    }, [formstate?.otp])
    const onMessage = (e: any) => {

    }
    const handleStripeConnect = async () => {
        setOpenWebview(true)
    }
    const onNavigationStateChange = (webViewState: { url: string; }) => {

        if (webViewState.canGoBack) {
            setOpenWebview(false)

        }
    }
    return (
        <>



            <View style={styles.container}>
                <Modal visible={openWebview} animationType="slide" transparent={false}>
                    <View style={{ flex: 1 }}>
                        <View style={{
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            paddingRight: 30,
                            paddingTop: 10
                        }}>
                            <View></View>
                            <TouchableOpacity
                                onPress={() => setOpenWebview(!openWebview)}
                            >
                                <EntypoIcon
                                    name='cross'
                                    size={25}
                                    color='#EE4140'
                                />
                            </TouchableOpacity>

                        </View>
                        <WebView
                            source={{ uri: 'https://generator.lorem-ipsum.info/terms-and-conditions' }}
                            onMessage={onMessage}
                            onNavigationStateChange={onNavigationStateChange}
                            ref={webviewRef}
                            javaScriptEnabled={true}
                            javaScriptEnabledAndroid={true}
                            cacheEnabled={true}
                            cacheMode='LOAD_NO_CACHE'
                            style={{ flex: 1 }}
                            onLoadStart={() => {

                            }}
                            onLoadProgress={() => {

                            }}
                            onLoad={() => {

                            }}
                            onLoadEnd={(e) => {
                                //console.log(e.nativeEvent)
                            }}

                        />
                    </View>
                </Modal>
                <View style={styles.header}>
                    <OIconButton
                        icon={theme.images.general.arrow_left}
                        borderColor={theme.colors.clear}
                        iconStyle={{ width: 20, height: 20, tintColor: '#1B3E70' }}
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


                {
                    formstep == 1 && (
                        <>
                            <View style={{
                                width: '100%'
                            }}>


                                <Text style={{ ...styles.title_txt, color: theme?.colors.logintext }}>{t('SIGNUP', 'Sign Up')}</Text>

                                <Text style={{ ...styles.inputTitle_txt, color: theme?.colors.logintext, marginTop: 30 }}>{t('EMAIL', 'Email')}</Text>
                                <TextInput
                                    value={formstate?.email}
                                    onChangeText={(e) => handleinputchanges('email', e)}
                                    placeholder='sample@mail.com'
                                    style={{
                                        ...styles.input_sty, backgroundColor: theme?.colors.loginInputbackground
                                    }}

                                />



                                <Text style={{ ...styles.inputTitle_txt, color: theme?.colors.logintext }}>{t('PASSWORD', 'Password')}</Text>
                                <View style={{ ...styles.password_view, backgroundColor: theme?.colors.loginInputbackground }}>
                                    <TextInput
                                        value={formstate?.password}
                                        onChangeText={(e) => handleinputchanges('password', e)}
                                        placeholder={t('PASSWORD_MSG', '8+ Characters, 1 capital letter')}
                                        style={{ width: '80%', maxHeight: '100%' }}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity
                                        style={{
                                            paddingRight: moderateScale(10)
                                        }}
                                        onPress={() => setShowPassword(!showPassword)}>

                                        {
                                            showPassword ? (
                                                <FeatherIcon
                                                    name='eye'

                                                    color='#979797'
                                                    size={17}
                                                />
                                            )
                                                :
                                                (
                                                    <FeatherIcon
                                                        name='eye-off'

                                                        color='#979797' size={20}
                                                    />
                                                )
                                        }

                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* <Text style={{ ...styles.inputTitle_txt, color: theme?.colors.logintext }}>Refferal code</Text>
                        <TextInput
                            placeholder="Refferal Code"
                            style={{ ...styles.input_sty, width: 200, backgroundColor: theme?.colors.loginInputbackground }}
                        /> */}

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
                                            <MaterialCommunityIcon

                                                name="checkbox-blank-outline"
                                                size={24}
                                                color='#979B9D'
                                            />
                                        </TouchableOpacity>

                                }


                                <Text
                                    style={{
                                        ...styles.forgetpassword_txt,
                                        color: theme?.colors.logintext,
                                        padding: 10,
                                        // alignItems:'center',
                                        // flexDirection:'row'
                                    }}>{t('CREATING_ACCOUNT_AGREE', 'By creating this account, you have agree with')}

                                    <OText style={{
                                        color: '#EE4140',
                                        fontSize: moderateScale(15),
                                        fontWeight: '400',
                                        fontFamily: 'Outfit-Regular',
                                        marginLeft: 20

                                    }}>  {t('TERM_OF_SERVICES',
                                        'Term of Services')}</OText></Text>
                            </View>
                            {/* <View style={{
                            position: 'absolute',
                            bottom: 20,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                        }}> */}


                            <OButton
                                onClick={() => handlesignupclick()}
                                text={t('NEXT', 'Next')}
                                bgColor={theme.colors.primary}
                                borderColor={theme.colors.primary}
                                textStyle={styles.btnText}
                                imgRightSrc={null}
                                isLoading={loadingState}
                                style={styles.btn}
                                parentStyle={{
                                    width: '100%',
                                    bottom: 160,
                                    position: 'absolute',

                                }}
                                isDisabled={(formstate?.email !== '' && formstate?.password !== '' && isChecked) ? false : true}

                            />


                            <View style={{
                                position: 'absolute',


                                alignContent: 'center',

                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: 30,
                                bottom: 80
                                // backgroundColor:'#000000'

                            }}>
                                <View>


                                    <Pressable
                                        style={{ marginRight: 'auto', marginBottom: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <OText style={styles.inputlable}>
                                            {t('LOGIN_ACC', 'Already have an account?')}
                                        </OText>
                                        <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
                                            <OText style={styles?.resettext}>
                                                {t('LOGIN', 'Login')}
                                            </OText>
                                        </TouchableOpacity>


                                    </Pressable>
                                </View>
                            </View>
                            {/* </View> */}

                        </>
                    )
                }
                {/* </KeyboardAwareScrollView> */}

                {
                    formstep == 3 && (
                        <>
                            <View style={{
                                width: '100%'
                            }}>
                                <Text style={{ ...styles.title_txt, fontSize: moderateScale(24), lineHeight: 32, color: theme?.colors.logintext }}>{t('VERIFY_YOUR_PHONE_NUMBER', 'Please verify your phone number')}</Text>

                                <Text style={{ ...styles.messege_txt, color: '#979B9D', fontSize: moderateScale(17) }}>{t('VERIFICATION_CODE_NUMBER', 'We’ve sent a verification code to the number')}:
                                    <Text style={{ color: theme?.colors.logintext, marginTop: 10, fontSize: moderateScale(17) }}> {formstate?.phone}</Text></Text>

                                <View style={[styles.inputContainer]}>

                                    {otpvalue.map((digit: any, index: any) => (
                                        <View style={{
                                            borderRadius: moderateScale(12),
                                            width: moderateScale(48),
                                            height: moderateScale(48),
                                            borderWidth: Platform.OS === 'android' ? 1 : moderateScale(1),
                                            borderColor: Platform.OS === 'android' ? theme?.colors.logintext : '#e5e7e9',
                                            justifyContent: 'center',
                                            alignItems: 'center'

                                        }} >

                                            <TextInput
                                                key={index}
                                                style={{
                                                    ...styles.otp_sty,
                                                    backgroundColor: digit ? '#FFFFFF' : '#FFFFFF',
                                                    color: theme?.colors.logintext,
                                                }}
                                                value={digit}
                                                maxLength={1}
                                                keyboardType="numeric"
                                                onChangeText={(value) => handleOtpchange(value, index)}
                                                ref={(ref) => (otpref.current[index] = ref)}
                                                textAlign="center"
                                            />
                                        </View>
                                    ))}
                                </View>


                                <View style={{
                                    marginTop: 20
                                }}>


                                    <Pressable
                                        style={{ marginRight: 'auto', marginBottom: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <OText style={{
                                            // alignItems:'center',
                                            color: '#979B9D',
                                            fontSize: moderateScale(15),
                                            fontFamily: 'Outfit-Regular',
                                            fontWeight: '400'
                                        }}>
                                            {t('NOT_RECEIVE_CODE', `I didn't receive a code?`)}
                                        </OText>
                                        {!reSendCode && (
                                            <Text style={{ color: '#61BAD3', fontFamily: 'Outfit-Regular', fontSize: moderateScale(14) }}>{t('RETRY_AFTER', 'Retry after')} {formatTime(timeLeft)}
                                            </Text>
                                        )}
                                        {reSendCode && (

                                            <Pressable

                                                onPress={() => {
                                                    setReSendCode(false)
                                                    handlesendotp()


                                                }}

                                                style={{
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >

                                                <Text style={{ color: '#61BAD3', fontSize: moderateScale(14) }}>{t('RESEND_CODE', 'Resend a Code')}</Text>


                                            </Pressable>


                                        )}
                                        {/* <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
                                    <OText style={styles?.resettext}>
                                        {t('CREATE_ACC', 'Login')}
                                    </OText>
                                </TouchableOpacity> */}


                                    </Pressable>
                                </View>
                            </View>
                            {/* <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10
                        }}> */}


                            {/* <Text
                                style={{
                                    ...styles.forgetpassword_txt,
                                    // alignItems:'center',
                                    color: '#979B9D',

                                }}>I didn't receive a code?


                            </Text> */}



                            {/* <View>
                                {!reSendCode && (
                                    <Text style={{ color: '#61BAD3', fontFamily: 'Outfit' }}> Retry after {formatTime(timeLeft)}
                                    </Text>
                                )}
                            </View>


                            {reSendCode && (

                                <View style={{

                                }}>
                                    <Pressable

                                        onPress={() => {
                                            setReSendCode(false)
                                            handlesendotp()


                                        }}

                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >

                                        <Text style={{ color: '#61BAD3' }}> Resend a Code</Text>


                                    </Pressable>
                                </View>

                            )} */}


                            {/* </View> */}

                            <OButton
                                onClick={() => {
                                    const singleString = otpvalue?.join("");
                                    if (formstate?.otp == singleString) {
                                        navigation?.navigate('SignupuserDetails', { userData: formstate })

                                    } else {
                                        showToast(ToastType.Error, t('OTP_INCORRECT', `OTP is incorrect`));

                                    }
                                }}
                                text={t('VERYFY_OTP', 'Verify OTP')}
                                bgColor={theme.colors.primary}
                                borderColor={theme.colors.primary}
                                textStyle={styles.btnText}
                                imgRightSrc={null}
                                //   isLoading={loadingState}
                                style={styles.btn}
                                parentStyle={{
                                    bottom: 140,
                                    position: 'absolute'
                                }}
                                isDisabled={(!otpvalue || otpvalue.length === 0 || otpvalue.some(val => val.trim() === '')) ? true : false}

                            />

                        </>

                    )
                }

                {
                    formstep == 2 && (
                        <>
                            <View style={{
                                width: '100%'
                            }}>
                                <Text style={{ ...styles.title_txt, color: theme?.colors.logintext }}>{t('WHATS_YOUR_NUMBER', 'What’s Your Number?')}</Text>

                                <Text style={{ ...styles.inputTitle_txt, color: theme?.colors.logintext }}>{t('PHONE_NUMBER', 'Phone number')}</Text>
                                <TextInput
                                    value={formstate?.phone}
                                    onChangeText={(p) => handleinputchanges('phone', p)}
                                    placeholder={t('ENTER_YOUR_NUMBER', 'Enter your Number')}
                                    style={{ ...styles.input_sty, backgroundColor: theme?.colors.loginInputbackground }}
                                    keyboardType='number-pad'
                                    maxLength={10}
                                />
                                <Text style={{ ...styles.messege_txt, color: '#979B9D' }}>{t('PHONE_NUMBER_CODE_VERIFY', 'We’ll send you a code to verify your phone')}</Text>
                            </View>
                            <OButton
                                onClick={() => handlesendotp()}
                                text={t('SEND_CODE', 'Send a Code')}
                                bgColor={theme.colors.primary}
                                borderColor={theme.colors.primary}
                                textStyle={styles.btnText}
                                imgRightSrc={null}
                                isLoading={loadingState}
                                style={styles.btn}
                                parentStyle={{
                                    bottom: 140,
                                    position: 'absolute'
                                }}
                                isDisabled={formstate?.phone?.length == 10 ? false : true}

                            />
                        </>
                    )
                }
            </View>
        </>
    );
};

export const SignUpDriver = (props: any) => {
    const sighupprops = {
        ...props,
        UIComponent: SignUpDriverUI,

    };
    return (<DrivcersignupControler
        {...sighupprops}
    />)
}

// export default SignUpDriver;
