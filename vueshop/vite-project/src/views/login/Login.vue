<template>
	<div class="login">
		<Header></Header>
		<section>
			<div class="login-tel">
				<input type="text" v-model="userTel" placeholder="输入手机号" pattern="[0-9]*" />
			</div>
			<div class="login-pwd">
				<input type="text" v-model="userPwd" placeholder="输入密码" />
			</div>
			<div class="login-btn" @click="login">登录</div>
			<div class="tab">
				<span @click="goModify">修改密码</span>
				<span @click="goRegister">快速注册</span>
			</div>
		</section>
	</div>
</template>

<script setup>
	import Header from './Header.vue';
	import { ref } from 'vue'
	
	const userTel = ref('')
	const userPwd = ref('')
	
	const rules = {
		userTel:{
			rule:/^1[23456789]\d{9}$/,
			msg:'手机输入内容错误，请重新输入'
		},
		userPwd:{
			rule:/^\w{6,12}$/,
			msg:'密码输入内容错误，请重新输入'
		}
	}
	
	import { showToast } from 'vant'
	
	//验证规则
	const validate = (key) =>{
		let bool = true
		const value = key === 'userTel' ? userTel.value : userPwd.value
		if( !rules[key].rule.test(value) ){
			showToast(rules[key].msg)
			bool = false
			return false
		}
		return bool
	}
	
	import http from '@/common/api/request.js'
	import { useUserStore } from '../../store/store.js'
	const userStore = useUserStore()
	const login = ()=>{
		//验证
		if( !validate('userTel') ) return
		if( !validate('userPwd') ) return
		http.$axios({
			url:'/api/login',
			method:'POST',
			data:{
				userTel:userTel.value,
				userPwd:userPwd.value
			}
		}).then(res => {
			console.log( '登录信息',res )
			showToast(res.msg)
			//跳转页面/保存用户信息
			//如果登录失败
			if( !res.success) return
			userStore.userLogin(res.data)
			router.push('/home')
		})
	}
	
	import { useRouter } from 'vue-router';
	let router = useRouter()
	//跳转注册页面
	const goRegister = ()=>{
		router.push({path:'/register'})
	}
	
	const goModify = ()=>{
		router.push({path:'/modify'})
	}
</script>

<style scoped>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
	}

	section>div {
		margin: 0.266666rem 0;
		width: 8.933333rem;
		height: 1.173333rem;
	}

	section input {
		box-sizing: border-box;
		padding: 0 0.266666rem;
		line-height: 1.173333rem;
		background-color: #FFFFFF;
		border: 1px solid #ccc;
		border-radius: 6px;
	}

	section .login-tel {
		margin-top: 0.8rem;
	}

	section .login-tel input {
		width: 8.933333rem;
	}

	section .login-pwd {
		margin-top: 0.8rem;
	}

	section .login-pwd input {
		width: 8.933333rem;
	}

	section .login-btn {
		line-height: 44px;
		color: #fff;
		text-align: center;
		background-color: #ff5777;
		border-radius: 6px;
	}

	section .tab {
		display: flex;
		justify-content: space-between;
		font-size: 0.373333rem;
	}
</style>