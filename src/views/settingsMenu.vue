<template>
  <div class="settings">
    <h2>My account</h2>

    <hr>

    <img :src="imageUrl" style="height: 100px; width: 100px; border-radius: 50%;">
    <input type="file" @change="uploadImage">
    <p>{{this.uploadingprogress}}</p>

    <hr>

    <h4>Personal info</h4>
    Email:
    user123@users.com
    <button disabled>Change email</button>

    <h6>Preferred name</h6>
    <input :placeholder="this.$store.state.username" v-model="this.newusername" type="text">

    <hr>

    <h4>Password</h4>
    <button disabled>Change password</button>

    <!-- <h2>Workspace settings</h2>

    <hr>

    <h4>Name:</h4>
    <input :placeholder="this.$store.state.workspaceName">  -->
    <!-- Crear this.workspace -->

    <span class="settings-btn">
    <button @click="updatenewsettings" class="btn">Update</button>
    <button @click="cancelupdatesettings" class="cancel-btn btn">Cancel</button>
    </span>
  </div>
</template>
<script>
import { ref, update } from "firebase/database"
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import db from '@/main.js'

export default {
  name: 'ProfileMenu',
  data(){
    return{
      newusername: null,
      imageUrl: null,

      uploadingprogress: null,
    }
  },
  methods: {
    updatenewsettings(){
      if(this.newusername){
        update(ref(db, 'users/' + this.$store.state.userid), { username: this.newusername })
        this.newusername = null
        alert('Settings updated')
      }else if(this.newusername == null || this.newusername == ''){
        alert('Please enter a new username') //Dynamically add error message
      }

      this.$store.commit('setuserinfo')
    },

    cancelupdatesettings(){
      this.newusername = null
    },


    firstProfilePicture(){
      this.uploadImage('@/assets/profile.jpg')
    },
    uploadImage(e){
      var files = e.target.files || e.dataTransfer.files
      if (!files.length){
        return
      }

      const storage = getStorage()
      const storageRef = sRef(storage, this.userID + '/profile')
      const uploadTask = uploadBytesResumable(storageRef, files[0], {
        metadata: {
          contentType: 'image/png'
        }
      })

      uploadTask.on('state-changed', (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        this.uploadingprogress = 'Upload is ' + parseInt(progress) + '% done'

          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            this.imageUrl = downloadURL
            this.$store.dispatch('setprofilepic', downloadURL)
          })
      }),
      (error) => {
        alert(error.message)
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/styles/AppStyle.scss';
@import '@/styles/LogStyle.scss';

.settings {
  overflow: auto;
  display: flex;
  flex-direction: column;

  &-btn{
    display: flex;
    margin: 10px;
  }

  input, button{
    width: 300px;
  }
}

hr{
  width: 100%;
}
</style>