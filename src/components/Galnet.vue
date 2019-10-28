<template>
    <div class="card">
        <div class="card-header">
            <h2><img src="@/assets/GalNet.png" alt="" width="48">
                GalNet</h2>
        </div>
        <div class="card-body">
            <div v-if="!feed[0]" class="text-center">
              <img src="@/assets/loading.svg" alt="" width="64">
              <h2>Loading</h2>
            </div>
            <!--          eslint-disable-->
            <div v-for="item in feed" v-bind:key="feed.id">
                <h3>{{ item.title }} - <span style="font-size:20px">{{ item.date }}</span></h3>
                <p v-html="item.content"></p>
                <hr>
            </div>
            <!--          eslint-enable-->
        </div>
    </div>
</template>

<script>
    const fetch = require('node-fetch');

    export default {
        name: 'Galnet',
        data: function() {
            return {
              feed: [],
            }
        },
        async created() {
            let request = await fetch('https://www.alpha-orbital.com/galnet-feed');
            let feed = await request.json();
            this.feed = feed.map(function (item, index) {
                return {id: index, content: item.content, date: item.date, title: item.title}
            }).slice(0, 10);
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
