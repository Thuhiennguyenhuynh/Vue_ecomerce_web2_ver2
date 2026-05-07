import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {

// Lấy user từ localStorage ngay khi khởi tạo để tránh lỗi F5 mất dữ liệu
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  // Thêm biến kiểm tra Admin
  const isAdmin = computed(() => user.value && user.value.role && user.value.role.roleName === 'ROLE_ADMIN')
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = computed(() => !!token.value)

  const BASE_URL = 'http://localhost:8900'

  const login = async (email, password) => {
    try {
      // Gọi qua API Gateway để dùng chung route và CORS
      const response = await axios.post(`${BASE_URL}/users/admin/login`, {
        email: email,
        password: password
      })

      // Backend trả về userData
      const userData = response.data

      // Tạo fake token để đánh dấu đã authenticated
      const fakeToken = "authenticated-token-placeholder"

      token.value = fakeToken
      user.value = userData

      localStorage.setItem('token', fakeToken)
      localStorage.setItem('user', JSON.stringify(userData))

      return { success: true }
    } catch (error) {
      if (error.response) {
        console.error('Login Error 500 details:', {
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data,
          config: error.config,
        })
      } else {
        console.error('Login Error:', error)
      }

      let errorMsg = 'Đăng nhập thất bại';

      if (error.response && error.response.status === 401) {
        errorMsg = 'Sai tài khoản hoặc mật khẩu!';
      } else if (error.response && error.response.status === 404) {
        errorMsg = 'Không tìm thấy API (Sai URL đường dẫn).';
      } else if (error.response && error.response.status === 500) {
        errorMsg = 'Lỗi server nội bộ. Kiểm tra console để xem chi tiết.';
      }

      return {
        success: false,
        message: errorMsg
      }
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  const checkAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      // axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      return true
    }
    return false
  }

  const initializeAuth = () => {
    checkAuth()
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    checkAuth,
    initializeAuth
  }
})
