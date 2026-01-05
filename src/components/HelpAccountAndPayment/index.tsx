import React from 'react'
import { useLanguage } from 'ordering-components-external/native'
import { OText, OButton, OIcon } from 'ordering-ui-native-release/themes/original'
import { useTheme } from 'styled-components/native'
import { StyleSheet, Linking, View, TouchableOpacity } from 'react-native'

import {
  Content
} from './styles'

export interface HelpAccountAndPaymentParams {
	navigation: any;
}

export const HelpAccountAndPayment = (props: HelpAccountAndPaymentParams) => {
  const {
    navigation
  } = props
  const [, t] = useLanguage()
  const theme = useTheme()

  const styles = StyleSheet.create({
    btnBackArrow: {
      borderWidth: 0,
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.white,
      shadowColor: theme.colors.white,
      display: 'flex',
      justifyContent: 'flex-start',
      paddingLeft: 0,
    },
    imageStyle: {
      width: '100%',
      height: 300,
      marginVertical: 20
    },
  })

  const goToBack = () => navigation?.canGoBack() && navigation.goBack()

  return (
    <>
      <OButton
        imgLeftSrc={theme.images.general.arrow_left}
        imgRightSrc={null}
        style={styles.btnBackArrow}
        onClick={() => goToBack()}
      />
      <OText size={22} weight={600}>{t('ACCOUNT_PAYMENT_OPTIONS', 'Account and Payment Options')}</OText>
      <Content>
      <OText mBottom={20}>
      Para cualquier duda o situacion con cualquier pedido puedes comunicarnoslo a traves
      de los siguientes canales, nuestro chat de WhatsApp o correo electronico.
      </OText>
      <OText mBottom={20}>
      <OText style={{ color: '#1977F2' }} onPress={() => Linking.openURL('https://wa.link/nklahx')} >Cont&aacute;ctanos por Whatsapp</OText>
      </OText>
      <OText mBottom={20}>
      info@vanvidelivery.com
      </OText> 

      </Content>
    </>
  )
}
