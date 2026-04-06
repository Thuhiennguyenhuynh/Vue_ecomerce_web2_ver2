<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4 shadow-sm">
          <CCardHeader class="d-flex justify-content-between align-items-center bg-white py-3">
            <h5 class="mb-0"><strong>Quản lý Sản Phẩm</strong></h5>
            <CButton color="primary" @click="openAddModal">
              <i class="cil-plus"></i> Thêm Sản Phẩm
            </CButton>
          </CCardHeader>
          <CCardBody>
            <div v-if="isLoading" class="text-center py-5">
              <CSpinner color="primary" />
              <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
            </div>

            <CTable v-else hover responsive bordered align="middle">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell class="text-center">ID</CTableHeaderCell>
                  <CTableHeaderCell>Tên Sản Phẩm</CTableHeaderCell>
                  <CTableHeaderCell class="text-end">Giá ($)</CTableHeaderCell>
                  <CTableHeaderCell>Danh Mục</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Tồn Kho</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Hành Động</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-if="products.length === 0">
                  <CTableDataCell colspan="6" class="text-center text-muted py-4">
                    Chưa có sản phẩm nào. Hãy thêm sản phẩm mới.
                  </CTableDataCell>
                </CTableRow>
                <CTableRow v-for="product in products" :key="product.id">
                  <CTableDataCell class="text-center">{{ product.id }}</CTableDataCell>
                  <CTableDataCell class="fw-semibold">{{ product.productName }}</CTableDataCell>
                  <CTableDataCell class="text-end text-success fw-bold">{{ product.price }}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="info">{{ product.category ? product.category.categoryName : 'Chưa phân loại' }}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <CBadge :color="product.availability > 0 ? 'success' : 'danger'">
                      {{ product.availability > 0 ? product.availability : 'Hết hàng' }}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <CButton color="warning" variant="outline" size="sm" class="me-2" @click="openEditModal(product)">
                      Sửa
                    </CButton>
                    <CButton color="danger" variant="outline" size="sm" @click="deleteProduct(product.id)">
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
        <CModalTitle>{{ isEdit ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới' }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div class="mb-3">
            <CFormLabel>Tên Sản Phẩm <span class="text-danger">*</span></CFormLabel>
            <CFormInput v-model="form.productName" placeholder="Nhập tên sản phẩm..." required />
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <CFormLabel>Giá ($) <span class="text-danger">*</span></CFormLabel>
              <CFormInput type="number" step="0.01" min="0" v-model.number="form.price" placeholder="99.99" required />
            </div>
            <div class="col-md-6 mb-3">
              <CFormLabel>Số Lượng <span class="text-danger">*</span></CFormLabel>
              <CFormInput type="number" min="0" v-model.number="form.availability" required />
            </div>
          </div>
          <div class="mb-3">
            <CFormLabel>Danh Mục <span class="text-danger">*</span></CFormLabel>
            <select class="form-select" v-model="form.categoryId" required>
              <option value="" disabled>-- Chọn danh mục --</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.categoryName }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <CFormLabel>Mô tả chi tiết</CFormLabel>
            <CFormTextarea v-model="form.discription" rows="3" placeholder="Mô tả sản phẩm..."></CFormTextarea>
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="ghost" @click="showModal = false">Hủy</CButton>
        <CButton color="primary" @click="saveProduct" :disabled="isSaving">
          {{ isSaving ? 'Đang lưu...' : 'Lưu Sản Phẩm' }}
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Gọi qua Cổng API Gateway 8900
const API_URL = 'http://localhost:8900/api/catalog/admin/products'
const CATEGORY_API_URL = 'http://localhost:8900/api/catalog/admin/categories'

const products = ref([])
const categories = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)

const form = ref({
  id: null,
  productName: '',
  price: 0,
  categoryId: '',
  availability: 0,
  discription: ''
})

const fetchProducts = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(API_URL)
    products.value = response.data
  } catch (error) {
    if (error.response?.status === 404) {
      products.value = []
    } else {
      console.error('Lỗi khi tải sản phẩm:', error)
    }
  } finally {
    isLoading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await axios.get(CATEGORY_API_URL)
    categories.value = response.data
  } catch (error) {
    if (error.response?.status === 404) categories.value = []
  }
}

const resetForm = () => {
  form.value = { id: null, productName: '', price: 0, categoryId: '', availability: 0, discription: '' }
}

const openAddModal = () => {
  resetForm()
  isEdit.value = false
  showModal.value = true
}

const openEditModal = (product) => {
  form.value = {
    id: product.id,
    productName: product.productName,
    price: product.price,
    categoryId: product.category?.id || '',
    availability: product.availability,
    discription: product.discription
  }
  isEdit.value = true
  showModal.value = true
}

const saveProduct = async () => {
  if (!form.value.productName || !form.value.categoryId) {
    alert('Vui lòng nhập tên sản phẩm và chọn danh mục!')
    return
  }

  isSaving.value = true
  const payload = {
    productName: form.value.productName,
    price: form.value.price,
    discription: form.value.discription,
    availability: form.value.availability,
    category: { id: form.value.categoryId }
  }

  try {
    if (isEdit.value) {
      await axios.put(`${API_URL}/${form.value.id}`, payload)
    } else {
      await axios.post(API_URL, payload)
    }
    showModal.value = false
    fetchProducts()
  } catch (error) {
    console.error('Lỗi khi lưu sản phẩm:', error)
    alert('Lưu thất bại! Vui lòng kiểm tra lại kết nối.')
  } finally {
    isSaving.value = false
  }
}

const deleteProduct = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không? Dữ liệu không thể khôi phục.')) {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchProducts()
    } catch (error) {
      console.error('Lỗi khi xóa:', error)
      alert('Lỗi: Không thể xóa sản phẩm này.')
    }
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>
