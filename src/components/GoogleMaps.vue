<template>
  <main>
    <LoadingModal :getData="getData" v-if="noFile"/>
    <div class="slider" v-bind:style="{ maxWidth: maxWidth }" >
      <ul class="dates">
        <h2> Days On The Hill </h2>
        <p> Days: {{ dates.length }}
        <li v-for="(date, index) in dates " v-bind:key="(index + 1) "> {{ date +", " + (index + 1) }} </li>
      </ul>
    </div>
    <gmap-map
    :center="{lat:currentLocation.lat, lng:currentLocation.lng}"
    :zoom="8"
    >
    <a id="slider-toggle" href="#"  v-on:click="maxWidth === 0 ? maxWidth = '300px' : maxWidth = 0">&#9776;</a>
      <gmap-marker
         :key="index"
         v-for="(location, index) in locations"

         :position="{ lat: (location.latitudeE7 / 1e7), lng: (location.longitudeE7 / 1e7) }"
         :clickable="true"
         :draggable="false"
         @click="center={ lat: (location.latitudeE7 / 1e7), lng: (location.longitudeE7 / 1e7) }"
      ></gmap-marker>
    </gmap-map>
  </main>
</template>

<script>
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import LoadingModal from './LoadingModal'

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.MAP_KEY,
    libraries: 'places' // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  }
})

export default {
  name: 'GoogleMaps',
  components: {
    LoadingModal
  },

  data () {
    return {
      currentLocation: {
        lat: 0,
        lng: 0
      },
      locations: '',
      dates: '',
      maxWidth: 0,
      noFile: true
    }
  },
  mounted: function () {
    this.geolocation()
  },
  methods: {
    getData (data) {
      this.locations = data.locations
      this.dates = data.dates
      this.noFile = false
    },
    geolocation: () => {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      })
    }
  }
}
</script>

<style>
  main {
    display: flex;
  }
  .vue-map-hidden {
    display: inline !important;
  }
  .vue-map-container {
    position: relative;
    width: 100vw;
    height: 100vh;
  }
  .dates {
    list-style-type: none;
    padding: 0;
    width: 300px;
  }
  .dates li {
    text-align: left;
    padding-left: 20px;
  }
  #slider-toggle {
    position: absolute;
    left: 120px;
    top: 7px;
    text-decoration: none;
    font-size: 30px;
  }
  .slider {
    height: 100vh;
    width: 300px;
    overflow-y: auto;
    transition: max-width 0.2s ease-in-out;
  }
</style>
