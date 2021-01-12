<template>
    <div class="odometer" :style="{
        '--title': `&quot;${title}&quot;`,
        '--color': color
    }" />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Odometer from 'odometer';
    import 'odometer/themes/odometer-theme-train-station.css';

    @Component export default class extends Vue {
        @Prop() private title!: string;
        @Prop() private color!: string;
        @Prop() private max!: number;
        @Prop() private start!: number;

        private current = this.start ?? this.max;
        private timer: number | undefined = undefined;

        mounted() {
            const od = new Odometer({
                el: this.$el,
                value: this.current + 9000,
                format: '(,ddd)',
                duration: 1000
            });

            this.timer = setInterval(() => {
                if (this.current <= 0) {
                    clearInterval(this.timer);
                    this.timer = undefined;
                }
                else {
                    this.current--;
                    od.update(this.current + 9000);
                }
            }, 1000);
        }
    }
</script>

<style>
    .odometer .odometer-inside::before {
        content: var(--title);
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
        margin: 0.25em;
    }

    .odometer .odometer-inside .odometer-digit:first-child,
    .odometer .odometer-inside .odometer-formatting-mark:nth-child(2) {
        display: none
    }

    .odometer-animating .odometer-ribbon-inner {
        -webkit-transition-duration: 1000ms !important;
        -moz-transition-duration: 1000ms !important;
        -ms-transition-duration: 1000ms !important;
        -o-transition-duration: 1000ms !important;
        transition-duration: 1000ms !important;
    }
</style>
