<template>
  <div class="settings">
    <h2>My account</h2>

    <hr>

    <img style="width: 100px; border-radius: 50%;" src="https://lh3.googleusercontent.com/a-/AOh14GjeZNqGbkyOMLxvGpzeg5s4hZdy5F6-eyWJ3aVinA=s100">
    <button>Upload photo</button>

    <hr>

    <h4>Personal info</h4>
    <h6>Email:</h6>
    <p>user123@users.com</p>

    <h6>Preferred name</h6>
    <input :placeholder="this.$store.state.username">

    <hr>

    <h4>Password</h4>
    <button>Change password</button>

    <h2>Workspace settings</h2>

    <hr>

    <h4>Name:</h4>
    <input :placeholder="this.$store.state.workspaceName"> 
    <!-- Crear this.workspace -->

    <button>Update</button>
    <button>Cancel</button>
  </div>
</template>

<script>
export default {
  name: 'ProfileMenu'
}
</script>

<style scoped lang="scss">
.settings {
  overflow: auto;
}
*{
  width: 200px;
}
hr{
  width: 100%;
}
</style>