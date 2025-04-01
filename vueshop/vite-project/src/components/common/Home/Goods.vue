<template>
	<div class="goods">
		<ul>
			<li v-for="(item,index) in goodsList" :key="item.id" @click="goDetail(item.id)">
				<div class="goods-top">
					<img :src="item.imgUrl" alt="" />
					<div class="goods-icon">
						<img class="left" :src="item.leftUrl" alt="" />
						<img class="right" :src="item.rightUrl" alt="" />
					</div>
					<div class="goods-actor">
						<img :src="item.actor" alt="" />
						<span class="actorname">{{item.actorname}}</span>
						<span class="actortag">{{item.actortag}}</span>
					</div>
				</div>
				<div class="goods-bottom">
					<h3>{{item.name}}</h3>
					<div class="price">
						<span class="fuhao">￥</span>
						<span class="jine">{{item.price}}</span>
						<span class="baoyou">
							<img :src="item.byUrl" alt="" />
						</span>
						<span class="xiaoliang">销量999</span>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup>
	import axios from 'axios'
	import {ref,onMounted} from 'vue'
	import http from '@/common/api/request.js'
	const goodsList = ref([])
	onMounted(()=>{
		fetchData()
		
	})
	const fetchData = async()=>{
		// const res = await axios.get('/api/index')
		let res = await http.$axios({url:'/api/index'})
		console.log(res)
		goodsList.value=res.goodsList
	}
	import { useRouter } from 'vue-router';
	let router = useRouter()
	const goDetail = (id)=>{
		router.push({path:'/detail',query:{id}})
	}
</script>

<style scoped>
	.goods {
		width: 100%;
		height: 800rem;
		/* background-color: red; */
		overflow: hidden;
		box-sizing: border-box;
		padding: 0.1875rem;
	}

	.goods ul {
		display: flex;
		flex-wrap: wrap;
	}

	.goods ul li {
		width: calc(50% - 0.25rem);
		border-radius: 0.3125rem;
		overflow: hidden;
		background-color: #fff;
		margin: 0.125rem;
	}

	.goods ul li .goods-top img {
		width: 100%;
		height: 6.125rem;
	}

	.goods ul li .goods-top {
		position: relative;
		height: 6.125rem;
	}

	.goods ul li .goods-top .goods-icon .left {
		position: absolute;
		top: 0.25rem;
		left: 0.25rem;
		width: 1.2rem;
		height: 1.1rem;
	}

	.goods ul li .goods-top .goods-icon .right {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		width: 0.7rem;
		height: 0.7rem;
	}

	/* ---------商品图上方两个图片样式--------------- */
	.goods ul li .goods-top .goods-actor {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 0.9375rem;
		padding: 0 0 0 0.3125rem;
		display: flex;
		align-items: center;
		box-sizing: border-box;

	}

	.goods ul li .goods-top .goods-actor img {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		margin-right: 0.125rem;
	}

	.goods ul li .goods-top .goods-actor .actorname {
		font-size: 0.35rem;
		margin-right: 0.125rem;
		color: #fff;
	}

	.goods ul li .goods-top .goods-actor .actortag {
		font-size: 0.3rem;
		padding: 0 0.125rem;
		background-color: rgba(0, 0, 0, .5);
		color: white;
		border-radius: 0.0625rem;
	}

	/* ---------商品图下方个人信息样式--------------- */
	.goods ul li .goods-bottom {
		width: 100%;
		padding: 0.1875rem;
		box-sizing: border-box;
	}

	.goods ul li .goods-bottom h3 {
		font-size: 0.359rem;
		font-weight: 100;
	}

	.goods ul li .goods-bottom .price {
		width: 100%;
		height: 0.625rem;
		position: relative;
		margin-bottom: 0.3125rem;
	}

	.goods ul li .goods-bottom .price .fuhao {
		font-size: 0.375rem;
		color: #f46;
	}

	.goods ul li .goods-bottom .price .jine {
		font-size: 0.5625rem;
		color: #f46;
	}

	.goods ul li .goods-bottom .price .baoyou img {
		width: 0.6875rem;
		height: 0.375rem;
		margin-left: 0.1875rem;
	}

	.goods ul li .goods-bottom .price .xiaoliang {
		padding: 0.0625rem 0.125rem;
		font-size: 0.3125rem;
		background-color: #ffecef;
		color: #f46;
		position: absolute;
		right: 0;
		top: 0.1875rem;
		border-radius: 0.3125rem;
	}
</style>