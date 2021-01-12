<template>
    <div class="odometer" :style="{
        '--duration':   `${rate}ms`,
        '--above': `&quot;${title}&quot;`,
        '--color': color,
        '--below-static': `&quot;max ${max}&quot;`,
        '--below-down': `&quot;down to ${targetValue}&quot;`,
        '--below-up': `&quot;up to ${targetValue}&quot;`
    }" />
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
                el: this.$el,
                value: this.displayValue + this.offset,
                format: `(,${'d'.repeat(this.digits)})`,
                duration: this.rate
            });

            this.roll();

            this.decrement(30);
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
    .odometer .odometer-inside::before {
        content: var(--above);
        font-size: .75em;
        display: grid;
    }

    .odometer .odometer-inside::after {
        content: var(--below);
        font-size: .3em;
        display: grid;
        margin-top: .5em;
    }

    .odometer .odometer-inside::after {
        content: var(--below-static);
    }

    .odometer.odometer-animating-down .odometer-inside::after {
        content: var(--below-down) !important;
        text-decoration: underline;
        text-decoration-thickness: .1em;
        text-underline-offset: .1em;
        text-decoration-color: #F00;
    }

    .odometer.odometer-animating-up .odometer-inside::after {
        content: var(--below-up) !important;
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
        margin: .25em;
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
