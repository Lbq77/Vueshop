<template>
	<div class="search">
		<Header></Header>
		<section>
			<div class="search-history">
				<h2>
					<i class="iconfont icon-fangdajing"></i>
					<span>历史搜索</span>
					<span @click="clearSearchHistory">清空</span>
				</h2>
				<ul v-if="searchArr.length">
					<li v-for="(item,index) in searchArr" :key="index" @click="searchList(item)">{{item}}</li>
					
				</ul>
				<div v-else> 暂无历史搜索</div>
			</div>
		</section>
	</div>
	
</template>

<script setup>
	import Header from "@/components/search/Header.vue";
	import {ref,onMounted} from 'vue'
	let searchArr = ref([])
	onMounted(()=>{
		searchArr.value=JSON.parse(localStorage.getItem('searchList'))||'[]'
	})
	import {showConfirmDialog} from 'vant'
	const clearSearchHistory = ()=>{
		showConfirmDialog({
			title:'清空历史搜索',
			message:'您确定要搜索所有的历史记录吗'
		}).then(()=>{
			console.log('清空')
			localStorage.removeItem('searchList')
			searchArr.value=[]
		}).catch(()=>{
			console.log('不清空')
		})
		
	}
	
	//历史搜索进入到列表页
	import { useRouter } from "vue-router";
	let router = useRouter()
	const searchList = (item)=>{
		router.push({
			name:'list',
			query:{
				key:item
			}
		})
	}
</script>

<style scoped>
	.search {
			display: flex;
			flex-direction: column;
			width: 100vw;
			height: 100vh;
			overflow: hidden;
			background-color: #fff;
		}
	
		section {
			flex: 1;
			background-color: #fff;
			overflow: hidden;
		}
	
		.search-history h2 {
			position: relative;
			padding: 0.533333rem;
			font-weight: 400;
			font-size: 0.48rem;
		}
	
		.search-history h2 i {
			padding-right: 0.08rem;
			color: #999;
			font-size: 0.48rem;
		}
	
		.search-history h2 span:last-child {
			position: absolute;
			right: 0.533333rem;
	
		}
	
		.search-history ul {
			display: flex;
			flex-wrap: wrap;
			padding: 0 0.266666rem;
		}
	
		.search-history ul li {
			margin: 0.266666rem;
			padding: 0.08rem 0.16rem;
			font-size: 0.373333rem;
			border: 1px solid #ccc;
		}
</style>