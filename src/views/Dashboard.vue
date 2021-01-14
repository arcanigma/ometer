<template>
    <div id="dashboard">
        <div class="dash" v-for="(meter, index) of meters" :key="meter.name">
            <Meter v-bind="meter" v-on:drop="drop(index)" />
        </div>
        <div class="tools">
            <v-btn x-large icon v-on:click="add()">
                <v-icon>mdi-view-grid-plus</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Meter from '@/components/Meter.vue';
    import json from '@/assets/data.json';

    export default Vue.extend({
        components: {
            Meter
        },

        data() {
            return {
                meters: json as Record<string, any>,
                next: json.length + 1
            }
        },

        methods: {
            add() {
                this.meters.push({
                    name: `New${this.next++}`
                })
            },

            drop(index: number) {
                this.meters.splice(index, 1)
            }
        }
    })
</script>

<style>
    .dash {
        display: inline-block;
    }
</style>
