<template>
    <div class="odometer" :style="{
        '--duration': `${rate}ms`,
        '--title': `&quot;${title}&quot;`,
        '--color': color
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
            max: { type: Number, default: 255, validator: it => it >= 1 },
            start: { type: Number },
            rate: { type: Number, default: 1000 }
        },

        data() {
            return {
                current: this.start ?? this.max,
                timer: undefined as number | undefined,
                digits: Math.floor(Math.log10(this.max)) + 1,
                offset: 10 ** (Math.floor(Math.log10(this.max)) + 1)
            };
        },

        mounted() {
            const od = new Odometer({
                el: this.$el,
                value: this.current + this.offset,
                format: `(,${'d'.repeat(this.digits)})`,
                duration: this.rate
            });

            this.timer = setInterval(() => {
                if (this.current <= 0) {
                    clearInterval(this.timer);
                    this.timer = undefined;
                }
                else {
                    this.current--;
                    od.update(this.current + this.offset);
                }
            }, this.rate);
        }
    })
</script>

<style>
    .odometer .odometer-inside::before {
        content: var(--title);
        font-size: .8em;
        display: grid;
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

    .odometer-animating .odometer-ribbon-inner {
        -webkit-transition-duration: var(--duration) !important;
        -moz-transition-duration: var(--duration) !important;
        -ms-transition-duration: var(--duration) !important;
        -o-transition-duration: var(--duration) !important;
        transition-duration: var(--duration) !important;
    }
</style>
