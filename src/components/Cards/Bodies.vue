<template>
    <div>
        <div class="card mt-3">
            <div class="card-header">
                <h3><img src="@/assets/planet.svg" width="28" alt=""> Celestial Bodies</h3>
            </div>
            <div class="card-body">
                <div v-for="star in stars" v-bind:key="star.id" class="row">
                    <div class="col">
                        <div class="card count" style="border: 1px solid #1e2022">
                            <div class="card-body">
                                <h4 style="font-family: 'Sintony', sans-serif">
                                    <span v-bind:aria-label="star.subType" data-balloon-pos="up" class="mr-2">
                                        <i class="fa fa-star" v-bind:style="style(star.subType)"></i>
                                    </span>
                                    <span v-if="star.isMainStar" class="mr-2"
                                          aria-label="This is the primary star of the system." data-balloon-pos="up">
                                        <i class="fas fa-home"></i>
                                    </span>
                                    <span aria-label="This star can be scooped for fuel." data-balloon-pos="up"
                                          class="mr-2" v-if="star.isScoopable">
                                        <i class="fas fa-charging-station"></i>
                                    </span>
                                    {{ star.name }}
                                </h4>
                                <div class="row mt-3">
                                    <div class="col-6">
                                        <div class="row">
                                            <div class="col-6 text-primary">
                                                <p>Type:</p>
                                                <p>Solar masses:</p>
                                                <p>Solar radius:</p>
                                            </div>
                                            <div class="col-6">
                                                <p>{{ star.subType }}</p>
                                                <p>{{ isNaN(star.solarMasses) ? '???' : star.solarMasses.toFixed(5) }}
                                                    solar
                                                    masses</p>
                                                <p>{{ isNaN(star.solarRadius) ? '???' : star.solarRadius.toFixed(5) }}
                                                    solar
                                                    radii</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="row">
                                            <div class="col-6 text-primary">
                                                <p>Age:</p>
                                                <p>Distance to arrival:</p>
                                            </div>
                                            <div class="col-6">
                                                <p>{{ star.age }} million years</p>
                                                <p>{{ format(star.distanceToArrival) }} light-seconds</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul class="tree">
                            <li>
                                <ul>
                                    <li v-for="child in children(star)" v-bind:key="child.id">
                                        <div class="card count" style="border: 1px solid #1e2022">
                                            <div class="card-body" v-if="child.type === 'Star'">
                                                <h5 style="font-family: 'Sintony', sans-serif">
                                                    <span v-bind:aria-label="child.subType" data-balloon-pos="up"
                                                          class="mr-2">
                                                        <i class="fa fa-star" v-bind:style="style(child.subType)"></i>
                                                    </span>
                                                    {{ child.name }}
                                                </h5>
                                            </div>
                                            <div class="card-body" v-else>
                                                <h5 style="font-family: 'Sintony', sans-serif">
                                                    <span v-bind:aria-label="child.subType" data-balloon-pos="up"
                                                          class="mr-2">
                                                        <i class="fas fa-globe-americas"></i>
                                                    </span>
                                                    <span v-if="child.isLandable"
                                                          aria-label="Ships can land on this planet."
                                                          data-balloon-pos="up" class="mr-2">
                                                        <i class="fas fa-plane-arrival"></i>
                                                    </span>
                                                    {{ child.name }}
                                                </h5>
                                            </div>
                                        </div>
                                        <ul>
                                            <li v-for="child in children(child)" v-bind:key="child.id">
                                                <div class="card count" style="border: 1px solid #1e2022">
                                                    <div class="card-body">
                                                        <h6 style="font-family: 'Sintony', sans-serif">
                                                            <span v-bind:aria-label="child.subType" data-balloon-pos="up"
                                                          class="mr-2">
                                                                <i class="fas fa-globe-americas"></i>
                                                            </span>
                                                            <span v-if="child.isLandable"
                                                                  aria-label="Ships can land on this planet."
                                                                  data-balloon-pos="up" class="mr-2">
                                                                <i class="fas fa-plane-arrival"></i>
                                                            </span>
                                                            {{ child.name }}
                                                        </h6>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <hr>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const fetch = require('node-fetch');
    const star = require('../../data/star');
    export default {
        name: 'Bodies',
        props: {
            system: null,
        },
        data: function () {
            return {
                bodies: null,
                raw: null,
                stars: null,
            }
        },
        watch: {
            system: function (old, system) {
                if (old.name === system.name) return;
                this.getBodies();
            }
        },
        methods: {
            getBodies: async function () {
                let request = await fetch(`https://www.edsm.net/api-system-v1/bodies?systemName=${this.system.name}`);
                let bodies = await request.json();
                if (bodies && bodies.bodies && bodies.bodies.length > 0) {
                    this.raw = bodies;
                    this.bodies = bodies.bodies.filter(b => ['Star', 'Planet'].includes(b.type));
                    this.stars = bodies.bodies.filter(b => {
                        if (b.type !== 'Star') return;
                        if (!b.parents) return true;
                        let parents = b.parents.map(p => Object.values(p)[0]);
                        return parents.includes(0) && parents.length < 2;
                    });
                    this.planets = bodies.bodies.filter(b => b.type === 'Planet');
                }
            },
            format: function (int) {
                if (isNaN(int)) return 0;
                return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            children: function (parent) {
                return this.bodies.filter(b => {
                    if (!Array.isArray(b.parents)) return;
                    if (parent.bodyId === b.bodyId) return;
                    if (parent.isMainStar) return true;
                    let parents = b.parents.map(b => Object.values(b)[0]).filter(b => b !== 0);
                    if (!parents || !parents[0]) return;
                    if (!parents.includes(parent.bodyId)) return;
                    console.log('=======================================================');
                    console.log(`Parent: ${parent.name} - ${parent.bodyId}`);
                    console.log(`Child: ${b.name} orbits ${parents.join('-')}`);
                    console.log('=======================================================');
                });
            },
            style: function (type) {
                let data = star.find(s => s.name === type);
                let css;
                if (data) {
                    css = `text-shadow: 0px 0px 10px ${data.color}; color: ${data.color}`
                }
                return css ? css : 'color: gold; text-shadow: 0px 0px 10px gold;';
            }
        },
        async created() {
            this.getBodies();
        }
    }
</script>
