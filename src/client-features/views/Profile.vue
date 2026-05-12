<template>
  <div class="bg-light min-vh-100 py-5">
    <div class="container" style="max-width: 1024px;">
      <div v-if="!authStore.isAuthenticated" class="text-center py-5 bg-white rounded shadow-sm border">
        <h2 class="fs-4 fw-bold text-dark mb-4">Vui lòng đăng nhập</h2>
        <p class="text-muted mb-4">Bạn cần đăng nhập để xem thông tin cá nhân và đơn hàng.</p>
        <button @click="goToLogin" class="btn btn-success text-white px-4 py-2 rounded-pill fw-bold">
          Đăng nhập ngay
        </button>
      </div>

      <div v-else class="row g-4">
        <!-- Sidebar Thông tin cá nhân -->
        <aside class="col-12 col-md-4">
          <div class="bg-white rounded shadow-sm p-4 border text-center position-relative overflow-hidden">
            <div class="bg-success position-absolute top-0 start-0 w-100" style="height: 100px;"></div>
            <div class="position-relative" style="z-index: 10;">
              <div class="mx-auto bg-white rounded-circle p-1 shadow-sm mb-3 mt-4" style="width: 100px; height: 100px;">
                <img src="https://ui-avatars.com/api/?name=User&background=198754&color=fff" alt="Avatar" class="w-100 h-100 rounded-circle" style="object-fit: cover;">
              </div>
              <h2 class="fs-5 fw-bold text-dark mb-1">{{ authStore.user?.userName || 'Người dùng' }}</h2>
              <p class="text-muted small mb-4">{{ authStore.user?.email || 'Chưa cập nhật email' }}</p>
              
              <div class="border-top pt-4">
                <button @click="logout" class="btn btn-outline-danger w-100 fw-bold rounded-pill">
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Danh sách đơn hàng -->
        <main class="col-12 col-md-8">
          <div class="bg-white rounded shadow-sm p-4 p-md-5 border">
            <h2 class="fs-4 fw-bold text-dark mb-4 border-bottom pb-3">Lịch sử đơn hàng</h2>
            
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-success" role="status"></div>
              <p class="mt-3 text-muted">Đang tải đơn hàng...</p>
            </div>
            
            <div v-else-if="orders.length === 0" class="text-center py-5 bg-light rounded">
              <p class="text-muted fs-5 mb-3">Bạn chưa có đơn hàng nào.</p>
              <router-link to="/products" class="text-success fw-bold text-decoration-none">Tiếp tục mua sắm &rarr;</router-link>
            </div>
            
            <div v-else class="d-flex flex-column gap-4">
              <div v-for="order in orders" :key="order.id" class="border rounded p-4 bg-light">
                <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom">
                  <div>
                    <p class="small text-muted mb-1">Mã đơn: <span class="fw-bold text-dark">#{{ order.id }}</span></p>
                    <p class="small text-muted mb-0">Ngày đặt: {{ formatDate(order.orderedDate) }}</p>
                  </div>
                  <div class="mt-2 mt-sm-0">
                    <span class="badge" :class="getStatusClass(order.status)">
                      {{ formatStatus(order.status) }}
                    </span>
                  </div>
                </div>
                
                <div class="mb-4">
                  <div v-for="(item, idx) in order.items" :key="idx" class="d-flex justify-content-between align-items-center small mb-2">
                    <div class="d-flex align-items-center gap-2">
                      <span class="fw-bold text-dark">{{ item.quantity }}x</span>
                      <span class="text-muted">{{ item.productName || 'Sản phẩm' }}</span>
                    </div>
                    <span class="fw-bold text-dark">{{ formatPrice(item.price) }} đ</span>
                  </div>
                </div>
                
                <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                  <span class="text-muted fw-bold">Tổng tiền:</span>
                  <span class="fs-5 fw-bold text-success">{{ formatPrice(order.total) }} đ</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import api from '../services/api'

const router = useRouter()
const authStore = useAuthStore()
const orders = ref<any[]>([])
const loading = ref(true)

const formatPrice = (price: number) => {
  return price ? price.toLocaleString('vi-VN') : '0'
}

const formatDate = (dateArr: number[]) => {
  if (!dateArr || !Array.isArray(dateArr)) return 'N/A'
  // Spring Boot LocalDate is often serialized as [YYYY, MM, DD]
  const [year, month, day] = dateArr
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
}

const formatStatus = (status: string) => {
  switch (status) {
    case 'PAYMENT_EXPECTED': return 'Chờ thanh toán'
    case 'PAID': return 'Đã thanh toán'
    case 'SHIPPED': return 'Đang giao hàng'
    case 'DELIVERED': return 'Đã giao'
    case 'CANCELLED': return 'Đã hủy'
    default: return status || 'Đang xử lý'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'PAYMENT_EXPECTED': return 'bg-warning text-dark'
    case 'PAID': return 'bg-info text-white'
    case 'SHIPPED': return 'bg-primary text-white'
    case 'DELIVERED': return 'bg-success text-white'
    case 'CANCELLED': return 'bg-danger text-white'
    default: return 'bg-secondary text-white'
  }
}

const fetchOrders = async () => {
  if (!authStore.user?.id) {
    loading.value = false
    return
  }
  
  try {
    const response = await api.getUserOrders(authStore.user.id)
    orders.value = response.data || []
  } catch (error) {
    console.error('Lỗi khi fetch đơn hàng:', error)
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  window.location.href = 'http://localhost:8900/admin/login'
}

const logout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  authStore.initializeAuth()
  if (authStore.isAuthenticated) {
    fetchOrders()
  } else {
    loading.value = false
  }
})
</script>

<style scoped>
/* Scoped styles nếu cần */
</style>
