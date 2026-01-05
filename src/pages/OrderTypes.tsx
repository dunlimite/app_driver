import React from 'react';
import {
  Container,
  OrderTypeSelector,
} from 'ordering-ui-native-release/themes/original';

const OrderTypes = (props: any) => {
  const { route } = props;

  const typesProps = {
    ...props,
    configTypes: route?.params?.configTypes,
    setOrderTypeValue: route?.params?.setOrderTypeValue
  };
  return (
    <Container>
      <OrderTypeSelector {...typesProps} />
    </Container>
  );
};

export default OrderTypes;
