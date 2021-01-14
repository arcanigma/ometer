<template>
    <div class="meter">
        <div class="header-left">
            <v-text-field outlined hide-details placeholder="Max"
                label="Max"
                v-model.lazy.number="remax"
                @change="remaxed()"
            />
        </div>
        <div class="header">
            <v-text-field solo flat hide-details placeholder="Name"
                v-model.lazy.trim="rename"
                @change="renamed()"
            />
        </div>
        <div class="header-right" />
        <div class="left">
            <v-btn icon @click="goto(remax)">
                <v-icon v-if="target == remax">mdi-alpha-m-circle</v-icon>
                <v-icon v-else>mdi-alpha-m-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn icon @click="goto(half)">
                <v-icon v-if="target == half">mdi-alpha-h-circle</v-icon>
                <v-icon v-else>mdi-alpha-h-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn icon @click="goto(1)">
                <v-icon v-if="target == 1">mdi-numeric-1-circle</v-icon>
                <v-icon v-else>mdi-numeric-1-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn icon @click="goto(0)">
                <v-icon v-if="target == 0">mdi-numeric-0-circle</v-icon>
                <v-icon v-else>mdi-numeric-0-circle-outline</v-icon>
            </v-btn>
        </div>
        <div class="central">
            <div class="odometer" ref="attach"
                :style="{
                    '--duration': `${pace}ms`,
                    '--color': color
                }"
            />
        </div>
        <div class="right">
            <v-btn x-large icon @click="inc(unit)">
                <v-icon v-if="target > display">mdi-plus-circle</v-icon>
                <v-icon v-else>mdi-plus-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn x-large icon @click="goto(display)">
                <v-icon v-if="target == display">mdi-stop-circle</v-icon>
                <v-icon v-else>mdi-stop-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn x-large icon @click="dec(unit)">
                <v-icon v-if="target < display">mdi-minus-circle</v-icon>
                <v-icon v-else>mdi-minus-circle-outline</v-icon>
            </v-btn>
        </div>
        <div class="footer-left">
            <v-btn icon @click="slower()">
                <v-icon v-if="pace == slow">mdi-rewind</v-icon>
                <v-icon v-else>mdi-rewind-outline</v-icon>
            </v-btn>
        </div>
        <div class="footer" v-if="target < display">down to {{ target }}</div>
        <div class="footer" v-else-if="target > display">up to {{ target }}</div>
        <div class="footer-right">
            <v-btn icon @click="faster()">
                <v-icon v-if="pace == fast">mdi-fast-forward</v-icon>
                <v-icon v-else>mdi-fast-forward-outline</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
    import 'odometer/themes/odometer-theme-train-station.css';
    import interpolate from 'color-interpolate';
    import Odometer from 'odometer';
    import Vue from 'vue';

    const PALETTE = interpolate([ '#E66100', '#777777', '#5D3A9B' ]),
        INTERVAL = 1000,
        UNIT = 30,
        DIGITS = 3,
        OFFSET = 10 ** DIGITS;

    const clamp = (num: number, min: number, max: number) =>
        Math.min(Math.max(num, min), max);

    export default Vue.extend({
        props: {
            name: { type: String, default: 'New' },
            max: { type: Number, default: 60 }
        },

        data() {
            const start = clamp(this.max, 1, 999);

            return {
                rename: this.name,

                remax: start,
                target: start,
                display: start,

                unit: UNIT,

                pace: INTERVAL,
                slow: INTERVAL * 2,
                fast: Math.round(INTERVAL / 2),

                od: Odometer
            };
        },

        computed: {
            half(): number { return Math.round(this.remax / 2); },
            color(): string { return PALETTE(this.display / this.remax); }
        },

        watch: {
            display(value) {
                this.od.update(value + OFFSET);
            }
        },

        mounted() {
            this.od = new Odometer({
                el: this.$refs.attach,
                value: this.display + OFFSET,
                format: `(,${'d'.repeat(DIGITS)})`,
                duration: INTERVAL
            });

            this.roll();
        },

        methods: {
            roll() {
                // TODO support realtime counting
                setTimeout(() => {
                    if (this.target < this.display)
                        this.display--;
                    else if (this.target > this.display)
                        this.display++;

                    this.roll();
                }, this.pace);
            },

            inc(by = 1) {
                this.target += by;
                if (this.target > this.remax)
                    this.target = this.remax;
            },

            dec(by = 1) {
                this.target -= by;
                if (this.target < 0)
                    this.target = 0;
            },

            goto(at: number) {
                this.target = at;
            },

            slower() {
                if (this.pace == INTERVAL)
                    this.pace = this.slow;
                else
                    this.pace = INTERVAL;
            },

            faster() {
                if (this.pace == INTERVAL)
                    this.pace = this.fast;
                else
                    this.pace = INTERVAL;
            },

            renamed() {
                if (this.rename.length === 0)
                    this.$emit('drop');
            },

            remaxed() {
                this.remax = clamp(this.remax, 1, 999);

                if (this.target > this.remax)
                    this.target = this.remax

                if (this.display > this.remax)
                    this.display = this.remax;
            }
        }
    })
</script>

<style>
    .meter {
        font-family: "Economica", sans-serif;
        display: grid;
        margin: 1em;

        grid-template-columns: 1fr auto 1fr;
        grid-template-rows: auto auto auto;
        gap: 0px 0px;
        grid-template-areas:
            "HL H HR"
            "L  C  R"
            "FL F FR";
    }

    .header-left { grid-area: HL; }
    .header { grid-area: H; }
    .header-right { grid-area: HR; }

    .header .v-input input {
        font-size: 3.25em;
        width: 3em;
        max-height: 1em;
    }

    .header .v-input__slot {
        background-color: unset !important;
    }

    .header-left .v-input input {
        font-size: 1.5em;
        width: 1.5em;
        text-align: center;
    }

    .left { grid-area: L; }
    .central { grid-area: C; }
    .right { grid-area: R; }

    .left, .right {
        margin: auto;
    }

    .footer-left { grid-area: FL; }
    .footer { grid-area: F; }
    .footer-right { grid-area: FR; }

    .footer-left, .footer, .footer-right {
        font-size: 1.5em;
    }

    .odometer {
        font-size: 5em;
        margin: .15em;
    }

    .odometer-inside {
        display: inline-flex;
    }

    .odometer .odometer-inside .odometer-digit {
        background-image: linear-gradient(to bottom,
            #111 0%,
            #000 35%,
            #333 55%,
            #111 55%,
            var(--color) 100%
        )
    }

    .odometer .odometer-inside .odometer-digit:first-child,
    .odometer .odometer-inside .odometer-formatting-mark:nth-child(2) {
        display: none
    }

    .odometer.odometer-animating .odometer-ribbon-inner {
        -webkit-transition-duration: var(--duration) !important;
        -moz-transition-duration: var(--duration) !important;
        -ms-transition-duration: var(--duration) !important;
        -o-transition-duration: var(--duration) !important;
        transition-duration: var(--duration) !important;
    }
</style>
