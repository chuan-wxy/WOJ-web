import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 引入echarts
import Echarts from 'vue-echarts'
import * as echarts from 'echarts'

import router from "./router";
import ElementPlus from "element-plus";
import ArcoVue from '@arco-design/web-vue';
import 'element-plus/dist/index.css'
import '@arco-design/web-vue/dist/arco.css';
import "bytemd/dist/index.css";
import "@/assets/global.css"
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(ElementPlus);
app.use(ArcoVue);
// 使用组件
app.component('e-charts',Echarts)
// 全局挂载 echarts
app.config.globalProperties.$echarts = echarts

app.use(pinia);
app.use(router);
app.mount('#app');
