<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4 shadow-sm border-top-info">
          <CCardHeader class="d-flex justify-content-between align-items-center bg-white py-3">
            <h5 class="mb-0 text-info"><strong>📝 Quản lý Bài Viết</strong></h5>
            <CButton color="info" class="text-white rounded-pill px-4" @click="openAddModal">
              <i class="cil-plus"></i> Thêm Bài Viết Mới
            </CButton>
          </CCardHeader>
          <CCardBody>
            <div v-if="isLoading" class="text-center py-5">
              <CSpinner color="info" />
              <p class="mt-2 text-muted">Đang tải danh sách bài viết...</p>
            </div>

            <CTable v-else hover responsive bordered align="middle">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell class="text-center" style="width: 5%">ID</CTableHeaderCell>
                  <CTableHeaderCell style="width: 25%">Tiêu Đề & Slug</CTableHeaderCell>
                  <CTableHeaderCell style="width: 35%">Nội Dung Tóm Tắt</CTableHeaderCell>
                  <CTableHeaderCell class="text-center" style="width: 15%">Hình Ảnh</CTableHeaderCell>
                  <CTableHeaderCell class="text-center" style="width: 15%">Hành Động</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-if="posts.length === 0">
                  <CTableDataCell colspan="5" class="text-center text-muted py-4">
                    Chưa có bài viết nào.
                  </CTableDataCell>
                </CTableRow>
                <CTableRow v-for="post in posts" :key="post.id">
                  <CTableDataCell class="text-center">{{ post.id }}</CTableDataCell>
                  <CTableDataCell>
                    <div class="fw-bold text-dark">{{ post.title }}</div>
                    <div class="small text-muted italic">Slug: {{ post.slug }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-muted small">
                    {{ post.content?.substring(0, 150) }}...
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <img 
                      :src="formatImageUrl(post.imageUrl) || 'https://via.placeholder.com/100x60'" 
                      class="rounded shadow-sm" 
                      style="height: 60px; width: auto; max-width: 120px; object-fit: cover;"
                    >
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <CButton color="warning" variant="ghost" size="sm" class="me-2" @click="openEditModal(post)">Sửa</CButton>
                    <CButton color="danger" variant="ghost" size="sm" @click="deletePost(post.id)">Xóa</CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CModal :visible="showModal" @close="showModal = false" backdrop="static" size="xl" alignment="center">
      <CModalHeader class="border-0 pb-0">
        <CModalTitle class="h4 fw-bold text-info">
          {{ isEdit ? '✏️ Cập nhật Bài Viết' : '✨ Soạn Thảo Bài Viết' }}
        </CModalTitle>
      </CModalHeader>
      
      <CModalBody class="bg-light pt-2">
        <CForm class="row g-4 px-2">
          <div class="col-lg-8">
            <CCard class="border-0 shadow-sm mb-4">
              <CCardBody class="p-4">
                <div class="mb-3">
                  <CFormLabel class="fw-bold">Tiêu Đề Bài Viết <span class="text-danger">*</span></CFormLabel>
                  <CFormInput size="lg" v-model="form.title" placeholder="VD: Xu hướng thời trang 2024..." required />
                </div>
                <div class="mb-3">
                  <CFormLabel class="fw-bold text-muted small">Đường dẫn SEO (Slug tự động)</CFormLabel>
                  <CFormInput v-model="form.slug" readonly class="bg-light border-0 text-info fw-semibold" />
                </div>
                <div class="mb-0">
                  <CFormLabel class="fw-bold">Nội Dung Chi Tiết <span class="text-danger">*</span></CFormLabel>
                  <CFormTextarea v-model="form.content" rows="12" placeholder="Viết nội dung bài viết tại đây..." required />
                </div>
              </CCardBody>
            </CCard>
          </div>

          <div class="col-lg-4">
            <CCard class="border-0 shadow-sm mb-4">
              <CCardBody class="p-4">
                <h6 class="fw-bold mb-3 border-bottom pb-2">Hình Ảnh Đại Diện</h6>
                <div class="text-center p-3 border rounded bg-white" style="border: 2px dashed #d8dbe0 !important;">
                  <img v-if="form.imageUrl" :src="formatImageUrl(form.imageUrl)" class="img-fluid rounded mb-3 shadow-sm" style="max-height: 180px;">
                  <div v-else class="py-4 text-muted">
                    <i class="cil-image display-4"></i>
                    <p class="small mt-2">Chưa có ảnh</p>
                  </div>
                  <CFormInput type="file" size="sm" @change="handleFileUpload" accept="image/*" />
                </div>
              </CCardBody>
            </CCard>
          </div>
        </CForm>
      </CModalBody>
      
      <CModalFooter class="border-0 bg-light pb-4">
        <CButton color="secondary" variant="ghost" class="rounded-pill px-4" @click="showModal = false">Hủy</CButton>
        <CButton color="info" class="text-white rounded-pill px-5 shadow" @click="savePost" :disabled="isSaving || isUploading">
          <CSpinner v-if="isSaving || isUploading" size="sm" class="me-2" />
          {{ isEdit ? 'Cập nhật ngay' : 'Đăng bài viết' }}
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

// Cấu hình API đồng bộ với Products/Categories
const API_URL = 'http://localhost:8900/api/catalog/admin/posts'
const UPLOAD_API = 'http://localhost:8900/api/catalog/admin/upload'

const posts = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)
const isUploading = ref(false)
const selectedFile = ref(null)

