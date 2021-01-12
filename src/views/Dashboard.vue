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
                    { title: "Realtime", max: 60 },
                    { title: "Slow", rate: 2000, color: 'indigo', max: 30 },
                    { title: "Fast", rate: 500, color: 'tomato', max: 120 },
                    { title: "Defaults" }
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
