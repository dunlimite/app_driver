import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  View,
  ImageSourcePropType,
  Platform
} from 'react-native';
import { HomeView } from 'ordering-ui-native-release/themes/original';
import { useTheme } from 'styled-components/native';
import settings from '../config';
export const Home = (props: any) => {
  const theme = useTheme();
  const homeProps = {
    ...props,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) {
        return;
      }
      props.navigation.navigate(page, params);
    },
    businessSlug: settings?.businessSlug
  };
  const url = theme?.homepage_view?.components?.homepage_header?.components?.image
  const homeImage: ImageSourcePropType = theme.images.general
    .homeHero as ImageSourcePropType;

  return (
    <ImageBackground source={url ? {uri: url} : homeImage}  style={styles.bg}>
      <View style={styles.mask}>
        <SafeAreaView style={styles.wrapper}>
          <HomeView {...homeProps} />
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : 30
  },
  mask: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0000004D',
  },
});

export default Home;
