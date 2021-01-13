<template>
    <v-app id="app">
        <v-main>
            <v-container fill-height fluid>
                <v-row align="center" justify="center">
                    <v-col>
                        <router-view></router-view>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<style>
    #app {
        text-align: center;
    }
</style>
