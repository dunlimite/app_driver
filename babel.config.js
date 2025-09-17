module.exports = function (api) {
  api.cache.forever()
  const plugins = [
    [
      'module-resolver',
      {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.android.js',
          '.android.tsx',
          '.ios.js',
          '.ios.tsx'
        ],
        root: ['.'],
        alias: {
          '@': './src',
          '@ui': './src/ui/index.tsx',
          '@components': './src/@/components/native/index.js'
        }
      }
    ],
      'react-native-reanimated/plugin'
  ]

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins
  }
}
