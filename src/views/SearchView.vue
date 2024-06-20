<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import HeaderSection from '@/components/HeaderSection.vue'

const searchResults = ref([])
const apikey = '323028b4f64c5b9effe07560441a913e'
const route = useRoute()
const currentIndex = ref(0)
const itemsPerPage = 5

const fetchSearchResults = async () => {
  const query = route.query.q
  if (query) {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${query}&language=ko-KR`)
      searchResults.value = response.data.results
    } catch (error) {
      console.log(error)
    }
  }
}

const openMovie = (id) => {
  window.open(`https://www.themoviedb.org/movie/${id}`, '_blank')
}

const nextSlide = () => {
  if (currentIndex.value < Math.ceil(searchResults.value.length / itemsPerPage) - 1) {
    currentIndex.value += 1
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
  }
}

onMounted(fetchSearchResults)
</script>

<template>
  <div id="wrap">
    <HeaderSection />

    <main id="main" role="main">
      <header id="header" role="banner">
        <div class="header__inner">
          <div class="search">
            <input v-model="searchQuery" type="text" placeholder="Search" />
            <button @click="performSearch"><v-icon name="hi-search" scale="1.2" class="icon_search"></v-icon></button>
          </div>
          <div class="community">Community</div>
          <div class="signin">Sign in</div>
        </div>
      </header>

      <div class="search-container">
        <h1>검색 결과</h1>
        <div v-if="searchResults.length" class="movies-grid">
          <div class="button-container">
            <button class="prev-button" @click="prevSlide">&#10094;</button>
            <div class="movie-list">
              <div v-for="movie in searchResults.slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage)" :key="movie.id" class="movie-card">
                <img :src="'https://image.tmdb.org/t/p/w500/' + movie.poster_path" :alt="movie.title" />
                <div class="overlay">
                  <h2>{{ movie.title }}</h2>
                  <button @click="openMovie(movie.id)">상세 정보</button>
                </div>
              </div>
            </div>
            <button class="next-button" @click="nextSlide">&#10095;</button>
          </div>
        </div>
        <div v-else>
          <p>No results found.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
#wrap {
  width: 100%;
  height: inherit;
  display: flex;
}

#wrap::-webkit-scrollbar {
  display: none;
}

#main {
  width: 85%;
  height: 100vh;
  position: relative;
  background-image: url('https://image.tmdb.org/t/p/w600_and_h900_bestv2/pmemGuhr450DK8GiTT44mgwWCP7.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  margin-left: 15%;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.719);
    z-index: 1;
  }
  * {
    position: relative;
    z-index: 2;
  }

  #header {
    width: 100%;
    margin-bottom: 4rem;
    margin-top: 2rem;
    margin-left: 1.3rem;
  }

  .header__inner {
    width: 100%;
    padding: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: -3rem;

    .search {
      flex: 1;
      margin-left: 3rem;
      display: flex;

      input {
        width: 100%;
        max-width: 400px;
        border-radius: 8rem;
        padding: 10px 44px;
        border: 2px solid var(--pointColor);
        background-color: var(--black);
        font-size: 1.2rem;
        color: var(--white);
        font-family: var(--fontJ);
      }

      button {
        background: none;
        border: none;
        cursor: pointer;
      }

      .icon_search {
        margin-top: -0.3rem;
        margin-left: -3rem;
        color: var(--pointColor);
      }
    }

    .community {
      margin-right: 1rem;
      font-size: 1.2rem;
      color: var(--white);
      font-family: 'Jura';
    }

    .signin {
      background-color: var(--pointColor);
      padding: 7px 35px;
      border-radius: 20px;
      color: var(--white);
      font-family: 'Jura';
      cursor: pointer;
    }
  }
  .search-container {
    padding: 20px;
    color: white;
  }

  h1 {
    font-family: var(--fontD);
  }

  .button-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .prev-button,
  .next-button {
    background-color: var(--black);
    border: 3px solid var(--black300);
    color: var(--white);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem 1.1rem;
    border-radius: 50%;
  }

  .movie-list {
    display: flex;
    gap: 20px;
    overflow: hidden;
    width: calc(100% - 100px); /* Adjust based on button sizes */
  }

  .movie-card {
    position: relative;
    width: calc(20% - 20px);
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
  }

  .movie-card img {
    width: 100%;
    height: auto;
  }

  .overlay {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    text-align: center;
    padding: 10px;
  }

  .overlay h2 {
    font-size: 1.2rem;
    margin: 0;
  }

  .overlay button {
    background-color: #f05a28;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 10px;
  }
}
</style>
