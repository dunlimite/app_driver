import React from 'react';
import { OrderDetails as OrderDetailsController } from '../components/OrderDetails';
import { Platform } from 'react-native'
import styled from 'styled-components/native';
import settings from '../config';

const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
  flex-shrink: 1;
`;

const OrderDetails = ({ navigation, route }: any) => {
  const orderDetailsProps = {
    navigation,
    orderId: route.params?.orderId,
    isFromCheckout: route.params?.isFromCheckout,
    isFromRoot: route.params?.isFromRoot,
    goToBusinessList: route?.params?.goToBusinessList,
    hideViaText: settings?.project === 'chewproject',
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      navigation.navigate(page, params);
    }
  };

  return (
    <SafeAreaContainer>
      <KeyboardView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <OrderDetailsController {...orderDetailsProps} />
      </KeyboardView>
    </SafeAreaContainer>
  );
};

export default OrderDetails;
