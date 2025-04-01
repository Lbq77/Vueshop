<template>
	<div class="tabbar">
	<ul>
		<li v-for="(item,index) in routerList" :key="index" @click="swichTab(item.path)">
			<span :class='route.path.includes(item.path) ? "active" : "" '>{{item.title}}</span>
		</li>
		
	</ul>
	</div>
</template>

<script setup>
	import {ref} from 'vue'
	import { useRouter,useRoute } from 'vue-router';
	let router=useRouter()
	let route = useRoute()
	
	const routerList=[
		{title:'首页',path:'/home'},
		{title:'商城',path:'/shopping'},
		{title:'直播',path:'/live'},
		{title:'我',path:'/my'},
	]
	
	//路由跳转
	const swichTab=(path)=>{
		router.replace(path)
	}
</script>

<style scoped>
	.tabbar {
			position: fixed;
			left: 0;
			bottom: 0;
			z-index: 999;
			width: 100%;
			height: 1.25rem;
			background-color: white;
		}
	
		.tabbar ul {
			display: flex;
			justify-content: space-around;
			align-items: center;
			width: 100%;
			height: 100%;
			border-top: 1px solid rgb(226, 226, 226);
		}
	
		.tabbar ul li {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	
		.tabbar ul li span {
			font-size: 0.45rem;
			color: rgb(102, 102, 102);
		}
	
		.tabbar ul li span.active {
		    color: red;
		}

</style>