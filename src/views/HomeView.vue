<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import HeaderSection from '@/components/HeaderSection.vue'
import { useRouter, useRoute } from 'vue-router'

const latestMovies = ref([])
const popularMovies = ref([])
const topMovies = ref([])
const searchQuery = ref('')
const apikey = '323028b4f64c5b9effe07560441a913e'

const currentIndexLatest = ref(0)
const currentIndexPopular = ref(0)
const currentIndexTop = ref(0)
const moviesPerPage = 5

const selectedVideo = ref(null)
const router = useRouter()
const route = useRoute()

const fetchMovies = async () => {
  try {
    const latestResponse = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apikey}&language=ko-KR`)
    const latestMoviesData = latestResponse.data.results
    await fetchMovieVideos(latestMoviesData)
    latestMovies.value = latestMoviesData

    const popularResponse = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apikey}&language=ko-KR`)
    const popularMoviesData = popularResponse.data.results
    await fetchMovieVideos(popularMoviesData)
    popularMovies.value = popularMoviesData

    const topResponse = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apikey}&language=ko-KR`)
    const topMoviesData = topResponse.data.results
    await fetchMovieVideos(topMoviesData)
    topMovies.value = topMoviesData

    console.log(latestResponse, popularResponse, topResponse)
  } catch (error) {
    console.log(error)
  }
}

const fetchMovieVideos = async (movies) => {
  for (const movie of movies) {
    const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apikey}&language=ko-KR`)
    const teasers = videoResponse.data.results.filter((video) => video.type === 'Teaser')
    if (teasers.length > 0) {
      movie.teaser = teasers[0]
    } else {
      movie.teaser = null
    }
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value } })
  }
}

const goToDetails = (id) => {
  console.log(`Navigating to details of movie ID: ${id}`) // 디버그 로그 추가
  router.push({ name: 'about', params: { id } })
}

const openVideo = (key) => {
  selectedVideo.value = `https://www.youtube.com/embed/${key}`
}

const closeVideo = () => {
  selectedVideo.value = null
}

const nextSlideLatest = () => {
  if (currentIndexLatest.value < Math.ceil(latestMovies.value.length / moviesPerPage) - 1) {
    currentIndexLatest.value += 1
  }
}

const prevSlideLatest = () => {
  if (currentIndexLatest.value > 0) {
    currentIndexLatest.value -= 1
  }
}

const nextSlidePopular = () => {
  if (currentIndexPopular.value < Math.ceil(popularMovies.value.length / moviesPerPage) - 1) {
    currentIndexPopular.value += 1
  }
}

const prevSlidePopular = () => {
  if (currentIndexPopular.value > 0) {
    currentIndexPopular.value -= 1
  }
}

const nextSlideTop = () => {
  if (currentIndexTop.value < Math.ceil(topMovies.value.length / moviesPerPage) - 1) {
    currentIndexTop.value += 1
  }
}

const prevSlideTop = () => {
  if (currentIndexTop.value > 0) {
    currentIndexTop.value -= 1
  }
}

onMounted(fetchMovies)

watch(route, () => {
  if (route.name === 'search' && route.query.q) {
    searchQuery.value = route.query.q
    fetchMovies()
  }
})
</script>

