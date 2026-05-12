import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8900/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  getProducts(params?: any) {
    return apiClient.get('/products', { params })
  },
  getCategories() {
    return apiClient.get('/products/categories')
  },
  getBanners() {
    return apiClient.get('/public/banners')
  },
  getArticles(params?: any) {
    // THÊM DẤU / Ở CUỐI ĐỂ KHỚP VỚI REWRITEPATH CỦA GATEWAY
    return apiClient.get('/articles/', { params }) 
  },
  getLatestProducts() {
    return apiClient.get('/products/latest')
  },
  getLatestPosts() {
    return apiClient.get('/public/posts/latest')
  },
  getUserOrders(userId: number | string) {
    return apiClient.get(`/shop/order/user/${userId}`)
  }
}