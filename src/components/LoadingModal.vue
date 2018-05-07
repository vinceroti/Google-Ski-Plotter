<template>
  <div :class="classes">
    <h1> Load your google maps JSON</h1>
    <label>File
      <input type="file" id="file" ref="file" accept="application/json" v-on:change="handleFileUpload()"/>
    </label>
    <button v-on:click="submitFile()">Submit</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'LoadingModal',
  props: ['getData'],
  data () {
    return {
      classes: 'modal',
      file: ''
    }
  },
  methods: {
    handleFileUpload () {
      this.file = this.$refs.file.files[0]
      console.log(this.file)
    },
    submitFile () {
      let self = this
      let formData = new FormData()
      formData.append('file', this.file)
      axios.post('http://localhost:8081', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (res) {
        self.getData(res.data)
        self.classes += ' hidden'
      }).catch(function (res) {
        console.log('FAILURE!!')
      })
    }
  }
}
</script>


<style>
  .hidden {
    opacity: 0;
    visibility: hidden;
  }
  .modal {
    position: fixed;
    width: 90vw;
    height: 900vh;
    left: 50%;
    height: 50%;
    transform: translate(-50%, 50%);
    background: gray;
    color: #fff;
    z-index: 9;
    border-radius: 5px;
    transition: ease-out 0.3s all;
  }
</style>
