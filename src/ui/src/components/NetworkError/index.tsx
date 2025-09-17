import React from 'react'
import { useLanguage } from '@components'
import { Dimensions, ImageBackground, StyleSheet, View, Text } from 'react-native'
import RNRestart from 'react-native-restart'
import { useTheme } from 'styled-components/native'
import { NoNetworkParams } from '../../types'
import { Container, ImageContainer } from './styles'
import { OText, OIcon, OButton } from '../shared'

export const NetworkError = (props: NoNetworkParams) => {
  const {
    image
  } = props
  const theme = useTheme()
  const [, t] = useLanguage()

  const noNetworkImage = image || theme.images.general.noNetwork
  const deviceWidth = Dimensions.get('window').width

  const styles = StyleSheet.create({
    btn: {
      borderRadius: 7.6,
      height: 52,
      left: 0,
      width: '100%'
    },
    btnText: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Outfit',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 18,

    },
  })

  return (
    <>
      <ImageBackground

        source={require('../../../../assets/images/enternet.png')}
        style={{
          width: deviceWidth,
          height: Dimensions.get('window').height,
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        resizeMode='cover'
      >

        <View style={{
          position: 'absolute',
          bottom: 180
        }}>
          <Text style={{
            fontSize: 22,
            color: '#FFFFFF',
            fontWeight: '400',
            fontFamily: 'Outfit',
            textAlign: 'center'
          }}>Connection Failed</Text>
          <Text style={{
            fontSize: 17,
            color: '#FFFFFF',
            fontWeight: '400',
            fontFamily: 'Outfit',
            textAlign: 'center',
            lineHeight: 22,
            marginTop: 15
          }} >Could not connect to the {'\n'} network,Please check and try {'\n'} again.</Text>
        </View>
        <OButton
          onClick={() => RNRestart.Restart()}
          text={t('Next', ' RETRY')}
          bgColor={theme.colors.primary}
          borderColor={theme.colors.primary}
          textStyle={styles.btnText}
          imgRightSrc={null}
          //   isLoading={formState?.loading || loading}
          style={styles.btn}
          parentStyle={{
            bottom: 70,
            position: 'absolute'
          }}

        />
      </ImageBackground>


    </>

  )
}
