<template>
        <form action="">
            <h3>Elite: Dangerous Data Network</h3>
            <div class="form-group">
                <div class="custom-control custom-checkbox">
                    <input class="custom-control-input" type="checkbox" name="eddn-enabled" id="eddn-enabled" v-on:change="save()"
                           v-model="eddn.enabled">
                    <label class="custom-control-label" for="eddn-enabled">Share game data with EDDN</label>
                </div>
            </div>
            <hr>
        </form>
</template>

<script>
    const fs = require('fs');
    const remote = require('electron').remote.app;

    export default {
        name: "EDDN",
        data: function () {
            return {
                eddn: {
                    enabled: false,
                }
            }
        },
        methods: {
            save: function () {
                let root = remote.getAppPath() + '\\..\\src';
                fs.writeFileSync(root + '/user/eddn.json', `{"enabled": ${this.eddn.enabled}}`, 'utf-8');
                return true;
            }
        },
        async created() {
            let root = remote.getAppPath() + '\\..\\src';
            if (fs.existsSync(root + '/user/eddn.json')) {
                let file = JSON.parse(fs.readFileSync(root + '/user/eddn.json', 'utf-8'));
                this.eddn.enabled = file.enabled
            }
        }
    }
</script>

<style scoped>

</style>