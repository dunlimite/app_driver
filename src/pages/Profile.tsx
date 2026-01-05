import * as React from 'react';
import { useTheme } from 'styled-components/native';
import { useConfig, useLanguage } from 'ordering-components-external/native';
import { TouchableOpacity, Vibration, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  UserProfile as ProfileController,
  Container,
  HeaderTitle,
} from 'ordering-ui-native-release/themes/original';
import Intercom from '@intercom/intercom-react-native';

interface Props {
  navigation: any;
  route: any;
}

const Profile = (props: Props) => {
  const [, t] = useLanguage();
  const [{ configs }] = useConfig()
  const theme = useTheme()
  const isIntercomEnabled = configs?.intercom_enabled?.value === '1'
  const pkg = require('../../package.json')

  const profileProps = {
    ...props,
    useSessionUser: true,
    useValidationFields: true,
    refreshSessionUser: true,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) =>
      props.navigation.navigate(route, params),
    handleRemoveAccount: props?.route?.params?.handleRemoveAccount,
    appVersion: pkg.version
  };

  const handleOpenIntercomChat = () => {
    Vibration.vibrate()
    Intercom.displayMessenger()
  }
  React.useEffect(() => {
    return (() => {
      Intercom.hideIntercom()
    })
  }, [])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.backgroundPage,
      }}
    >
      <Container noPadding>
        <HeaderTitle ph={20} text={t('MY_PROFILE', 'My Profile')} />
        <ProfileController {...profileProps} />
      </Container>
      {isIntercomEnabled && (
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: theme.colors.primary,
            width: 50,
            height: 50,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={() => handleOpenIntercomChat()}
        >
          <Ionicons name='chatbox' size={30} color={theme.colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Profile;
