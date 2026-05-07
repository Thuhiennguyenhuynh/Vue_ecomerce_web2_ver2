<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4 shadow-sm border-top-primary">
          <CCardHeader class="d-flex justify-content-between align-items-center bg-white py-3">
            <h5 class="mb-0 text-primary"><strong>📦 Quản lý Sản Phẩm</strong></h5>
            <CButton color="primary" @click="openAddModal">
              <i class="cil-plus"></i> Thêm Sản Phẩm Mới
            </CButton>
          </CCardHeader>
          <CCardBody>
            <div v-if="isLoading" class="text-center py-5">
              <CSpinner color="primary" />
              <p class="mt-2 text-muted">Đang tải dữ liệu sản phẩm...</p>
            </div>

            <CTable v-else hover responsive bordered align="middle" class="mb-0">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell class="text-center">ID</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Hình Ảnh</CTableHeaderCell>
                  <CTableHeaderCell>Thông Tin Sản Phẩm</CTableHeaderCell>
                  <CTableHeaderCell class="text-end">Giá Bán</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Tồn Kho</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Hành Động</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-if="products.length === 0">
                  <CTableDataCell colspan="6" class="text-center text-muted py-4">
                    Chưa có sản phẩm nào trong hệ thống.
                  </CTableDataCell>
                </CTableRow>
                <CTableRow v-for="product in products" :key="product.id">
                  <CTableDataCell class="text-center">{{ product.id }}</CTableDataCell>
                  <CTableDataCell class="text-center">
                    <img
                      :src="product.imageUrl || 'https://via.placeholder.com/60'"
                      @error="$event.target.src='https://via.placeholder.com/60'"
                      alt="Product"
                      class="rounded shadow-sm"
                      style="width: 60px; height: 60px; object-fit: cover;"
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div class="fw-bold text-dark">{{ product.productName }}</div>
                    <div class="small text-muted">Slug: {{ product.slug }}</div>
                    <CBadge color="info" shape="rounded-pill" class="mt-1">
                      {{ product.category ? product.category.categoryName : 'Chưa phân loại' }}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell class="text-end fw-bold text-success">
                    ${{ product.price.toLocaleString() }}
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <CBadge :color="product.availability > 0 ? 'success' : 'danger'">
                      {{ product.availability > 0 ? product.availability + ' sản phẩm' : 'Hết hàng' }}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <CButton color="warning" variant="ghost" size="sm" class="me-2" @click="openEditModal(product)">
                      Sửa
                    </CButton>
                    <CButton color="danger" variant="ghost" size="sm" @click="deleteProduct(product.id)">
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

