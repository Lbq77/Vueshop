import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//引入公共样式
import '@/assets/css/common.css'

//引入淘宝无限适配方案
import '@/assets/js/flexible.js'

//引入字体图标的css文件
import '@/assets/css/iconfont.css'


//引入vantUI
import Vant from 'vant'
import 'vant/lib/index.css'

//引入pinia
import {createPinia} from 'pinia'
createApp(App).use(router).use(Vant).use(createPinia()).mount('#app')
