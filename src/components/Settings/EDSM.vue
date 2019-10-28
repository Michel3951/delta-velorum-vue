<template>
    <form action="">
        <h3>Elite: Dangerous Star Map</h3>
        <div class="form-group">
            <label for="cmdr">CMDR Name</label>
            <input type="text" name="cmdr" id="cmdr" v-model="cmdr" class="form-control" v-on:blur="save(true)"
                   v-bind:class="{'invalid': !cmdr || !verified, 'valid': verified}">
        </div>
        <div class="form-group">
            <label for="key">API Key</label>
            <input :type="!hidekey ? 'text' : 'password'" name="key" id="key" v-model="apikey" v-on:blur="save(true)"
                   v-bind:class="{'invalid': !apikey || !verified, 'valid': verified}" class="form-control">
        </div>
        <div class="form-group">
            <div class="custom-control custom-checkbox">
                <input class="custom-control-input" type="checkbox" name="show" id="show" v-on:change="save()"
                       v-model="hidekey">
                <label class="custom-control-label" for="show">Hide key</label>
            </div>
        </div>
        <div class="form-group">
            <div class="custom-control custom-checkbox">
                <input class="custom-control-input" type="checkbox" name="enabled" id="enabled" v-on:change="save()"
                       v-model="enabled">
                <label class="custom-control-label" for="enabled">Share game data with EDSM</label>
            </div>
        </div>
        <hr>
    </form>
</template>

<script>
    const fs = require('fs');
    const remote = require('electron').remote;
    const app = remote.app;

    export default {
        name: "EDSM",
        data: function () {
            return {
                hidekey: true,
                apikey: null,
                cmdr: null,
                enabled: false,
                verified: false,
            }
        },
        methods: {
            save: function (doVerify = false) {
                let root = app.getAppPath() + '\\..\\src';
                fs.writeFileSync(root + '/user/edsm.json', `{"cmdr": ${this.cmdr ? `"${this.cmdr}"` : null}, "hidekey": ${this.hidekey}, "apikey": ${this.apikey ? `"${this.apikey}"` : null},"enabled": ${this.enabled}}`, 'utf-8');
                if (doVerify) this.verify();
                return true;
            },
            verify: async function () {
                let commander = await remote.getGlobal('cmdr').verify();
                this.verified = !!(commander && commander.name && commander.apikey);
            }
        },
        async created() {
            let root = app.getAppPath() + '\\..\\src';
            if (fs.existsSync(root + '/user/edsm.json')) {
                let file = JSON.parse(fs.readFileSync(root + '/user/edsm.json', 'utf-8'));
                this.apikey = file.apikey;
                this.hidekey = file.hidekey;
                this.cmdr = file.cmdr;
                this.enabled = file.enabled;
                let commander = remote.getGlobal('cmdr');
                if (commander && commander.name && commander.apikey) {
                    this.verified = true;
                }
            }
        }
    }
</script>

<style scoped>

</style>