<CModal :visible="showModal" @close="showModal = false" backdrop="static" size="xl" alignment="center">
      <CModalHeader class="border-bottom-0 pb-0">
        <CModalTitle class="h4 fw-bold text-primary">
          {{ isEdit ? '✏️ Cập nhật Sản Phẩm' : '✨ Thêm Sản Phẩm Mới' }}
        </CModalTitle>
      </CModalHeader>
      
      <CModalBody class="pt-2 bg-light">
        <p class="text-muted small mb-4 px-2">Vui lòng điền đầy đủ thông tin bên dưới. Các trường có dấu <span class="text-danger">*</span> là bắt buộc.</p>

        <CForm class="row g-4 px-2">
          <div class="col-lg-8">
            <CCard class="border-0 shadow-sm mb-4">
              <CCardBody class="p-4">
                <h6 class="fw-bold mb-3 border-bottom pb-2 text-dark">Thông Tin Cơ Bản</h6>
                <div class="row g-3">
                  <div class="col-md-12">
                    <CFormLabel class="fw-semibold">Tên Sản Phẩm <span class="text-danger">*</span></CFormLabel>
                    <CFormInput size="lg" v-model="form.productName" placeholder="VD: Áo thun nam cao cấp..." required />
                  </div>
                  <div class="col-md-6">
                    <CFormLabel class="fw-semibold">Danh Mục <span class="text-danger">*</span></CFormLabel>
                    <CFormSelect v-model="form.categoryId" required>
                      <option value="" disabled>-- Chọn danh mục --</option>
                      <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.categoryName }}</option>
                    </CFormSelect>
                  </div>
                  <div class="col-md-6">
                    <CFormLabel class="fw-semibold">URL Slug <small class="text-muted">(Tự động tạo)</small></CFormLabel>
                    <CFormInput v-model="form.slug" readonly class="bg-light text-muted border-0" placeholder="ao-thun-nam" />
                  </div>
                  <div class="col-12 mt-3">
                    <CFormLabel class="fw-semibold">Mô tả chi tiết</CFormLabel>
                    <CFormTextarea v-model="form.discription" rows="6" placeholder="Nhập mô tả chi tiết sản phẩm để thu hút khách hàng..."></CFormTextarea>
                  </div>
                </div>
              </CCardBody>
            </CCard>

            <CCard class="border-0 shadow-sm">
              <CCardBody class="p-4">
                <h6 class="fw-bold mb-3 border-bottom pb-2 text-dark">Giá & Tồn Kho</h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <CFormLabel class="fw-semibold">Giá Bán <span class="text-danger">*</span></CFormLabel>
                    <CInputGroup>
                      <CInputGroupText class="bg-light fw-bold text-success">$</CInputGroupText>
                      <CFormInput type="number" step="0.01" min="0" v-model.number="form.price" placeholder="0.00" required />
                    </CInputGroup>
                  </div>
                  <div class="col-md-6">
                    <CFormLabel class="fw-semibold">Số Lượng Trong Kho <span class="text-danger">*</span></CFormLabel>
                    <CInputGroup>
                      <CInputGroupText class="bg-light text-primary">SL</CInputGroupText>
                      <CFormInput type="number" min="0" v-model.number="form.availability" placeholder="0" required />
                    </CInputGroup>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </div>

          <div class="col-lg-4">
            <CCard class="border-0 shadow-sm h-100">
              <CCardBody class="p-4">
                <h6 class="fw-bold mb-3 border-bottom pb-2 text-dark">Quản Lý Media</h6>

                <div class="mb-4">
                  <CFormLabel class="fw-semibold d-block">Ảnh Đại Diện (Main)</CFormLabel>
                  <div class="position-relative border rounded p-3 text-center bg-white" style="border: 2px dashed #d8dbe0 !important; min-height: 200px; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                    <img v-if="form.imageUrl" :src="form.imageUrl" class="img-fluid rounded shadow-sm mb-3" style="max-height: 160px; object-fit: cover; width: 100%;" />
                    <div v-else class="text-muted my-4">
                      <span style="font-size: 3rem;">📸</span>
                      <p class="mt-2 mb-0 small">Chưa có ảnh đại diện</p>
                    </div>
                    <div class="mt-auto w-100">
                        <CFormInput type="file" size="sm" @change="handleMainImageUpload" accept="image/*" />
                    </div>
                  </div>
                </div>

                <div>
                  <CFormLabel class="fw-semibold d-block">Bộ Sưu Tập Ảnh Phụ</CFormLabel>
                  <CFormInput type="file" size="sm" multiple @change="handleAdditionalImagesUpload" accept="image/*" class="mb-3" />
                  
                  <div class="d-flex flex-wrap gap-2 p-2 rounded bg-white border" style="min-height: 100px; border: 1px dashed #d8dbe0 !important;">
                    <div v-if="form.additionalImageUrls.length === 0" class="text-muted small w-100 text-center mt-3">
                      Chưa tải lên ảnh phụ nào
                    </div>
                    
                    <div v-for="(url, i) in form.additionalImageUrls" :key="i" class="position-relative">
                      <img :src="url" class="rounded shadow-sm" style="width: 70px; height: 70px; object-fit: cover; border: 1px solid #ebedef;" />
                      <button @click.prevent="removeAdditionalImage(i)" class="btn btn-sm btn-danger text-white rounded-circle position-absolute top-0 start-100 translate-middle p-0 d-flex align-items-center justify-content-center shadow" style="width: 22px; height: 22px; font-size: 12px;">
                        ✕
                      </button>
                    </div>

                  </div>
                </div>

              </CCardBody>
            </CCard>
          </div>
        </CForm>
      </CModalBody>
      
      <CModalFooter class="border-top-0 pt-3 pb-4 bg-light">
        <CButton color="secondary" variant="ghost" class="px-4 rounded-pill" @click="showModal = false">Hủy Bỏ</CButton>
        <CButton color="primary" class="px-5 rounded-pill shadow" @click="saveProduct" :disabled="isSaving || isUploading">
          <CSpinner v-if="isSaving || isUploading" size="sm" class="me-2" />
          {{ isUploading ? 'Đang Tải Ảnh Lên...' : (isEdit ? 'Lưu Thay Đổi' : 'Tạo Sản Phẩm') }}
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

