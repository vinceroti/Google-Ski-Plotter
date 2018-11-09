<template>
  <main>
    <LoadingModal :getData="getData" v-if="noFile"/>
    <div class="slider" v-if="!noFile" :style="{ maxWidth: maxWidth }" >
      <ul class="dates">
        <h2> Days On The Hill </h2>
        <p> Days: {{ dates.length }}
        <li v-for="(date, index) in dates" v-bind:key="(index + 1)">
          <a target="_blank" :href="`${googleUrl}${formatedDates[index]}`"> {{ date }} </a>
        </li>
      </ul>
    </div>
    <l-map
      :center="[defaultLocation.lat, defaultLocation.lng]"
      :zoom="zoom"
      id="map"
    >
      <a
        id="slider-toggle"
        href="#" v-if="!noFile"
        @click="maxWidth === 0 ? maxWidth = '300px' : maxWidth = 0"
      >&#9776;</a>
      <l-tile-layer
        :url="LTileUrl"
        :attribution="Lattribution"/>
      <l-marker
         :key="index"
         v-for="(location, index) in locations"
         ref="myMarker"
         :lat-lng="[(location.latitudeE7 / 1e7), (location.longitudeE7 / 1e7) ]"
         :clickable="true"
         :draggable="false"
         @click="openPopup"
         :icon="Licon"
      >
        <l-popup :options="{ autoClose: false, closeOnClick: false }">
          <p>{{ dates[index] }} - <a target="_blank" :href="`${googleUrl}${formatedDates[index]}`">Details</a></p>
        </l-popup>
      </l-marker>
    </l-map>
  </main>
</template>

<script>
import { LMap, LMarker, LTileLayer, LPopup } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import LoadingModal from './LoadingModal.vue';
import Marker from '../assets/marker.png';

export default {
  name: 'Map',
  components: {
    LoadingModal,
    LMap,
    LMarker,
    LTileLayer,
    LPopup,
  },

  data() {
    return {
      defaultLocation: {
        lat: 39.8283,
        lng: -98.5795,
      },
      currentLocation: {},
      zoom: 5,
      locations: '',
      dates: '',
      formatedDates: [],
      maxWidth: 0,
      noFile: true,
      Licon: L.icon({ iconUrl: Marker, iconSize: [46, 46] }),
      LTileUrl: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
      Lattribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      googleUrl: 'https://www.google.com/maps/timeline?pb=!1m2!1m1!1s',
    };
  },
  beforeMount() {
    const mapData = window.localStorage.getItem('map-data');
    if (mapData) {
      this.noFile = false;
      this.getData(JSON.parse(mapData));
    }
  },
  mounted() {
    this.geolocation();
  },
  methods: {
    getData(data) {
      this.locations = data.locations;
      this.dates = data.dates;
      this.noFile = false;
      this.filterDates(data.dates);
    },
    geolocation() {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      function success(pos) {
        this.currentLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        this.zoom = 8;
      }
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }

      navigator.geolocation.getCurrentPosition(success, error, options);
    },
    filterDates(dates) {
      dates.forEach((date) => {
        const dateObj = new Date(date);
        this.formatedDates.push(`${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`);
      });
    },
    openPopup(event) {
      this.$nextTick(() => {
        event.target.openPopup();
      });
    },
  },
};
</script>

<style lang="scss" >
  main {
    display: flex;
  }
  h2 {
    display:  inline;
  }
  .vue-map-hidden {
    display: inline !important;
  }
  #location-popup {
    position: fixed;
    top: 0;
    left: 50%;
    width: 100%;
  }
  #map {
    position: relative;
    width: 100vw;
    height: 100vh;
    z-index: 0;
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
  .leaflet-popup {
    bottom: 10px !important;
    p {
      text-align: center;
      font-size: 14px;
    }
  }
  #slider-toggle {
    position: absolute;
    left: 55px;
    top: 12px;
    text-decoration: none;
    font-size: 30px;
    z-index: 500;
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
