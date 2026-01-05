import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useConfig } from 'ordering-components-external/native'
import { OIcon, OText } from 'ordering-ui-native-release/themes/original';

const Splash = () => {
  const theme = useTheme();
  const [{configs}] = useConfig()
  const enabledPoweredByOrdering = configs?.powered_by_ordering_module?.value


  return (
    <View style={styles.wrapper}>
      <OIcon src={theme.images.logos.logotype} style={styles.logo} />
      {enabledPoweredByOrdering && (
        <OText>
          Powered By Ordering.co
        </OText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 80,
    width: 250,
    alignSelf: 'center',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

export default Splash;
