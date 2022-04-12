<template>
  <h2>Account</h2>

  <!-- <img> Profile picture -->
  <!-- <button>Upload photo</button> -->

  <h3>Personal info</h3>
  <h4>Preferred name:</h4>
  <input :placeholder="this.$store.state.username">

  <button>Update</button>
</template>

<script>
export default {
  name: 'ProfileMenu'
}
</script>

<style scoped>
</style>