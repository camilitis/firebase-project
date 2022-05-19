<template>
  <div class="settings">
    <h2>My account</h2>

    <hr>

    <img :src="this.$store.state.profilepicture" style="height: 100px; width: 100px; border-radius: 50%;">
    <input type="file" @change="uploadImage">
    <p>{{this.uploadingprogress}}</p>


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
        update(ref(db, 'users/' + this.$store.state.userid), { username: this.newusername })
        update(ref(db, 'users/' + this.$store.state.userid), { profilepicture: this.profilepicture })

        this.newusername = null
        this.imageUrl = null
        alert('Settings updated')

      this.$store.commit('setuserinfo')
    },

    cancelupdatesettings(){
      this.newusername = null
      this.downloadURL = null
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
@import '@/styles/SettingsStyle.scss';
</style>