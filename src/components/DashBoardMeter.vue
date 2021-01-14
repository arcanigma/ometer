<template>
    <div class="meter">
        <div class="header-left">
            <v-text-field outlined hide-details placeholder="Limit"
                label="Limit"
                :value="limit"
                @change="relimit(...arguments)"
            />
        </div>
        <div class="header">
            <v-text-field solo flat hide-details placeholder="Name"
                :value="name"
                @change="rename(...arguments)"
            />
        </div>
        <div class="header-right" />
        <div class="left">
            <v-btn icon @click="goto(limit)">
                <v-icon v-if="target == limit">mdi-alpha-m-circle</v-icon>
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
                    '--duration': `${duration}ms`,
                    '--color': color
                }"
            />
        </div>
        <div class="right">
            <v-btn x-large icon @click="inc(UNIT)">
                <v-icon v-if="target > display">mdi-plus-circle</v-icon>
                <v-icon v-else>mdi-plus-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn x-large icon @click="goto(display)">
                <v-icon v-if="target == display">mdi-stop-circle</v-icon>
                <v-icon v-else>mdi-stop-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn x-large icon @click="dec(UNIT)">
                <v-icon v-if="target < display">mdi-minus-circle</v-icon>
                <v-icon v-else>mdi-minus-circle-outline</v-icon>
            </v-btn>
        </div>
        <div class="footer-left">
            <v-btn icon @click="slower()">
                <v-icon v-if="pace > 1">mdi-rewind</v-icon>
                <v-icon v-else>mdi-rewind-outline</v-icon>
            </v-btn>
        </div>
        <div class="footer" v-if="target < display">down to {{ target }}</div>
        <div class="footer" v-else-if="target > display">up to {{ target }}</div>
        <div class="footer-right">
            <v-btn icon @click="faster()">
                <v-icon v-if="pace < 1">mdi-fast-forward</v-icon>
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

    const clamp = (num: number, min: number, max: number) =>
        Math.min(Math.max(num, min), max);

    export default Vue.extend({
        props: {
            name: { type: String, required: true },
            limit: { type: Number, required: true }
        },

        data() {
            return {
                target: this.limit,
                display: this.limit,
                pace: 1,

                od: Odometer
            };
        },

        computed: {
            PALETTE: () => interpolate([ '#E66100', '#777777', '#5D3A9B' ]),
            INTERVAL: () => 1000,
            UNIT: () => 30,
            DIGITS: () => 3,
            OFFSET: () => 10 ** 3,

            color(): string { return this.PALETTE(this.display / this.limit) },
            duration(): number { return Math.round(this.pace * this.INTERVAL) },
            half(): number { return Math.round(this.limit / 2) }
        },

        watch: {
            display(value: number) {
                this.od.update(value + this.OFFSET);
            },

            limit(value: number) {
                if (this.target > value)
                    this.target = value;

                if (this.display > value)
                    this.display = value;
            }
        },

        mounted() {
            this.od = new Odometer({
                el: this.$refs.attach,
                value: this.display + this.OFFSET,
                format: `(,${'d'.repeat(this.DIGITS)})`,
                duration: this.duration
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
                }, this.duration);
            },

            inc(by = 1) {
                this.target += by;
                if (this.target > this.limit)
                    this.target = this.limit;
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
                if (this.pace == 1)
                    this.pace = 2;
                else
                    this.pace = 1;
            },

            faster() {
                if (this.pace == 1)
                    this.pace = 0.5;
                else
                    this.pace = 1;
            },

            rename(to: string) {
                to = to.trim();
                if (to.length == 0)
                    this.$emit('drop');
                else
                    this.$emit('rename', to);
            },

            relimit(to: number) {
                to = clamp(to, 1, 999);
                if (to != this.limit)
                    this.$emit('relimit', to);
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

    .theme--dark .odometer-inside :not(.odometer-digit:nth-child(4)) {
        z-index: 2;
    }

    .theme--dark .odometer-inside .odometer-digit:nth-child(4) {
        z-index: 1;
        box-shadow: 0px 0px 2em 1em var(--color);
    }

    .odometer .odometer-inside .odometer-digit {
        background-image: linear-gradient(to bottom,
            #111 0%,
            #000 35%,
            #333 55%,
            #111 55%,
            var(--color) 100%
        );
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
