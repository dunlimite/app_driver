import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Platform } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useTheme } from 'styled-components/native';
import { useLanguage } from 'ordering-components-external/native';
import { OIconButton, _setStoreData } from 'ordering-ui-native-release/themes/original';
import { DeviceOrientationMethods, OIcon } from 'ordering-ui-native-release'
import IconAntDesign from 'react-native-vector-icons/AntDesign'

const { useDeviceOrientation } = DeviceOrientationMethods
const IntroductoryTutorial = ({ navigation, route }: any) => {
  const [, t] = useLanguage();
  const theme = useTheme();
  const [orientationState] = useDeviceOrientation();
  const [showSkipButton, setShowSkipButton] = useState(true)

  const WIDTH_SCREEN = orientationState?.dimensions?.width
  const HEIGHT_SCREEN = orientationState?.dimensions?.height

  const setTutorial = route?.params?.setTutorial;
  const data = [
    {
      key: 1,
      title: t('DELIVERY_BY_ADDRESS', 'Delivery by Address'),
      text: t('DELIVERY_BY_ADDRESS_INST', 'DELIVERY_BY_ADDRESS_INST'),
      image: theme.images.tutorials.slide1,
      bg: theme.colors.white,
    },
    {
      key: 2,
      title: t('SELECT_A_BUSINESS', 'SELECT_A_BUSINESS'),
      text: t('SELECT_A_BUSINESS_INST', 'SELECT_A_BUSINESS_INST'),
      image: theme.images.tutorials.slide2,
      bg: theme.colors.white,
    },
    {
      key: 3,
      title: t('BUSINESS_MENU', 'BUSINESS_MENU'),
      text: t('BUSINESS_MENU_INST', 'BUSINESS_MENU_INST'),
      image: theme.images.tutorials.slide3,
      bg: theme.colors.white,
    },
    {
      key: 4,
      title: t('PRODUCT_LIST', 'PRODUCT_LIST'),
      text: t('PRODUCT_LIST_INST', 'PRODUCT_LIST_INST'),
      image: theme.images.tutorials.slide4,
      bg: theme.colors.white,
    },
    {
      key: 5,
      title: t('CHECKOUT_SCREEN', 'CHECKOUT_SCREEN'),
      text: t('CHECKOUT_SCREEN_INST', 'CHECKOUT_SCREEN_INST'),
      image: theme.images.tutorials.slide5,
      bg: theme.colors.white,
    },
    {
      key: 6,
      title: t('TUTORIAL_ORDER_COMPLETED', 'TUTORIAL_ORDER_COMPLETED'),
      text: t('TUTORIAL_ORDER_COMPLETED_INST', 'TUTORIAL_ORDER_COMPLETED_INST'),
      image: theme.images.tutorials.slide6,
      bg: theme.colors.white,
    },
  ];
  type Item = typeof data[0];
  const styles = StyleSheet.create({
    slide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 80,
    },
    image: {
      position:'absolute',
      flex: 0,
      top: 40,
      width: '100%',
      height: '70%',
      resizeMode: (WIDTH_SCREEN > 1080)  ? 'contain' : 'cover',
      marginTop: 10
    },
    text: {
      position:'absolute',
      color: theme.colors.colorTextTutorial,
      fontSize: 15,
      fontFamily: 'Poppins',
      bottom: HEIGHT_SCREEN * .13,
      textAlign: 'left',
      width: WIDTH_SCREEN * .85
    },
    title: {
      position:'absolute',
      bottom: HEIGHT_SCREEN * .22,
      fontFamily: 'Poppins',
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.colorTextTutorial,
      textAlign: 'left',
      width: WIDTH_SCREEN* .85
    },
    buttonCircle: {
      top: 3,
      minWidth: 90,
      maxWidth: 90,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    tutorialText: {
      fontSize: 18,
      fontWeight: '300',
      color: theme.colors.primary,
    },
  });

  const _renderItem = ({ item }: { item: Item }) => {
    return (
      <View
        style={{
          ...styles.slide,
          backgroundColor: item.bg,
        }}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.text} numberOfLines={3}>{item.text}</Text>
      </View>
    );
  };

  const RenderNextButton = () => {
    return (
      <View style={{
        ...styles.buttonCircle,
        right: 0
      }}>
        <Text style={styles.tutorialText}>{t('TUTORIAL_NEXT', 'Next')}{' '}
        <IconAntDesign
          name='arrowright'
          color={theme.colors.primary}
          size={16}
        />
        </Text>
      </View>
    );
  };

  const RenderSkipButton = () => {
    return (
      <View style={{
        ...styles.buttonCircle,
        marginLeft: Platform.OS === 'ios' ? 0 : WIDTH_SCREEN * .45,
        start: Platform.OS === 'ios' ? WIDTH_SCREEN * 0.45 : 0
      }}>
        <Text style={styles.tutorialText}>
          {t('TUTORIAL_SKIP', 'Skip')}
        </Text>
      </View>
    );
  };

  const RenderPrevButton = () => {
    return (
      <View style={{
        ...styles.buttonCircle,
        start: WIDTH_SCREEN * 0.7
      }}>
        <Text style={styles.tutorialText}>{t('TUTORIAL_BACK', 'Back')}</Text>
      </View>
    );
  };

  const RenderDoneButton = () => {
    return (
      <View style={{
        ...styles.buttonCircle,
        right: 0
      }}>
        <Text style={styles.tutorialText}>{t('TUTORIAL_DONE', "Let's start!")}</Text>
      </View>
    );
  };

  const _onDone = () => {
    setTutorial(false);
    _setStoreData('isTutorial', false);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      <AppIntroSlider
        renderItem={_renderItem}
        data={data}
        onDone={_onDone}
        activeDotStyle={{
          backgroundColor: theme.colors.primary,
          position:'relative',
          right: WIDTH_SCREEN * 0.29
        }}
        dotStyle={{
          backgroundColor: 'lightgray',
          position:'relative',
          right: WIDTH_SCREEN * 0.29
        }}
        renderDoneButton={RenderDoneButton}
        renderNextButton={RenderNextButton}
        renderSkipButton={RenderSkipButton}
        showSkipButton={showSkipButton}
        onSlideChange={(index) =>{
          index >= 1 ? setShowSkipButton(false) : setShowSkipButton(true)
        }}
      />
    </View>
  );
};
export default IntroductoryTutorial;
