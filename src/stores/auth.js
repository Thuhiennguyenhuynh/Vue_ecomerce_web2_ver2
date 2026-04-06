import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  // Do backend chưa có JWT, chúng ta tạm dùng một biến đánh dấu auth
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = computed(() => !!token.value)

  const BASE_URL = 'http://localhost:8900'

  const login = async (email, password) => {
    try {
      // Gọi trực tiếp đến user-service (port 8811) thay vì qua API Gateway
      const response = await axios.post('http://localhost:8811/users/login', {
        userName: email,
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
      console.error("Login Error:", error);
      let errorMsg = 'Đăng nhập thất bại';

      if (error.response && error.response.status === 401) {
        errorMsg = 'Sai tài khoản hoặc mật khẩu!';
      } else if (error.response && error.response.status === 404) {
        errorMsg = 'Không tìm thấy API (Sai URL đường dẫn).';
      } else if (error.response && error.response.status === 500) {
        errorMsg = 'Lỗi server nội bộ.';
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
    login,
    logout,
    checkAuth,
    initializeAuth
  }
})
