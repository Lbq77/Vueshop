<template>
	<header>
		<div class="search-return" @click="goBack">
			<
		</div>
		<div class="search-main">
			<form action="" onsubmit="return false" @keyup.enter="goSearchList">
				<input type="search" placeholder="学院风jk套装" v-model="searchVal"/>
			</form>
		</div>
		<div class="search-btn" @click="goSearchList">搜索</div>
	</header>
</template>

<script setup>
	import {useRouter,useRoute} from 'vue-router'
	import { ref } from 'vue'
	let router = useRouter()
	let route = useRoute()
	const goBack = ()=> {
		router.back()
	}
	let searchVal = ref(route.query.key||'')
	let goSearchList = ()=>{
		// console.log(searchVal.value)
		if(!searchVal.value) return
		let searchList = localStorage.getItem('searchList') || '[]'
		let searchArr = JSON.parse(searchList)
		searchArr.unshift(searchVal.value)
		const uniqueSet = new Set(searchArr)
		const newArray = Array.from(uniqueSet)
		localStorage.setItem('searchList',JSON.stringify(newArray))
		router.push({name:'list',query:{key:searchVal.value}})
	}
	
</script>

<style>
	header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 1.173333rem;
			/* background-color:#f5f5f5; */
			border-bottom: 1px solid #ccc;
		}
	
		.search-return,
		.serach-btn {
			padding: 0 0.266666rem;
			color: #666;
		}
	
		.search-main {
			display: flex;
			align-items: center;
			width: 6.933333rem;
			height: 0.7rem;
		}
	
		.search-main form {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
		}
	
		.search-main form input {
			width: 100%;
			height: 100%;
			padding: 0 0 0 0.25rem;
			border: 1px solid #ccc;
			/* 设置默认边框颜色 */
			transition: border-color 0.3s ease;
			/* 平滑过渡效果 */
			border-radius: 0.1875rem;
		}
	
		.search-main form input:focus {
			outline: none;
			/* 去掉默认的轮廓线 */
			border-color: #ff4466;
			/* 改变边框颜色 */
		}
	
		.search-btn {
			font-size: 0.456666rem;
		}
		
		.search-return {
			font-size: 0.556666rem;
		}
</style>