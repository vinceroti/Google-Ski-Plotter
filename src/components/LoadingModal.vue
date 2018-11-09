<template>
  <div  class="modal">
    <div v-if="!loading" ref="handleFileUpload" class="flex-container container">
      <h1 class="full-width">Google Maps Skiing Plotter</h1>
      <p class="full-width">This is an application that will take your google maps history data, and find out how many days you went skiing at a resort. No infomation is saved but it is sent to a server in order to parse through the large JSON file.</p>
      <p> Follow this <a target="_blank" href="https://takeout.google.com/settings/takeout">link</a>, click <b>SELECT NONE</b>, only select <b> Location History
      JSON format</b>. Upload ZIP</p>
      <label v-if="!file" class="full-width">
        <input type="file" id="file" ref="file" accept="application/zip" v-on:change="submitFile()"/>
      </label>
      <div v-if="file" class="full-width flex-container bar-container ">
        <span class="full-width">{{ progress }}%</span>
        <div class="bar" :style="'width:' + progress + '%'"></div>
      </div>
    </div>
    <div v-if="loading" class="flex-container">
      <p class="full-width margin-bottom"> File upload complete, waiting on server response (This could take a few mins...)</p>
      <loading-circle class="full-width"></loading-circle>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Circle } from 'vue-loading-spinner';
import io from 'socket.io-client';

const socket = io.connect(process.env.VUE_APP_SERVER);

export default {
  name: 'LoadingModal',
  props: ['getData'],
  components: {
    'loading-circle': Circle,
  },
  data() {
    return {
      file: '',
      loading: false,
      progress: 0,
    };
  },
  mounted() {
    const self = this;
    socket.on('done', (res) => {
      self.getData(JSON.parse(res));
      window.localStorage.setItem('map-data', res);
    });
  },
  methods: {
    submitFile() {
      const self = this;
      const formData = new FormData();
      this.file = true;
      formData.append('file', this.$refs.file.files[0]);
      formData.append('socketId', socket.id);

      axios.post(process.env.VUE_APP_SERVER || '/', formData, {
        onUploadProgress(progressEvent) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          self.progress = progress;
          if (progress === 100) {
            self.loading = true;
          }
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        console.log(res.data.status);
      }).catch((res) => {
        console.log('FAILURE!!', res);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .bar {
    display: flex;
    height: 5px;
    background: #fff;
    margin: 30px;
  }
  .modal {
    max-width: 90vw;
    min-width:  70vw;
    left: 50%;
    top: 15%;
    max-height: 70vh;
    position: fixed;
    transform: translateX(-50%);
    background: #759660;
    color: #fff;
    z-index: 9;
    border-radius: 5px;
    transition: ease-out 0.3s all;
    overflow: auto;
    padding: 20px 10px;
  }
  .flex-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .bar-container {
    justify-content: flex-start;
  }
  .full-width {
    width: 100%;
  }
  button {
    margin-top: 10px;
    width: 100px;
    height: 30px;
  }
  span {
    margin: 10px 0;
  }
</style>
