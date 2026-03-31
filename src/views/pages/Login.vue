<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="handleLogin">
                  <h1>Login</h1>
                  <p class="text-body-secondary">Sign In to your account</p>
                  
                  <div v-if="errorMessage" class="alert alert-danger" role="alert">
                    {{ errorMessage }}
                  </div>

                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="username"
                      placeholder="Username"
                      autocomplete="username"
                      required
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="password"
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                      required
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="primary" type="submit" class="px-4" :disabled="isLoading">
                        {{ isLoading ? 'Đang xử lý...' : 'Login' }}
                      </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0">
                        Forgot password?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                  <CButton color="light" variant="outline" class="mt-3" @click="router.push('/register')">
                    Register Now!
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Khai báo các state
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    // Gọi API sang Backend. Lưu ý: Backend API bạn đang viết dùng @RequestParam,
    // Nên chúng ta sẽ truyền data qua URL Params thay vì truyền dạng JSON body (đối số thứ 2 là null)
    const response = await axios.post('http://localhost:8811/users/login', null, {
      params: {
        userName: username.value,
        password: password.value
      }
    })

    if (response.status === 200) {
      // Lưu thông tin user vào localStorage để các trang khác có thể dùng
      localStorage.setItem('user', JSON.stringify(response.data))
      
      // Chuyển hướng về trang Dashboard
      router.push('/dashboard') 
    }
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error)
    // Nếu API trả về mã lỗi 401 UNAUTHORIZED (Sai mật khẩu/user như bạn đã cấu hình bên Spring Boot)
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Sai tài khoản hoặc mật khẩu!'
    } else {
      errorMessage.value = 'Không thể kết nối đến server (Vui lòng kiểm tra lại Backend).'
    }
  } finally {
    isLoading.value = false
  }
}
</script>