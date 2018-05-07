<template>
  <main>
    <LoadingModal :getData="getData"/>
    <div class="slider" v-bind:style="{ maxWidth: maxWidth }" >
      <ul class="dates">
        <h2> Days On The Hill </h2>
        <p> Days: {{ dates.length }}
        <li v-for="(date, index) in dates "> {{ date +", " + (index + 1) }} </li>
      </ul>
    </div>
    <gmap-map
    :center="{lat:47.9282, lng: -121.5045}"
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
      locations: '',
      dates: '',
      maxWidth: 0
    }
  },
  mounted: function () {
    console.log('mounted')
  },
  methods: {
    getData(data) {
      this.locations = data.locations
      this.dates = data.dates
      console.log(data)
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
