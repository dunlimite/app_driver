import React from 'react';
import { Platform } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import {
  LoginForm,
  Container,
  _setStoreData,
} from 'ordering-ui-native-release/themes/original';
import { useLanguage } from 'ordering-components-external/native';
import Intercom from '@intercom/intercom-react-native'

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const Login = ({ navigation, route }: any) => {
  const [, t] = useLanguage();
  const theme = useTheme();

  const loginProps = {
    navigation,
    useLoginByCellphone: true,
    loginButtonText: t('LOGIN', 'Login'),
    loginButtonBackground: theme.colors.primary,
    forgotButtonText: t('FORGOT_YOUR_PASSWORD', 'Forgot your password?'),
    registerButtonText: t('SIGNUP', 'Signup'),
    handleSuccessLogin: (user : any) => {
      const interParams: any = { userId: user?.id?.toString() }
      user?.email && (interParams.email = user?.email)
      Intercom.registerIdentifiedUser(interParams)
    },
    onNavigationRedirect: (page: string) => {
      if (!page) {
        return;
      }
      navigation.navigate(page);
    },
    notificationState: route?.params?.notification_state,
  };

  _setStoreData('notification_state', route?.params?.notification_state);

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Container>
        <LoginForm {...loginProps} />
      </Container>
    </KeyboardView>
  );
};

export default Login;
