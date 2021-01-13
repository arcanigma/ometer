<template>
    <div id="dashboard">
        <div class="dash" v-for="(m, i) of meters" :key="i">
            <Meter v-bind="m" />
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
                    { title: "Realtime", max: 60 },
                    { title: "Halved", color: 'indigo', rate: 2000, max: 30 },
                    { title: "Doubled", color: 'tomato', rate: 500, max: 120 }
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
