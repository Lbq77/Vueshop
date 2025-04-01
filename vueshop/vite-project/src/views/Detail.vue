<template>
	<div class="detail">
		<div class="detailTop">
			<van-swipe class="my-swipe" lazy-render :show-indicators='isshow'>
			  <van-swipe-item v-for="image in images" :key="image">
			    <img :src="image" />
			  </van-swipe-item>
			</van-swipe>	
			<div class="detailPrice">
				<div class="price">
					<div class="priceFu">￥</div>
					<div class="pricePr">{{goodsDetail.price}}</div>
					<div class="priceYh">优惠价</div>
				</div>
				<div class="sales">
					已售{{goodsDetail.num}}
				</div>
			</div>
			<div class="detailName">
				{{goodsDetail.name}}
			</div>
		</div>
		<div class="detailFoot">
			<div class="item add" @click="addCart">加入购物车</div>
			<div class="item buy">立即购买</div>
		</div>
	</div>
	
</template>

<script setup>
	import {
		ref,
		onMounted,
		onActivated
	} from 'vue'
	let isshow = ref(true)
	let images = ref(['/images/list-1.webp', '/images/list-2.webp', '/images/list-3.webp', '/images/list-4.webp'])
	
	onMounted(()=>{
		goData()
		id.value = route.query.id
	})
	import http from '@/common/api/request.js'
	import {useRoute} from 'vue-router'
	let route = useRoute()
	let goodsDetail = ref({})
	let id = ref(0)
	const goData =async ()=>{
		let goodsId = ref(route.query.id)
		let res = await http.$axios({
			url:'/api/goods/id',
			params:{
				id:goodsId.value
			}
		})
		console.log('详情数据',res)
		goodsDetail.value = res[0]
	}
	onActivated(()=>{
		//判断当前url里的id和之前的id是否一致
		if( route.query.id !== id.value ){
			goData()
			id.value = route.query.id
		}
	})
	
	import {showToast} from 'vant'
	const addCart = ()=>{
		let id = route.query.id
		http.$axios({
			url:'/api/addCart',
			method:'POST',
			data:{
				goodsId:id
			},
			headers:{
				token:true
			}
		}).then(res =>{
			console.log('添加购物车',res)
			if(res.success){
				showToast(res.msg)
			}
		})
	}
</script>

<style scoped>
	.detail {
		background-color: #fff;
	}

	.detail .detailTop .my-swipe .van-swipe-item {
		width: 100%;
		height: 10.375rem;
		text-align: center;
	}

	.detail .detailTop .detailPrice {
		width: 100%;
		/* background-color: red; */
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.6375rem 0.325rem 0.325rem 0.325rem;
		box-sizing: border-box;
	}

	.detail .detailTop .detailPrice .price {
		display: flex;
		align-items: center;
	}

	.detail .detailTop .detailPrice .price .priceFu {
		font-size: 0.375rem;
	}

	.detail .detailTop .detailPrice .price .pricePr {
		font-weight: 600;
	}

	.detail .detailTop .detailPrice .price .priceYh {
		font-size: 0.3125rem;
		margin-left: 0.1875rem;
		background-color: rgb(255, 236, 239);
		color: rgb(255, 68, 102);
		padding: 0.0625rem 0.0625rem;
	}

	.detail .detailTop .detailPrice .sales {
		font-size: 0.375rem;
		color: #666;
	}

	.detail .detailTop .detailName {
		padding: 0rem 0.325rem 0.325rem 0.325rem;
		font-size: 0.4375rem;
	}

	.detail .detailFoot {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		/* background-color: red; */
	}

	.detail .detailFoot .item {
		width: 50%;
		text-align: center;
		line-height: 1rem;
		height: 100%;
		font-size: 0.4375rem;
	}

	.detail .detailFoot .add {
		background-color: rgb(255, 236, 239);
		color: rgb(255, 68, 102);
	}

	.detail .detailFoot .buy {
		background-color: rgb(255, 87, 119);
		color: rgb(255, 255, 255);
	}
</style>