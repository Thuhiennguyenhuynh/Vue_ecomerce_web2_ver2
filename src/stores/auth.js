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
      // 1. Sửa URL cho đúng API Gateway -> Zuul -> User Service
      // 2 & 3. Dùng 'params' thay vì body, và map 'email' thành 'userName'
      // const response = await axios.post(`${BASE_URL}/api/accounts/users/login`, null, {
      //   params: {
      //     userName: email,
      //     password: password
      //   }
      // })

   const response = await axios.post('http://localhost:8900/api/accounts/users/login', {
        userName: email,
        password: password
      })

      // 4. Backend Spring Boot hiện tại chỉ trả về cục dữ liệu User (không có token)
      // Nên response.data chính là userData
      const userData = response.data

      // Vì backend chưa làm JWT Token, ta tạm tạo một fake token để frontend nhận diện là đã login
      const fakeToken = "authenticated-token-placeholder"

      token.value = fakeToken
      user.value = userData

      localStorage.setItem('token', fakeToken)
      localStorage.setItem('user', JSON.stringify(userData))

      // Nếu sau này backend có JWT thực sự, hãy mở khoá dòng này:
      // axios.defaults.headers.common['Authorization'] = `Bearer ${fakeToken}`

      return { success: true }
    } catch (error) {
      console.error("Login Error:", error);
      let errorMsg = 'Đăng nhập thất bại';

      if (error.response && error.response.status === 401) {
        errorMsg = 'Sai tài khoản hoặc mật khẩu!';
      } else if (error.response && error.response.status === 404) {
        errorMsg = 'Không tìm thấy API (Sai URL đường dẫn).';
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
