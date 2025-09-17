import React, { useEffect, useState } from "react";
import { useTheme } from 'styled-components/native';
import { View, Text, StyleSheet, StatusBar, Image, TextInput, Dimensions, TouchableOpacity, ScrollView, Pressable, Modal, Platform } from 'react-native';
import { moderateScale } from "../../providers/Responsive";
import { useLanguage } from "@components";
import {
  OButton, Container, OIconButton
} from '@ui'
import { SignupUserDetails as SignupUserDetailsControler } from './signupuserDetailsControler'
import { UserDetailsAddress } from './UserDetails';
import styled from 'styled-components/native';
import { useRoute } from "@react-navigation/native";

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;
const SignupUserDetailsUI = (props: any) => {
  const { navigation,
    formstate,
    handlechangeInput,
    userupdteCredentialData,
    stateDetails

  } = props
  const theme = useTheme();
  const [, t] = useLanguage();

  const [userModal, setsuermodal] = useState(false);
  const [locatinModal, setLocationModal] = useState(false);

  const styles = StyleSheet.create({
    header: {
      marginBottom: moderateScale(16),
      justifyContent: 'space-between',
      // marginTop:40
    },
    arrowLeft: {
      maxWidth: moderateScale(40),
      height: moderateScale(25),
      justifyContent: 'flex-end',
      marginBottom: moderateScale(8),
    },
    container: {
      flex: 1,
      height: Dimensions.get('window').height,
      // padding: 20,SS
      alignItems: 'center',
      width: '100%',
      backgroundColor: '#ffffff'
    },
    inputTitle_txt: {
      // marginHorizontal: moderateScale(15),
      marginTop: moderateScale(15),
      fontFamily: 'Outfit-Regular',
      fontSize: moderateScale(14),
      fontWeight: '400'
    },
    input_sty: {
      marginTop: moderateScale(4),
      // marginHorizontal: 15,

      borderRadius: moderateScale(12),
      maxHeight: Platform.OS === 'android' ? 60 : 48,
      minHeight: Platform.OS === 'android' ? 60 : 48,
      padding: moderateScale(6)

    },
    title_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: moderateScale(27),
      // marginHorizontal: 15,
      marginTop: moderateScale(15),
      fontWeight: '400'
    },
    btn: {
      borderRadius: 7.6,
      height: Platform.OS === 'android' ? 60 : 44,
      left: 0,
      width: '100%'
    },
    btnText: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Outfit-Regular',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 18,

    },
  })

  let userdetailsprops = {
    ...props,
    onhneaddressmodal: () => setsuermodal(!userModal),
    // onlocatonModal : () => setLocationModal(!locatinModal)
  }
  const route = useRoute();
  const { userData } = route.params || {};
  console.log(userData, 'usre params datas///')

  useEffect(() => {
    userupdteCredentialData(userData)
  }, [userData])
  return (
    <>


      <View style={styles.container}>
        <View style={{
          width: '100%'
        }}>
          <OIconButton
            icon={theme.images.general.arrow_left}
            borderColor={theme.colors.clear}
            iconStyle={{ width: 20, height: 20, tintColor: '#1B3E70' }}
            style={styles.arrowLeft}
            onClick={() => props?.navigation?.navigate('Signup')}
          />
          <View style={styles.header}>

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

          <Text style={{ ...styles.title_txt, color: theme?.colors.logintext }}>{t('TELL_ABOUT_YOURSELF', 'Tell us about yourself')}</Text>

          <Text style={{ ...styles.inputTitle_txt, color: theme?.colors.logintext, paddingTop: moderateScale(10) }}>{t('FIRST_NAME', 'First name')}</Text>

          <TextInput
            value={formstate?.first_name}
            placeholder={t('ENTER_FIRST_NAME', 'Enter your First name')}
            onChangeText={(t) => handlechangeInput('first_name', t)}
            style={{ ...styles.input_sty, backgroundColor: theme?.colors.loginInputbackground }}
          />



          <Text style={{ ...styles.inputTitle_txt, color: theme?.colors.logintext }}>{t('LAST_NAME', 'Last name')}</Text>


          <TextInput
            value={formstate?.last_name}
            placeholder={t('ENTER_LAST_NAME', 'Enter your Last name')}
            onChangeText={(t) => handlechangeInput('last_name', t)}

            style={{ ...styles.input_sty, backgroundColor: theme?.colors.loginInputbackground }}
          />



          {/* // user address details */}

          {/* <Modal
              animationType="slide"
              style={{
                height: '100%',
                flex: 1,
                position: 'absolute',
                zIndex: 9999,
                width: '100%'

              }}


              visible={userModal}
            // onClose={() => setIsModalVisible(false)}
            >

              <UserDetailsAddress
                {...userdetailsprops}
                stateDetails={stateDetails}
              />

            </Modal> */}
        </View>

        <OButton
          onClick={() => props?.navigation?.navigate('Customeruserdetials')}
          text={t('Next', 'Next')}
          bgColor={theme.colors.primary}
          borderColor={theme.colors.primary}
          textStyle={styles.btnText}
          imgRightSrc={null}
          //   isLoading={formState?.loading || loading}
          style={styles.btn}
          parentStyle={{
            bottom: 140,
            position: 'absolute'
          }}
          isDisabled={formstate?.first_name != '' && formstate?.last_name != '' ? false : true}

        />

      </View>

      {/* </Container> */}

    </>
  )
}

export const SignupDetails = (props: any) => {

  const SignupUserDetailsProps = {
    ...props,
    UIComponent: SignupUserDetailsUI
  }
  return (
    <>
      <SignupUserDetailsControler
        {...SignupUserDetailsProps}
      />
    </>
  )
}
