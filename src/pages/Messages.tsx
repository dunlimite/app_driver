import React from 'react';
import {
  MessagesOption,
  SafeAreaContainerLayout,
} from '@ui';

const Messages = ({ navigation }: any) => {
  const MyOrderProps = {
    navigation,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return;
      navigation.navigate(page, params);
    },
    firstFetch: 'orders',
    sortParams: {
      param: 'last_direct_message_at',
      direction: 'asc',
    },
    paginationSettings: {
      page: 1,
      pageSize: 10,
      controlType: 'infinity',
    },
  };

  return (
    <SafeAreaContainerLayout>
      <MessagesOption {...MyOrderProps} />
    </SafeAreaContainerLayout>
  );
};

export default Messages;
