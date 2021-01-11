<template>
    <div class="odometer" />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Odometer from 'odometer';
    import 'odometer/themes/odometer-theme-train-station.css';

    @Component export default class extends Vue {
        @Prop() private start!: number;
        @Prop() private max!: number;
        private current = this.start;
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
    .odometer {
        font-size: 5em;
        padding: .05em .1em .1em .1em;
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
