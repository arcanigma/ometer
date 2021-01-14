module.exports = {
    pwa: {
        name: "Ometer",
        themeColor: "#5D3A9B",
        msTileColor: "#5D3A9B",
        appleMobileWebAppCapable: "yes",
        appleMobileWebAppStatusBarStyle: "default",
        workboxPluginMode: "GenerateSW"
    },
    devServer: {
        watchOptions: {
            poll: true
        }
    },
    transpileDependencies: [
        "vuetify"
    ]
}
