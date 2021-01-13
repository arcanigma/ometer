<template>
    <div id="dashboard">
        <div class="dash" v-for="(meter, index) of meters" :key="index">
            <Meter class="mx-8" v-bind="meter" />
        </div>
        <div class="tools">
            <v-btn x-large icon v-on:click="meters.push({})">
                <v-icon>mdi-view-grid-plus</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
    import Meter from '@/components/Meter.vue';

    export default {
        components: {
            Meter
        },

        data() {
            return {
                meters: [
                    { title: "Ness",    color: 'red',       max: 120 },
                    { title: "Paula",   color: 'pink',      max: 45 },
                    { title: "Jeff",    color: 'slategray', max: 90 },
                    { title: "Poo",     color: 'navy',      max: 60 }
                ]
            }
        }
    }
</script>

<style>
    .dash {
        display: inline-block;
    }
</style>
