<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4 shadow-sm">
            <CCardBody class="p-4">
              <CForm @submit.prevent="handleRegister">
                <h1>Đăng ký Admin</h1>
                <p class="text-medium-emphasis">Tạo tài khoản quản trị viên mới</p>

                <CAlert v-if="errorMessage" color="danger" class="mb-4 d-flex align-items-center">
                  <CIcon icon="cil-burn" class="flex-shrink-0 me-2" width="24" height="24" />
                  <div>
                    <strong>Đăng ký thất bại: </strong> {{ errorMessage }}
                  </div>
                </CAlert>

                <CInputGroup class="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    v-model="form.email"
                    placeholder="Email (Tên đăng nhập)"
                    type="email"
                    required
                  />
                </CInputGroup>

                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <i class="cil-lock-locked"></i>
                  </CInputGroupText>
                  <CFormInput
                    v-model="form.password"
                    type="password"
                    placeholder="Mật khẩu"
                    required
                  />
                </CInputGroup>

                <CInputGroup class="mb-4">
                  <CInputGroupText>
                    <i class="cil-lock-locked"></i>
                  </CInputGroupText>
                  <CFormInput
                    v-model="form.repeatPassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                </CInputGroup>

                <div class="d-grid gap-2">
                  <CButton color="success" type="submit" class="text-white" :disabled="isLoading">
                    <CSpinner v-if="isLoading" size="sm" class="me-2" />
                    {{ isLoading ? 'Đang xử lý...' : 'Tạo tài khoản' }}
                  </CButton>
                  <CButton color="link" class="px-0 text-center mt-2" @click="router.push('/login')">
                    Đã có tài khoản? Quay lại Đăng nhập
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('') // Biến hứng lỗi để hiển thị lên UI

const form = ref({
  email: '',
  password: '',
  repeatPassword: ''
})

const handleRegister = async () => {
  // Xóa lỗi cũ mỗi lần submit mới
  errorMessage.value = ''

  if (form.value.password !== form.value.repeatPassword) {
    errorMessage.value = 'Mật khẩu nhập lại không khớp!'
    return
  }

  isLoading.value = true

  try {
   const response = await axios.post('http://localhost:8900/api/accounts/registration', {
      userName: form.value.email,
      userPassword: form.value.password,
      role: {
        roleName: "ROLE_ADMIN"
      }
    })

    if (response.status === 201) {
      alert('Tạo tài khoản Admin thành công! Vui lòng đăng nhập.')
      router.push('/login')
    }

  } catch (error) {
    console.error('Chi tiết lỗi từ Server:', error.response || error)

    // Hứng và phân loại lỗi từ Backend trả về
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 500) {
        // Cố gắng lấy message từ Spring Boot nếu có, nếu không thì in ra object lỗi
        const serverMsg = data.message ? data.message : JSON.stringify(data);
        errorMessage.value = `Lỗi Server 500. Dữ liệu trả về: ${serverMsg}. (Gợi ý: Trùng Email hoặc Database từ chối lưu).`;
      } else if (status === 400) {
        errorMessage.value = 'Dữ liệu gửi lên không hợp lệ (400 Bad Request).';
      } else {
        errorMessage.value = `Lỗi hệ thống: Mã lỗi ${status}`;
      }
    } else if (error.request) {
      errorMessage.value = 'Không thể kết nối đến Backend. Hãy chắc chắn API Gateway (8900) đang chạy!';
    } else {
      errorMessage.value = 'Đã xảy ra lỗi không xác định trên trình duyệt.';
    }
  } finally {
    isLoading.value = false
  }
}
</script>
