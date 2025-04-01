import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

import { fileURLToPath } from 'url'

// 获取 `__dirname`（因为 Vite 使用 ES 模块，`__dirname` 默认不可用）
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 正确解析路径
    }
  },
  // 添加 server 配置
  	server: {
  		// 设置代理
  		proxy: {
  			'/api': {
  				target: 'http://localhost:3000', // 目标服务器地址
  				changeOrigin: true, // 是否改变请求头中的 Origin，默认为 false
  				rewrite: (path) => path.replace(/^\/api/, '/api'), // 重写路径
  			},
  		},
  	}
})