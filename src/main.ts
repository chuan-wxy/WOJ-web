import { createApp } from 'vue'
import App from './App.vue'
import { initRouter } from './router'
import ElementPlus from 'element-plus'
import ArcoVue from '@arco-design/web-vue'
import language from './locales' // 国际化
import '@styles/core/tailwind.css' // tailwind
import '@styles/index.scss' // 样式
import '@utils/sys/console.ts' // 控制台输出内容
import 'element-plus/dist/index.css'
import '@arco-design/web-vue/dist/arco.css'
import 'bytemd/dist/index.css'
import '@/assets/global.css'
import { initPinia } from '@/store'

const app = createApp(App)

initPinia(app)
initRouter(app)

app.use(language)
app.use(ElementPlus)
app.use(ArcoVue)

app.mount('#app')
