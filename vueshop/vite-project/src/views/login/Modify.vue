<template>
	<div class="modify-password">
		<Header></Header>
		<section>
			<div class="modify-tel">
				<input type="text" v-model="userTel" placeholder="输入手机号" pattern="[0-9]*" />
			</div>
			<div class="modify-pwd">
				<input type="password" v-model="userPwd" placeholder="输入密码" pattern="\w{6,12}" />
			</div>
			<div class="modify-btn" @click="modifyPassword">修改密码</div>

		</section>
	</div>
</template>

<script setup>
	import Header from './Header.vue';
	import {
		ref
	} from 'vue'

	const userTel = ref('')
	const userPwd = ref('')

	const rules = {
		userTel: {
			rule: /^1[23456789]\d{9}$/,
			msg: '手机输入内容错误，请重新输入'
		},
		userPwd: {
			rule: /^\w{6,12}$/,
			msg: '密码输入内容错误，请重新输入'
		}
	}

	import {
		showToast
	} from 'vant'

	//验证规则
	const validate = (key) => {
		let bool = true
		const value = key === 'userTel' ? userTel.value : userPwd.value
		if (!rules[key].rule.test(value)) {
			showToast(rules[key].msg)
			bool = false
			return false
		}
		return bool
	}

	import http from '@/common/api/request.js'
	const modifyPassword = () => {
		if( !validate('userTel') ) return
		if( !validate('userPwd') ) return
		http.$axios({
			url:'/api/modify',
			method:'POST',
			data:{
				phone:userTel.value,
				pwd:userPwd.value
			}
		}).then(res => {
			showToast(res.msg)
			console.log( '修改信息',res )
		})
	}
</script>

<style scoped>
	.modify-password {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
	}

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

	section .modify-tel {
		margin-top: 0.8rem;
	}

	section .modify-tel input {
		width: 8.933333rem;
	}

	section .modify-pwd {
		margin-top: 0.8rem;
	}

	section .modify-pwd input {
		width: 8.933333rem;
	}

	section .modify-btn {
		line-height: 44px;
		color: #fff;
		text-align: center;
		background-color: #ff5777;
		border-radius: 6px;
	}
</style>