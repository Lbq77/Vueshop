<template>
	<header>
		<div class="fenlei" @click="goSort">
			<img src="@/assets/img/fenlei.png" alt="" />
		</div>
		<div class="search" @click="gosearch">
			<i class="iconfont icon-fangdajing "></i>
			<span>学院风jk套装</span>
		</div> 
		<div class="liaotian">
			<i class="iconfont icon-liaotian"></i>
		</div>
	</header>
</template>

<script setup>
	import { useRouter } from 'vue-router';
	let router = useRouter()
	const gosearch = ()=>{
		router.push('/search')
	}
	const goSort = ()=>{
		router.push('/sort')
	}
	
</script>

<style scoped>
	header {
			display: flex;
			justify-content: space-around;
			align-items: center;
			width: 100%;
			height: 1.235rem;
			padding: 0.2rem 0.15rem;
			background-color: #fff;
			border-bottom: 1px solid #e5e5e5;
			box-sizing: border-box;
		}
	
		header .fenlei img {
			width: 0.6rem;
			height: 0.6rem;
			line-height: 0.8rem;
			margin-top: 0.188rem;
		}
	
		header .search {
			width: 7rem;
			height: 0.835rem;
			font-size: 0.4rem;
			color: #999;
			background-color: #eee;
			border-radius: 0.125rem;
		}
	
		header .search i {
			margin: 0 0.2rem;
			width: 0.9375rem;
			height: 0.9375rem;
			line-height: 0.9375rem;
		}
	
		header .liaotian i {
			font-size: 0.7rem;
			color: #999;
		}
	
	
</style>