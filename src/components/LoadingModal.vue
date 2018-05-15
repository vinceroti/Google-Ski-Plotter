<template>
  <div  class="modal">
    <div v-if="!loading" ref="handleFileUpload" class="flex-container">
      <h1 class="full-width">Google Maps Skiing Plotter</h1>
      <p class="full-width">This is an application that will take your google maps history data, and find out how many days you went skiing at a resort. No infomation is saved but it is sent to a server to parse through the large JSON file</p>
      <label class="full-width">File
        <input type="file" id="file" ref="file" accept="application/json" v-on:change="handleFileUpload()"/>
      </label>
      <button v-bind:disabled="disabled" v-on:click="submitFile()">Submit</button>
      <div class="full-width bar-container flex-container">
        <span class="full-width">{{ progress }}%</span>
        <div class="bar" :style="'width:' + progress + '%'"></div>
      </div>
    </div>
    <div v-if="loading" class="flex-container">
      <p class="full-width margin-bottom"> File upload complete, waiting on server response (This could take a few mins..)</p>
      <loading-circle class="full-width"></loading-circle>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Circle } from 'vue-loading-spinner'
import io from 'socket.io-client'
const socket = io.connect(process.env.SERVER)

export default {
  name: 'LoadingModal',
  props: ['getData'],
  components: {
    'loading-circle': Circle
  },
  data () {
    return {
      file: '',
      loading: false,
      disabled: false,
      progress: 0
    }
  },
  mounted () {
    const self = this
    socket.on('recieve', function (res) {
      console.log(res)
      self.getData(JSON.parse(res))
    })
    socket.on('generic', function (msg) {
      console.log(msg)
    })
  },
  methods: {
    handleFileUpload () {
      this.file = this.$refs.file.files[0]
    },
    submitFile () {
      const self = this
      const formData = new FormData()
      this.disabled = true
      formData.append('file', this.file)

      axios.post(process.env.SERVER, formData, {
        onUploadProgress: function (progressEvent) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          self.progress = progress
          if (progress === 100) {
            self.loading = true
          }
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (res) {
        console.log(res.data.status)
      }).catch(function (res) {
        console.log('FAILURE!!', res)
      })
    }
  }
}
</script>

<style scoped>
  .bar {
    display: flex;
    height: 5px;
    background: #fff;
    margin: 30px;
  }
  .bar-container {
    display: flex;
  }
  .modal {
    width: 90vw;
    height: 100vh;
    left: 50%;
    top: 20%;
    height: 50%;
    position: fixed;
    transform: translateX(-50%);
    background: gray;
    color: #fff;
    z-index: 9;
    border-radius: 5px;
    transition: ease-out 0.3s all;
  }
  .flex-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .full-width {
    width: 100%;
  }
  button {
    margin-top: 10px;
    width: 100px;
    height: 30px;
  }
  .margin-bottom {
    margin: 50px;
  }
  p {
    margin:  5px 70px 20px;
    font-size: 16px;
  }
  span {
    margin: 10px 0;
  }
</style>
