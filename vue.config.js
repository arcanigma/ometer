module.exports = {
    pwa: {
        name: 'Ometer',
        themeColor: '#1E0040',
        msTileColor: '#F98140',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        workboxPluginMode: 'GenerateSW'
    },
    devServer: {
        watchOptions: {
            poll: true
        }
    }
}
