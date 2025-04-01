<template>
	<div class='order'>
		<header>
			<i @click="goBack">
				<
			</i>
			<span>提交订单</span>
			<i class="iconfont icon-liaotian"></i>
		</header>
		<section>
			<div class='path'>
				<h3 class='path-title'>收货信息</h3>
				<div class='path-content'>
					<div>
						<span>{{path.name}}</span>
						<span>{{path.tel}}</span>
					</div>
					<div>
						<span>{{path.province}}</span>
						<span>{{path.city}}</span>
						<span>{{path.county}}</span>
						<span>{{path.addressDetail}}</span>
					</div>
				</div>
			</div>
			<div class='payment'>
				<div class='payment-title'>支付方式：</div>
				<van-radio-group v-model="radioPayment">
					<van-radio name="wx">微信支付</van-radio>
					<van-radio name="ali">支付宝支付</van-radio>
				</van-radio-group>
			</div>
			<div class='goods'>
				<ul>
					<li v-for="(i,d) in goodsList" :key="d">
						<div>
							<img :src="i.goods_imgUrl" alt="" />
						</div>
						<div class='goods-content'>
							<h4>{{i.goods_name}}</h4>
							<div class='goods-total'>
								<span>¥{{i.goods_price}}</span>
								<span>x{{i.goods_num}}</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</section>
		<footer>
			<div class='order-total'>
				<span>共</span>
				<b>{{total.num}}</b>
				<span>件,</span>
				<span>总金额：</span>
				<em>¥{{total.price}}</em>
			</div>
			<div class='order-topay' @click="submitOrder">提交订单</div>
		</footer>
	</div>
</template>

<script setup>
	import { ref,onMounted,computed } from 'vue'
	import {useCartStore} from '../store/cart.js'
	import { useRoute } from 'vue-router'
	import { storeToRefs } from 'pinia'
	let route = useRoute()
	const store = useCartStore()
	const radioPayment = ref('wx')
	const item = ref([])
	
	onMounted(()=>{
		item.value = JSON.parse(route.query.detail)
		selectOrder()
	})
	
	const {total} = storeToRefs(store)
	let list = ref(store.list)
	
	const goodsList = computed(()=>{
		return item.value.map(id=>list.value.find(v=>v.id === id))
	})
	
	//模拟地址数据
	const path = ref({
		id:1,
		name:'张三',
		tel:'15516812978',
		province:'北京市',
		city:'北京市',
		county:'朝阳区',
		addressDetail:'某某小区7号楼3单元101'
	})
	
	import http from '@/common/api/request.js'
	let price = ref('')
	//查询订单
	const selectOrder = ()=>{
		http.$axios({
			url:'/api/selectOrder',
			method:'post',
			headers:{
				token:true
			},
			data:{
				orderId:localStorage.getItem('shop_orderId')
			}
		}).then(res => {
			console.log('查询',res)
			price.value = res.data[0].goods_price
		})
	}
	
	import qs from 'qs'
	
	//提交订单
	const submitOrder =()=>{
		//改订单状态 删除购物车数据
		http.$axios({
			url:'/api/submitOrder',
			method:'post',
			headers:{
				token:true
			},
			data:{
				orderId:localStorage.getItem('shop_orderId'),
				shopArr:store.selectList
			}
		}).then(res=>{
    console.log('修改状态', res)  // 打印提交订单状态的响应

    // 创建一个新的数组存储商品名
    let newArr = []
    goodsList.value.forEach(v => {
        console.log('商品名称:', v.goods_name)  // 打印每个商品的名称
        newArr.push(v.goods_name)
    })

    // 合并商品名称，并计算支付所需的参数
    let dataOrder = {
        orderId: localStorage.getItem('shop_orderId'),
        name: newArr.join(''),  // 商品名连接成一个字符串
        price: price.value
    }

    console.log('支付参数:', dataOrder)  // 打印支付参数

    if (res.success) {
        console.log('提交订单成功，准备支付')

        // 发送支付请求
        http.$axios({
            url: '/api/payment',
            method: 'post',
            headers: {
                token: true,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(dataOrder)  // 转换数据为 url 编码格式
        }).then(res => {
            console.log('支付的响应:', res)  // 打印支付的响应
            window.location.href = res.paymentUrl  // 跳转到支付页面
        }).catch(error => {
            console.error('支付请求失败:', error)  // 错误处理
        })
    } else {
        console.log('提交订单失败:', res.message)  // 打印失败信息
    }
})
	}
</script>

<style scoped>
	/* header */
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 1.173333rem;
		color: #666;
		background-color: #fafafa;
		border-bottom: 2px solid #eee;
	}

	header i {
		padding: 0 0.4rem;
		font-size: 0.586666rem;
	}

	header span {
		font-weight: 300;
		font-size: 0.48rem;
	}

	/* section */
	section {
		background-color: #fafafa;
	}

	section .path-title {
		padding: 0.4rem;
		font-size: 0.48rem;
	}

	section .path-content {
		padding: 0.16rem 0.4rem;
		font-size: 0.373333rem;
		background-color: #FFFFFF;
	}

	section .path-content span {
		padding-right: 0.16rem;
	}

	section .payment {
		padding: 0.16rem 0.4rem;
		margin-top: 0.4rem;
		font-size: 0.426666rem;
		background-color: #FFFFFF;
	}

	section .payment .van-radio-group {
		display: flex;
		padding: 0.16rem 0;
	}

	section .payment .van-radio-group .van-radio {
		padding-right: 0.266666rem;
	}

	section .goods {
		padding: 0.16rem 0.4rem;
		margin-top: 0.4rem;
		font-size: 0.426666rem;
		background-color: #FFFFFF;
	}

	section .goods ul {
		width: 100%;
	}

	section .goods ul li {
		display: flex;
		width: 100%;
	}

	section .goods ul li img {
		width: 1.973333rem;
		height: 1.973333rem;
	}

	section .goods ul li .goods-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-left: 0.4rem;
	}

	section .goods ul li .goods-content .goods-total {
		display: flex;
		justify-content: space-between;
	}

	/* footer */
	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 1.2rem;
		border-top: 1px solid #ccc;
		position: absolute;
		bottom: 0;
		left: 0;
	}

	footer .order-total {
		font-size: 0.426666rem;
	}

	footer .order-total span {
		padding: 0 0.16rem;
	}

	footer .order-total b {
		color: #666;
	}

	footer .order-total em {
		font-size: 0.48rem;
		color: #ff5777;
	}

	footer .order-topay {
		width: 3.2rem;
		line-height: 1.2rem;
		color: #fff;
		font-size: 0.426666rem;
		text-align: center;
		background-color: #ff5777;
	}
</style>