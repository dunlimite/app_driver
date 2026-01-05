module.exports = {
  dependencies: {
    'ordering-ui-native-release': {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
  project: {
    ios: {},
    android: {}, // grouped into "project"
  },
  assets: ['./src/assets/fonts'], // stays the same
};
