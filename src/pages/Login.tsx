import React from 'react';
import { Platform } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Container, LoginForm, SafeAreaContainerLayout } from '@ui';
import settings from '../config.json'
import { navigate } from '../navigators/NavigationRef';

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const Login = ({ navigation, route }: any) => {
  const theme = useTheme();

  const loginProps = {
    navigation,
    useLoginByCellphone: true,
    useLoginByEmail: true,
    allowedLevels: [4],
    validateDeveloperMode: settings.validate_developer_mode,
    onNavigationRedirect: (page: string) => {
      if (!page) return;
      navigation.navigate(page);
    },
    notificationState: route?.params?.notification_state,
    onNavigationSignup: () => {
      navigation.navigate('Signup')
    }
    // useRootPoint: settings.use_root_point
  };

  return (
    // <KeyboardView
    //   enabled
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaContainerLayout>

        <LoginForm {...loginProps} />

      </SafeAreaContainerLayout>
    // </KeyboardView>

  );
};

export default Login;
