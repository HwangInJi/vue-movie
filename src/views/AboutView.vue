<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import HeaderSection from '@/components/HeaderSection.vue'

const route = useRoute()
const movieID = ref(route.params.id)
const movie = ref(null)
const credits = ref([])
const keywords = ref([])
const recommendations = ref([])
const backdrops = ref([])
const posters = ref([])
const activeImageTab = ref('backdrops') // 'backdrops' 또는 'posters'
const apikey = '323028b4f64c5b9effe07560441a913e'

const fetchMovieDetails = async () => {
  try {
    console.log('Fetching movie details for ID:', movieID.value)
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieID.value}?api_key=${apikey}&language=ko-KR`)
    movie.value = response.data
    console.log('Movie Details:', response.data)
  } catch (error) {
    console.error('Error fetching movie details:', error)
  }

  try {
    const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieID.value}/videos?api_key=${apikey}&language=ko-KR`)
    if (videoResponse.data.results.length > 0) {
      const teaserKey = videoResponse.data.results[0].key
      movie.value.teaserKey = teaserKey
    }
  } catch (error) {
    console.error('Error fetching video:', error)
  }

  try {
    const responseCredits = await axios.get(`https://api.themoviedb.org/3/movie/${movieID.value}/credits?api_key=${apikey}&language=ko-KR`)
    credits.value = responseCredits.data.cast
    console.log('Credits:', credits.value)
  } catch (error) {
    console.error('Error fetching credits:', error)
  }

  try {
    const responseKeywords = await axios.get(`https://api.themoviedb.org/3/movie/${movieID.value}/keywords?api_key=${apikey}&language=ko-KR`)
    keywords.value = responseKeywords.data.keywords
    console.log('Keywords:', keywords.value)
  } catch (error) {
    console.error('Error fetching keywords:', error)
  }

  try {
    const responseRecommendations = await axios.get(`https://api.themoviedb.org/3/movie/${movieID.value}/recommendations?api_key=${apikey}&language=ko-KR`)
    recommendations.value = responseRecommendations.data.results
    console.log('Recommendations:', recommendations.value)
  } catch (error) {
    console.error('Error fetching recommendations:', error)
  }

  try {
    const responseImages = await axios.get(`https://api.themoviedb.org/3/movie/${movieID.value}/images?api_key=${apikey}`)
    backdrops.value = responseImages.data.backdrops
    posters.value = responseImages.data.posters
    console.log('Backdrops:', backdrops.value)
    console.log('Posters:', posters.value)
  } catch (error) {
    console.error('Error fetching images:', error)
  }
}

onMounted(fetchMovieDetails)
</script>

