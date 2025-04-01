import axios from 'axios'
import { useUserStore } from '../../store/user.js'

export default{
	common:{
		method:'GET',
		data:{},
		params:{},
		headers:{}
	},
	$axios(options={}){
		
		const userStore = useUserStore()
		
		options.method=options.method || this.common.method
		options.data=options.data || this.common.data
		options.params=options.params || this.common.params
		options.headers=options.headers || this.common.headers
		
		//加载动画，请求前
		
		if( options.headers.token ){
			options.headers.token = userStore.token
			if(!userStore.token){
				console.log('用户未登录')
			}
		}
		
		return axios(options).then(v=>{
			let data = v.data.data
			return new Promise((res,rej)=>{
				if(!v) return rej()
				
				//请求结束，关闭加载动画
				
				res(data)
			})
		})
	}
}