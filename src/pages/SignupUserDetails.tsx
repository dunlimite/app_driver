
import React from 'react';
import { Platform } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Container, SafeAreaContainerLayout, SignupDetails } from '@ui';

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const SignupUserDetails = (props: any) => {
  const theme = useTheme();

  return (

      <SafeAreaContainerLayout>
        <SignupDetails
          {...props}
        />
        </SafeAreaContainerLayout>

  );
};

export default SignupUserDetails;
