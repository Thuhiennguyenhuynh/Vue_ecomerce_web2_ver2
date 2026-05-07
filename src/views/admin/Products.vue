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
                  <CTableHeaderCell class="text-center">Ảnh</CTableHeaderCell>
                  <CTableHeaderCell>SKU</CTableHeaderCell>
                  <CTableHeaderCell>Tên Sản Phẩm</CTableHeaderCell>
                  <CTableHeaderCell class="text-end">Giá ($)</CTableHeaderCell>
                  <CTableHeaderCell>Danh Mục</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Tồn Kho</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Hành Động</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-if="products.length === 0">
                  <CTableDataCell colspan="8" class="text-center text-muted py-4">
                    Chưa có sản phẩm nào. Hãy thêm sản phẩm mới.
                  </CTableDataCell>
                </CTableRow>
                <CTableRow v-for="product in products" :key="product.id">
                  <CTableDataCell class="text-center">{{ product.id }}</CTableDataCell>
                  <CTableDataCell class="text-center">
                    <img
                      :src="product.imageUrl || 'http://via.placeholder.com/50'"
                      alt="Product Image"
                      class="img-thumbnail"
                      style="width: 50px; height: 50px; object-fit: cover;"
                    />
                  </CTableDataCell>
                  <CTableDataCell class="fw-semibold">{{ product.sku }}</CTableDataCell>
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

    <CModal :visible="showModal" @close="showModal = false" backdrop="static" size="lg">
      <CModalHeader>
        <CModalTitle>{{ isEdit ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới' }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div class="row">
            <div class="col-md-6 mb-3">
              <CFormLabel>Tên Sản Phẩm <span class="text-danger">*</span></CFormLabel>
              <CFormInput v-model="form.productName" placeholder="VD: Áo thun nam" required />
            </div>
            <div class="col-md-6 mb-3">
              <CFormLabel>Đường dẫn Slug (Tự động) <span class="text-danger">*</span></CFormLabel>
              <CFormInput v-model="form.slug" placeholder="VD: ao-thun-nam" required readonly style="background-color: #f8f9fa;" />
            </div>
          </div>

          <div class="row">
            <div class="col-md-4 mb-3">
              <CFormLabel>Mã SKU (Tự động)</CFormLabel>
              <CFormInput v-model="form.sku" placeholder="VD: PROD-12345" required readonly style="background-color: #f8f9fa;" />
            </div>
            <div class="col-md-4 mb-3">
              <CFormLabel>Giá ($) <span class="text-danger">*</span></CFormLabel>
              <CFormInput type="number" step="0.01" min="0" v-model.number="form.price" placeholder="99.99" required />
            </div>
            <div class="col-md-4 mb-3">
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

          <div class="row">
            <div class="col-md-6 mb-3">
              <CFormLabel>Ảnh Đại Diện (Upload)</CFormLabel>
              <CFormInput type="file" accept="image/*" @change="handleMainImageUpload" />
              <div v-if="form.imageUrl" class="mt-2">
                <img :src="form.imageUrl" alt="Preview" style="height: 100px; border-radius: 8px; object-fit: cover;" />
              </div>
            </div>

            <div class="col-md-6 mb-3">
              <CFormLabel>Ảnh Phụ (Upload nhiều ảnh)</CFormLabel>
              <CFormInput type="file" accept="image/*" multiple @change="handleAdditionalImagesUpload" />
              <div v-if="form.additionalImageUrls.length > 0" class="mt-2 d-flex flex-wrap gap-2">
                <img
                  v-for="(url, index) in form.additionalImageUrls"
                  :key="index"
                  :src="url"
                  style="height: 60px; width: 60px; border-radius: 8px; object-fit: cover;"
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <CFormLabel>Mô tả chi tiết</CFormLabel>
            <CFormTextarea v-model="form.discription" rows="3" placeholder="Mô tả sản phẩm..."></CFormTextarea>
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="ghost" @click="showModal = false">Hủy</CButton>
        <CButton color="primary" @click="saveProduct" :disabled="isSaving || isUploading">
          <CSpinner v-if="isUploading" size="sm" class="me-1" />
          {{ isUploading ? 'Đang tải ảnh...' : (isSaving ? 'Đang lưu...' : 'Lưu Sản Phẩm') }}
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

// Gọi qua Cổng API Gateway 8900 - CORRIGIDO
const API_URL = 'http://localhost:8900/api/catalog/admin/products'
const CATEGORY_API_URL = 'http://localhost:8900/api/catalog/admin/categories'

const products = ref([])
const categories = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)
const isUploading = ref(false) // Trạng thái khóa nút lưu khi đang upload ảnh

const form = ref({
  id: null,
  sku: '',
  slug: '',
  productName: '',
  price: 0,
  categoryId: '',
  availability: 0,
imageUrl: '',
  additionalImageUrls: [], // Mảng chứa URL ảnh phụ sau khi upload
  discription: ''
})

// === HÀM HỖ TRỢ: CHUYỂN TÊN THÀNH SLUG ===
const generateSlug = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase()
    .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
    .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
    .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
    .replace(/đ/gi, 'd')
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng gạch ngang
    .replace(/[^\w\-]+/g, '') // Xóa các ký tự đặc biệt
    .replace(/\-\-+/g, '-') // Xóa nhiều gạch ngang liên tiếp
    .replace(/^-+/, '') // Xóa gạch ngang ở đầu
    .replace(/-+$/, ''); // Xóa gạch ngang ở cuối
}

