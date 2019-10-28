<template>
    <div class="card">
        <div class="card-header">
            <h2><img src="@/assets/engineer.svg" alt="" height="32">
                Settings</h2>
        </div>
        <div class="card-body">
            <EDSM/>
            <EDDN/>
        </div>
    </div>
</template>

<script>
    import EDSM from '@/components/Settings/EDSM.vue'
    import EDDN from '@/components/Settings/EDDN.vue'

    export default {
        name: 'settings',
        components: {
            EDSM,
            EDDN
        }
    }
</script>
