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
                    { title: "Slow", color: 'indigo', rate: 2000, max: 30 },
                    { title: "Fast", color: 'tomato', rate: 500, max: 120 },
                    { title: "Hyper", rate: 15, max: 1200 },
                    { title: "Crawl", rate: 9000, max: 9 }
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
