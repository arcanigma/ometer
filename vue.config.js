module.exports = {
    pwa: {
        name: 'Ometer',
        themeColor: '#1E0040',
        msTileColor: '#F98140',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: 'dev/sw.js',
        }
    },
    devServer: {
        watchOptions: {
            poll: true
      }
    }
}
