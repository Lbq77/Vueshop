<template>
	<div class="list">
		<header>
			<div class="returns">
				<i> 
					< 
				</i>
			</div>
			<div class="search">
				<i class="iconfont icon-fangdajing"></i>
				<span>学院jk套装</span>
			</div>
			<div class="go-shopping">
				<img src="@/assets/img/shopping.png" alt="" />
			</div>
			
		</header>
		<section>
			<div class="list-l">
				<ul class="l-item">
					<li :class="{active :index===selectedCategoryIndex}" 
					v-for="(item,index) in leftData" 
					:key="item.id" @click="selectCategory(index)">
					{{item.name}}
					</li>
					
				</ul>
			</div>
			<div class="list-r">
				<ul>
					<li class="shop-list">
						<ul class="r-content">
							<li v-for="(item,index) in getRightData" :key="index">
								<img :src="item.imgUrl" alt="" />
								<span>{{item.name}}</span>
							</li>
	
						</ul>
					</li>
				</ul>
			</div>
		</section>
	</div>
</template>

<script setup>
	import {ref,onMounted,computed} from 'vue'
	import http from '@/common/api/request.js'
	let leftData = ref([])
	let rightData = ref([])
	onMounted(()=>{
		sortData()
		
	})
	const sortData = async()=>{
		let res = await http.$axios({
			url:'/api/goods/list'
		})
		console.log(res)
		const leftArr = []
		const rightArr = []
		res.forEach(v=>{
			leftArr.push({
				id:v.id,
				name:v.name
			})
			rightArr.push(v.data)
		})
		leftData.value=leftArr
		rightData.value=rightArr
	}
	const selectedCategoryIndex = ref(0)
	const selectCategory= (index)=>{
		selectedCategoryIndex.value=index
		
	}
	const getRightData = computed(()=>{
		return rightData.value[selectedCategoryIndex.value]||[]
	})
</script>

<style scoped>
	.list {
			display: flex;
			flex-direction: column;
			width: 100vw;
			height: 100vh;
			overflow: hidden;
		}
	
		header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 1.173333rem;
			background-color: #fff;
			border-bottom: 2px solid #f1f1f1;
		}
	
		header .returns {
			line-height: 1.173333rem;
			padding: 0 0.533333rem;
		}
	
		header .returns i {
			color: #666;
			font-size: 0.693333rem;
		}
	
		header .search {
			display: flex;
			align-items: center;
			flex: 1;
			padding: 0.16rem 0.266666rem;
			background-color: #eee;
			border-radius: 0.1875rem;
		}
	
		header .search i {
			padding-right: 0.16rem;
			color: #666;
			font-size: 0.48rem;
		}
	
		header .search span {
			color: #666;
			font-size: 0.373333rem;
		}
	
		header .go-shopping {
			padding: 0 0.266666rem;
			margin-top: 0.15rem;
		}
	
		header .go-shopping img {
			width: 0.6rem;
			height: 0.6rem;
		}
	
		section {
			display: flex;
			flex: 1;
			overflow: hidden;
		}
	
		.list-l {
			width: 2rem;
			background-color: #f1f1f1;
			/* border-right: 1px solid #CCCCCC; */
			overflow: hidden;
		}
	
		.list-l .l-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	
		.list-l .l-item li {
			width: 100%;
			line-height: 1.333333rem;
			text-align: center;
			font-size: 0.373333rem;
		}
	
		.list-l .l-item li.active {
			color: #ff5777;
			border-left: 6px solid #ff5777;
			background-color: #fff;
		}
	
		.list-r {
			flex: 1;
			overflow: hidden;
			background-color: #fff;
		}
	
		.list-r .shop-list {
			text-align: center;
		}
	
		.list-r .shop-list .r-content {
			display: flex;
			flex-wrap: wrap;
		}
	
		.list-r .shop-list .r-content li {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 33.33%;
			padding: 0.266666rem 0;
		}
	
		.list-r .shop-list .r-content li img {
			width: 2rem;
			height: 3rem;
		}
	
		.list-r .shop-list .r-content li span {
			margin-top: 0.3125rem;
			font-size: 0.3rem;
		}
</style>