// API CONFIG - LUÔN DÙNG ĐƯỜNG DẪN ADMIN
const API_URL = 'http://localhost:8900/api/catalog/admin/products'
const CATEGORY_API_URL = 'http://localhost:8900/api/catalog/admin/categories'
const UPLOAD_API = 'http://localhost:8900/api/catalog/admin/upload'

const products = ref([])
const categories = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)
const isUploading = ref(false)

const form = ref({
  id: null,
  slug: '',
  productName: '',
  price: 0,
  categoryId: '',
  availability: 0,
  imageUrl: '',
  additionalImageUrls: [],
  discription: ''
})

// Tự động sinh Slug cho SEO
const generateSlug = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Khử dấu tiếng Việt
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '') // Xóa ký tự đặc biệt
    .replace(/(\s+)/g, '-') // Thay khoảng trắng bằng -
    .replace(/-+/g, '-') // Xóa nhiều - liên tiếp
    .replace(/^-+|-+$/g, ''); // Xóa - ở đầu và cuối
}

watch(() => form.value.productName, (newName) => {
  if (!isEdit.value) form.value.slug = generateSlug(newName);
})

// Xử lý logic URL ảnh (Fix Mixed Content & Cloudinary)
const formatImageUrl = (fileUrl) => {
  if (!fileUrl) return '';
  // Nếu là link hoàn chỉnh (Cloudinary), giữ nguyên và ép https
  if (fileUrl.startsWith('http')) {
    return fileUrl.replace('http://', 'https://');
  }
  // Nếu là đường dẫn tương đối, nối với server
  return `http://localhost:8900/api/catalog${fileUrl}`;
}

const uploadImageToServer = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await axios.post(UPLOAD_API, formData)
  return formatImageUrl(res.data.fileUrl || `/images/${res.data.fileName}`)
}

const handleMainImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  isUploading.value = true
  try {
    form.value.imageUrl = await uploadImageToServer(file)
  } finally { isUploading.value = false }
}

const handleAdditionalImagesUpload = async (e) => {
  const files = Array.from(e.target.files)
  if (files.length === 0) return
  isUploading.value = true
  try {
    const urls = await Promise.all(files.map(f => uploadImageToServer(f)))
    form.value.additionalImageUrls = [...form.value.additionalImageUrls, ...urls]
  } finally { isUploading.value = false }
}

const fetchProducts = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(API_URL)
    products.value = res.data
  } catch (err) {
    products.value = []
  } finally { isLoading.value = false }
}

const fetchCategories = async () => {
  try {
    const res = await axios.get(CATEGORY_API_URL)
    categories.value = res.data
  } catch (err) { console.error(err) }
}

const openAddModal = () => {
  form.value = { id: null, slug: '', productName: '', price: 0, categoryId: '', availability: 0, imageUrl: '', additionalImageUrls: [], discription: '' }
  isEdit.value = false
  showModal.value = true
}

const openEditModal = (p) => {
  form.value = {
    id: p.id,
    slug: p.slug,
    productName: p.productName,
    price: p.price,
    categoryId: p.category?.id || '',
    availability: p.availability,
    imageUrl: p.imageUrl,
    additionalImageUrls: p.images ? p.images.map(img => img.imageUrl) : [],
    discription: p.discription
  }
  isEdit.value = true
  showModal.value = true
}

const saveProduct = async () => {
  if (!form.value.productName || !form.value.categoryId) return alert('Thiếu thông tin bắt buộc!')
  isSaving.value = true
  const payload = {
    ...form.value,
    category: { id: form.value.categoryId },
    images: form.value.additionalImageUrls.map(url => ({ imageUrl: url }))
  }
  try {
    if (isEdit.value) await axios.put(`${API_URL}/${form.value.id}`, payload)
    else await axios.post(API_URL, payload)
    showModal.value = false
    fetchProducts()
  } finally { isSaving.value = false }
}

const deleteProduct = async (id) => {
  if (confirm('Xóa sản phẩm này?')) {
    await axios.delete(`${API_URL}/${id}`)
    fetchProducts()
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>