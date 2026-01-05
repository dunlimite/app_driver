/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { useBusiness } from 'ordering-components-external/native';

import settings from '../config.js'
import { MyOrders as MyOrdersController } from 'ordering-ui-native-release/themes/original';

const MyOrders = ({ navigation }: any) => {
  const [businessState] = useBusiness();
  const myOrderProps = {
    navigation,
    businessId: businessState?.business?.id,
    franchiseId: settings?.franchiseSlug,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) {
        return;
      }
      navigation.navigate(page, params);
    },
    handleRedirectToCheckout: (uuid: number) => {
      if (!uuid) return
      navigation.navigate('CheckoutNavigator', { cartUuid: uuid })
    }
  };

  return (
    <MyOrdersController {...myOrderProps} />
  );
};

export default MyOrders;
