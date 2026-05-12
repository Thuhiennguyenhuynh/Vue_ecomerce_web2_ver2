<template>
  <nav class="navbar navbar-expand-lg bg-white border-bottom fixed-top shadow-sm header-custom">
    <div class="container">
      <router-link to="/" class="navbar-brand d-flex align-items-center group-logo">
        <div class="logo-box text-white rounded px-2 py-1 me-2 fw-bold transition-transform">H</div>
        <span class="fw-black text-hl-brown h4 mb-0 tracking-tighter">HinCoffee</span>
      </router-link>

      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#clientNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="clientNavbar">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
          <li class="nav-item px-2"><router-link to="/" class="nav-link fw-bold text-uppercase small link-effect">Trang chủ</router-link></li>
          <li class="nav-item px-2"><router-link to="/products" class="nav-link fw-bold text-uppercase small link-effect"><CIcon icon="cil-grid" class="me-1" /> Sản phẩm</router-link></li>
          <li class="nav-item px-2 border-start d-none d-lg-block"></li>
          <li class="nav-item px-2"><router-link to="/articles" class="nav-link fw-bold text-uppercase small link-effect"><CIcon icon="cil-notes" class="me-1" /> Bài viết</router-link></li>
          <li class="nav-item px-2"><router-link to="/profile" class="nav-link fw-bold text-uppercase small link-effect">Tài khoản</router-link></li>
        </ul>

        <div class="d-flex align-items-center gap-3">
          <form @submit.prevent="handleSearchSubmit" class="position-relative d-none d-md-block group-search">
            <input v-model="headerSearchQuery" type="text" class="form-control rounded-pill search-input shadow-none pe-4" placeholder="Tìm kiếm..." style="width: 200px;">
            <button type="submit" class="btn btn-link text-hl-red position-absolute top-50 end-0 translate-middle-y p-0 me-3 btn-search">
              <CIcon icon="cil-search" />
            </button>
          </form>

          <router-link to="/cart" class="btn btn-cart d-flex align-items-center gap-2 rounded-pill px-3 py-2 position-relative text-decoration-none">
            <CIcon icon="cil-cart" size="lg" />
            <span class="fw-bold d-none d-md-inline-block small text-uppercase">Giỏ hàng</span>

            <span v-if="totalCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-hl-red pulse-badge shadow-sm">
              {{ totalCount }}
              <span class="visually-hidden">sản phẩm</span>
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// Thay thế Pinia store bằng useCart composable
import { useCart } from '../composables/useCart'

const router = useRouter()
const headerSearchQuery = ref('')

// Lấy biến totalCount (tự động cập nhật nhờ computed bên trong composable)
const { totalCount } = useCart()

const handleSearchSubmit = () => {
  if (headerSearchQuery.value.trim()) {
    router.push({ path: '/products', query: { search: headerSearchQuery.value.trim() } })
    headerSearchQuery.value = ''
  }
}
</script>

<style scoped>
.fw-black { font-weight: 900; }
.tracking-tighter { letter-spacing: -0.05em; }
.header-custom { height: 75px; z-index: 1050; transition: all 0.3s ease; }

.text-hl-brown { color: #4a2c2a !important; }
.text-hl-red { color: #b22830 !important; }
.bg-hl-red { background-color: #b22830 !important; }
.logo-box { background-color: #b22830; transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

.group-logo:hover .logo-box { transform: rotate(-10deg) scale(1.1); }

/* Hiệu ứng gạch chân khi hover menu */
.link-effect {
  position: relative; color: #4a2c2a !important; letter-spacing: 0.05em;
}
.link-effect::after {
  content: ''; position: absolute; width: 0; height: 2px; bottom: 0; left: 50%;
  background-color: #b22830; transition: all 0.3s ease; transform: translateX(-50%);
}
.link-effect:hover::after, .router-link-active::after { width: 80%; }
.link-effect:hover, .router-link-active { color: #b22830 !important; }

/* Nút Giỏ Hàng nổi bật */
.btn-cart {
  background-color: #fdf0f0; color: #b22830; border: 1px solid rgba(178,40,48,0.2);
  transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.btn-cart:hover {
  background-color: #b22830; color: #fff; transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(178,40,48,0.2);
}

/* Hiệu ứng đập nhịp tim cho số lượng giỏ hàng */
@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 0 0 rgba(178, 40, 48, 0.7); }
  70% { transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 0 10px rgba(178, 40, 48, 0); }
  100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 0 0 rgba(178, 40, 48, 0); }
}
.pulse-badge { animation: pulse 2s infinite; border: 2px solid #fff; }

.search-input:focus {
  border-color: #b22830; width: 250px !important; box-shadow: 0 0 0 0.2rem rgba(178, 40, 48, 0.15);
}
.group-search:hover .btn-search { transform: scale(1.1); }
</style>