<template>
  <div id="wrap">
    <HeaderSection />

    <main id="main" role="main">
      <header id="header" role="banner">
        <div class="header__inner">
          <div class="search">
            <input v-model="searchQuery" type="text" placeholder="Search" @keyup.enter="performSearch" />
            <button @click="performSearch"><v-icon name="hi-search" scale="1.2" class="icon_search"></v-icon></button>
          </div>
          <div class="community">Community</div>
          <div class="signin">Sign in</div>
        </div>
      </header>

      <h1>
        Unlimited <span>Movie</span>, <br />
        TVs Shows, & More
      </h1>

      <div class="view__inner">
        <section class="01">
          <h3 class="title01">신작 영화</h3>
          <div class="button-container">
            <button class="prev-button" @click="prevSlideLatest">&#10094;</button>
            <button class="next-button" @click="nextSlideLatest">&#10095;</button>
          </div>
          <ul :style="{ transform: `translateX(-${currentIndexLatest * 24}%)` }">
            <li v-for="movie in latestMovies" :key="movie.id" class="view__card style1">
              <div class="movie-card">
                <img :src="'https://image.tmdb.org/t/p/w500/' + movie.poster_path" :alt="movie.title" />
                <div class="overlay">
                  <button class="details-button" @click="goToDetails(movie.id)">상세 정보</button>
                  <button v-if="movie.teaser" class="details-button2" @click="openVideo(movie.teaser.key)">트레일러</button>
                </div>
              </div>
            </li>
          </ul>
        </section>

        <section class="02">
          <h3 class="title01">개봉 예정</h3>
          <div class="button-container">
            <button class="prev-button" @click="prevSlidePopular">&#10094;</button>
            <button class="next-button" @click="nextSlidePopular">&#10095;</button>
          </div>
          <ul :style="{ transform: `translateX(-${currentIndexPopular * 24}%)` }">
            <li v-for="movie in popularMovies" :key="movie.id" class="view__card style1">
              <div class="movie-card">
                <img :src="'https://image.tmdb.org/t/p/w500/' + movie.poster_path" :alt="movie.title" />
                <div class="overlay">
                  <button class="details-button" @click="goToDetails(movie.id)">상세 정보</button>
                  <button v-if="movie.teaser" class="details-button2" @click="openVideo(movie.teaser.key)">트레일러</button>
                </div>
              </div>
            </li>
          </ul>
        </section>

        <section class="03">
          <h3 class="title01">평점 높은 영화</h3>
          <div class="button-container">
            <button class="prev-button" @click="prevSlideTop">&#10094;</button>
            <button class="next-button" @click="nextSlideTop">&#10095;</button>
          </div>
          <ul :style="{ transform: `translateX(-${currentIndexTop * 24}%)` }">
            <li v-for="movie in topMovies" :key="movie.id" class="view__card style1">
              <div class="movie-card">
                <img :src="'https://image.tmdb.org/t/p/w500/' + movie.poster_path" :alt="movie.title" />
                <div class="overlay">
                  <button class="details-button" @click="goToDetails(movie.id)">상세 정보</button>
                  <button v-if="movie.teaser" class="details-button2" @click="openVideo(movie.teaser.key)">트레일러</button>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <div v-if="selectedVideo" class="modal" @click="closeVideo">
        <div class="modal-content" @click.stop>
          <span class="close" @click="closeVideo">&times;</span>
          <iframe :src="selectedVideo" width="1400" height="75%" frameborder="0" allowfullscreen></iframe>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss">
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

  h1 {
    width: 100%;
    max-width: 1400px;
    position: relative;
    padding: 6px;
    font-size: 5rem;
    font-family: var(--fontJ);
    font-weight: bold;
    margin-bottom: 5rem;
    color: white;
    z-index: 2;
    margin-left: 1.3rem;
    span {
      color: var(--pointColor);
      font-size: 5rem;
    }
  }
  .search-result {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    position: relative;
    margin-top: 5rem;
    margin: 0 auto;
    padding: 6px;
    z-index: 2;
    margin-left: 1.3rem;
    h3 {
      font-size: 2vw;
      font-family: var(--fontD);
      text-align: left;
    }
    .movie-card {
      width: 20%;
      height: 40vh;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        border: 1px solid var(--black100);
      }
      .overlay {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: opacity 0.3s ease;
        .details-button,
        .details-button2 {
          background-color: #000000a8;
          color: var(--pointColor);
          border: none;
          padding: 13px 33px;
          cursor: pointer;
          font-size: 1rem;
          border-radius: 45px;
          font-family: var(--fontD);
          margin: 0.5rem;
        }
      }
      &:hover .overlay {
        opacity: 1;
      }
    }
  }
  .view__inner {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    position: relative;
    margin-top: 5rem;
    margin: 0 auto;
    padding: 6px;
    z-index: 2;
    margin-left: 1.3rem;
    section {
      margin-bottom: 3rem;
    }
    .title01 {
      font-size: 2vw;
      font-family: var(--fontD);
      text-align: left;
    }
    .button-container {
      display: flex;
      max-width: 100%;
      margin: 0 auto;
      position: relative;
      top: -5.5rem;
      left: -3rem;
      gap: 1rem;
      justify-content: right;
      margin-top: 3rem;
      z-index: 2;
      .prev-button,
      .next-button {
        background-color: var(--black);
        border: 3px solid var(--black300);
        color: var(--white);
        font-size: 1rem;
        cursor: pointer;
        padding: 0.2rem 0.6rem;
        border-radius: 50%;
      }
    }
    ul {
      width: 280vw;
      display: flex;
      gap: 1rem;
      list-style: none;
      padding: 0;
      margin: 0;
      transition: transform 0.3s ease;
      margin-top: -3.3rem;
      li {
        width: 20%;
        height: 40vh;
        position: relative;
        .movie-card {
          width: 100%;
          height: 100%;
          position: relative;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            border: 1px solid var(--black100);
          }
          .overlay {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: opacity 0.3s ease;
            .details-button {
              position: fixed;
              background-color: #000000a8;
              color: var(--pointColor);
              border: none;
              padding: 13px 33px;
              cursor: pointer;
              font-size: 1rem;
              border-radius: 45px;
              font-family: var(--fontD);
              margin-top: -4rem;
            }
            .details-button2 {
              position: absolute;
              background-color: #000000a8;
              color: var(--pointColor);
              border: none;
              padding: 13px 33px;
              cursor: pointer;
              font-size: 1rem;
              border-radius: 45px;
              font-family: var(--fontD);
              margin-top: 3rem;
            }
          }
          &:hover .overlay {
            opacity: 1;
          }
        }
      }
    }
  }
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.9);
  }
  .modal-content {
    width: 1400px;
    height: 115vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .close {
    color: #aaa;
    float: right;
    font-size: 60px;
    font-weight: bold;
    position: absolute;
    top: 57px;
    right: -60px;
    cursor: pointer;
  }
  @media (max-width: 1200px) {
    .view__inner ul {
      width: 500vw;
      li {
        width: 25%;
      }
    }
  }
  @media (max-width: 800px) {
    .view__inner ul {
      width: 500vw;
      li {
        width: 50%;
      }
    }
  }
  @media (max-width: 600px) {
    .view__inner ul {
      width: 500vw;
      li {
        width: 100%;
      }
    }
  }
}
</style>
