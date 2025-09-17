import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigators/RootNavigator';
import { navigationRef, navigate } from './navigators/NavigationRef';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerNavigationProp } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Dimensions, Platform } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';

import Profile from './pages/Profile';
import DriverEarning from './pages/DriverEarnings';
import WithdrawalMethod from './pages/Withdramethod';
import PayoutPage from './pages/Payout';
import DriverChatPage from './pages/DriverChat';
import MyOrdersList from './pages/MyOrdersList';
import MyOrders from './pages/MyOrders';
import { useUtils, useSession, useLanguage } from '@components';
import {
  OIcon, LogoutButton
} from '@ui'
import moment from 'moment';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  acc_name: {
    fontSize: 22,
    color: '#26374B',
    fontWeight: '400',
    fontFamily: 'Outfit-Regular',
    paddingLeft: 10,
    width: '70%'
  },
  drawer_item: {
    fontSize: 17,
    color: '#26374B',
    fontWeight: '400',
    fontFamily: 'Outfit-Regular'
  }
})

const DrawerCustomContent = (props: any) => {

  const [{ user }] = useSession();
  const [{ optimizeImage }] = useUtils();
  const [, t] = useLanguage();
  const [logoutModal, setlogoutModal] = useState(false)
  return (
    <>

      <DrawerContentScrollView {...props} style={{
        // backgroundColor: 'red',

      }}>
        <View style={{
          width: '100%',
          padding: 15,
          height: Dimensions.get('window').height
          // backgroundColor:'#000000'
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 25
          }}>
            {user?.photo && (
              <Image
                source={{ uri: optimizeImage(user?.photo, 'h_300,c_limit') }}

                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 12
                }}

              />
              // <OIcon
              //   url={optimizeImage(user?.photo, 'h_300,c_limit')}
              //   width={60}
              //   height={60}
              //   style={{ borderRadius: 10 }}
              // />
            )}
            {!user?.photo && (
              <View style={{
                height: 60,
                width: 60,
                borderRadius: 18,
                borderColor: '#e1e4e8',

              }}>


                <MaterialIcon
                  name='person'
                  color='#9b9c9e'
                  size={40}
                />

              </View>
            )}
            <Text style={styles?.acc_name} numberOfLines={1}

            >{user?.name} {user?.lastname}</Text>
          </View>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 18,
              paddingBottom: 7
            }}

            onPress={() => props?.navigation?.navigate('Profile')}
          >
            <Text style={styles?.drawer_item}>{t('ACCOUNT', 'Account')}</Text>
            <FeatherIcon
              name='chevron-right'
              color='#26374B'
              size={23}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 15,
              paddingBottom: 7
            }}
            onPress={() => props?.navigation?.navigate('Withdrawalmethod')}

          >
            <Text style={styles?.drawer_item}>{t('CONNECT_WITH_STRIPE', 'Connect with Stripe')}</Text>
            <FeatherIcon
              name='chevron-right'
              color='#26374B'
              size={23}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 13,
              paddingBottom: 5
            }}
            onPress={() => props?.navigation?.navigate('Payout', { userId: user?.id })}

          >
            <Text style={styles?.drawer_item}>{t('DEPOSITS', 'Deposits')}</Text>
            <FeatherIcon
              name='chevron-right'
              color='#26374B'
              size={23}
            />
          </TouchableOpacity>
          <TouchableOpacity

            onPress={() => props?.navigation?.navigate('DriverEarnings', { userId: user?.id ,weekdate: moment().startOf("isoWeek") })}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 15,
              paddingBottom: 7
            }}
          >
            <Text style={styles?.drawer_item}>{t('DELIVERIES', 'Deliveries')}</Text>
            <FeatherIcon
              name='chevron-right'
              color='#26374B'
              size={23}
            />
          </TouchableOpacity>
          <TouchableOpacity

            onPress={() => props?.navigation?.navigate('MyOrdersList', { refresh: Date.now() })}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 15,
              paddingBottom: 7
            }}
          >
            <Text style={styles?.drawer_item}>{t('ORDERS_LIST', 'Orders List')}</Text>
            <FeatherIcon
              name='chevron-right'
              color='#26374B'
              size={23}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 13,
              paddingBottom: 5
            }}
            onPress={() => props?.navigation?.navigate('DriverChat', { userId: user?.id })}

          >
            <Text style={styles?.drawer_item}>{t('MESSAGE', 'MESSAGE')}</Text>
            <FeatherIcon
              name='chevron-right'
              color='#26374B'
              size={23}
            />
          </TouchableOpacity>
          {/*<TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop:15,
              paddingBottom:7
            }}
          >
            <Text style={styles?.drawer_item}>Your bonuses</Text>
            <FeatherIcon
              name='chevron-right'
              color='#26374B'
              size={23}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop:15,
              paddingBottom:7
            }}
          >
            <Text style={styles?.drawer_item}>Referrals</Text>
            <FeatherIcon
              name='chevron-right'
              color='#26374B'
              size={23}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop:15,
              paddingBottom:7
            }}
          >
            <Text style={styles?.drawer_item}>Make Money Quicker</Text>
            <FeatherIcon
              name='chevron-right'
              color='#26374B'
              size={23}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop:15,
              paddingBottom:7
            }}
          >
            <Text style={styles?.drawer_item}>Newsroom</Text>
            <FeatherIcon
              name='chevron-right'
              color='#26374B'
              size={23}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop:15,
              paddingBottom:7
            }}
          >
            <Text style={styles?.drawer_item}>FAQ</Text>
            <FeatherIcon
              name='chevron-right'
              color='#26374B'
              size={23}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop:15,
              paddingBottom:7
            }}
          >
            <Text style={styles?.drawer_item}>Support</Text>
            <FeatherIcon
              name='chevron-right'
              color='#26374B'
              size={23}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop:15,
              paddingBottom:7
            }}
          >
            <Text style={styles?.drawer_item}>Settings</Text>
            <FeatherIcon
              name='chevron-right'
              color='#26374B'
              size={23}
            />
          </TouchableOpacity>*/}

          {/* <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 50
            }}
          >
            <LogoutButton setRootState={props.setRootState} />
          </TouchableOpacity> */}

          <View style={{
            // marginTop: 200,
            position: 'absolute',
            bottom: Platform.OS == 'ios' ? 100 : 60,
            left: Platform.OS == 'ios' ? 30 : 15,
            right: 0
          }}>
            {/* <Text>FSDFSD</Text> */}
            <LogoutButton setRootState={props.setRootState} navigation={props?.navigation} />

          </View>
        </View>

      </DrawerContentScrollView>
    </>
  )
}

