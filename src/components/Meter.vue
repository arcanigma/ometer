<template>
    <div class="meter">
        <div class="header">{{ title }}</div>
        <div class="mid-header">
            <button v-on:click="increment(10)">+10</button>
        </div>
        <div class="middle">
            <div class="odometer" :style="{ '--duration': `${rate}ms`, '--color': color }" />
        </div>
        <div class="mid-footer">
            <button v-on:click="decrement(10)">–10</button>
        </div>
        <div class="footer bad" v-if="targetValue < displayValue">down to {{ targetValue }}</div>
        <div class="footer good" v-else-if="targetValue > displayValue">up to {{ targetValue }}</div>
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
                targetValue: Math.max(this.start ?? this.max, 0),
                displayValue: Math.max(this.start ?? this.max, 0),
                od: Odometer
            };
        },

        mounted() {
            this.od = new Odometer({
                el: this.$el.getElementsByClassName('odometer')[0],
                value: this.displayValue + this.offset,
                format: `(,${'d'.repeat(this.digits)})`,
                duration: this.rate
            });

            this.roll();
        },

        methods: {
            roll() {
                // TODO support realtime counting
                setInterval(() => {
                    if (this.targetValue < this.displayValue)
                        this.displayValue--;
                    else if (this.targetValue > this.displayValue)
                        this.displayValue++;
                    else
                        return;
                    this.od.update(this.displayValue + this.offset);
                }, this.rate);
            },

            decrement(by = 1) {
                this.targetValue -= by;
                if (this.targetValue < 0)
                    this.targetValue = 0;
            },

            increment(by = 1) {
                this.targetValue += by;
                if (this.targetValue > this.max)
                    this.targetValue = this.max;
            }
        }
    })
</script>

<style>
    .meter {
        font-family: "Economica", sans-serif;
        display: grid;
        margin: 1em;
    }

    .header {
        font-size: 4em;
    }

    .mid-header {
    }

    .middle {
    }

    .mid-footer {
    }

    .footer {
        font-size: 1.5em;
        margin-top: .5em;
    }

    .bad {
        text-decoration: underline;
        text-decoration-thickness: .1em;
        text-underline-offset: .1em;
        text-decoration-color: #F00;
    }

    .good {
        text-decoration: underline;
        text-decoration-thickness: .1em;
        text-underline-offset: .1em;
        text-decoration-color: #0F0;
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
