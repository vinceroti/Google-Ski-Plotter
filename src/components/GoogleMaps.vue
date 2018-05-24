<template>
  <main>
    <LoadingModal :getData="getData" v-if="noFile"/>
    <div class="slider" v-if="!noFile" :style="{ maxWidth: maxWidth }" >
      <ul class="dates">
        <h2> Days On The Hill </h2>
        <p> Days: {{ dates.length }}
        <li v-for="(date, index) in dates" v-bind:key="(index + 1)">
          <a target="_blank" :href="`https://www.google.com/maps/timeline?pb=!1m2!1m1!1s${formatedDates[index]}`"> {{ date}} </a>
        </li>
      </ul>
    </div>
    <gmap-map
    :center="{lat:currentLocation.lat, lng:currentLocation.lng}"
    :zoom="zoom"
    >
    <a id="slider-toggle" href="#" v-if="!noFile" v-on:click="maxWidth === 0 ? maxWidth = '300px' : maxWidth = 0">&#9776;</a>
      <gmap-marker
         :key="index"
         v-for="(location, index) in locations"
         ref="myMarker"
         :position="{ lat: (location.latitudeE7 / 1e7), lng: (location.longitudeE7 / 1e7) }"
         :clickable="true"
         :draggable="false"
         @click="center={ lat: (location.latitudeE7 / 1e7), lng: (location.longitudeE7 / 1e7) }"
         :icon="{url: '../../static/marker.png', size: {width: 46, height: 46, f: 'px', b: 'px'}, scaledSize: {width: 40, height: 40, f: 'px', b: 'px'} }"
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
        lat: 39.8283,
        lng: -98.5795
      },
      zoom: 5,
      locations: '',
      dates: '',
      formatedDates: [],
      maxWidth: 0,
      noFile: true
    }
  },
  beforeMount () {
    const mapData = window.localStorage.getItem('map-data')
    if (mapData) {
      this.noFile = false
      this.getData(JSON.parse(mapData))
    }
  },
  mounted: function () {
    this.geolocation()
    console.log(this.$refs)
  },
  methods: {
    getData (data) {
      this.locations = data.locations
      this.dates = data.dates
      this.noFile = false
      this.filterDates(data.dates)
    },
    geolocation: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        this.zoom = 8
      })
    },
    filterDates (dates) {
      dates.forEach((date) => {
        const dateObj = new Date(date)
        this.formatedDates.push(`${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`)
      })
    }
  }
}
</script>

<style style lang="scss" >
  main {
    display: flex;
  }
  h2 {
    display:  inline;
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
    width: 100%;
    text-align: left;
    list-style-type: none;
    padding-left: 20px;
    white-space: nowrap;
    a {
      text-decoration: none;
    }
  }
  #slider-toggle {
    position: absolute;
    left: 120px;
    top: 7px;
    text-decoration: none;
    font-size: 30px;
  }
  .slider {
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    transition: max-width 0.2s ease-in-out;
  }
  .margin-bottom {
    margin-bottom: 50px;
  }
</style>
