import React, { useState, useEffect } from 'react'
import { MessageListing, Container } from 'ordering-ui-native-release/themes/original';
import settings from '../config.js'
import { RefreshControl } from 'react-native';
interface Props {
  navigation: any;
  route: any;
}

const Messages = (props: Props) => {
  const messagesProps = {
    ...props,
    franchiseId: settings?.franchiseSlug,
  }

  const [refreshing] = useState(false);
  const [refreshOrders, setRefreshOrders] = useState(false)

  const handleOnRefresh = () => {
    setRefreshOrders(true);
  }

  return (
    <Container
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => handleOnRefresh()}
        />
      }>
      <MessageListing {...messagesProps} refreshOrders={refreshOrders} setRefreshOrders={setRefreshOrders} />
    </Container>
  )
}

export default Messages
