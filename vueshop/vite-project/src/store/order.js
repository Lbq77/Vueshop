import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order',{
	state:()=>({
		list:[],
		order_id:localStorage.getItem('shop_orderId') || ''
	}),
	actions:{
		initOrder(orderId){
			this.list = orderId
			this.order_id = orderId[0].order_id
			localStorage.setItem('shop_orderId',orderId[0].order_id)
		}
	}
})