<template>
	<ul class="sorts">
		<li v-for="(item,index) in sortList" :key="item.id">
			<img :src="item.imgUrl" alt="" />
			<span>{{item.title}}</span>
		</li>
	</ul>
</template>

<script setup>
	
	import axios from 'axios'
	import {ref,onMounted} from 'vue'
	import http from '@/common/api/request.js'
	const sortList = ref([])
	onMounted(()=>{
		fetchData()
		
	})
	const fetchData = async()=>{
		let res = await http.$axios({url:'/api/index'})
		console.log(res)
		sortList.value=res.sortList
	}
</script>

<style scoped>
	.sorts {
		width: 100%;
		background-color: white;
		font-size: 0.35rem;
		box-sizing: border-box;
		display: flex;
		flex-flow: row wrap;
	}

	.sorts li {
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
		flex: 0 0 20%;
		margin: 0.3rem 0;
	}

	.sorts li img {
		width: 1.5rem;
		height: 1.5rem;
	}

	.sorts li span {
		margin-top: 0.1875rem;
		color: rgb(102, 102, 102);
	}
</style>