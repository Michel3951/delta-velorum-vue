<template>
    <div>
        <div class="card mt-3">
            <div class="card-header">
                <h3><img src="@/assets/planet.svg" width="28" alt=""> Celestial Bodies</h3>
            </div>
            <div class="card-body">
                <div v-for="body in bodies.bodies" v-bind:key="body.id">

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const fetch = require('node-fetch');
    export default {
        name: 'Bodies',
        props: {
            system: null,
        },
        data: function () {
            return {
                bodies: null,
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
                    this.bodies = bodies;
                    this.stars = bodies.filter(b => b.type === 'Star');
                    this.planets = bodies.filter(b => b.type === 'Planet');
                }
            },
            children: function (id) {
                
            }
        },
        async created() {
            this.getBodies();
        }
    }
</script>
