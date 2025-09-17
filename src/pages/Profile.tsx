import * as React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import settings from '../config.json'
import { useLanguage, useConfig, useSession } from '@components';
import {
  UserProfileForm as ProfileController,
  SafeAreaContainerLayout,
  OText,
  OIconButton
} from '@ui';
const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
`;

interface Props {
  navigation: any;
  route: any;
}

const Profile = (props: Props) => {
  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [{ user }, { refreshUserInfo }] = useSession();
  const navigation = useNavigation();

  const profileProps = {
    ...props,
    useSessionUser: true,
    useValidationFields: true,
    isFocused: navigation.getState()?.routes[navigation.getState()?.index]?.name === 'Profile',
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) =>
      props.navigation.navigate(route, params),
    isShowDriverStatus: !configs?.available_status_enabled || configs?.available_status_enabled?.value !== '0'
  };

  const styles = StyleSheet.create({

    title: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 26,
      color: theme.colors.textGray,
    },
    header: {
      marginBottom: 30,
      display: 'flex',
      flexDirection: 'row',
      marginHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ECEEEF',
      marginTop: 30,

      // marginTop:40
    },
    arrowLeft: {
      maxWidth: 40,
      height: 25,
      justifyContent: 'flex-end',
      // marginBottom: moderateScale(20),
    },
  });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const isProfileRoute = navigation.getState()?.routes[navigation.getState()?.index]?.name === 'Profile'
      isProfileRoute && user?.id && refreshUserInfo()
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <KeyboardView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ backgroundColor: theme.colors.backgroundLight }}>
        {/* <SafeAreaContainerLayout
          style={{
            backgroundColor: theme.colors.backgroundLight,
          }}> */}

        <ProfileController {...profileProps} />
        {/* </SafeAreaContainerLayout> */}
      </KeyboardView>
    </>
  );
};

export default Profile;
