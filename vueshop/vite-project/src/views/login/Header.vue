<template>
	<header>
		<div @click="goBack">
			<i>
				<
			</i>
		</div>
		<div>
			<span>登陆/注册</span>
		</div>
		<div>
			<i class="iconfont icon-liaotian"></i>
		</div>
	</header>
</template>

<script setup>
	import { useRouter } from 'vue-router';
	let router = useRouter()
	const goBack =()=>{
		router.back()
	}
</script>

<style scoped>
	header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 1.173333rem;
			color: #fff;
			background-color: #ff5777;
		}
	
		header span {
			font-size: 0.48rem;
		}
	
		header i {
			padding: 0 0.4rem;
			font-size: 0.586666rem;
		}
</style>