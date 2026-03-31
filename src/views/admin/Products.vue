<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between align-items-center">
            <strong>Quản lý Sản Phẩm</strong>
            <CButton color="primary" @click="openAddModal">
              + Thêm Sản Phẩm
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Tên Sản Phẩm</CTableHeaderCell>
                  <CTableHeaderCell>Giá ($)</CTableHeaderCell>
                  <CTableHeaderCell>Danh Mục</CTableHeaderCell>
                  <CTableHeaderCell>Số Lượng</CTableHeaderCell>
                  <CTableHeaderCell>Hành Động</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-if="products.length === 0">
                  <CTableDataCell colspan="6" class="text-center">
                    Chưa có sản phẩm nào.
                  </CTableDataCell>
                </CTableRow>
                <CTableRow v-for="product in products" :key="product.id">
                  <CTableDataCell>{{ product.id }}</CTableDataCell>
                  <CTableDataCell>{{ product.productName }}</CTableDataCell>
                  <CTableDataCell>{{ product.price }}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="info">{{ product.category ? product.category.categoryName : 'N/A' }}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{{ product.availability }}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="warning" size="sm" class="me-2 text-white" @click="openEditModal(product)">
                      Sửa
                    </CButton>
                    <CButton color="danger" size="sm" class="text-white" @click="deleteProduct(product.id)">
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
        <CModalTitle>{{ isEdit ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới' }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div class="mb-3">
            <CFormLabel>Tên Sản Phẩm</CFormLabel>
            <CFormInput v-model="form.productName" placeholder="Nhập tên sản phẩm..." required />
          </div>
          <div class="mb-3">
            <CFormLabel>Giá ($)</CFormLabel>
            <CFormInput type="number" step="0.01" v-model.number="form.price" placeholder="Ví dụ: 99.99" required />
          </div>
       <div class="mb-3">
            <CFormLabel>Danh Mục</CFormLabel>
            <select class="form-select" v-model="form.categoryId" required>
              <option value="" disabled>-- Chọn danh mục --</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.categoryName }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <CFormLabel>Số Lượng (Kho)</CFormLabel>
            <CFormInput type="number" v-model.number="form.availability" required />
          </div>
          <div class="mb-3">
            <CFormLabel>Mô tả</CFormLabel>
            <CFormTextarea v-model="form.discription" rows="3"></CFormTextarea>
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showModal = false">Hủy</CButton>
        <CButton color="primary" @click="saveProduct">Lưu Lại</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// State
const products = ref([])
const categories = ref([])
const showModal = ref(false)
const isEdit = ref(false)

// URL của Backend
const BASE_URL = 'http://localhost:8810'

const form = ref({
  id: null,
  productName: '',
  price: 0,
  categoryId: '',
  availability: 0,
  discription: ''
})

// Lấy danh sách Sản phẩm
const fetchProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/products`)
    products.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      products.value = []
    } else {
      console.error('Lỗi khi tải sản phẩm:', error)
    }
  }
}

// Lấy danh sách Danh mục
const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/categories`)
    categories.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      categories.value = []
    } else {
      console.error('Lỗi khi tải danh mục:', error)
    }
  }
}

// Reset form
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
    categoryId: product.category ? product.category.id : '',
    availability: product.availability,
    discription: product.discription
  }
  isEdit.value = true
  showModal.value = true
}

// Lưu (POST / PUT)
const saveProduct = async () => {
  // ĐÃ SỬA: Chặn lỗi không chọn danh mục
  if (!form.value.categoryId || form.value.categoryId === '') {
    alert('Vui lòng chọn một danh mục trước khi lưu!');
    return;
  }

  const payload = {
    productName: form.value.productName,
    price: form.value.price,
    discription: form.value.discription,
    availability: form.value.availability,
    category: {
      id: form.value.categoryId
    }
  }

  try {
    if (isEdit.value) {
      await axios.put(`${BASE_URL}/admin/products/${form.value.id}`, payload)
      alert('Cập nhật thành công!')
    } else {
      await axios.post(`${BASE_URL}/admin/products`, payload)
      alert('Thêm mới thành công!')
    }
    showModal.value = false
    fetchProducts() // Load lại bảng sau khi lưu
  } catch (error) {
    console.error('Lỗi khi lưu sản phẩm:', error)
    alert('Có lỗi xảy ra từ Server (500), vui lòng kiểm tra lại dữ liệu nhập!')
  }
}

// Xóa Sản phẩm
const deleteProduct = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
    try {
      await axios.delete(`${BASE_URL}/admin/products/${id}`)
      fetchProducts()
    } catch (error) {
      console.error('Lỗi khi xóa:', error)
      alert('Không thể xóa sản phẩm!')
    }
  }
}

// Chạy khi component mount
onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>
