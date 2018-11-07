import Vue from 'vue';
import Router from 'vue-router';
import GoogleMaps from './components/GoogleMaps.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Google Maps',
      component: GoogleMaps,
    },
  ],
});
