<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6">
          <CCard class="p-4">
            <CCardBody>
              <CForm @submit.prevent="handleLogin">
                <h1>Đăng Nhập Admin</h1>
                <p class="text-body-secondary">Đăng nhập để quản lý hệ thống</p>

                <CAlert v-if="errorMessage" color="danger" class="mb-4">
                  <strong>LỖI CHI TIẾT:</strong> <br />
                  {{ errorMessage }}
                </CAlert>

                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput v-model="form.email" type="email" placeholder="Email" autocomplete="email"
                    :invalid="v$.email.$error" required />
                  <CFormFeedback invalid v-if="v$.email.$error">
                    {{ v$.email.$errors[0].$message }}
                  </CFormFeedback>
                </CInputGroup>

                <CInputGroup class="mb-4">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput v-model="form.password" type="password" placeholder="Mật khẩu"
                    autocomplete="current-password" :invalid="v$.password.$error" required />
                  <CFormFeedback invalid v-if="v$.password.$error">
                    {{ v$.password.$errors[0].$message }}
                  </CFormFeedback>
                </CInputGroup>

                <CRow>
                  <CCol :xs="6">
                    <CButton color="primary" type="submit" class="px-4" :disabled="loading">
                      <CSpinner v-if="loading" size="sm" class="me-2" />
                      {{ loading ? 'Đang đăng nhập...' : 'Đăng Nhập' }}
                    </CButton>
                  </CCol>
                  <CCol :xs="6" class="text-right">
                    <CButton color="link" class="px-0">
                      Quên mật khẩu?
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import axios from 'axios' // Import thêm axios để test trực tiếp

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(false)
const errorMessage = ref('') // Biến hứng lỗi hiển thị ra màn hình

const form = reactive({
  email: '',
  password: ''
})

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(6) }
}

const v$ = useVuelidate(rules, form)
// Chặn back khi ở trang login
onMounted(() => {
  // Thêm entry vào history để chặn back
  window.history.pushState(null, null, window.location.href)

  const handlePopState = (e) => {
    e.preventDefault()
    window.history.pushState(null, null, window.location.href)
  }

  window.addEventListener('popstate', handlePopState)

  // Cleanup khi component unmount
  return () => {
    window.removeEventListener('popstate', handlePopState)
  }
})
const handleLogin = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await authStore.login(form.email, form.password)

    if (result.success) {
      // KIỂM TRA ROLE ADMIN
      if (authStore.user && authStore.user.role && authStore.user.role.roleName === 'ROLE_ADMIN') {
        toast.success('Đăng nhập Admin thành công!')
        router.push('/dashboard')
      } else {
        // BẠN CÓ ĐANG VÀO ĐÂY KHÔNG?
        alert(result.message)
        authStore.logout() // Bắt user ra nếu không phải Admin
        errorMessage.value = 'Bạn không có quyền truy cập trang quản trị!'
      }
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    if (error.response) {
      console.error('LỖI ĐĂNG NHẬP CHI TIẾT:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        config: error.config,
      })
    } else if (error.request) {
      console.error('LỖI ĐĂNG NHẬP KHÔNG NHẬN ĐƯỢC RESPONSE:', error.request)
    } else {
      console.error('LỖI ĐĂNG NHẬP:', error.message)
    }

    errorMessage.value = 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.'
    toast.error('Đăng nhập thất bại!')
  } finally {
    loading.value = false
  }
}
</script>
