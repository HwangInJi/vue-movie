<!-- src/components/HeaderSection.vue -->
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
  router.push({ name: 'home' })
}
</script>

<template>
  <aside id="aside">
    <h1 class="logo" @click="goToHome"><em>Sky</em>watch</h1>
    <nav class="menu">
      <ul>
        <li>
          <a href="#"><v-icon name="ri-home-smile-fill" scale="1.4" class="icon"></v-icon>Home</a>
        </li>
        <li>
          <a href="#"><v-icon name="ri-movie-2-fill" scale="1.4" class="icon"></v-icon>Movies</a>
        </li>
        <li>
          <a href="#"><v-icon name="md-livetv-twotone" scale="1.4" class="icon"></v-icon>TvShows</a>
        </li>
        <li>
          <a href="#"><v-icon name="md-pricechange" scale="1.4" class="icon"></v-icon>Pricing</a>
        </li>
        <li>
          <a href="#"><v-icon name="co-github" scale="1.4" class="icon"></v-icon>Github</a>
        </li>
        <li>
          <a href="#"><v-icon name="bi-chat-square-dots-fill" scale="1.4" class="icon"></v-icon>Contact</a>
        </li>
      </ul>
    </nav>
    <footer id="footer" role="contentinfo"></footer>
  </aside>
</template>

<style scoped lang="scss">
#wrap {
  width: 100%;
  height: inherit;
  display: flex;
  overflow: hidden;
}

#wrap::-webkit-scrollbar {
  display: none;
}

#aside {
  width: 15%;
  height: 100vh;
  position: fixed;
  background-color: #242424;

  .logo {
    text-align: left;
    padding: 20px;
    font-size: 2vw;
    font-family: var(--fontS);
    font-weight: 500;
    cursor: pointer; /* 커서를 포인터로 변경하여 클릭 가능함을 나타냅니다 */

    em {
      font-size: 2.5vw;
      font-family: var(--fontS);
      color: var(--pointColor);
    }

    #footer {
      height: 20%;
    }
  }
  .menu {
    padding: 20px;
    text-align: left;
    font-size: 1.3vw;
    font-family: 'Jura';

    ul {
      li {
        padding: 10px;
        a {
          .icon {
            margin-right: 0.5rem;
          }
        }

        a:hover {
          color: var(--pointColor);
        }
      }
    }
  }
}
</style>
