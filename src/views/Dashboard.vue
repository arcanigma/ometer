<template>
    <div id="dashboard">
        <Meter v-for="(meter, index) of meters" :key="index" v-bind="meter" />
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
                    { title: "Ness", color: 'crimson', max: 90 },
                    { title: "Paula", color: 'pink', max: 30 },
                    { title: "Jeff", color: 'slategray', max: 60 },
                    { title: "Poo", color: 'royalblue', max: 60, start: 40 }
                ]
            }
        }
    }
</script>

<style>
    #dashboard {
        display: inline;
    }
</style>
