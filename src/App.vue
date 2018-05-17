<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  * {
    box-sizing: border-box;
  }
  #app {
    font-family: 'Lato', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  body {
    margin: 0;
  }
  a {
    color: #000;
    transition: all 0.15s linear
  }
  a:hover {
    color: #ddd;
  }
  p {
    font-size: 16px;
  }
  .container {
    margin: 0px 20px;
  }
</style>
