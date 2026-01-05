import * as React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Platform } from 'react-native';
import { UpsellingProducts as Upselling } from 'ordering-ui-native-release/themes/original';

interface Props {
  navigation: any;
  route: any;
}

const UpsellingPage = (props: Props) => {
  const theme = useTheme()

  const upsellingProps = {
    ...props,
    ...props.route.params,
    isPage: true,
    onGoBack: props?.navigation?.canGoBack()
      ? () => props?.navigation?.goBack()
      : () => props?.navigation?.navigate('BottomTab'),
    onNavigationRedirect: (route: string, params: any) =>
      props.navigation.navigate(route, params),
  };

  const UpsellingView = styled.SafeAreaView`
    flex: 1;
    background-color: ${theme.colors.backgroundPage};
  `;

  return (
    <UpsellingView>
      <Upselling {...upsellingProps} />
    </UpsellingView>
  );
};

export default UpsellingPage;
