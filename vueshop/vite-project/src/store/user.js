import { defineStore } from 'pinia'

export const useUserStore = defineStore('user',{
	state:()=>({
		//用户的信息
		userInfo:{},
		//用户的token
		token:null,
		//用户的登录状态
		loginStatus:false
	}),
	actions:{
		//保存用户的信息
		async userLogin(user){
			this.loginStatus = true
			this.token = user.token
			this.userInfo = user
			localStorage.setItem('saveUserInfo',JSON.stringify(user))
		},
		//获取数据
		initUser(){
			const userInfo = JSON.parse(localStorage.getItem('saveUserInfo'))
			if( userInfo ){
				this.loginStatus = true
				this.token = userInfo.token
				this.userInfo = userInfo
			}
		},
		//退出登录
		loginOut(){
			this.loginStatus = false
			this.token = null
			this.userInfo = {}
			localStorage.removeItem('saveUserInfo')
		}
	}
})