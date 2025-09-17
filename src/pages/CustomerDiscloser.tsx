
import React from 'react';
import { Platform } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Container, SafeAreaContainerLayout, SignupDetails,CustomerDiscloser } from '@ui';
const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const CustomerDiscloserDetials = (props: any) => {
  const theme = useTheme();

  return (

      <SafeAreaContainerLayout>
        <CustomerDiscloser
          {...props}
        />
        </SafeAreaContainerLayout>

  );
};

export default CustomerDiscloserDetials;