const form = ref({
  id: null,
  title: '',
  slug: '',
  content: '',
  imageUrl: ''
})

// Tự động sinh Slug chuẩn SEO (giống bên Products)
const generateSlug = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

watch(() => form.value.title, (newTitle) => {
  if (!isEdit.value) form.value.slug = generateSlug(newTitle);
})

// Xử lý định dạng URL ảnh và ép HTTPS cho Cloudinary
const formatImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url.replace('http://', 'https://');
  return `http://localhost:8900/api/catalog${url}`;
}

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0]
}

const fetchPosts = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(API_URL)
    posts.value = res.data
  } catch (err) {
    posts.value = []
  } finally { isLoading.value = false }
}

const savePost = async () => {
  if (!form.value.title || !form.value.content) {
    alert('Vui lòng điền đủ Tiêu đề và Nội dung!');
    return;
  }

  isSaving.value = true
  try {
    // 1. Upload ảnh trước nếu có chọn file mới
    if (selectedFile.value) {
      isUploading.value = true
      const formData = new FormData()
      formData.append('file', selectedFile.value)
      const resUpload = await axios.post(UPLOAD_API, formData)
      form.value.imageUrl = resUpload.data.fileUrl || `/images/${resUpload.data.fileName}`
      isUploading.value = false
    }

    // 2. Gửi JSON dữ liệu bài viết
    const payload = { ...form.value }
    if (isEdit.value) {
      await axios.put(`${API_URL}/${form.value.id}`, payload)
    } else {
      await axios.post(API_URL, payload)
    }
    
    showModal.value = false
    fetchPosts()
    alert('Thao tác thành công!')
  } catch (err) {
    console.error(err)
    alert('Lỗi hệ thống: ' + (err.response?.status === 503 ? 'Service Unavailable' : 'Server Error'));
  } finally {
    isSaving.value = false
    isUploading.value = false
  }
}

const openAddModal = () => {
  form.value = { id: null, title: '', slug: '', content: '', imageUrl: '' }
  selectedFile.value = null
  isEdit.value = false
  showModal.value = true
}

const openEditModal = (post) => {
  form.value = { ...post }
  selectedFile.value = null
  isEdit.value = true
  showModal.value = true
}

const deletePost = async (id) => {
  if (confirm('Xóa bài viết này?')) {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchPosts()
    } catch (err) { alert('Không thể xóa bài viết!'); }
  }
}

onMounted(fetchPosts)
</script>