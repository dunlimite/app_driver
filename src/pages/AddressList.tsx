import React from 'react';
import { AddressList as AddressListController } from 'ordering-ui-native-release/themes/original';
import { useSession } from 'ordering-components-external/native';
import styled from 'styled-components/native';
import { Platform } from 'react-native'

const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding-top: ${Platform.OS === 'ios' ? '0px' : '10px'};
`;

const AddressList = ({ route, navigation }: any) => {
  const [{ user }] = useSession();
  const addressListProps = {
    navigation,
    route,
    userId: user?.id,
    isGoBack: route?.params?.isGoBack,
    isFromBusinesses: route?.params?.isFromBusinesses,
    isFromProductsList: route?.params?.isFromProductsList,
    isFromCheckout: route?.params?.isFromCheckout,
    afterSignup: route?.params?.afterSignup,
  };

  return (
    <SafeAreaContainer>
      <AddressListController {...addressListProps} />
    </SafeAreaContainer>
  )
};

export default AddressList;
