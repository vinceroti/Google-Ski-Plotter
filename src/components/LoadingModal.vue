<template>
  <div class="modal">
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
  data () {
    return {
      file: ''
    }
  },
  methods: {
    handleFileUpload () {
      this.file = this.$refs.file.files[0]
      console.log(this.file)
    },
    submitFile () {
      let formData = new FormData()
      formData.append('file', this.file)
      console.log(formData, this.file)
      axios.post('http://localhost:8081', formData, {
        headers: {
          'Content-Type': 'undefined'
        }
      }).then(function () {
        console.log('SUCCESS!!')
      }).catch(function () {
        console.log('FAILURE!!')
      })
    }
  }
}
</script>


<style>
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
  }
</style>
