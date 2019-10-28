<template>
    <div id="app">
        <header>
            <div class="float-left">
                <img src="@/assets/logo.png" alt="" class="img-fluid" width="28">
                <span> Delta Velorum Companion</span>
            </div>
            <div class="float-right">
                <a href="#" v-on:click="minimize()" class="text-white mr-2" id="hide"><i class="fas fa-minus"></i></a>
                <a href="#" v-on:click="close()" class="text-danger" id="close"><i class="fas fa-times"></i></a>
            </div>
        </header>
        <div class="container-fluid my-4">
            <div class="row w-100" id="content">
                <div class="col-3">
                    <div class="position-fixed" style="width: 22%">
                        <div class="card">
                            <div class="card-header">
                                <strong>Navigation</strong>
                            </div>
                            <div class="card-body">
                                <ul class="list-unstyled">
                                    <li><router-link to="/">GalNet</router-link></li>
                                    <li>
                                        <a href="#edsm-menu" v-on:click="toggle('#edsm-menu')"
                                           role="button">
                                            Star Map <i class="fas fa-caret-down"></i>
                                        </a>
                                        <div class="d-none" id="edsm-menu">
                                            <ul class="list-unstyled ml-2">
                                                <li><router-link to="/starmap/system">System</router-link></li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                                <hr>
                                <router-link to="/settings">Settings</router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-9">
                    <router-view/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const remote = require('electron').remote;
    const $ = require('jquery');

    export default {
        name: 'App',
        methods: {
            close: function () {
                return remote.getCurrentWindow().close();
            },
            minimize: function () {
                return remote.getCurrentWindow().minimize();
            },
            toggle: function (id) {
                let $id = $(id);
                $id.toggleClass('d-none');
            }
        }
    }
</script>

<style>

    #app {

    }
</style>
