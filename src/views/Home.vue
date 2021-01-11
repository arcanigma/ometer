<template>
    <div class="home">
        <Meter :start="10" :max="10" />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import Meter from '@/components/Meter.vue';

    @Component({
        components: {
            Meter
        }
    })

    export default class extends Vue {}
</script>
