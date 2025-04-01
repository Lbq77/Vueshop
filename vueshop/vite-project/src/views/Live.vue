<template>
	<div class="cart">
		<header>
			<i @click="goBack">
				< </i>
					<span>购物车</span>
					<span>编辑</span>
		</header>
	</div>
	<section>
		<ul>
			<li v-for="(item,index) in lists" :key="item.id">
				<div class="check">
					<van-checkbox class="vantcheck" @click="checkItem(index)" v-model="item.checked"></van-checkbox>
				</div>
				<h2>
					<img :src="item.goods_imgUrl" alt="" />
				</h2>
				<div class="goods">
					<div class="goods-title">
						<span>{{item.goods_name}}</span>
					</div>
					<div class="goods-num">
						<div class="goods-price">￥{{item.goods_price}}</div>
						<van-stepper @change="changeNum($event,item)" v-model="item.goods_num" integer></van-stepper>
					</div>
				</div>
			</li>
		</ul>
	</section>
	<footer>
		<div class="redio">
			<van-checkbox @click="checkAllFn" v-model="isCheckedAll"></van-checkbox>
		</div>
		<div class="total">
			<div>
				全选（<span class="total-active">{{total.num}}</span>）
			</div>
		</div>
		<div class="order">
			<div class="order-price">
				<span class="total-active">￥{{total.price}}</span>
			</div>
			<div class="order-jiesuan" @click="goOrder">
				结算
			</div>
		</div>
	</footer>
</template>

<script setup>
	import {
		ref,
		onMounted,
		watch
	} from 'vue'
	// const checked = ref(true)
	const value = ref(1)
	
	import {useRouter} from 'vue-router'
	let router = useRouter()
	const goBack = () => {
		router.push('/')
	}
	
	onMounted(()=>{
		getData()
		isCheckedAll.value = cartStore.isCheckedAll
	})
	
	import http from '@/common/api/request.js'
	let lists = ref([])
	import {useCartStore} from '../store/cart.js'
	const cartStore = useCartStore()
	import { storeToRefs } from 'pinia'
	const { total } = storeToRefs(cartStore)
	const getData = async ()=>{
		let res = await http.$axios({
			url:'/api/selectCart',
			method:'post',
			headers:{
				token:true
			}
		})
		console.log('购物车数据',res)
		res.data.forEach(v=>{
			v['checked'] = true
		})
		cartStore.cartList(res.data)
		lists.value = cartStore.list
	}
	console.log(lists.value)
	let checkItem = (i)=>{
		cartStore.check_item(i)
	}
	let checkAllFn = ()=>{
		cartStore.checkAllFn()
	}
	let isCheckedAll = ref('')
	watch(lists,()=>{
		isCheckedAll.value = lists.value.every(item => item.checked)
	},{deep:true})
	
	//修改数据
	const changeNum = (value,item)=>{
		console.log(value,item)
		http.$axios({
			url:'/api/updateNum',
			method:'post',
			headers:{
				token:true
			},
			data:{
				id:item.id,
				num:value
			}
		})
	}
	import { useOrderStore } from '../store/order.js'
	const orderStore = useOrderStore()
	//跳转到结算页面
	const goOrder = ()=>{
		if( !cartStore.selectList.length ){
			return
		}
		
		//选中商品的新数组,此时数组里是一个一个的对象
		let newList = []
		lists.value.forEach(item => {
			cartStore.selectList.filter(v=>{
				if(v==item.id){
					newList.push(item)
				}
			})
		})
		console.log(newList)
		//生成订单
		http.$axios({
			url:'/api/addOrder',
			method:'post',
			headers:{
				token:true
			},
			data:{
				arr:newList
			}
		}).then(res => {
			console.log('res666',res)
			if( !res.success ) return
			orderStore.initOrder(res.data)
			//跳转提交订单也买你
			console.log('准备跳转...')
			router.push({
			    path: '/order',
			    query: {
			        detail: JSON.stringify(cartStore.selectList)
			    }
			})
			console.log('跳转完成')

		})
		
		// router.push({
		// 	path:'/order',
		// 	query:{
		// 		detail:JSON.stringify(cartStore.selectList)
		// 	}
		// })
	}
</script>

<style scoped>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 1.173333rem;
		color: #fff;
		background-color: #ff5777;
	}

	header i {
		padding: 0 0.4rem;
		font-size: 0.586666rem;
	}

	header span {
		padding: 0 0.4rem;
		font-size: 0.426666rem;
	}

	section {
		background-color: #f5f5f5;
	}

	section ul {
		display: flex;
		flex-direction: column;
	}

	section ul li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.16rem 0.533333rem;
		margin: 0.213333rem 0;
		background-color: #fff;
	}

	section ul li .check {
		padding-right: 0.373333rem;
	}

	section ul li .goods {
		display: flex;
		height: 2.525rem;
		flex-direction: column;
		justify-content: space-between;
		padding-left: 0.4rem;
		font-size: 0.32rem;
	}

	section ul li .goods .goods-title {
		display: flex;
		font-size: 0.355rem;
		font-weight: 700;
	}

	section ul li .goods .goods-title i {
		font-size: 0.586666rem;
	}

	section ul li .goods .goods-price {
		padding: 0.08rem 0;
		color: #ff5777;
		font-weight: 700;
		font-size: 0.4375rem;
	}

	section ul li .goods .goods-num {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	section ul li img {
		width: 1.973333rem;
		height: 2.573333rem;
	}

	footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 1.28rem;
		border-top: 0.053333rem solid #ccc;
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #fff;
	}

	footer .radio {
		padding: 0 0.4rem;
	}

	footer .total {
		flex: 1;
		font-size: 0.32rem;
	}

	footer .total .total-active {
		color: #ff5777;
	}

	footer .order {
		width: 4.4rem;
		text-align: center;
		font-size: 0.426666rem;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	footer .order .order-price {
		color: #ff5777;
		line-height: 1.28rem;
		font-weight: 700;
	}

	footer .order .order-jiesuan {
		padding: 0.125rem 0.3875rem;
		height: 0.6375rem;
		background-color: #ff5777;
		color: #fff;
		font-size: 0.4125rem;
		line-height: 0.6375rem;
		border-radius: 0.4rem;
	}
</style>