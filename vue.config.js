module.exports = {
    pwa: {
        name: 'Ometer',
        themeColor: '#1E0040',
        msTileColor: '#F98140',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: 'src/registerServiceWorker.ts',
        }
    },
    devServer: {
        watchOptions: {
            poll: true
      }
    }
}
