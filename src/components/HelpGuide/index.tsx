import React from 'react'
import { useLanguage } from 'ordering-components-external/native'
import { OText, OButton, OIcon } from 'ordering-ui-native-release/themes/original'
import { useTheme } from 'styled-components/native'
import { StyleSheet } from 'react-native'
import {
  Content
} from './styles'

export interface HelpGuideParams {
	navigation: any;
}

export const HelpGuide = (props: HelpGuideParams) => {
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
      height: 120,
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
      <OText size={22} weight={600}>{t('GUIDE_TO_ORDERING', 'Guide to Ordering')}</OText>
      <Content>
        <OText mBottom={20}>
        Ofrecemos a todos nuestros usuarios la opción de realizar sus pagos a traves de simpe movil, 
        estos son los pasos a seguir.
        </OText>
        <OText mBottom={20}>
        1- Al finalizar su compra elija la opcion de pago en efectivo. 
        </OText>
        <OText mBottom={20}>
        2- Cuando el repartidor sea asignado debera comunicarle a través del chat que desea realizar su pago 
        por simpe movil.
        </OText>
        <OText mBottom={20}>
        3- El pedido se entregara hasta que el repartidor reciba la notificación del deposito.
        </OText>        
      </Content>
    </>
  )
}
