import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, Modal, View, Image } from 'react-native';
import { useTheme } from 'styled-components/native';
import { OIcon, OText } from '../shared';
import { _retrieveStoreData, _clearStoreData } from '../../providers/StoreUtil';
import { LogoutAction, useLanguage, useSession, ToastType, useToast } from '@components';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const LogoutButtonUI = (props: any) => {
  const { handleLogoutClick, setRootState, formState, navigation } = props;
  const [, t] = useLanguage();
  const [, { showToast }] = useToast()
  const theme = useTheme();
  const [loading, setLoading] = useState(false)
  const [logoutModal, setlogoutModal] = useState(false)
  const navigationD = useNavigation();
  const handleClick = async () => {
    setLoading(true)
    const data = await _retrieveStoreData('notification_state');
    const res = await handleLogoutClick(data);
    setLoading(false)
    if (res) {
      setlogoutModal(!logoutModal)
      navigation.closeDrawer();
      _clearStoreData({ excludedKeys: ['isTutorial', 'language'] });
      setRootState && setRootState({ isAuth: false, token: null })
    }
  };

  useEffect(() => {
    if (formState?.result?.error) {
      showToast(ToastType.Error, t(formState?.result?.result))
    }
  }, [formState?.result])

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      marginBottom: 40,
    },
    text: {
      color: theme.colors.textGray,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 16,
      marginRight: 10,
    },
  });


  return (
    <View>
      <TouchableOpacity

        onPress={() => setlogoutModal(!logoutModal)}
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-between',
          marginTop: 15
        }}
      >
        <Text style={{
          fontSize: 17,
          color: '#26374B',
          fontWeight: '400',
          fontFamily: 'Outfit'
        }}>Log out</Text>
        <MaterialIcon
          name='logout'
          color='#26374B'
          size={23}
          style={{ marginLeft: 10 }}
        />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutModal}
      // onRequestClose={() => {
      //   Alert.alert('Modal has been closed.');
      //   setimagemodal(!imagemodal);
      // }}
      // onDismiss={() => setimagemodal(!imagemodal)}

      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: "rgba(0, 0, 0, 0.5)"

        }}>

          <View style={{
            height: 350,
            width: 330,
            backgroundColor: '#FFFFFF',
            borderRadius: 20
          }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>

              <Image
                source={require('../../../../assets/images/logout_modal.png')}
                style={{
                  width: 280,
                  height: 180
                }}
                resizeMode='contain'
              />
              <Text style={{
                fontSize: 17,
                color: '#26374B',
                fontFamily: 'Outfit',
                fontWeight: '400',
                marginTop: 10
              }}>Are you sure ?</Text>
              <Text style={{
                fontSize: 15,
                color: '#979B9D',
                fontFamily: 'Outfit',
                fontWeight: '400',
                marginTop: 10
              }}>You want to log out</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingTop: 20
            }}>
              <TouchableOpacity
                onPress={() => setlogoutModal(!logoutModal)}
                style={{
                  height: 50,
                  width: 150,
                  backgroundColor: '#C1C3C4',
                  borderRadius: 29,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}><Text style={{
                  fontSize: 17,
                  color: '#FFFFFF',
                  fontFamily: 'Outfit',
                  fontWeight: '400',
                }}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={{
                width: 150,
                height: 50,
                borderRadius: 29,
                backgroundColor: '#E15B5D',
                justifyContent: 'center',
                alignItems: 'center'
              }}
                onPress={() => handleClick()} disabled={loading}
              >

                <Text style={{
                  fontSize: 17,
                  fontFamily: 'Outfit',
                  fontWeight: '600',
                  color: '#FFFFFF'
                }}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </Modal>
    </View>



  );
};

export const LogoutButton = (props: any) => {
  const [{ user }] = useSession()
  const logoutProps = {
    ...props,
    isNative: true,
    isDriverApp: user?.level === 4,
    UIComponent: LogoutButtonUI,
  };

  return <LogoutAction {...logoutProps} />;
};
