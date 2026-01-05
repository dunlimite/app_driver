import * as React from 'react';
import { StackActions } from '@react-navigation/native';
import { Platform, RefreshControl } from 'react-native'
import styled, { useTheme } from 'styled-components/native';
import { useLanguage } from 'ordering-components-external/native';
import {
  CartContent,
  Container,
  HeaderTitle,
  OButton
} from 'ordering-ui-native-release/themes/original';

import settings from '../config.js'
import { View } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
interface Props {
  navigation: any;
  route: any;
}

const CartList = (props: Props) => {
  const [, t] = useLanguage();
  const theme = useTheme()
  const [refreshing] = React.useState(false);

  const handleOnRefresh = () => {
    props?.route?.params?.refreshOrderOptions?.()
  }

  const cartProps = {
    ...props,
    isFranchiseApp: !!settings?.franchiseSlug,
    singleBusiness: settings?.businessSlug,
    onNavigationRedirect: (route: string, params: any, replace: boolean) => {
      if (replace) {
        props.navigation.dispatch(StackActions.replace(route, params))
        return
      }
      props.navigation.navigate(route, params)
    },
  };

  const isChewLayout = theme?.header?.components?.layout?.type === 'chew'
  const hideCarts = theme?.bar_menu?.components?.my_carts?.hidden

  const SafeAreaContainer = styled.SafeAreaView`
    flex: 1;
    background-color: ${(props: any) => props.theme.colors.backgroundPage};
  `;

  const KeyboardView = styled.KeyboardAvoidingView`
    flex-grow: 1;
    flex-shrink: 1;
  `;

  return (
    <SafeAreaContainer>
      <KeyboardView
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      >
        <Container
          noPadding
          disableFlex={Platform.OS === 'ios'}
          pt={0}
          nestedScrollEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => handleOnRefresh()}
            />
          }
        >
          <View style={{
            ...{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            },
            ...props.titleStyle
          }}>
            {hideCarts && !isChewLayout && (
              <OButton
                imgLeftStyle={{ width: 18 }}
                imgRightSrc={null}
                style={{
                  borderWidth: 0,
                  width: 26,
                  height: 26,
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginTop: 50,
                }}
                useArrow
                onClick={() => props.navigation.goBack()}
                icon={AntDesignIcon}
                iconProps={{
                  name: 'arrowleft',
                  size: 26
                }}
              />
            )}
            <HeaderTitle text={settings?.businessSlug
              ? t('CART', 'Cart')
              : t('MY_CARTS', 'My carts')}
            />
          </View>
          <CartContent {...cartProps} />
        </Container>
      </KeyboardView>
    </SafeAreaContainer>
  );
};

export default CartList;
