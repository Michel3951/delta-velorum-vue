<template>
    <div>
        <div class="form-group">
            <label for="systemName">System name</label>
            <input type="text" name="systemName" id="systemName"
                   v-bind:class="{valid: system, invalid: ![null, ''].includes(systemName) && !system}"
                   v-model="systemName" class="form-control" v-on:blur="request()">
        </div>
        <div class="form-group row">
            <div class="col-auto">
                <div class="custom-control custom-checkbox">
                    <input class="custom-control-input" type="checkbox" name="bodies" id="bodies"
                           v-model="showBodies">
                    <label class="custom-control-label" for="bodies">Show bodies</label>
                </div>
            </div>
            <div class="col-auto">
                <div class="custom-control custom-checkbox">
                    <input class="custom-control-input" type="checkbox" name="stations" id="stations"
                           v-model="showStations">
                    <label class="custom-control-label" for="stations">Show stations</label>
                </div>
            </div>
            <div class="col-auto">
                <div class="custom-control custom-checkbox">
                    <input class="custom-control-input" type="checkbox" name="factions" id="factions"
                           v-model="showFactions">
                    <label class="custom-control-label" for="factions">Show factions</label>
                </div>
            </div>
        </div>
        <div v-if="system">
            <SystemInformation v-bind:system="this.system" v-bind:cmdr="this.commander" v-bind:showFactions="showFactions"/>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import SystemInformation from '@/components/Cards/SystemInformation.vue'

    const fetch = require('node-fetch');
    const remote = require('electron').remote;

    export default {
        name: 'home',
        components: {
            SystemInformation
        },
        data: function () {
            return {
                systemName: null,
                system: null,
                commander: null,
                showBodies: false,
                showStations: false,
                showFactions: false,
            }
        },
        methods: {
            request: async function () {
                let commander = remote.getGlobal('cmdr');
                let request = await fetch(`https://www.edsm.net/api-v1/system?systemName=${this.systemName}&showInformation=1&showPrimaryStar=1&showPermit=1&showCoordinates=1`);
                let response = await request.json();
                if (response && Object.keys(response).length > 0) {
                    if (commander && commander.apikey && commander.name) {
                        console.log(1);
                        let cmdrReq = await fetch(`https://www.edsm.net/api-logs-v1/get-position?commanderName=${commander.name}&apiKey=${commander.apikey}&showCoordinates=1`);
                        let cmdrPos = await cmdrReq.json();
                        if (cmdrPos && cmdrPos.msgnum === 100) {
                            this.commander = cmdrPos;
                        } else {
                            console.log(`Unable to get commander distance: ${cmdrPos}`);
                        }
                    }
                    this.valid = true;
                    this.system = response
                } else {
                    this.valid = this.system = null;
                }
            }
        }
    }
</script>
