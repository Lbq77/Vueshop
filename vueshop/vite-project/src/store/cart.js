import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart',{
	state:()=>({
		//购物车数据
		list:[],
		//选中商品的数据
		selectList:[]
	}),
	getters:{
		isCheckedAll(){
			return this.list.length === this.selectList.length
		},
		total(state){
			let total = {num:0,price:0}
			this.list.forEach(v=>{
				if(v.checked){
					total.num+=parseInt(v.goods_num)
					total.price+=v.goods_price*v.goods_num
				}
			})
			// this.list.forEach(v=>{
			// 	if( v.checked ){
			// 		total.num += parseInt(v.goods_num)
			// 		total.prie += v.goods_num * v.goods_num
			// 	}
			// })
			return total
		}
	},
	actions:{
		cartList(cartArr){
			this.list = cartArr
			cartArr.forEach(v => {
				this.selectList.push(v.id)
			})
		},
		//全选
		check_all(){
			this.selectList = this.list.map(v => {
				v.checked = true
				return v.id
			})
		},
		//全不选
		un_check_all(){
			this.list.forEach(v =>{
				v.checked = false
			})
			this.selectList = []
		},
		// 单选
		check_item(index){
			let id = this.list[index].id
			let i = this.selectList.indexOf(id)
			if( i > -1 ){
				return this.selectList.splice(i,1)
			}
			this.selectList.push(id)
		},
		checkAllFn(){
			this.isCheckedAll ? this.un_check_all() : this.check_all()
		}
	}
})