/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Dimensions, Platform, StyleSheet, Vibration, View } from 'react-native';
import { useLanguage, useOrder, useConfig } from 'ordering-components-external/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import styled, { useTheme } from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { OIcon, OText } from 'ordering-ui-native-release/themes/original';

import BusinessList from '../pages/BusinessesListing';
import BusinessListingSearch from '../pages/BusinessListingSearch';
import MyOrders from '../pages/MyOrders';
import CartList from '../pages/CartList';
import Profile from '../pages/Profile';
import Wallets from '../pages/Wallets';
import settings from '../config.js'
import BusinessProductsList from '../pages/BusinessProductsList';

const Tab = createMaterialBottomTabNavigator();

const BottomNavigator = () => {
  const theme = useTheme();
  const [{ configs }] = useConfig()
  const isWalletEnabled = configs?.cash_wallet?.value && configs?.wallet_enabled?.value === '1' && (configs?.wallet_cash_enabled?.value === '1' || configs?.wallet_credit_point_enabled?.value === '1')
  const isHideWalletMenu = !!theme?.bar_menu?.components?.wallet?.hidden || !isWalletEnabled
  const isChewLayout = theme?.header?.components?.layout?.type?.toLowerCase() === 'chew'
  const hideOrders = theme?.bar_menu?.components?.orders?.hidden
  const hideBrowse = theme?.bar_menu?.components?.browse?.hidden
  const hideCarts = theme?.bar_menu?.components?.my_carts?.hidden
  const hideProfile = theme?.bar_menu?.components?.profile?.hidden
  const isIos = Platform.OS === 'ios'
  const windowHeight = Dimensions.get('window').height;

  const hideAdvancedSearch = !!settings.franchiseSlug || !!settings.businessSlug
  const CartsLenght = styled.View`
    width: 10px;
    height: 10px;
    background-color: ${theme.colors.red};
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 10px;
    top: 7px;
  `;

  const [, t] = useLanguage();
  const [{ carts }, { refreshOrderOptions }] = useOrder();
  let cartsList =
    (carts &&
      Object.values(carts).filter((cart: any) => cart.products.length > 0)) ||
    [];

  cartsList = settings?.businessSlug
    ? cartsList.filter((cart: any) => cart?.business?.slug === settings?.businessSlug || parseInt(settings?.businessSlug) === cart?.business_id)
    : cartsList

  const iconWidth = isChewLayout ? 22 : 16

  const styles = StyleSheet.create({
    iconStyle: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      bottom: 10
    }
  })

  return (
    <Tab.Navigator
      initialRouteName={!!settings.businessSlug ? "Business" : "BusinessList"}
      activeColor={theme.colors.primary}
      barStyle={{ backgroundColor: theme.colors.white, height: !isIos ? 65 : isIos && windowHeight && windowHeight <= 667 ? 55 : 65 }}
      inactiveColor={theme.colors.disabled}
      sceneAnimationEnabled
      shifting={false}
    >
      {!!settings.businessSlug ? (
        <Tab.Screen
          name="Business"
          component={BusinessProductsList}
          listeners={{
            tabPress: () => Vibration.vibrate(100)
          }}
          options={{
            tabBarLabel: t('HOME', 'Home'),
            tabBarIcon: ({ color }) => (
              <View
                style={styles.iconStyle}>
                <OIcon
                  src={theme.images.general.tag_home}
                  width={iconWidth}
                  color={color}
                />
              </View>
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="BusinessList"
          component={BusinessList}
          listeners={{
            tabPress: () => Vibration.vibrate(100)
          }}
          options={{
            tabBarLabel: t('HOME', 'Home'),
            tabBarIcon: ({ color }) => (
              <View
                style={styles.iconStyle}>
                <OIcon
                  src={theme.images.general.tag_home}
                  width={iconWidth}
                  color={color}
                />
              </View>
            ),
          }}
        />
      )}
      {!hideAdvancedSearch && !hideBrowse && (
        <Tab.Screen
          name="BusinessSearch"
          component={BusinessListingSearch}
          listeners={{
            tabPress: () => Vibration.vibrate(100)
          }}
          options={{
            tabBarLabel: t('BROWSE', 'Browse'),
            tabBarIcon: ({ color }) => (
              <View
                style={styles.iconStyle}>
                <OIcon
                  src={theme.images.tabs.explorer}
                  width={iconWidth}
                  color={color}
                />
              </View>
            ),
          }}
        />
      )}
      {(!isChewLayout || (isChewLayout && !hideOrders)) && (
        <Tab.Screen
          name="MyOrders"
          component={MyOrders}
          listeners={{
            tabPress: () => Vibration.vibrate(100)
          }}
          options={{
            tabBarLabel: t('ORDERS', 'Orders'),
            tabBarIcon: ({ color }) => (
              <View
                style={styles.iconStyle}>
                <OIcon src={theme.images.tabs.orders} width={iconWidth} color={color} />
              </View>
            ),
          }}
        />
      )}
      {!hideCarts && (
        <Tab.Screen
          name="Cart"
          component={CartList}
          listeners={{
            tabPress: () => Vibration.vibrate(100)
          }}
          initialParams={{
            refreshOrderOptions
          }}
          options={{
            tabBarLabel: settings?.businessSlug
              ? t('MY_CART', 'My cart')
              : t('MY_CARTS', 'My carts'),
            tabBarIcon: ({ color }) => (
              <View
                style={{ ...styles.iconStyle, width: 52 }}>
                <OIcon
                  src={theme.images.tabs.my_carts}
                  width={iconWidth}
                  color={color}
                />
              </View>
            ),
            tabBarBadge: cartsList.length > 0 ? cartsList.length : undefined
          }}
        />
      )}
      {!isHideWalletMenu && (
        <Tab.Screen
          name="Wallets"
          component={Wallets}
          listeners={{
            tabPress: () => Vibration.vibrate(100)
          }}
          options={{
            tabBarLabel: t('WALLETS', 'Wallets'),
            tabBarIcon: ({ color }) => (
              <View
                style={styles.iconStyle}>
                <Ionicons
                  name={'wallet-outline'}
                  color={color}
                  size={iconWidth + 3}
                />
              </View>
            ),
          }}
        />
      )}
      {!hideProfile && (
        <Tab.Screen
          name="Profile"
          component={Profile}
          listeners={{
            tabPress: () => Vibration.vibrate(100)
          }}
          options={{
            tabBarLabel: t('PROFILE', 'Profile'),
            tabBarIcon: ({ color }) => (
              <View
                style={styles.iconStyle}>
                <FeatherIcon
                  name={'user'}
                  color={color}
                  size={iconWidth + 3}
                />
              </View>
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default BottomNavigator;
