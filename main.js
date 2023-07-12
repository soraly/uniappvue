import App from './App.vue'
import './utils/noScale.js'
import filters from './utils/filters'
import store from "./store";
import en from './locale/en.json'
import zhHans from './locale/zh-Hans.json'
import zhHant from './locale/zh-Hant.json'
import localdata from './utils/localdata/index.js'
import {config} from "./config/config.js";


import uView from "uview-ui";
Vue.use(uView);

/**
 * 新增全局属性
 */

Vue.prototype.$store=store;
Vue.prototype.$localdb=localdata;
Vue.prototype.$config=config;

const messages = {
	en,
	'zh-Hans': zhHans,
	'zh-Hant': zhHant
}

let i18nConfig = {
	locale: uni.getLocale(),// 获取已设置的语言
	messages
}
// #ifndef VUE3
import Vue from 'vue'
import VueI18n from 'vue-i18n';
Vue.config.productionTip = false
App.mpType = 'app'
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)
const app = new Vue({
	store,
	i18n,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import { createI18n } from 'vue-i18n'// v9.x
const i18n = createI18n(i18nConfig)


export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	return {
		app
	}
}
// #endif
Object.keys(filters).map(v => {
	Vue.filter(v, filters[v])
})
