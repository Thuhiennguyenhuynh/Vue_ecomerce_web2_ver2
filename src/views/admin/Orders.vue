<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between align-items-center">
            <strong>Quản lý Đơn Hàng</strong>
            <CButton color="success" class="text-white" @click="openAddModal">
              + Thêm Đơn Hàng
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Khách Hàng</CTableHeaderCell>
                  <CTableHeaderCell>Tổng Tiền ($)</CTableHeaderCell>
                  <CTableHeaderCell>Trạng Thái</CTableHeaderCell>
                  <CTableHeaderCell>Ngày Đặt</CTableHeaderCell>
                  <CTableHeaderCell>Hành Động</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-if="orders.length === 0">
                  <CTableDataCell colspan="6" class="text-center text-muted">
                    Chưa có đơn hàng nào. Hãy thêm đơn hàng đầu tiên!
                  </CTableDataCell>
                </CTableRow>
                <CTableRow v-for="order in orders" :key="order.id">
                  <CTableDataCell>{{ order.id }}</CTableDataCell>
                  <CTableDataCell>{{ order.user ? order.user.name : 'N/A' }}</CTableDataCell>
                  <CTableDataCell>{{ order.totalPrice }}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge :color="getStatusColor(order.status)">
                      {{ getStatusText(order.status) }}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{{ formatDate(order.orderDate) }}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="info" size="sm" class="me-2 text-white" @click="viewOrderDetails(order)">
                      Chi Tiết
                    </CButton>
                    <CButton color="warning" size="sm" class="me-2 text-white" @click="openEditModal(order)">
                      Sửa
                    </CButton>
                    <CButton color="danger" size="sm" class="text-white" @click="deleteOrder(order.id)">
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

    <!-- Modal Chi Tiết Đơn Hàng -->
    <CModal :visible="showDetailsModal" @close="showDetailsModal = false" size="lg">
      <CModalHeader>
        <CModalTitle>Chi Tiết Đơn Hàng #{{ selectedOrder.id }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div v-if="selectedOrder">
          <p><strong>Khách Hàng:</strong> {{ selectedOrder.user ? selectedOrder.user.name : 'N/A' }}</p>
          <p><strong>Email:</strong> {{ selectedOrder.user ? selectedOrder.user.email : 'N/A' }}</p>
          <p><strong>Tổng Tiền:</strong> ${{ selectedOrder.totalPrice }}</p>
          <p><strong>Trạng Thái:</strong> {{ getStatusText(selectedOrder.status) }}</p>
          <p><strong>Ngày Đặt:</strong> {{ formatDate(selectedOrder.orderDate) }}</p>
          <h5>Sản Phẩm:</h5>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Tên Sản Phẩm</CTableHeaderCell>
                <CTableHeaderCell>Số Lượng</CTableHeaderCell>
                <CTableHeaderCell>Giá</CTableHeaderCell>
                <CTableHeaderCell>Tổng</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="item in selectedOrder.orderItems" :key="item.id">
                <CTableDataCell>{{ item.product ? item.product.productName : 'N/A' }}</CTableDataCell>
                <CTableDataCell>{{ item.quantity }}</CTableDataCell>
                <CTableDataCell>${{ item.price }}</CTableDataCell>
                <CTableDataCell>${{ item.quantity * item.price }}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showDetailsModal = false">Đóng</CButton>
      </CModalFooter>
    </CModal>

    <!-- Modal Thêm/Sửa Đơn Hàng -->
    <CModal :visible="showModal" @close="showModal = false" size="lg">
      <CModalHeader>
        <CModalTitle>{{ isEdit ? 'Sửa Đơn Hàng' : 'Thêm Đơn Hàng Mới' }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div class="mb-3">
            <CFormLabel>Khách Hàng</CFormLabel>
            <select class="form-select" v-model="form.userId" required>
              <option value="" disabled>-- Chọn khách hàng --</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
          </div>
          <div class="mb-3">
            <CFormLabel>Trạng Thái</CFormLabel>
            <select class="form-select" v-model="form.status" required>
              <option value="pending">Chờ Xử Lý</option>
              <option value="shipped">Đã Gửi</option>
              <option value="delivered">Đã Giao</option>
              <option value="cancelled">Đã Hủy</option>
            </select>
          </div>
          <div class="mb-3">
            <CFormLabel>Sản Phẩm</CFormLabel>
            <div v-for="(item, index) in form.orderItems" :key="index" class="d-flex mb-2">
              <select class="form-select me-2" v-model="item.productId" style="flex: 2;">
                <option value="" disabled>-- Chọn sản phẩm --</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.productName }} (${{ product.price }})
                </option>
              </select>
              <CFormInput type="number" v-model.number="item.quantity" placeholder="SL" style="flex: 1;" class="me-2" />
              <CButton color="danger" size="sm" @click="removeOrderItem(index)">Xóa</CButton>
            </div>
            <CButton color="secondary" size="sm" @click="addOrderItem">+ Thêm Sản Phẩm</CButton>
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showModal = false">Hủy</CButton>
        <CButton color="primary" @click="saveOrder">Lưu Lại</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// State
