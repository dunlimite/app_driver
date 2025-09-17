import React, { useContext } from 'react';
import { View, Platform, StyleSheet, Dimensions } from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome5'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTheme } from 'styled-components/native';

import { useLanguage } from '@components';
import { OIcon, OText } from '@ui';

import Profile from '../pages/Profile';
import MyOrders from '../pages/MyOrders';
import Messages from '../pages/Messages';
import MapView from '../pages/MapView'
import RequestPermissions from '../pages/RequestPermissions';
import { PermissionsContext } from '../context/PermissionsContext';

import { BottomTabIconContainer } from './styles';

const Tab = createMaterialBottomTabNavigator();

const BottomNavigator = () => {
  const [, t] = useLanguage();
  const theme = useTheme();
  const { isGrantedPermissions } = useContext(PermissionsContext);

  const isIos = Platform.OS === 'ios';
  const windowHeight = Dimensions.get('window').height;

  const styles = StyleSheet.create({
    bottomTabs: {
      backgroundColor: theme.colors.white,
      borderTopWidth: 1,
      borderTopColor: theme.colors.tabBar,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.36,
      shadowRadius: 6.87,
      elevation: 11,
      paddingBottom: isIos ? windowHeight < 845 ? 0 : 30 : 0
    },
  });

  const IconComponent: any = (props: any) => {
    return props.type === 'orders'
      ? <IconFA {...props} />
      : <OIcon {...props} />
  }

  const iconsData: any = {
    orders: {
      icon: {
        name: 'list-alt',
        size: 20,
        style: { marginBottom: 2 }
      },
      text: t('ORDERS', 'Orders')
    },
    mapview: {
      icon: {
        src: theme.images.general.map,
        width: 20,
        height: 20,
        style: { marginBottom: 1 }
      },
      text: t('MAP_VIEW', 'Map view')
    },
    messages: {
      icon: {
        src: theme.images.general.messages,
        width: 20,
        height: 20,
        style: { marginBottom: 1 }
      },
      text: t('MESSAGES', 'Messages')
    },
    profile: {
      icon : {
        src: theme.images.general.profile,
        width: 23,
        height: 23,
        style: { marginBottom: 1 }
      },
      text: t('PROFILE', 'Profile')
    }
  }

  const BottomTabIconComponent = ({ color, focused, tabName }: any) => (
    <BottomTabIconContainer isIos={isIos}>
      <View style={{ alignItems: 'center' }}>
        <IconComponent
          type={tabName}
          color={color}
          {...iconsData[tabName].icon}
        />
        <OText
          size={12}
          color={focused ? theme.colors.textGray : color}
        >
          {iconsData[tabName].text}
        </OText>
      </View>
    </BottomTabIconContainer>
  )

  return (
    <Tab.Navigator
      initialRouteName="Orders"
      activeColor={theme.colors.primary}
      barStyle={styles.bottomTabs}
      labeled={false}
      inactiveColor={theme.colors.disabled}>
      <Tab.Screen
        name="Orders"
        component={MyOrders}
        options={{
          tabBarIcon: ({ color, focused }: any) => (
            <BottomTabIconComponent
              tabName='orders'
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MapView"
        component={isGrantedPermissions
          ? MapView
          : RequestPermissions}
        options={{
          tabBarIcon: ({ color, focused }: any) => (
            <BottomTabIconComponent
              tabName='mapview'
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarIcon: ({ color, focused }: any) => (
            <BottomTabIconComponent
              tabName='messages'
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color, focused }: any) => (
            <BottomTabIconComponent
              tabName='profile'
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
