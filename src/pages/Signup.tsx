import React from 'react';
import {
  SignupForm,
  Container,
  _setStoreData,
  _removeStoreData,
} from 'ordering-ui-native-release/themes/original';
import styled from 'styled-components/native';
import { useLanguage, useSession } from 'ordering-components-external/native';
import { Platform } from 'react-native';
import Intercom from '@intercom/intercom-react-native';

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const Signup = (props: any) => {
  const [, t] = useLanguage();
  const [, { login }] = useSession();

  const signupProps = {
    ...props,
    useChekoutFileds: true,
    loginButtonText: t('LOGIN', 'Login'),
    signupButtonText: t('SIGNUP', 'Signup'),
    useSignupByEmail: true,
    notificationState: props.route?.params?.notification_state,
    onNavigationRedirect: (page: string) => {
      if (!page) {
        return;
      }
      props.navigation.navigate(page);
    },
    handleSuccessSignup: (user: any) => {
      _removeStoreData('isGuestUser');
      if (user?.id) {
        login({
          user,
          token: user.session.access_token,
        });
      }
      const interParams: any = { userId: user?.id?.toString() }
      user?.email && (interParams.email = user?.email)
      Intercom.registerIdentifiedUser(interParams)
    },
  };

  _setStoreData('notification_state', props.route?.params?.notification_state);

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Container>
        <SignupForm {...signupProps} />
      </Container>
    </KeyboardView>
  );
};

export default Signup;
