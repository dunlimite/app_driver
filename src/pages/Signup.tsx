import React from 'react';
import { Platform } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import {
  Container,
  SafeAreaContainerLayout,
  SignUpDriver,
  SignupForm,
  StoreMethods
} from '@ui';
import { useSession } from '@components';

const { _removeStoreData } = StoreMethods;

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const Signup = (props: any) => {
  const [, { login }] = useSession();
  const theme = useTheme();

  const signupProps = {
    // navigation,
    // notificationState: route?.params?.notification_state,
    // signupLevel: 4,
    // onNavigationRedirect: (page: string) => {
    //   if (!page) return;
    // navigation.navigate(page);
    // },
    // handleSuccessSignup: (user: any) => {
    //   _removeStoreData('isGuestUser');

    //   if (user?.id && [4].includes(user?.level)) {
    //     login({
    //       user,
    //       token: user.session.access_token,
    //     });
    //   } else {
    //     navigation?.canGoBack() && navigation?.goBack();
    //   }
    // },
  };

  return (
 <SafeAreaContainerLayout>
        <SignUpDriver
          {...props}
        />
        </SafeAreaContainerLayout>

  );
};

export default Signup;
