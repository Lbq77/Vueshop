<template>
	<div class="my">
		<header>
			<div class="my-bg">
				<img src="/images/mytopbg.png" alt="" />
			</div>
			<div class="login">
				<div class="login-actore" v-if="loginStatus">
					<div class="actore-name">{{userInfo.nickName}}</div>
				</div>
				<div class="login-actore" v-else>
					<div class="actore-name" @click="goLogin">登录/注册</div>
				</div>
				<div class="loginvip">
					<img src="/images/mytoprember.png" alt="" />
				</div>
			</div>
		</header>
		<section>
			<ul>
				<li>地址管理</li>
				<li @click="goOut">退出登录</li>
			</ul>
		</section>
		<Tabbar></Tabbar>
	</div>
</template>

<script setup>
	import Tabbar from '@/components/common/Tabbar.vue'
	
	import { useRouter } from 'vue-router';
	let router = useRouter()
	const goLogin = ()=>{
		router.push({path:'/login'})
	}
	import { computed } from 'vue'
	import { useUserStore } from '../store/user.js'
	const userStore = useUserStore()
	//计算属性
	const loginStatus = computed(()=>userStore.loginStatus)
	const userInfo = computed(()=>userStore.userInfo)
	
	//退出登录
	const goOut = () => {
		userStore.loginOut()
		router.push({path:'/'})
	}
</script>

<style scoped>
	.my {
		background-color: #f1f1f1;
	}

	.my .my-bg {
		width: 100%;
		height: 2.5rem;
	}

	.my .my-bg img {
		width: 100%;
		height: 100%;
	}

	.my header {
		/* overflow: hidden; */
		/* background-color: red; */
	}

	.my header .login {
		position: relative;
		width: 93%;
		height: 3.125rem;
		background-color: #fff;
		color: red;
		text-align: center;
		/* 文字也居中 */
		margin: -1.25rem auto;
		/* 水平居中 */
		border-radius: 0.1875rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;
		box-sizing: border-box;
	}

	.my header .login .login-actore {
		width: 100%;
		height: 2.5rem;
	}

	.my header .login .login-actore .actore-name {
		width: 100%;
		text-align: center;
		line-height: 1.5rem;
	}

	.my header .login .loginvip {
		width: 100%;
		height: 1.375rem;
	}

	.my header .login .loginvip img {
		width: 100%;
		height: 100%;
	}

	.my section {
		position: relative;
		top: 1.25rem;
		width: 93%;
		height: 1.5rem;
		background-color: #fff;
		margin: 0.3125rem auto;
		line-height: 1.5rem;
		font-size: 0.4375rem;
		border-radius: 0.1875rem;
	}
	.my section ul{
		display: flex;
	}
	.my section ul li{
		margin-right: 1.25rem;
	}
</style>