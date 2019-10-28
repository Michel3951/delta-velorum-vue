<template>
    <div>
        <div class="card">
            <div class="card-header">
                <h3><img src="@/assets/expanding.svg" width="28" alt=""> System information - {{ system.name }}</h3>
            </div>
            <div class="card-body">
                <div class="text-center mb-3" v-if="system.requirePermit">
                    <span class="text-primary"><i class="fas fa-exclamation-triangle"></i> This system requires the <b>{{ system.permitName }}</b> permit to be entered.</span>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-6">
                                <p class="text-primary" v-if="cmdr">Distance from your location:</p>
                                <p class="text-primary">Allegiance:</p>
                                <p class="text-primary">Government:</p>
                                <p class="text-primary">Controlling faction:</p>
                            </div>
                            <div class="col-6">
                                <p v-if="cmdr">{{ distance() }} light-year</p>
                                <p>{{ system.information.allegiance || 'None' }}</p>
                                <p>{{ system.information.government || 'None' }}</p>
                                <p>{{ controllingFaction ? controllingFaction.name : 'None' }}<br><em
                                        v-if="controllingFaction && controllingFaction.state">({{
                                    controllingFaction.state}})</em></p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-6">
                                <p class="text-primary">Economy:</p>
                                <p class="text-primary">Security:</p>
                                <p class="text-primary">Population:</p>
                            </div>
                            <div class="col-6">
                                <p>{{ system.information.economy || 'None' }}</p>
                                <p>{{ system.information.security || 'None' }}</p>
                                <p>{{ format(system.information.population) || 'None' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--    This should be in another component, but it would be a waste to call the API 2 times-->
        <div class="card mt-3" v-if="factions !== false && showFactions">
            <div class="card-header">
                <h3><img src="@/assets/alliance.svg" width="28" alt=""> Minor Factions</h3>
            </div>
            <div class="card-body">
                <div v-if="factions">
                    <div v-for="faction in factions" v-bind:key="faction.id">
                        <div class="row">
                            <div class="col-8">
                                <span data-tooltip="Player faction" class="mr-2" v-if="faction.isPlayer"><i
                                        class="fas fa-users"></i></span>
                                <s v-if="faction.influence == 0"><b>{{ faction.name }}</b> <em>({{ faction.state
                                    }})</em></s>
                                <span v-else><b>{{ faction.name }}</b> <em>({{ faction.state }})</em></span>
                            </div>
                            <div class="col-4 text-right">
                                {{ percentage(faction.influence) }}%
                                <span v-if="faction.influence > lastInfluence(faction.id)"
                                      v-bind:data-tooltip="`+${percentage(faction.influence - lastInfluence(faction.id))}%`">
                                    <i class="far fa-caret-square-up text-success"></i>
                                </span>
                                <span v-bind:data-tooltip="`-${percentage(lastInfluence(faction.id) - faction.influence)}%`"
                                      v-else>
                                    <i class="far fa-caret-square-down text-danger"></i>
                                </span>
                            </div>
                        </div>
                        <hr>
                    </div>
                </div>
                <div v-else class="text-center">
                    {{ Array.isArray(factions) }}
                    <img src="@/assets/loading.svg" alt="" width="64">
                    <h2>Loading</h2>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const fetch = require('node-fetch');
    export default {
        name: 'SystemInformation',
        props: {
            system: null,
            cmdr: null,
            showFactions: null,
        },
        data: function () {
            return {
                factions: false,
                controllingFaction: null,
            }
        },
        watch: {
            system: function (old, system) {
                if (old.name === system.name) return;
                this.getFactions();
            }
        },
        methods: {
            getFactions: async function () {
                this.factions = false;
                let request = await fetch(`https://www.edsm.net/api-system-v1/factions?systemName=${this.system.name}&showHistory=1`);
                let response = await request.json();
                if (response && response.factions && response.factions.length > 0) {
                    this.controllingFaction = response.factions.filter(f => f.id === response.controllingFaction.id)[0];
                    let ignored = ['Pilots\' Federation Local Branch'];
                    this.factions = response.factions.filter(f => !ignored.includes(f.name));
                }
            },
            distance: function () {
                if (this.cmdr) {
                    let sysCoords = this.system.coords;
                    let cdmrCoords = this.cmdr.coordinates;
                    return Math.sqrt(Math.pow((sysCoords.x - cdmrCoords.x), 2)
                        + Math.pow((sysCoords.y - cdmrCoords.y), 2)
                        + Math.pow((sysCoords.z - cdmrCoords.z), 2)).toFixed(2);
                }
            },
            format: function (int) {
                if (isNaN(int)) return 'None';
                return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            lastInfluence: function (id) {
                let faction = this.factions.filter(x => x.id === id)[0];
                return Object.values(faction.influenceHistory).filter(x => x !== faction.influence).reverse()[0];
            },
            percentage: function (int) {
                if (isNaN(int)) return '0.000';
                return (int * 100).toFixed(3);
            }
        },
        async created() {
            this.getFactions();
        }
    }
</script>
