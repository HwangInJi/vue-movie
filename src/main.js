import './assets/scss/style.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { HiSearch, RiHomeSmileFill, RiMovie2Fill, MdLivetvTwotone, MdPricechange, CoGithub, BiChatSquareDotsFill } from 'oh-vue-icons/icons'

addIcons(HiSearch, RiHomeSmileFill, RiMovie2Fill, MdLivetvTwotone, MdPricechange, CoGithub, BiChatSquareDotsFill)

const app = createApp(App)
app.component('v-icon', OhVueIcon)
app.use(router)
app.mount('#app')
