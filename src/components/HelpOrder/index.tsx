import React from 'react'
import { useLanguage } from 'ordering-components-external/native'
import { OText, OButton, OIcon } from 'ordering-ui-native-release/themes/original'
import { useTheme } from 'styled-components/native'
import { StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'

import {
  Content
} from './styles'

export interface HelpOrderParams {
	navigation: any;
}

export const HelpOrder = (props: HelpOrderParams) => {
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
      height: 120
    },
    videoStyle: {
      height: 200,
      marginVertical: 20
    }
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
      <OText size={22} weight={600}>{t('HELP_WITH_ORDER', 'Help with an order')}</OText>
      <Content>
        <OText weight='bold' mBottom={20}>
        Quienes somos  
        </OText>
        <OText mBottom={20}>
        Vanvi es una aplicacion 100% costarricense con un enfoque claro: 
        ofrecer un servicio de calidad excepcional a todos nuestros usuarios. 
        Estamos comprometidos en ser la plataforma donde encontraras una amplia variedad de promociones 
        y ofertas exclusivas, ademas de emocionantes oportunidades para que nuestros usuarios participen 
        y ganen a traves de diferentes dinamicas.
        </OText>        
        <OText mBottom={20}>
        En Vanvi, no solo nos preocupamos por brindarte beneficios y entretenimiento, 
        sino que tambien estamos comprometidos con nuestra comunidad. 
        A traves de nuestro programa "Vanvi Care," participamos activamente en obras sociales para brindar 
        ayuda a la poblacion más vulnerable de Costa Rica. 
        Creemos en hacer una diferencia en la vida de las personas y contribuir al bienestar de nuestra sociedad. 
        </OText>
        <OText mBottom={20}>
        Te invitamos a seguirnos en nuestras redes sociales para estar al tanto de todas nuestras novedades, 
        promociones y sorpresas. En Vanvi, estamos aquí para ayudarte y responder tus consultas en cualquier 
        momento. Nuestra mision es proporcionarte una experiencia excepcional y ser una parte activa en el 
        crecimiento y el bienestar de nuestra comunidad. ¡Gracias por elegirnos!
        </OText>
     
      </Content>
    </>
  )
}
