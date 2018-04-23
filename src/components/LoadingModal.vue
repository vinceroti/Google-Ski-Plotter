<template>
  <div class="modal">
    <h1> Load your google maps JSON</h1>
  </div>
</template>

<script>
  export default {
    name: 'LoadingModal',
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
