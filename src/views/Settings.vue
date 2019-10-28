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
    const fs = require('fs');
    const app = require('electron').remote.app;

    export default {
        name: 'settings',
        components: {
            EDSM,
            EDDN
        },
        created: function() {
            let root = app.getAppPath() + '\\..\\src';

            if (!fs.existsSync(root + '\\user')){
                fs.mkdirSync(root + '\\user');
            }
        }
    }
</script>
