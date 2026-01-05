import React from 'react'
import { Platform } from 'react-native'
import { MultiOrdersDetails as MultiOrdersDetailsController } from 'ordering-ui-native-release/themes/original'
import styled from 'styled-components/native';

const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding-top: ${Platform.OS === 'ios' ? '0px' : '24px'};
`;

const MultiOrdersDetails = ({ navigation, route }: any) => {
  const multiOrdersDetailsProps = {
    navigation,
    orderId: route?.params?.orderId,
    isFromMultiCheckout: route.params?.isFromMultiCheckout,
    onRedirectPage: () => navigation.navigate('BusinessList')
  }

  return (
    <SafeAreaContainer>
      <MultiOrdersDetailsController {...multiOrdersDetailsProps} />
    </SafeAreaContainer>
  )
}

export default MultiOrdersDetails
