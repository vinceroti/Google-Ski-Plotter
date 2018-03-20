<template>
  <main>
    <gmap-map
    :center="{lat:47.9282, lng: -121.5045}"
    :zoom="8"
    >
      <gmap-marker
         :key="index"
         v-for="(location, index) in locations"

         :position="{ lat: (location.latitudeE7 / 1e7), lng: (location.longitudeE7 / 1e7) }"
         :clickable="true"
         :draggable="false"
         @click="center={ lat: (location.latitudeE7 / 1e7), lng: (location.longitudeE7 / 1e7) }"
      ></gmap-marker>
    </gmap-map>
    <ul class="dates">
      <li v-for="(date, index) in dates "> {{ date +", " + (index + 1) }} </li>
    </ul>
  </main>
</template>

<script>
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import axios from 'axios'

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
  data () {
    return {
      locations: '',
      dates: ''
    }
  },
  mounted: function() {
    console.log('mounted')
    axios.get('http://localhost:8081/api')
    .then(function(response){
        console.log(response);
        this.locations  = response.data.locations
        this.dates = response.data.dates
    }.bind(this))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .vue-map-container {
  width: 100vw;
  height: 100vh;
 }
 .dates {
  position: absolute;
  left: 0;
  top: 10%;
  width: 20%;
  padding-left: 15px;
  list-style-type: none;
 }
 .dates li {
  text-align: left;
 }
</style>
