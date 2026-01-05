import React from 'react'
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import {
  SafeAreaContainer,
  ReviewDriver as ReviewDriverController
} from 'ordering-ui-native-release/themes/original'

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

const ReviewDriver = ({navigation, route} : any) => {
  const reviewDriverProps = {
    navigation,
    order: route?.params?.order,
    onNavigationRedirect: (route: string, params: any) => navigation.navigate(route, params)
  }

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaContainer>
        <ReviewDriverController {...reviewDriverProps} />
      </SafeAreaContainer>
    </KeyboardView>
  )
}

export default ReviewDriver
