import React from 'react';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SafeSystemBarsView = ({ children, style }) => {
  const insets = useSafeAreaInsets();

  const getBottomPadding = () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 35) {
        const extraPadding = Math.max(insets.bottom, 48);
        return extraPadding;
      }
      return insets.bottom;
    }
    return 0;
  };

  const getTopPadding = () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 35) {
        const extraPadding = Math.max(insets.top, 30);
        return extraPadding;
      }
      return insets.top;
    }
    return 0;
  };

  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: getTopPadding(),
          paddingBottom: getBottomPadding()
        },
        style
      ]}
    >
      {children}
    </View>
  );
};

export default SafeSystemBarsView;