const AppContainer = () => {
  return (
    <GestureHandlerRootView style={{
      flex: 1
    }}>

      <NavigationContainer

        ref={navigationRef}>
        <Drawer.Navigator
          drawerContent={(props: any) => (
            <DrawerCustomContent {...props} />
          )}
          screenOptions={{
            drawerPosition: 'left',
            drawerType: 'front',
            drawerStyle: {
              backgroundColor: "#FFFFFF", // Background color
              width: Dimensions.get('window').width * .80, // Adjust width as needed
              borderTopRightRadius: 50, // Apply border radius to top-right,
              borderBottomRightRadius: 50,
              // overflow: "hidden", // Ensure radius applies properly
            },

            // borderTopRightRadius: 20
          }}
        >
          <Drawer.Screen name="Home"
            options={{ headerShown: false }}
            component={RootNavigator} />
          <Drawer.Screen name="Profile"
            options={{ headerShown: false }}
            component={Profile} />
          <Drawer.Screen name="DriverEarnings"
            options={{ headerShown: false }}
            component={DriverEarning} />
          <Drawer.Screen name="MyOrdersList"
            options={{ headerShown: false }}
            component={MyOrdersList} />
          <Drawer.Screen name="MyOrders"
            options={{ headerShown: false }}
            component={MyOrders} />
          <Drawer.Screen name="Payout"
            options={{ headerShown: false }}
            component={PayoutPage} />
          <Drawer.Screen name="DriverChat"
            options={{ headerShown: false }}
            component={DriverChatPage} />
          <Drawer.Screen name="Withdrawalmethod"
            options={{ headerShown: false }}
            component={WithdrawalMethod} />
        </Drawer.Navigator>
        {/* <RootNavigator /> */}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default AppContainer;
