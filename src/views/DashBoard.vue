<template>
    <div>
        <div class="dash" v-for="(meter, index) of meters" :key="meter.name">
            <dash-board-meter
                :name="meter.name"
                :limit="meter.limit"
                @drop="drop(index)"
                @rename="rename(index, ...arguments)"
                @relimit="relimit(index, ...arguments)"
            />
        </div>
        <div>
            <v-btn x-large icon @click="add()">
                <v-icon>mdi-view-grid-plus</v-icon>
            </v-btn>
            <v-btn x-large icon @click="theme()">
                <v-icon>mdi-theme-light-dark</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import DashBoardMeter from '@/components/DashBoardMeter.vue';

    export default Vue.extend({
        components: {
            DashBoardMeter
        },

        data() {
            const saved = localStorage.getItem('meters');
            const meters: {
                name: string;
                limit: number;
            }[] = saved ? JSON.parse(saved) : [ {
                name: "New",
                limit: 60
            } ];

            return {
                meters
            }
        },

        watch: {
            meters: {
                handler(value) {
                    localStorage.setItem('meters', JSON.stringify(value));
                },
                deep: true
            }
        },

        methods: {
            add() {
                this.meters.push({
                    name: this.unique('New'),
                    limit: 60
                });
            },

            drop(index: number) {
                this.meters.splice(index, 1)
            },

            rename(index: number, name: string) {
                this.meters[index].name = this.unique(name);
            },

            relimit(index: number, limit: number) {
                this.meters[index].limit = limit;
            },

            theme() {
                this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
                localStorage.setItem('dark-mode', JSON.stringify(this.$vuetify.theme.dark));
            },

            unique(name: string): string {
                for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
                    const rename = `${name}${i >= 1 ? i : ''}`;
                    if (this.meters.every(it => it.name != rename))
                        return rename;
                }
                return name;
            }
        }
    })
</script>

<style>
    .dash {
        display: inline-block;
    }
</style>
