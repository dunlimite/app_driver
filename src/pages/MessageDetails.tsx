import React from 'react'
import { Platform } from 'react-native'
import { Messages as MessagesController } from 'ordering-ui-native-release/themes/original';
import styled from 'styled-components/native';

const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding-top: ${Platform.OS === 'ios' ? '0px' : '24px'};
`;


const MessagesDetails = (props: any) => {
  const messagesProps = {
    ...props,
    type: props.route?.params?.type,
    orderId: props.route?.params?.orderId,
    messages: props.route?.params?.messages,
    order: props.route?.params?.order,
    business: props.route?.params?.business,
    driver: props.route?.params?.driver,
    setMessages: props.route?.params?.setMessages,
    onClose: props.route?.params?.onClose
  }

  return (
    <SafeAreaContainer>
      <MessagesController {...messagesProps} />
    </SafeAreaContainer>
  )
}

export default MessagesDetails
