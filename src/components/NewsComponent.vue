<template>
<section class="articles-container">
  <ul>
    <li v-for="article of articles" :key="article.title"><a :href="article.url">
      <h1>{{article.title}}</h1>
      <h2>{{article.author}}</h2>
      <p>{{article.description}}</p>
    </a></li>
  </ul>
</section>
</template>

<script>
export default {
  data(){
    return{
      articles: {}
    }
  },
  methods:{
    getnewsapi: async function(){
      var URL = `https://newsapi.org/v2/top-headlines?language=en&pageSize=4&apiKey=${process.env.VUE_APP_NEWS_API_KEY}`

      try{
        const response = await fetch(URL)
        const data = await response.json()

        this.articles = data.articles
        console.log(data.articles)
      }catch(error){
        console.log(error)
      }
    }
  },
  created() {
    this.getnewsapi()
  }
}
</script>
<style lang="scss">
.articles-container{
  overflow-y: scroll;
  height: 200px;

  li + li{
    border-top: 1px solid #ddd;
  }
}
ul{
  list-style: none;
  padding: 0;
  a{
    color: var(--text-color);
    text-decoration: none;
  }
  h1{
    color: var(--selected-color)
  }
}
</style>