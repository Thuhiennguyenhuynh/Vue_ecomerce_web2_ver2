<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between align-items-center">
            <strong>Quản lý Người Dùng</strong>
            <CButton color="success" class="text-white" @click="openAddModal">
              + Thêm Người Dùng
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Tên</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Số Điện Thoại</CTableHeaderCell>
                  <CTableHeaderCell>Vai Trò</CTableHeaderCell>
                  <CTableHeaderCell>Hành Động</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-if="users.length === 0">
                  <CTableDataCell colspan="6" class="text-center text-muted">
                    Chưa có người dùng nào. Hãy thêm người dùng đầu tiên!
                  </CTableDataCell>
                </CTableRow>
                <CTableRow v-for="user in users" :key="user.id">
                  <CTableDataCell>{{ user.id }}</CTableDataCell>
                  <CTableDataCell>{{ user.name }}</CTableDataCell>
                  <CTableDataCell>{{ user.email }}</CTableDataCell>
                  <CTableDataCell>{{ user.phone }}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge :color="user.role === 'admin' ? 'danger' : 'primary'">
                      {{ user.role === 'admin' ? 'Admin' : 'Khách Hàng' }}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="warning" size="sm" class="me-2 text-white" @click="openEditModal(user)">
                      Sửa
                    </CButton>
                    <CButton color="danger" size="sm" class="text-white" @click="deleteUser(user.id)">
                      Xóa
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CModal :visible="showModal" @close="showModal = false">
      <CModalHeader>
        <CModalTitle>{{ isEdit ? 'Sửa Người Dùng' : 'Thêm Người Dùng Mới' }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div class="mb-3">
            <CFormLabel>Tên <span class="text-danger">*</span></CFormLabel>
            <CFormInput v-model="form.name" placeholder="Nhập tên..." required />
          </div>
          <div class="mb-3">
            <CFormLabel>Email <span class="text-danger">*</span></CFormLabel>
            <CFormInput type="email" v-model="form.email" placeholder="Nhập email..." required />
          </div>
          <div class="mb-3">
            <CFormLabel>Số Điện Thoại</CFormLabel>
            <CFormInput v-model="form.phone" placeholder="Nhập số điện thoại..." />
          </div>
          <div class="mb-3">
            <CFormLabel>Địa Chỉ</CFormLabel>
            <CFormTextarea v-model="form.address" rows="2" placeholder="Nhập địa chỉ..."></CFormTextarea>
          </div>
          <div class="mb-3">
            <CFormLabel>Vai Trò</CFormLabel>
            <select class="form-select" v-model="form.role" required>
              <option value="customer">Khách Hàng</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showModal = false">Hủy</CButton>
        <CButton color="primary" @click="saveUser">Lưu Lại</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// State quản lý dữ liệu
const users = ref([])
const showModal = ref(false)
const isEdit = ref(false)

// Cổng của Service Người Dùng qua API Gateway
const BASE_URL = 'http://localhost:8900/api/accounts'

const form = ref({
  id: null,
  name: '',
  email: '',
  phone: '',
  address: '',
  role: 'customer'
})

// Lấy danh sách người dùng từ backend
const fetchUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`)
    users.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      users.value = [] // Bỏ qua lỗi 404 khi DB trống
    } else {
      console.error('Lỗi khi tải người dùng:', error)
    }
  }
}

// Hàm dọn dẹp form
const resetForm = () => {
  form.value = { id: null, name: '', email: '', phone: '', address: '', role: 'customer' }
}

const openAddModal = () => {
  resetForm()
  isEdit.value = false
  showModal.value = true
}

const openEditModal = (user) => {
  form.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role
  }
  isEdit.value = true
  showModal.value = true
}

// Gọi API Thêm hoặc Cập nhật
const saveUser = async () => {
  // Bắt lỗi dữ liệu rỗng
  if (!form.value.name || form.value.name.trim() === '' || !form.value.email || form.value.email.trim() === '') {
    alert('Vui lòng nhập tên và email!')
    return
  }

  const payload = {
    name: form.value.name.trim(),
    email: form.value.email.trim(),
    phone: form.value.phone || '',
    address: form.value.address || '',
    role: form.value.role
  }

  try {
    if (isEdit.value) {
      await axios.put(`${BASE_URL}/users/${form.value.id}`, payload)
      alert('Cập nhật người dùng thành công!')
    } else {
      await axios.post(`${BASE_URL}/users`, payload)
      alert('Thêm mới người dùng thành công!')
    }
    showModal.value = false
    fetchUsers() // Tải lại bảng
  } catch (error) {
    console.error('Lỗi khi lưu người dùng:', error)
    alert('Có lỗi xảy ra! Hãy kiểm tra xem email có bị TRÙNG không nhé.')
  }
}

// Xóa người dùng
const deleteUser = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return

  try {
    await axios.delete(`${BASE_URL}/users/${id}`)
    alert('Xóa người dùng thành công!')
    fetchUsers()
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error)
    alert('Có lỗi xảy ra khi xóa!')
  }
}

// Khởi tạo
onMounted(() => {
  fetchUsers()
})
</script>
