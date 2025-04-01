import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
// 获取环境变量，Vite 会自动替换这里的值
const base = import.meta.env.VITE_BASE_URL || '/'
const router = createRouter({
  history: createWebHistory(base),
  routes: [
	{
		path:'/',
		redirect:'/home'
		
	},
    {
      path: '/home',
      name: 'Home',
      component: Home,
    },
	{
	  path: '/shopping',
	  name: 'Shopping',
	  component: () => import('../views/Shopping.vue'),
	},
	{
	  path: '/live',
	  name: 'Live',
	   component: () => import('../views/Live.vue'),
	},
	{
	  path: '/my',
	  name: 'My',
	   component: () => import('../views/My.vue'),
	},
	
	{
	  path: '/search',
	  name: 'Search',
	  redirect:{name:'index'},
	  children:[
		  {
			  path:'/',
			  name:'index',
			  component:()=>import('../views/search/SearchIndex.vue')
		  },
		  {
		  			  path:'list',
		  			  name:'list',
		  			  component:()=>import('../views/search/SearchList.vue'),
					  props: route => ({ key: route.query.key, page: route.query.page }),
		  },
	  ],
	   component: () => import('../views/Search.vue'),
	},
	{
	  path: '/sort',
	  name: 'Sort',
	   component: () => import('../views/Sort.vue'),
	},
	{
	  path: '/detail',
	  name: 'Detail',
	  meta:{keepAlive:true},
	   component: () => import('../views/Detail.vue'),
	},
	{
	  path: '/login',
	  name: 'Login',
	   component: () => import('../views/login/Login.vue'),
	},
	{
	  path: '/register',
	  name: 'Register',
	   component: () => import('../views/login/Register.vue'),
	},
	{
	  path: '/modify',
	  name: 'Modify',
	   component: () => import('../views/login/Modify.vue'),
	},
	{
	  path: '/order',
	  name: 'Order',
	   component: () => import('../views/Order.vue'),
	},
	{
	  path: '/payment',
	  name: 'payment',
	  component: () => import('../views/payment.vue'),
	},
	
  ],
})
export default router