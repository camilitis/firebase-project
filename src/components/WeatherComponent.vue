<template>
<section v-if="this.weather.cityName" :class="this.weather.img" class="weather-card">
  <div class="weather-card-blur">
  </div>
    <h2 class="weather-card-text">{{this.weather.temperature}}</h2>
    <h4 class="weather-card-text">{{this.weather.description}}</h4>
    <a @click="changelocationmode" class="weather-card-text-city">{{this.weather.cityName}}, {{this.weather.country}}</a>

  <div id="changelocationmode" class="menu-container menu-weather">
      <div class="menu">
        <ul class="menu-list">
          <li class="menu-item">
            <input v-model="this.entercityname" placeholder="Enter city" class="menu-item" type="text">
            <button @click="changecity" class="menu-button">
              <vue-feather type="map"></vue-feather>
              Change city
            </button>
          </li>
        </ul>
        <ul v-if="this.locationtype == 'city' && this.$store.state.geolocation.error == false" class="menu-list">
          <li class="menu-item">
            <button @click="getWeather" class="menu-button">
              <vue-feather type="map-pin"></vue-feather>
              Change to current location
            </button>
          </li>
        </ul>
      </div>
  </div>

    <div 
    v-if="this.weathermenu == true"
    @click="changelocationmode" class="app-backdrop"></div>
</section>
</template>
<script>
export default {
  data(){
    return{
      entercityname: null,

      locationtype: 'lonlat',

      weathermenu: false,

      weather:{
        cityName: null,
        country: null,
        temperature: null,
        description: null,
        img: null,
      }
    }
  },
  methods: {
    changelocationmode(){
      document.getElementById('changelocationmode').classList.toggle('menu-weather-show')
      if(this.weathermenu == true){
        this.weathermenu = false
      }else if(this.weathermenu == false){
        this.weathermenu = true
      }
    },

    getWeather: async function (){
      this.locationtype = 'lonlat'

      const VUE_APP_WEATHER_API_KEY = process.env.VUE_APP_WEATHER_API_KEY

      const latURL = `http://api.openweathermap.org/data/2.5/weather?lat=${this.$store.state.geolocation.lat}&lon=${this.$store.state.geolocation.lng}&appid=${VUE_APP_WEATHER_API_KEY}&units=metric`

      if(this.locationtype == 'lonlat'){
        try{
          const response = await fetch(latURL)
          const data = await response.json()

          this.citySearch = ''
          this.weather.cityName = data.name
          this.weather.country = data.sys.country
          this.weather.temperature = Math.round(data.main.temp) + '°C'
          this.weather.description = data.weather[0].description

          const timeOfDay = data.weather[0].icon
          const weatherConditions = data.weather[0].main

          if(weatherConditions === 'Clouds') {
            this.weather.img = 'cloudy'
          }else if(weatherConditions === 'Snow'){
            this.weather.img = 'snowy'
          }else if(weatherConditions === 'Thunderstorm' || weatherConditions === 'Drizzle' || weatherConditions === 'Rain'){
            this.weather.img = 'rainy'
          }else if (weatherConditions === 'Clear' || weatherConditions == '') {
            if (timeOfDay.includes("n")) {
              this.weather.img = 'clear-night'
            }else {
              this.weather.img = 'clear-day'
            }
          }
        } catch(error){
          console.log(error)
        }
      }
      this.changelocationmode()
    },

    changecity: async function (){
      const VUE_APP_WEATHER_API_KEY = process.env.VUE_APP_WEATHER_API_KEY
      const cityURL = `https://api.openweathermap.org/data/2.5/weather?q=${this.entercityname}&appid=${VUE_APP_WEATHER_API_KEY}&units=metric`;

      if(this.entercityname){
        this.locationtype = 'city'
        try{
          const response = await fetch(cityURL)
          const data = await response.json()

          this.citySearch = ''
          this.weather.cityName = data.name
          this.weather.country = data.sys.country
          this.weather.temperature = Math.round(data.main.temp) + '°C'
          this.weather.description = data.weather[0].description

          const timeOfDay = data.weather[0].icon
          const weatherConditions = data.weather[0].main

          if(weatherConditions === 'Clouds') {
            this.weather.img = 'cloudy'
          }else if(weatherConditions === 'Snow'){
            this.weather.img = 'snowy'
          }else if(weatherConditions === 'Thunderstorm' || weatherConditions === 'Drizzle' || weatherConditions === 'Rain'){
            this.weather.img = 'rainy'
          }else if (weatherConditions === 'Clear' || weatherConditions == '') {
            if (timeOfDay.includes("n")) {
              this.weather.img = 'clear-night'
            }else {
              this.weather.img = 'clear-day'
            }
          }

          this.entercityname = null
        } catch(error){
          console.log(error)
          alert('Please enter a valid city name')

          this.entercityname = 'Tokio'
          this.changecity()
        }
      }else{
        alert('Please enter a city name')
      }
      this.changelocationmode()
    }
  },
  created: function(){
    this.getWeather()
  },
  mounted(){
    if(this.$store.state.geolocation.error == true){
      this.entercityname = 'Tokio'
      this.changecity()
    }
  }
}
</script>
<style lang="scss">
@import '@/styles/AppStyle.scss';
@import '@/styles/TasksListStyle.scss';
@import '@/styles/MenuStyle.scss';

input[type=text], input[type=date], input[type=radio], input[type=password], select{
  border-radius: 10px;
}

.weather-card{
  max-width: 400px;
  border: 3px solid var(--text-color);
  border-radius: 10px;
  height: 150px;
  box-shadow: 2px 2px 10px var(--task-dropshadow);
  opacity: .9;
  transition: .2s;
  color: rgb(212, 212, 212);
  transition: .2s;
  margin: auto;

  &:hover{
    opacity: 1;
    box-shadow: none;
  }

  &-blur{
  background-size: cover;
  filter: blur(1px);
  position: fixed;
  z-index: 1;
  display: block;
  }

  &-text{
    -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;
    margin-left: 20px;
    text-transform: capitalize;
    &-city{
    cursor: pointer;
    margin-left: 20px;
      &:hover{
        text-decoration: underline;
      }
    }
  }
}

.cloudy{
  background-image: url("https://images.unsplash.com/photo-1595661671412-e20c4a3e65cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80");
}
.snowy{
  background-image: url("https://images.unsplash.com/photo-1491002052546-bf38f186af56?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1208&q=80");
}
.rainy{
  background-image: url("https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=751&q=80");
}
.clear-day{
  background-image: url("https://images.unsplash.com/photo-1585996950364-1975d93bd896?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=683&q=80");
}
.clear-night{
  background-image: url("https://images.unsplash.com/photo-1506863250276-e0b65a47fed1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80");
}

.menu-weather{
  display: none;
  &-show{
    display: block;
  }
}
</style>