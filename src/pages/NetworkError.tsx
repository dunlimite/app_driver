import React from 'react';
import { Platform } from 'react-native'
import { SafeAreaContainer, NetworkError as NetworkErrorScreen } from 'ordering-ui-native-release/themes/original'

const NetworkError = () => {
  return (
    <SafeAreaContainer
      style={{ paddingTop: Platform.OS === 'ios' ? 0 : 20 }}
    >
      <NetworkErrorScreen />
    </SafeAreaContainer>
  );
};

export default NetworkError;