<template>
  <div id="wrap">
    <HeaderSection />

    <div id="main" role="main">
      <div v-if="movie" class="detail">
        <div class="movie-details">
          <img v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w500/' + movie.poster_path" :alt="movie.title" class="poster" />
          <div class="details">
            <h2 class="title">{{ movie.title }}</h2>
            <p class="overview">{{ movie.overview }}</p>
            <p class="info">Vote : {{ movie.vote_average.toFixed(1) }}</p>
            <p class="info">Popularity : {{ movie.popularity.toFixed(2) }}</p>
            <p class="info">Date : {{ movie.release_date }}</p>
            <p class="info">Genres : {{ movie.genres.map((genre) => genre.name).join(', ') }}</p>
          </div>
        </div>

        <div class="movie-keywords">
          <div class="keywords-container">
            <span v-for="keyword in keywords" :key="keyword.id" class="keyword">{{ keyword.name }}</span>
          </div>
        </div>

        <div class="credits">
          <h3>출연자</h3>
          <div class="credits-container">
            <ul class="credits-list">
              <li v-for="credit in credits" :key="credit.cast_id" class="credit">
                <div class="credit-info">
                  <img v-if="credit.profile_path" :src="'https://image.tmdb.org/t/p/w500/' + credit.profile_path" :alt="credit.name" class="profile-image" />
                  <div class="name-and-character">
                    <span class="cast__name">{{ credit.name }}</span
                    ><br />
                    <span class="char__name">{{ credit.character }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="teaser" v-if="movie.teaserKey">
          <h3>티저 영상</h3>
          <div class="teaser-video-container">
            <iframe width="560" height="315" :src="'https://www.youtube.com/embed/' + movie.teaserKey" frameborder="0" allowfullscreen></iframe>
          </div>
        </div>

        <div class="recommendations" v-if="recommendations.length > 0">
          <h3>추천 영화</h3>
          <div class="recommendations-container">
            <ul class="recommendations-list">
              <li v-for="recommendation in recommendations" :key="recommendation.id" class="recommendation">
                <div class="recommendation-info">
                  <img v-if="recommendation.poster_path" :src="'https://image.tmdb.org/t/p/w500/' + recommendation.poster_path" :alt="recommendation.title" class="recommendation-image" />
                  <div class="title-and-release">
                    <span class="recommendation-title">{{ recommendation.title }}</span
                    ><br />
                    <span class="recommendation-release">{{ recommendation.release_date }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="image-section">
          <button @click="activeImageTab = 'backdrops'" :class="{ active: activeImageTab === 'backdrops' }">배경</button>
          <button @click="activeImageTab = 'posters'" :class="{ active: activeImageTab === 'posters' }">포스터</button>

          <div v-if="activeImageTab === 'backdrops'" class="image">
            <img v-for="backdrop in backdrops" :key="backdrop.file_path" :src="'https://image.tmdb.org/t/p/w500/' + backdrop.file_path" class="image-item" />
          </div>
          <div v-if="activeImageTab === 'posters'" class="image">
            <img v-for="poster in posters" :key="poster.file_path" :src="'https://image.tmdb.org/t/p/w500/' + poster.file_path" class="image-item2" />
          </div>
        </div>
      </div>
    </div>
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

.detail {
  width: 100%;
  padding: 20px;
  margin-left: 1.3rem;
}

.movie-details {
  display: flex;
  width: 80%;
  margin-bottom: 20px;
  margin-top: 2rem;
}

.poster {
  width: 280px;
  height: auto;
  border-radius: 8px;
  margin-right: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.details {
  flex: 1;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-family: var(--fontD);
}

.overview {
  margin-bottom: 15px;
  line-height: 1.6;
  font-family: var(--fontJ);
}

.info {
  margin-bottom: 8px;
  font-family: var(--fontD);
}

.movie-keywords {
  margin: 20px 0;
}

.keywords-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.keyword {
  background-color: var(--pointColor);
  padding: 5px 10px;
  border-radius: 15px;
  font-family: var(--fontJ);
  font-size: 0.9rem;
  color: #fff;
}

.credits {
  margin-bottom: 20px;
  border-top: 1px solid var(--pointColor);
  padding-top: 20px;
}

.credits h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  font-family: var(--fontJ);
  font-weight: 700;
}

.credits-container {
  overflow: hidden;
  position: relative;
}

.credits-list {
  display: flex;
  animation: scroll 40s linear infinite;
}

.credit {
  flex: 0 0 auto;
  margin-right: 10px;
}

.credit-info {
  width: 120px;
}

.profile-image {
  width: 100px;
  height: 150px;
  border-radius: 8px;
  margin-bottom: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.name-and-character {
  text-align: center;
}

.cast__name,
.char__name {
  font-weight: bold;
  font-family: var(--fontD);
  font-size: 16px;
}

.teaser {
  border-top: 1px solid var(--pointColor);
  padding-top: 20px;
}

.teaser h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  font-family: var(--fontJ);
  font-weight: 700;
}

.teaser-video-container {
  display: flex;
  justify-content: center; /* 동영상을 가운데 정렬 */
}

.teaser iframe {
  margin-top: 10px;
}

.recommendations {
  margin-top: 20px;
  border-top: 1px solid var(--pointColor);
  padding-top: 20px;
}

.recommendations h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  font-family: var(--fontJ);
  font-weight: 700;
}

.recommendations-container {
  overflow: hidden;
  position: relative;
}

.recommendations-list {
  display: flex;
  animation: scroll 40s linear infinite;
}

.recommendation {
  flex: 0 0 auto;
  margin-right: 10px;
}

.recommendation-info {
  width: 120px;
  font-family: var(--fontD);
  font-size: 16px;
}

.recommendation-image {
  width: 100px;
  height: 150px;
  border-radius: 8px;
  margin-bottom: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title-and-release {
  text-align: center;
}

.recommendation-title {
  font-weight: bold;
}

.image-section {
  margin-top: 20px;
}

.image-section button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 20px;
  background-color: var(--pointColor);
  color: #fff;
  cursor: pointer;
  font-family: var(--fontD);
  font-size: 0.9rem;
}

.image-section button.active {
  background-color: #ff6600;
}

.image {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-item {
  width: 240px;
  height: 150px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.image-item2 {
  width: 240px;
  height: 300px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
