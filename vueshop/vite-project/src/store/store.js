import { defineStore } from 'pinia'

//引入模块
import { useUserStore } from './modules/user.js'

//创建store
export const useRootStore = defineStore('root',{
	modules:{
		user:useUserStore
	}
})

export { useUserStore }