const orders = ref([])
const users = ref([])
const products = ref([])
const showModal = ref(false)
const showDetailsModal = ref(false)
const isEdit = ref(false)
const selectedOrder = ref(null)

// URL của Backend qua API Gateway
const ORDER_API_URL = 'http://localhost:8900/api/shop'
const USER_API_URL = 'http://localhost:8900/api/accounts'
const PRODUCT_API_URL = 'http://localhost:8900/api/catalog'

const form = ref({
  id: null,
  userId: '',
  status: 'pending',
  orderItems: [{ productId: '', quantity: 1 }]
})

// Computed cho tổng tiền
const totalPrice = computed(() => {
  return form.value.orderItems.reduce((total, item) => {
    const product = products.value.find(p => p.id === item.productId)
    return total + (product ? product.price * item.quantity : 0)
  }, 0)
})

// Lấy danh sách đơn hàng
const fetchOrders = async () => {
  try {
    const response = await axios.get(`${ORDER_API_URL}/admin/orders`)
    orders.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      orders.value = []
    } else {
      console.error('Lỗi khi tải đơn hàng:', error)
    }
  }
}

// Lấy danh sách người dùng
const fetchUsers = async () => {
  try {
    const response = await axios.get(`${USER_API_URL}/users`)
    users.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải người dùng:', error)
  }
}

// Lấy danh sách sản phẩm
const fetchProducts = async () => {
  try {
    const response = await axios.get(`${PRODUCT_API_URL}/products`)
    products.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải sản phẩm:', error)
  }
}

// Reset form
const resetForm = () => {
  form.value = { id: null, userId: '', status: 'pending', orderItems: [{ productId: '', quantity: 1 }] }
}

const openAddModal = () => {
  resetForm()
  isEdit.value = false
  showModal.value = true
}

const openEditModal = (order) => {
  form.value = {
    id: order.id,
    userId: order.user ? order.user.id : '',
    status: order.status,
    orderItems: order.orderItems.map(item => ({
      productId: item.product ? item.product.id : '',
      quantity: item.quantity
    }))
  }
  isEdit.value = true
  showModal.value = true
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
  showDetailsModal.value = true
}

const addOrderItem = () => {
  form.value.orderItems.push({ productId: '', quantity: 1 })
}

const removeOrderItem = (index) => {
  form.value.orderItems.splice(index, 1)
}

// Gọi API Thêm hoặc Cập nhật
const saveOrder = async () => {
  if (!form.value.userId || form.value.orderItems.length === 0) {
    alert('Vui lòng chọn khách hàng và ít nhất một sản phẩm!')
    return
  }

  const payload = {
    userId: form.value.userId,
    status: form.value.status,
    orderItems: form.value.orderItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }))
  }

  try {
    if (isEdit.value) {
      await axios.put(`${ORDER_API_URL}/admin/orders/${form.value.id}`, payload)
      alert('Cập nhật đơn hàng thành công!')
    } else {
      await axios.post(`${ORDER_API_URL}/admin/orders`, payload)
      alert('Thêm mới đơn hàng thành công!')
    }
    showModal.value = false
    fetchOrders()
  } catch (error) {
    console.error('Lỗi khi lưu đơn hàng:', error)
    alert('Có lỗi xảy ra!')
  }
}

// Xóa đơn hàng
const deleteOrder = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return

  try {
    await axios.delete(`${ORDER_API_URL}/admin/orders/${id}`)
    alert('Xóa đơn hàng thành công!')
    fetchOrders()
  } catch (error) {
    console.error('Lỗi khi xóa đơn hàng:', error)
    alert('Có lỗi xảy ra khi xóa!')
  }
}

// Helper functions
const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'shipped': return 'info'
    case 'delivered': return 'success'
    case 'cancelled': return 'danger'
    default: return 'secondary'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'Chờ Xử Lý'
    case 'shipped': return 'Đã Gửi'
    case 'delivered': return 'Đã Giao'
    case 'cancelled': return 'Đã Hủy'
    default: return status
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN')
}

// Khởi tạo
onMounted(() => {
  fetchOrders()
  fetchUsers()
  fetchProducts()
})
</script>
