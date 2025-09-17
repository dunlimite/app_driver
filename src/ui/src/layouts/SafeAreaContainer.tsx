import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { useNetInfo } from '@react-native-community/netinfo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding-top:${Platform.OS === 'android' ? StatusBar?.currentHeight : 0}
`;

export const SafeAreaContainerLayout = (props: any) => {
  const theme = useTheme();
  const netInfo = useNetInfo()

  const [statusColor, setStatusColor] = useState<string | null>(null)
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'Portrait'
      : 'Landscape',
  );

  Dimensions.addEventListener('change', ({ window: { width, height } }) => {
    if (width < height) {
      setOrientation('Portrait');
    } else {
      setOrientation('Landscape');
    }
  });

  useEffect(() => {
    if (netInfo.isConnected === false) {
      setStatusColor(theme.colors.danger500)
    }

    if (netInfo.isConnected && statusColor) {
      setStatusColor(theme.colors.success500)
      setTimeout(() => {
        setStatusColor(null)
      }, 2000);
    }
  }, [netInfo.isConnected])

  return (
    <SafeAreaContainer  >
      {/* <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      > */}
      <KeyboardAwareScrollView contentContainerStyle={{
        flexGrow: 1
      }}
        enableOnAndroid={true}
        extraScrollHeight={5}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled" // Ensures taps work properly
        keyboardOpeningTime={0} // Helps prevent unwanted scroll behavior on iOS
        showsVerticalScrollIndicator={false}

      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 0,
            paddingBottom: 0,
            // flex: 1,
          }}

        >
          <StatusBar
            barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
            {...statusColor && ({ backgroundColor: statusColor })}
          />
          {props.children}
        </View>
      </KeyboardAwareScrollView>
      {/* </KeyboardAvoidingView> */}
    </SafeAreaContainer>
  );
};
