import React from 'react';
import {
  OrderMessage as OrderMessageController,
  SafeAreaContainer,
} from '@ui';

const OrderMessage = ({ navigation, route }: any) => {
  const { orderId, isFromCheckout, setOrders } = route.params;
  const orderDetailsProps = {
    navigation,
    orderId,
    isFromCheckout,
    setOrders,
    isDisabledOrdersRoom: true,
  };

  return (
    <SafeAreaContainer>
      <OrderMessageController {...orderDetailsProps} />
    </SafeAreaContainer>
  );
};

export default OrderMessage;