// Theo dõi sự thay đổi của Tên sản phẩm để tự động tạo Slug
watch(() => form.value.productName, (newName) => {
  if (!isEdit.value) { // Chỉ tự động sinh slug khi thêm mới, sửa thì không tự đổi để tránh hỏng link cũ
    form.value.slug = generateSlug(newName);
  }
})

// === HÀM HỖ TRỢ: TỰ ĐỘNG TẠO SKU ===
const generateSKU = () => {
  const timestamp = Date.now().toString().slice(-6); // Lấy 6 số cuối của thời gian hiện tại
  const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 ký tự ngẫu nhiên
  return `PROD-${timestamp}${randomStr}`;
}

// === CÁC HÀM XỬ LÝ UPLOAD ẢNH ===
const sanitizeFileName = (value) => {
  if (!value) return 'file'
  return value.toString().toLowerCase()
    .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
    .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
    .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
    .replace(/đ/gi, 'd')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

const buildNamedFile = (file, fileName) => {
  return new File([file], fileName, { type: file.type })
}

const buildFileName = (file, options = {}) => {
  const extension = file.name.split('.').pop() || 'png'
  const timestamp = Date.now()
  const baseName = options.baseName ? sanitizeFileName(options.baseName) : sanitizeFileName(file.name.replace(/\.[^/.]+$/, ''))

  if (options.type === 'user') {
    return `${baseName}.${extension}`
  }

  if (options.type === 'extra') {
    return `${baseName}-phu123-${timestamp}.${extension}`
  }

  if (options.type === 'main') {
    return `${baseName}-main-${timestamp}.${extension}`
  }

  return `${baseName}-${timestamp}.${extension}`
}

// const uploadImageToServer = async (file, options = {}) => {
//   const namedFile = buildNamedFile(file, buildFileName(file, options))
//   const formData = new FormData()
//   formData.append('file', namedFile, namedFile.name)

//   const response = await axios.post('http://localhost:8900/api/catalog/admin/upload', formData, {
//   })

//   // Resposta contém fileName ou fileUrl
//   const fileUrl = response.data.fileUrl || (`/images/${response.data.fileName}`)
//   if (!fileUrl) {
//     throw new Error('Không nhận được URL file từ server')
//   }

//   // Converter para URL đầy đủ qua API Gateway
//   return `http://localhost:8900/api/catalog${fileUrl}`
// }

const uploadImageToServer = async (file, options = {}) => {
  try {
      const namedFile = buildNamedFile(file, buildFileName(file, options))
      const formData = new FormData()
      formData.append('file', namedFile, namedFile.name)

      // Gửi request
      const response = await axios.post('http://localhost:8900/api/catalog/admin/upload', formData)

      const fileUrl = response.data.fileUrl || (`/images/${response.data.fileName}`)
      return `http://localhost:8900/api/catalog${fileUrl}`
  } catch (error) {
      // DÒNG NÀY RẤT QUAN TRỌNG: In ra chi tiết thông báo lỗi từ Backend
      console.error('CHI TIẾT LỖI UPLOAD:', error.response?.data);
      alert('Lỗi upload: ' + JSON.stringify(error.response?.data || error.message));
      throw error;
  }
}

const handleMainImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  isUploading.value = true;
  try {
    const uploadedUrl = await uploadImageToServer(file, {
      type: 'main',
      baseName: form.value.productName || file.name.replace(/\.[^/.]+$/, '')
    })
    form.value.imageUrl = uploadedUrl;
  } catch (error) {
    alert('Lỗi upload ảnh đại diện!')
  } finally {
    isUploading.value = false;
  }
}

