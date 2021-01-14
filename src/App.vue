<template>
    <v-app id="app">
        <v-main>
            <v-container class="pa-0" fill-height fluid>
                <v-row align="center" justify="center">
                    <v-col>
                        <router-view></router-view>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        mounted() {
            const darkMode = localStorage.getItem('dark-mode');
            if (darkMode)
                this.$vuetify.theme.dark = JSON.parse(darkMode);
        }
    })
</script>

<style>
    body {
        overflow: hidden;
    }

    #app {
        text-align: center;
    }
</style>
