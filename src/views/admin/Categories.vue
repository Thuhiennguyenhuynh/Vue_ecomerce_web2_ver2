<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between align-items-center">
            <strong>Quản lý Danh Mục Sản Phẩm</strong>
            <CButton color="success" class="text-white" @click="openAddModal">
              + Thêm Danh Mục
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Tên Danh Mục</CTableHeaderCell>
                  <CTableHeaderCell>Mô tả</CTableHeaderCell>
                  <CTableHeaderCell>Hành Động</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-if="categories.length === 0">
                  <CTableDataCell colspan="4" class="text-center text-muted">
                    Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!
                  </CTableDataCell>
                </CTableRow>
                <CTableRow v-for="category in categories" :key="category.id">
                  <CTableDataCell>{{ category.id }}</CTableDataCell>
                  <CTableDataCell class="font-weight-bold">{{ category.categoryName }}</CTableDataCell>
                  <CTableDataCell>{{ category.description }}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="warning" size="sm" class="me-2 text-white" @click="openEditModal(category)">
                      Sửa
                    </CButton>
                    <CButton color="danger" size="sm" class="text-white" @click="deleteCategory(category.id)">
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
        <CModalTitle>{{ isEdit ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới' }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div class="mb-3">
            <CFormLabel>Tên Danh Mục <span class="text-danger">*</span></CFormLabel>
            <CFormInput v-model="form.categoryName" placeholder="VD: Laptop, Điện thoại..." required />
          </div>
          <div class="mb-3">
            <CFormLabel>Mô tả</CFormLabel>
            <CFormTextarea v-model="form.description" rows="3" placeholder="Nhập mô tả chi tiết..."></CFormTextarea>
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showModal = false">Hủy</CButton>
        <CButton color="primary" @click="saveCategory">Lưu Lại</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// State quản lý dữ liệu
const categories = ref([])
const showModal = ref(false)
const isEdit = ref(false)

// Cổng của Service Danh mục
const BASE_URL = 'http://localhost:8810'

const form = ref({
  id: null,
  categoryName: '',
  description: '' // Backend Entity Category dùng 'description'
})

// Lấy danh sách danh mục từ Java
const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/categories`)
    categories.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      categories.value = [] // Bỏ qua lỗi 404 khi DB trống
    } else {
      console.error('Lỗi khi tải danh mục:', error)
    }
  }
}

// Hàm dọn dẹp form
const resetForm = () => {
  form.value = { id: null, categoryName: '', description: '' }
}

const openAddModal = () => {
  resetForm()
  isEdit.value = false
  showModal.value = true
}

const openEditModal = (category) => {
  form.value = {
    id: category.id,
    categoryName: category.categoryName,
    description: category.description
  }
  isEdit.value = true
  showModal.value = true
}

// Gọi API Thêm hoặc Cập nhật
const saveCategory = async () => {
  // Bắt lỗi dữ liệu rỗng
  if (!form.value.categoryName || form.value.categoryName.trim() === '') {
    alert('Vui lòng nhập tên danh mục!')
    return
  }

  const payload = {
    categoryName: form.value.categoryName.trim(),
    description: form.value.description || ''
  }

  try {
    if (isEdit.value) {
      await axios.put(`${BASE_URL}/admin/categories/${form.value.id}`, payload)
      alert('Cập nhật danh mục thành công!')
    } else {
      await axios.post(`${BASE_URL}/admin/categories`, payload)
      alert('Thêm mới danh mục thành công!')
    }
    showModal.value = false
    fetchCategories() // Tải lại bảng
  } catch (error) {
    console.error('Lỗi khi lưu danh mục:', error)
    alert('Có lỗi xảy ra! Hãy kiểm tra xem tên danh mục có bị TRÙNG không nhé.')
  }
}

// Gọi API Xóa
const deleteCategory = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa danh mục này? LƯU Ý: Nếu danh mục đang có chứa Sản phẩm thì xóa sẽ bị lỗi Database!')) {
    try {
      await axios.delete(`${BASE_URL}/admin/categories/${id}`)
      fetchCategories()
    } catch (error) {
      console.error('Lỗi khi xóa:', error)
      alert('Không thể xóa! Rất có thể danh mục này đang được sử dụng bởi một sản phẩm nào đó.')
    }
  }
}

// Tự động chạy khi mở trang
onMounted(() => {
  fetchCategories()
})
</script>
