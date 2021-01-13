<template>
    <div class="meter">
        <div class="header">{{ title }}</div>
        <div class="left">
            <v-btn small icon :dark="false" v-on:click="goto(max)">
                <v-icon v-if="target == max">mdi-alpha-m-circle</v-icon>
                <v-icon v-else>mdi-alpha-m-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn small icon :dark="false" v-on:click="goto(half)">
                <v-icon v-if="target == half">mdi-alpha-h-circle</v-icon>
                <v-icon v-else>mdi-alpha-h-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn small icon :dark="false" v-on:click="goto(1)">
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
            <div class="odometer" :style="{ '--duration': `${rate}ms`, '--color': color }" />
        </div>
        <div class="right">
            <v-btn large icon :dark="false" v-on:click="inc(10)">
                <v-icon v-if="target > display">mdi-plus-circle</v-icon>
                <v-icon v-else>mdi-plus-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn large icon :dark="false" v-on:click="goto(display)">
                <v-icon v-if="target == display">mdi-stop-circle</v-icon>
                <v-icon v-else>mdi-stop-circle-outline</v-icon>
            </v-btn>
            <br/>
            <v-btn large icon v-on:click="dec(10)">
                <v-icon v-if="target < display">mdi-minus-circle</v-icon>
                <v-icon v-else>mdi-minus-circle-outline</v-icon>
            </v-btn>
        </div>
        <div class="footer" v-if="target < display">down to {{ target }}</div>
        <div class="footer" v-else-if="target > display">up to {{ target }}</div>
        <div class="footer" v-else>max {{ max }}</div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Odometer from 'odometer';
    import 'odometer/themes/odometer-theme-train-station.css';

    export default Vue.extend({
        props: {
            title: { type: String, default: 'Counter' },
            color: { type: String, default: '#111' },
            max: { type: Number, default: 255 },
            start: { type: Number },
            rate: { type: Number, default: 1000 }
        },

        data() {
            return {
                digits: Math.floor(Math.log10(this.max)) + 1,
                offset: 10 ** (Math.floor(Math.log10(this.max)) + 1),
                target: Math.max(this.start ?? this.max, 0),
                display: Math.max(this.start ?? this.max, 0),
                half: Math.round(this.max/2),
                od: Odometer
            };
        },

        mounted() {
            this.od = new Odometer({
                el: this.$el.getElementsByClassName('odometer')[0],
                value: this.display + this.offset,
                format: `(,${'d'.repeat(this.digits)})`,
                duration: this.rate
            });

            this.roll();
        },

        methods: {
            roll() {
                // TODO support realtime counting
                setInterval(() => {
                    if (this.target < this.display)
                        this.display--;
                    else if (this.target > this.display)
                        this.display++;
                    else
                        return;
                    this.od.update(this.display + this.offset);
                }, this.rate);
            },

            dec(by = 1) {
                this.target -= by;
                if (this.target < 0)
                    this.target = 0;
            },

            inc(by = 1) {
                this.target += by;
                if (this.target > this.max)
                    this.target = this.max;
            },

            goto(at: number) {
                this.target = at;
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
            "H H H"
            "L C R"
            "F F F";
    }

    .header {
        grid-area: H;
        font-size: 4em;
        line-height: 1em;
    }

    .left {
        grid-area: L;
        margin: auto;
    }

    .central {
        grid-area: C;
    }

    .right {
        grid-area: R;
        margin: auto;
    }

    .footer {
        grid-area: F;
        font-size: 1.5em;
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

    .odometer {
        font-size: 5em;
        margin: .15em;
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
