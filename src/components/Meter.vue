<template>
    <div class="meter">
        <div class="header-left">
            <v-text-field outlined hide-details placeholder="Max"
                label="Max"
                v-model.lazy.number="limit"
                v-on:change="remaxed()"
            />
        </div>
        <div class="header">
            <v-text-field solo flat hide-details placeholder="Name"
                v-model.lazy.trim="rename"
                v-on:change="renamed()"
            />
        </div>
        <div class="header-right" />
        <div class="left">
            <v-btn small icon v-on:click="goto(limit)">
                <v-icon v-if="target == limit">mdi-alpha-m-circle</v-icon>
                <v-icon v-else>mdi-alpha-m-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn small icon v-on:click="goto(half)">
                <v-icon v-if="target == half">mdi-alpha-h-circle</v-icon>
                <v-icon v-else>mdi-alpha-h-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn small icon v-on:click="goto(1)">
                <v-icon v-if="target == 1">mdi-numeric-1-circle</v-icon>
                <v-icon v-else>mdi-numeric-1-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn small icon v-on:click="goto(0)">
                <v-icon v-if="target == 0">mdi-numeric-0-circle</v-icon>
                <v-icon v-else>mdi-numeric-0-circle-outline</v-icon>
            </v-btn>
        </div>
        <div class="central">
            <div class="odometer" ref="attach"
                :style="{
                    '--duration': `${pace}ms`,
                    '--color': colorize()
                }"
            />
        </div>
        <div class="right">
            <v-btn large icon v-on:click="inc(10)">
                <v-icon v-if="target > display">mdi-plus-circle</v-icon>
                <v-icon v-else>mdi-plus-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn large icon v-on:click="goto(display)">
                <v-icon v-if="target == display">mdi-stop-circle</v-icon>
                <v-icon v-else>mdi-stop-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn large icon v-on:click="dec(10)">
                <v-icon v-if="target < display">mdi-minus-circle</v-icon>
                <v-icon v-else>mdi-minus-circle-outline</v-icon>
            </v-btn>
        </div>
        <div class="footer-left">
            <v-btn small icon v-on:click="slower()">
                <v-icon v-if="pace == slow">mdi-rewind</v-icon>
                <v-icon v-else>mdi-rewind-outline</v-icon>
            </v-btn>
        </div>
        <div class="footer" v-if="target < display">down to {{ target }}</div>
        <div class="footer" v-else-if="target > display">up to {{ target }}</div>
        <div class="footer-right">
            <v-btn small icon v-on:click="faster()">
                <v-icon v-if="pace == fast">mdi-fast-forward</v-icon>
                <v-icon v-else>mdi-fast-forward-outline</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import interpolate from 'color-interpolate';
    import Odometer from 'odometer';
    import 'odometer/themes/odometer-theme-train-station.css';

    const PALETTE = interpolate([ '#E66100', '#777777', '#5D3A9B' ]);

    export default Vue.extend({
        props: {
            name: { type: String, default: 'New' },
            max: { type: Number, default: 500 },
            start: { type: Number }, // TODO obsolete
            interval: { type: Number, default: 1000 }
        },

        data() {
            return {
                rename: this.name,

                digits: 3,
                offset: 1000,

                limit: this.max,
                half: Math.round(this.max / 2),
                target: Math.max(this.start ?? this.max, 0),
                display: Math.max(this.start ?? this.max, 0),

                pace: this.interval,
                slow: this.interval * 2,
                fast: Math.round(this.interval / 2),

                od: Odometer,
            };
        },

        mounted() {
            this.od = new Odometer({
                el: this.$refs.attach,
                value: this.display + this.offset,
                format: `(,${'d'.repeat(this.digits)})`,
                duration: this.pace
            });

            this.roll();
        },

        methods: {
            roll() {
                // TODO support realtime counting
                setTimeout(() => {
                    if (this.target < this.display) {
                        this.display--;
                        this.update();
                    }
                    else if (this.target > this.display) {
                        this.display++;
                        this.update();
                    }
                    this.roll();
                }, this.pace);
            },

            update() {
                this.od.update(this.display + this.offset);
            },

            inc(by = 1) {
                this.target += by;
                if (this.target > this.limit)
                    this.target = this.limit;
            },

            goto(at: number) {
                this.target = at;
            },

            dec(by = 1) {
                this.target -= by;
                if (this.target < 0)
                    this.target = 0;
            },

            slower() {
                if (this.pace == this.interval)
                    this.pace = this.slow;
                else
                    this.pace = this.interval;
            },

            faster() {
                if (this.pace == this.interval)
                    this.pace = this.fast;
                else
                    this.pace = this.interval;
            },

            renamed() {
                if (this.rename.length === 0)
                    this.$emit('drop');
            },

            remaxed() {
                if (this.limit < 1)
                    this.limit = 1;
                else if (this.limit > 999)
                    this.limit = 999;

                this.half = Math.round(this.limit / 2);

                if (this.target > this.limit)
                    this.target = this.limit
                if (this.display > this.limit) {
                    this.display = this.limit;
                    this.update();
                }
            },

            colorize() {
                return PALETTE(this.display / this.limit);
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
