<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4 shadow-sm">
          <CCardHeader class="d-flex justify-content-between align-items-center bg-white py-3">
            <h5 class="mb-0"><strong>Quản lý Danh Mục</strong></h5>
            <CButton color="success" class="text-white" @click="openAddModal">
              <i class="cil-plus"></i> Thêm Danh Mục
            </CButton>
          </CCardHeader>
          <CCardBody>
            <div v-if="isLoading" class="text-center py-5">
              <CSpinner color="success" />
            </div>

            <CTable v-else hover responsive bordered align="middle">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell class="text-center" style="width: 10%">ID</CTableHeaderCell>
                  <CTableHeaderCell style="width: 30%">Tên Danh Mục</CTableHeaderCell>
                  <CTableHeaderCell style="width: 40%">Mô tả</CTableHeaderCell>
                  <CTableHeaderCell class="text-center" style="width: 20%">Hành Động</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-if="categories.length === 0">
                  <CTableDataCell colspan="4" class="text-center text-muted py-4">
                    Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!
                  </CTableDataCell>
                </CTableRow>
                <CTableRow v-for="category in categories" :key="category.id">
                  <CTableDataCell class="text-center">{{ category.id }}</CTableDataCell>
                  <CTableDataCell class="fw-bold">{{ category.categoryName }}</CTableDataCell>
                  <CTableDataCell class="text-muted">{{ category.description || 'Không có mô tả' }}</CTableDataCell>
                  <CTableDataCell class="text-center">
                    <CButton color="warning" variant="outline" size="sm" class="me-2" @click="openEditModal(category)">
                      Sửa
                    </CButton>
                    <CButton color="danger" variant="outline" size="sm" @click="deleteCategory(category.id)">
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

    <CModal :visible="showModal" @close="showModal = false" backdrop="static">
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
            <CFormLabel>Mô tả (Tùy chọn)</CFormLabel>
            <CFormTextarea v-model="form.description" rows="3" placeholder="Nhập mô tả chi tiết..."></CFormTextarea>
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="ghost" @click="showModal = false">Hủy</CButton>
        <CButton color="primary" @click="saveCategory" :disabled="isSaving">
          {{ isSaving ? 'Đang lưu...' : 'Lưu Lại' }}
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Cổng API Gateway 8900
const API_URL = 'http://localhost:8900/api/catalog/admin/categories'

const categories = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)

const form = ref({
  id: null,
  categoryName: '',
  description: ''
})

const fetchCategories = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(API_URL)
    categories.value = response.data
  } catch (error) {
    if (error.response?.status === 404) {
      categories.value = []
    } else {
      console.error('Lỗi khi tải danh mục:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        request: error.request,
        message: error.message,
        config: error.config,
      })
    }
  } finally {
    isLoading.value = false
  }
}

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

const saveCategory = async () => {
  if (!form.value.categoryName || form.value.categoryName.trim() === '') {
    alert('Vui lòng nhập tên danh mục!')
    return
  }

  isSaving.value = true
  const payload = {
    categoryName: form.value.categoryName.trim(),
    description: form.value.description || ''
  }

  try {
    if (isEdit.value) {
      await axios.put(`${API_URL}/${form.value.id}`, payload)
      alert('Cập nhật danh mục thành công!')
    } else {
      await axios.post(API_URL, payload)
      alert('Thêm danh mục thành công!')
    }
    showModal.value = false
    fetchCategories()
  } catch (error) {
    console.error('Lỗi khi lưu danh mục:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      request: error.request,
      message: error.message,
      config: error.config,
    })
    alert('Lưu thất bại! Tên danh mục có thể bị trùng lặp hoặc server đã trả lỗi 500.')
  } finally {
    isSaving.value = false
  }
}

// const deleteCategory = async (id) => {
//   if (confirm('Bạn có chắc chắn muốn xóa? LƯU Ý: Nếu danh mục đang chứa Sản phẩm, việc xóa sẽ gây lỗi hệ thống!')) {
//     try {
//       await axios.delete(`${API_URL}/${id}`)
//       fetchCategories()
//     } catch (error) {
//       console.error('Lỗi khi xóa:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         headers: error.response?.headers,
//         request: error.request,
//         message: error.message,
//         config: error.config,
//       })
//       alert('Không thể xóa! Danh mục này có thể đang được gán cho sản phẩm hoặc server trả lỗi 500.')
//     }
//   }
// }

// Ví dụ xử lý khi xóa
const deleteCategory = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa? LƯU Ý: Nếu danh mục đang chứa Sản phẩm, việc xóa sẽ gây lỗi hệ thống!')) {
    try {
      await axios.delete(`${API_URL}/${id}`)
      alert('Xóa danh mục thành công!')
      fetchCategories()
    } catch (error) {
      console.error('Lỗi khi xóa:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        request: error.request,
        message: error.message,
        config: error.config,
      })
      alert('Không thể xóa! Danh mục này có thể đang được gán cho sản phẩm hoặc server trả lỗi 500.')
    }
  }
}


onMounted(() => {
  fetchCategories()
})
</script>
