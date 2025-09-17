import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Modal, View, Text, Image, Platform, SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from 'styled-components/native';
import {
  OButton, OIcon, OText, Container,
  OIconButton
} from '@ui'
import { useLanguage, useSession, useApi } from '@components';
import { WebView } from 'react-native-webview';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { moderateScale } from "../../providers/Responsive";

export const WithDraMethod = (props: any) => {

  const {
    navigation
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [ordering] = useApi()
  const [{ user, token }] = useSession();
  const [openWebview, setOpenWebview] = useState(false);
  const webviewRef = useRef<any>(null)
  const [stripeClientId, setStripeClientId] = useState(null);
  const [stripeUserId, setStripeUserId] = useState(null);

  const redirect_uri = 'https://plugins-development.ordering.co/' + ordering.project + '/stripe_connect_react/stripe_driver_redirect.php';

  const handleStripeConnect = async () => {
    setOpenWebview(true)
  }
  const onMessage = (e: any) => {

  }
  const onNavigationStateChange = (webViewState: { url: string; }) => {
    console.log(webViewState)
    if (webViewState.canGoBack) {
      setOpenWebview(false)
      getstripedetails()
    }
  }

  const getstripedetails = async () => {

    let res = await fetch('https://plugins-development.ordering.co/' + ordering.project + '/stripe_connect_react/get_config.php', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({
        'driverId': user.id
      })
    });
    let result = await res.json();
    console.log('aaa')
    console.log(JSON.stringify(result))
    setStripeClientId(result.stripe_ca_key)
    setStripeUserId(result.stripe_user_id)

  }

  const goToBack = () => navigation?.canGoBack() && navigation.goBack()

  const styles = StyleSheet.create({
    btnText: {
      color: '#fff',
      fontFamily: 'Outfit',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
    },
    headers: {
      width: '100%',
      borderBottomColor: '#ECEEEF',
      borderBottomWidth: 1
    },
    // btnBackArrowa: {
    //   borderWidth: 0,
    //   width: '40%',
    //   // height: ,
    //   tintColor: theme.colors.textGray,
    //   backgroundColor: theme.colors.clear,
    //   borderColor: theme.colors.clear,
    //   shadowColor: theme.colors.clear,
    //   paddingLeft: 0,
    //   paddingRight: 0,
    //   marginBottom: Platform.OS == 'ios' ? 0 : 0,
    //   marginTop: Platform.OS === 'ios' ? 0 : 0
    // },
    btn: {
      borderRadius: 7.6,
      height: 44,
      left: 0,
      // width: '100%',
      marginHorizontal: 16,
      marginTop:10
    },
    btnBackArrow: {
      borderWidth: 0,
      width: '40%',
      height: 32,
      tintColor: theme.colors.textGray,
      backgroundColor: theme.colors.clear,
      borderColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      paddingLeft: 0,
      paddingRight: 0,
      // marginBottom: 0,
      // marginTop: Platform.OS === 'ios' ? 60 : 30
    },
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF'
    },
    header: {
      marginBottom: 30,
      display: 'flex',
      flexDirection: 'row',
      // marginHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ECEEEF',
      marginTop: Platform.OS == 'ios' ? 10 : 30,

      // marginTop:40
    },
    arrowLeft: {
      maxWidth: 40,
      height: 25,
      justifyContent: 'flex-end',
      color: '#1B3E70',
      marginHorizontal: 20
      // marginBottom: moderateScale(20),
    },

  });

  useEffect(() => {
    getstripedetails()
  }, [token])

  return (
    <>
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
            paddingTop:Platform.OS === 'android' ? StatusBar?.currentHeight : 0

      }}>
        {
          Platform.OS === 'ios' && (
            <>
              <View style={styles.header}>

          <OIconButton
            icon={theme.images.general.arrow_left}
            borderColor={theme.colors.clear}
            iconStyle={{ width: 20, height: 20, tintColor: '#1B3E70' }}
            style={styles.arrowLeft}
            onClick={() => goToBack()}

          />

          <Text style={{
            textAlign: 'center',
            width: '60%',
            fontSize: 17,
            color: theme?.colors.logintext,
            fontFamily: 'Oufit',
            fontWeight: '400'

          }}>{t('CONNECT_WITH_STRIPE', 'Connect with Stripe')}</Text>

        </View>
            </>
          )
        }
        <View style={[styles?.headers, {
          // marginTop: 10
        }]}>
          <View style={{
            width: Platform.OS === 'android' ? '50%' : '60%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // padding: 10,
            paddingLeft:10, paddingTop:10,paddingBottom:10
            //  backgroundColor:'red'
          }}>
            <TouchableOpacity

              onPress={() => {
                goToBack()
              }
              } style={styles.btnBackArrow}>
              <OIcon src={theme.images.general.arrow_left} color='#1B3E70' />
            </TouchableOpacity>


            <Text style={{
              fontSize: moderateScale(17),
              fontWeight: '400',
              color: '#1B3E70',
              fontFamily: 'Outfit',
              // backgroundColor:'red'
            }}>{t('CONNECT_WITH_STRIPE', 'Connect with Stripe')}</Text>

          </View>

        </View>

        <View style={styles?.container}>


          {/* <Container style={{
          justifiContent: 'center',
          alignItems: 'center'
        }}> */}

          <OButton
            onClick={() => handleStripeConnect()}
            text={t('CONNECT_WITH_STRIPE', 'Connect to Bank')}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
            textStyle={styles.btnText}
            imgRightSrc={null}
            //   isLoading={formState?.loading || loading}
            style={styles.btn}
            parentStyle={{
              width: '100%'
            }}



          />
          {/* <TouchableOpacity
            onPress={() => handleStripeConnect()}
            style={{
              width: 300,
              height: 50
            }}>
            <Image
              style={{
                width: '100%'
              }}
              source={require('../../../../assets/images/stripe.png')}
              resizeMode='contain'
            />
          </TouchableOpacity> */}

          {/* </Container> */}
        </View>


        <Modal visible={openWebview} animationType="slide" transparent={false}>
          <View style={{ flex: 1, marginTop: 100 }}>
            {
              user.id !== null && (

                <WebView
                  source={{ uri: 'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=' + stripeClientId + '&scope=read_write&redirect_uri=' + redirect_uri + '&state=' + user.id }}
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
              )

            }

          </View>
        </Modal>
      </SafeAreaView>
    </>
  )
}
