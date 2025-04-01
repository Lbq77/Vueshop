<template>
  <div class="goods">
    <ul class="goods-list">
      <li 
        v-for="(item, index) in goodsList" 
        :key="item.id" 
        class="goods-item"
      >
        <div class="goods-top">
          <img :src="item.imgUrl" alt="商品图片" />
          <div class="goods-actor">
            <img :src="item.actor" alt="头像" />
            <span class="actorname">{{ item.actorname }}</span>
            <span class="actortag">{{ item.actortag }}</span>
          </div>
        </div>
        <div class="goods-bottom">
          <h3 class="goods-name">{{ item.name }}</h3>
          <div class="price">
            <span class="fuhao">￥</span>
            <span class="jine">{{ item.price }}</span>
            <span class="xiaoliang">销量 {{ item.sales }}</span>
          </div>
        </div>
      </li>
    </ul>

    <!-- 分页按钮 -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage <= 1">上一页</button>
      <span>第 {{ currentPage }} 页</span>
      <button @click="nextPage" :disabled="!hasMore">下一页</button>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">加载中...</div>
    <div v-else-if="!hasMore" class="no-more">没有更多数据了</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import http from '@/common/api/request.js'; // 确保你的http封装无误

const route = useRoute();
const router = useRouter();

const goodsList = ref([]);
const currentPage = ref(Number(route.query.currentPage) || 1);
const hasMore = ref(true);
const isLoading = ref(false);
const key = ref(route.query.key || ''); // 搜索关键词

onMounted(() => {
    if ('PerformanceObserver' in window) {
        const paintObserver = new PerformanceObserver((list) => {
            const entries = list.getEntriesByType('paint');
            for (const entry of entries) {
                if (entry.name === 'first-contentful-paint') {
                    console.log(`🌟 FCP (首次内容绘制): ${entry.startTime.toFixed(2)} ms`);
                    trackEvent('FCP', { duration: entry.startTime.toFixed(2) });
                }
            }
        });

        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            for (const entry of entries) {
                console.log(`🏆 LCP (最大内容绘制): ${entry.startTime.toFixed(2)} ms`);
                trackEvent('LCP', { duration: entry.startTime.toFixed(2) });
            }
        });

        // 监听 FCP 指标
        paintObserver.observe({ type: 'paint', buffered: true });
        
        // 监听 LCP 指标
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } else {
        console.warn('⚠️ 当前浏览器不支持 PerformanceObserver');
    }
});









// ✅ 1. 提前声明 getData
const getData = () => {
    if (isLoading.value) return;
    isLoading.value = true;

    // 获取最新的 route.query.page 和 route.query.key
    const currentPage = Number(route.query.currentPage) || 1;
    const currentKey = route.query.key || '';

    console.log('请求数据：', {
        searchName: currentKey,
        currentPage: currentPage,
        pageSize: 8,
    });

    // 开始计时
    const start = performance.now();

    // 发起请求
    http.$axios({
        url: '/api/goods/shopList',
        params: {
            searchName: currentKey,
            currentPage: currentPage,
            pageSize: 8,
        },
    })
        .then((res) => {
            // 更新商品列表
            goodsList.value = res.results || [];
            hasMore.value = res.results.length >=8; 
            console.log('请求成功', res);
        })
        .catch((err) => {
            console.error('❌ 网络请求失败:', err);
        })
        .finally(() => {
            isLoading.value = false;

            // 结束计时
            const duration = performance.now() - start;

            // ✅ 在每次请求完成后上报数据
            trackEvent('api_call', { 
                duration: duration,
                endpoint: '/api/goods/shopList',
                page: currentPage,
                key: currentKey
            });
        });
};


// ✅ 2. 监听路由变化
// 监听 route.query 的变化
    watch(
      () => route.query,
      (newQuery, oldQuery) => {
        console.log('Query changed:', newQuery, oldQuery); // 输出路由查询参数变化前后的值
        const newPage = Number(newQuery.currentPage) || 1;
        const newKey = newQuery.key || '';

        currentPage.value = newPage;
        key.value = newKey;

        getData();
      },
      { immediate: true } // 在组件挂载时立即执行一次
    );

    // 确保数据加载（手动获取）
    onMounted(() => {
      getData();  // 如果你想确保组件初始化时也会触发一次数据获取
    });

// 上一页
const prevPage = () => {
  // 确保当前页大于1才跳转
  if (currentPage.value > 1) {
    // 页码减1
    const newPage = currentPage.value - 1;

    // 使用 router.push 来跳转到上一页
    router.push({
      path: '/search/list',  // 保持路径不变
      query: { key: key.value, currentPage: newPage }  // 传递新的分页参数
    });
  } else {
    console.log("已经是第一页，无法返回上一页！");
  }
};


function trackEvent(eventType, details) {
    console.log(eventType);
    console.log(details);
    // 上报
    fetch('/api/dataReport', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // ✅ 确保服务器能正确解析
        },
        body: JSON.stringify({ eventType, details }), // ✅ 确保参数格式正确
    })
    .then(res => res.json())
    .then(data => console.log('📤 响应:', data))
    .catch(err => console.error('❌ 发送失败:', err));
}




// 下一页
const nextPage = () => {
  if (hasMore.value) {
    router.push({ path: '/search/list', query: { key: key.value, currentPage: currentPage.value + 1 } });
  }
};



</script>


<style scoped>
/* 外层容器 */
.goods {
  padding: 1rem;
  background-color: #f8f8f8;
}

/* 列表布局 */
.goods-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* 自适应2-4列 */
  gap: 1rem;
  padding: 0;
  list-style: none;
}

/* 商品卡片 */
.goods-item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.goods-item:hover {
  transform: translateY(-5px);
}

/* 图片样式 */
.goods-top img {
  width: 100%;
  aspect-ratio: 1 / 1; /* 保证图片是正方形 */
  object-fit: cover;
}

/* 价格和销量 */
.price {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  align-items: center;
}

.fuhao {
  color: red;
  font-size: 1rem;
}

.jine {
  font-size: 1.2rem;
  font-weight: bold;
}

.xiaoliang {
  font-size: 0.8rem;
  color: #888;
}

/* 加载提示 */
.loading,
.no-more {
  text-align: center;
  padding: 1rem;
  color: #666;
}

/* 分页按钮 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #007aff;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.3s;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 1rem;
  font-weight: bold;
}
</style>