const handleAdditionalImagesUpload = async (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  isUploading.value = true;
  try {
    // Upload nhiều file cùng lúc và đặt tên ảnh phụ theo tên sản phẩm + phu123
    const uploadPromises = files.map((file) => uploadImageToServer(file, {
      type: 'extra',
      baseName: form.value.productName || file.name.replace(/\.[^/.]+$/, '')
    }))
    const uploadedUrls = await Promise.all(uploadPromises);

    // Nối thêm vào mảng ảnh phụ hiện có
    form.value.additionalImageUrls = [...form.value.additionalImageUrls, ...uploadedUrls];
  } catch (error) {
    alert('Lỗi upload ảnh phụ!')
  } finally {
    isUploading.value = false;
  }
}

// === API CALLS ===
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
    console.error('Lỗi khi tải danh mục:', error)
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    sku: generateSKU(), // Gán SKU tự động ngay khi reset form
    slug: '',
    productName: '',
    price: 0,
    categoryId: '',
    availability: 0,
    imageUrl: '',
    additionalImageUrls: [],
    discription: ''
  }
}
const openAddModal = () => {
  resetForm()
  isEdit.value = false
  showModal.value = true
}

const openEditModal = (product) => {
  form.value = {
    id: product.id,
    sku: product.sku || generateSKU(), // Nếu chưa có thì sinh mới
    slug: product.slug || '',
    productName: product.productName,
    price: product.price,
    categoryId: product.category?.id || '',
    availability: product.availability,
    imageUrl: product.imageUrl || '',
    additionalImageUrls: product.images ? product.images.map(img => img.imageUrl) : [],
    discription: product.discription
  }
  isEdit.value = true
  showModal.value = true
}

const saveProduct = async () => {
  if (!form.value.sku || !form.value.slug || !form.value.productName || !form.value.categoryId) {
    alert('Vui lòng nhập đầy đủ thông tin bắt buộc!')
    return
  }

  isSaving.value = true

  // Chuyển mảng URL thành mảng Object ProductImage để gửi xuống BE
  const formattedImages = form.value.additionalImageUrls.map(url => ({ imageUrl: url }))

  const payload = {
    sku: form.value.sku,
    slug: form.value.slug,
    productName: form.value.productName,
    price: form.value.price,
    discription: form.value.discription,
    availability: form.value.availability,
    imageUrl: form.value.imageUrl,
    category: { id: form.value.categoryId },
    images: formattedImages
  }

  try {
    if (isEdit.value) {
      await axios.put(`${API_URL}/${form.value.id}`, payload)
    } else {
      await axios.post(API_URL, payload)
    }
    showModal.value = false
    fetchProducts()
    alert(isEdit.value ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!')
  } catch (error) {
    console.error('Lỗi khi lưu:', error)
    const message = error.response?.data?.message || 'Lưu thất bại! Hãy kiểm tra lại thông tin.'
    alert(message)
  } finally {
    isSaving.value = false
  }
}

const deleteProduct = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchProducts()
    } catch (error) {
      console.error('Lỗi khi xóa:', error)
    }
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>
