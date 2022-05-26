<template>
  <h3>{{this.$store.state.todaysdate}}</h3>
  <div class="home-time">
    <h3 class="home-time-hours">{{this.$store.state.time}}</h3>
    <h4>
      <span v-if="this.$store.state.hours >= 5 && this.$store.state.hours < 12">Good morning</span>
      <span v-if="this.$store.state.hours >= 12 && this.$store.state.hours < 19">Good afternoon</span>
      <span v-if="this.$store.state.hours >= 19 && this.$store.state.hours <= 23 || this.$store.state.hours >= 0 && this.$store.state.hours < 5">Good evening</span>,
      {{this.$store.state.username}}
    </h4>
  </div>
  <section class="home-components">
    <div class="home-components-comp">
    <WeatherComponent/>
    <p>Click the location to change the city</p>
    </div>
    <div class="home-components-comp">
      <h2>Latest news</h2>
    <NewsComponent/>
    </div>
  </section>
</template>
<script>
import WeatherComponent from '../components/WeatherComponent.vue'
import NewsComponent from '../components/NewsComponent.vue'

export default{
  components:{
    WeatherComponent,
    NewsComponent
  }
}
</script>
<style lang="scss">
@import '@/styles/HomePage.scss';
</style>