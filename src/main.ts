import App from './App.vue'
import { createApp } from 'vue'
import { initPinia } from '@/store'
import { initRouter } from './router'
import language from './locales' // 国际化
import '@styles/core/tailwind.css' // tailwind
import '@styles/index.scss' // 样式
import '@utils/sys/console.ts' // 控制台输出内容
import { setupGlobDirectives } from '@/directives'

const app = createApp(App)

initPinia(app)
initRouter(app)
setupGlobDirectives(app)

app.use(language)
app.mount('#app')
