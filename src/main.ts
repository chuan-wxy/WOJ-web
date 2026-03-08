import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

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
app.use(pinia);
app.use(router);
app.mount('#app');
