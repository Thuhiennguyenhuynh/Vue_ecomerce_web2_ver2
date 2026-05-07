<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4 shadow-sm">
          <CCardHeader class="d-flex justify-content-between align-items-center bg-white py-3">
            <h5 class="mb-0"><strong>Quản lý Bài Viết</strong></h5>
            <CButton color="success" class="text-white" @click="openAddModal">
              <i class="cil-plus"></i> Thêm Bài Viết
            </CButton>
          </CCardHeader>
          <CCardBody>
            <div v-if="isLoading" class="text-center py-5">
              <CSpinner color="success" />
            </div>

            <CTable v-else hover responsive bordered align="middle">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell class="text-center" style="width: 5%">ID</CTableHeaderCell>
                  <CTableHeaderCell style="width: 25%">Tiêu Đề</CTableHeaderCell>
                  <CTableHeaderCell style="width: 40%">Nội Dung</CTableHeaderCell>
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
                  <CTableDataCell class="fw-bold">{{ post.title }}</CTableDataCell>
                  <CTableDataCell class="text-muted text-truncate" style="max-width: 300px;">{{ post.content }}</CTableDataCell>
                  <CTableDataCell class="text-center">
                    <img v-if="post.imageUrl" :src="post.imageUrl" alt="Post Image" style="height: 50px; width: auto; border-radius: 4px;">
                    <span v-else class="text-muted">Không có</span>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <CButton color="warning" variant="outline" size="sm" class="me-2" @click="openEditModal(post)">
                      Sửa
                    </CButton>
                    <CButton color="danger" variant="outline" size="sm" @click="deletePost(post.id)">
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

    <CModal :visible="showModal" @close="showModal = false" backdrop="static" size="lg">
      <CModalHeader>
        <CModalTitle>{{ isEdit ? 'Sửa Bài Viết' : 'Thêm Bài Viết Mới' }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div class="mb-3">
            <CFormLabel>Tiêu Đề <span class="text-danger">*</span></CFormLabel>
            <CFormInput v-model="form.title" placeholder="Nhập tiêu đề bài viết" required />
          </div>

          <div class="mb-3">
            <CFormLabel>Hình Ảnh</CFormLabel>
            <CFormInput type="file" accept="image/*" @change="handleFileUpload" />
            <div v-if="isEdit && form.imageUrl" class="mt-2">
              <img :src="form.imageUrl" alt="Current Image" style="max-height: 100px; border-radius: 4px;" />
            </div>
          </div>

          <div class="mb-3">
            <CFormLabel>Nội Dung <span class="text-danger">*</span></CFormLabel>
            <CFormTextarea v-model="form.content" rows="10" placeholder="Nhập nội dung bài viết..." required></CFormTextarea>
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="ghost" @click="showModal = false">Hủy</CButton>
        <CButton color="primary" @click="savePost" :disabled="isSaving">
          {{ isSaving ? 'Đang lưu...' : 'Lưu Lại' }}
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Cập nhật lại đường dẫn cho khớp với file Controller Backend
const API_URL = 'http://localhost:8900/api/catalog/admin/posts'

const posts = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)

// Khai báo biến lưu file ảnh Post
const selectedFile = ref(null)

const form = ref({
  id: null,
  title: '',
  content: '',
  imageUrl: ''
})

const fetchPosts = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(API_URL)
    posts.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải bài viết:', error)
  } finally {
    isLoading.value = false
  }
}

// Hàm lấy dữ liệu ảnh được chọn
const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0]
}

const resetForm = () => {
  form.value = { id: null, title: '', content: '', imageUrl: '' }
  selectedFile.value = null
}

const openAddModal = () => {
  resetForm()
  isEdit.value = false
  showModal.value = true
}

const openEditModal = (post) => {
  form.value = { ...post }
  selectedFile.value = null
  isEdit.value = true
  showModal.value = true
}

const savePost = async () => {
  if (!form.value.title || !form.value.content) {
    alert('Vui lòng nhập đầy đủ tiêu đề và nội dung!')
    return
  }

  isSaving.value = true
  try {
    const formData = new FormData();
    const postData = { ...form.value };

    // Đóng gói data sang JSON Blob
    formData.append("data", new Blob([JSON.stringify(postData)], { type: "application/json" }));

    // Đính kèm ảnh
    if (selectedFile.value) {
      formData.append("image", selectedFile.value);
    }

    const axiosConfig = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    if (isEdit.value) {
      await axios.put(`${API_URL}/${form.value.id}`, formData, axiosConfig)
      alert('Cập nhật bài viết thành công!')
    } else {
      await axios.post(API_URL, formData, axiosConfig)
      alert('Thêm bài viết thành công!')
    }

    showModal.value = false
    fetchPosts()
  } catch (error) {
    console.error('Lỗi khi lưu bài viết:', error)
    alert('Lưu thất bại! ' + (error.response?.data?.message || ''))
  } finally {
    isSaving.value = false
  }
}

const deletePost = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
    try {
      await axios.delete(`${API_URL}/${id}`)
      alert('Xóa bài viết thành công!')
      fetchPosts()
    } catch (error) {
      console.error('Lỗi khi xóa bài viết:', error)
      alert('Không thể xóa bài viết!')
    }
  }
}

onMounted(() => {
  fetchPosts()
})
</script>
