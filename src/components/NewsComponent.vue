<template>
<section class="articles-container">
  <ul>
    <li v-for="article of articles" :key="article.title"><a :href="article.url" target="_blank" rel="noopener noreferrer" class="showhim article">
      <span class="article-title">
        {{article.title}}
      </span>
      <span class="article-author"> - {{article.author}}</span>
      <span class="showme"><vue-feather type="external-link"></vue-feather></span>
      <p class="article-description">{{article.content}}</p>
    </a>
    </li>
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
  width: 600px;

  li + li{
    border-top: 1px solid #ddd;
    padding: 15px 0px;
  }

  ul{
    list-style: none;
    padding: 0;
    a{
      color: var(--text-color);
      text-decoration: none;
    }
  }
}

.article{
  &:hover{
    opacity: .7;
  }
  &-title{
    color: var(--selected-color);
    font-size: 1.2rem;
    font-weight: bold;
    line-height: 1.5;
  }
  &-author{
    font-weight: 600;
  }
  svg{
    width: 20px;
    margin: 0 10px;
  }
}

.showme {
  display: none;
}

.showhim:hover .showme {
  display: inline;
}
</style>