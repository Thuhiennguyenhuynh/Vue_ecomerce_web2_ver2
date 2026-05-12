<template>
  <div class="home-page-content overflow-hidden page-bg" style="margin-top: 100px;">

    <section class="position-relative overflow-hidden hero-section">
        <img v-if="banners.length > 0" :src="banners[0].imageUrl" class="position-absolute w-100 h-100 object-fit-cover zoom-anim"/>
        <img v-else src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" class="position-absolute w-100 h-100 object-fit-cover zoom-anim"/>

        <div class="position-absolute top-0 start-0 w-100 h-100 bg-overlay-premium"></div>

        <div class="position-relative z-1 container h-100 d-flex flex-column justify-content-center text-center text-lg-start">
          <div class="col-lg-7 fade-in-up">
            <span class="badge bg-hl-gold text-dark mb-3 px-3 py-2 rounded-pill fw-bold text-uppercase tracking-widest small shadow-sm">
              Trải nghiệm khác biệt
            </span>
            <h1 class="display-3 fw-black text-uppercase mb-4 text-white text-shadow-sm lh-sm">
              {{ banners[0]?.title || 'TỰ HÀO SINH RA TỪ ĐẤT VIỆT' }}
            </h1>
            <p class="lead text-light mb-5 fs-5 fw-light" style="max-width: 600px;">
              {{ banners[0]?.description || 'Hành trình mang hương vị cà phê đậm đà, chuẩn gu Việt đến mọi miền tổ quốc. Kết nối những trái tim qua từng giọt đắng thơm.' }}
            </p>
            <div class="d-flex gap-3 justify-content-center justify-content-lg-start">
              <button class="btn btn-hl-red px-5 py-3 rounded-pill fw-bold text-uppercase shadow-lg hover-lift">Đặt Hàng Ngay</button>
              <button class="btn btn-outline-light px-5 py-3 rounded-pill fw-bold text-uppercase hover-lift">Khám Phá</button>
            </div>
          </div>
        </div>
    </section>

    <section class="py-6 about-section position-relative">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6 position-relative fade-in-up">
            <div class="img-composition">
              <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Cà phê" class="img-main rounded-5 shadow-lg object-fit-cover"/>
              <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Hạt cà phê" class="img-float rounded-circle shadow-lg border border-4 border-white object-fit-cover"/>
            </div>
          </div>
          <div class="col-lg-6 fade-in-up delay-1 ps-lg-5">
            <h6 class="text-hl-red fw-bold text-uppercase tracking-widest mb-2">Câu chuyện thương hiệu</h6>
            <h2 class="display-5 fw-black text-hl-brown mb-4">TINH HOA TỪ<br/><span class="text-hl-gold">ĐẠI NGÀN</span></h2>
            <p class="text-muted fs-5 mb-4 fw-light" style="line-height: 1.8;">
              Chúng tôi tự hào sử dụng nguồn hạt cà phê thượng hạng được tuyển chọn khắt khe từ vùng đất Tây Nguyên. Trải qua quy trình rang xay mộc độc quyền, HinCoffee giữ trọn vẹn hương vị nguyên bản, đậm đà và đánh thức mọi giác quan.
            </p>
            <div class="row g-4 mb-5">
              <div class="col-6 d-flex align-items-center gap-3">
                <div class="icon-box bg-hl-red-light rounded-circle d-flex align-items-center justify-content-center text-hl-red">
                  <CIcon icon="cil-leaf" size="xl"/>
                </div>
                <div>
                  <h4 class="fw-black mb-0 text-hl-brown">99%</h4>
                  <span class="small text-muted fw-bold text-uppercase">Hạt chín mọng</span>
                </div>
              </div>
              <div class="col-6 d-flex align-items-center gap-3">
                <div class="icon-box bg-hl-gold-light rounded-circle d-flex align-items-center justify-content-center text-hl-gold">
                  <CIcon icon="cil-drop" size="xl"/>
                </div>
                <div>
                  <h4 class="fw-black mb-0 text-hl-brown">100h</h4>
                  <span class="small text-muted fw-bold text-uppercase">Lên men tự nhiên</span>
                </div>
              </div>
            </div>
            <button class="btn btn-outline-hl-brown rounded-pill px-5 py-3 fw-bold hover-lift">Tìm hiểu quy trình</button>
          </div>
        </div>
      </div>
    </section>

    <section class="py-6 menu-section bg-white position-relative">
      <div class="container">
        <div class="d-flex flex-column align-items-center justify-content-center mb-5 section-title fade-in-up text-center">
          <h6 class="text-hl-red fw-bold text-uppercase tracking-widest mb-2">Đánh thức vị giác</h6>
          <h2 class="display-5 fw-black text-hl-brown mb-0 position-relative pb-3">
            THỰC ĐƠN NỔI BẬT
            <span class="title-underline center-underline"></span>
          </h2>
        </div>

        <div class="row g-4 g-lg-5">
          <div v-for="(product, index) in products" :key="product.id" class="col-6 col-md-4 col-lg-3 fade-in-up" :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="product-card group cursor-pointer bg-transparent h-100 d-flex flex-column" @click="goToProduct(product.id)">
              <div class="product-img-wrap rounded-4 overflow-hidden position-relative mb-3 shadow-sm">
                <div class="ratio ratio-1x1 bg-light">
                  <img :src="product.imageUrl" class="object-fit-cover w-100 h-100 transition-transform" />
                </div>
                <div class="cart-action-overlay d-flex align-items-center justify-content-center">
                  <button class="btn btn-hl-red rounded-circle p-0 d-flex align-items-center justify-content-center shadow-lg hover-scale" style="width: 45px; height: 45px;" @click.stop="addToCart(product)">
                    <CIcon icon="cil-basket" size="lg"/>
                  </button>
                </div>
              </div>
              <div class="product-info text-center d-flex flex-column flex-grow-1">
                <h5 class="fw-bold text-hl-brown mb-2 text-truncate-2 group-hover-red transition" style="font-size: 1.1rem;">
                  {{ product.productName }}
                </h5>
                <div class="mt-auto">
                  <span class="text-hl-red fw-black fs-5">{{ formatPrice(product.price) }}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-5 fade-in-up delay-2">
          <button class="btn btn-outline-hl-brown rounded-pill px-5 py-3 fw-bold hover-lift" @click="$router.push('/products')">Xem toàn bộ Menu</button>
        </div>
      </div>
    </section>

    <section class="py-6 bg-dark text-white position-relative parallax-section" style="background-image: url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80');">
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-overlay-dark-heavy"></div>
      <div class="container py-5 position-relative z-1 text-center fade-in-up">
        <h2 class="display-4 fw-black text-white mb-4">KHÔNG GIAN CỦA <span class="text-hl-gold">SỰ KẾT NỐI</span></h2>
        <p class="lead mx-auto mb-5 fw-light" style="max-width: 750px; color: #e0e0e0;">
          Hơn cả một ly cà phê, HinCoffee mang đến không gian hiện đại, ấm cúng và truyền cảm hứng. Nơi bạn có thể gặp gỡ đối tác, hàn huyên cùng bạn bè hay tìm một góc tĩnh lặng cho riêng mình.
        </p>
        <div class="row g-4 justify-content-center mt-3">
          <div class="col-6 col-md-3">
            <div class="counter-box">
              <h2 class="display-4 fw-black text-hl-gold mb-0">50+</h2>
              <p class="mb-0 fw-bold text-uppercase tracking-widest small">Cửa hàng</p>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="counter-box">
              <h2 class="display-4 fw-black text-hl-gold mb-0">10M+</h2>
              <p class="mb-0 fw-bold text-uppercase tracking-widest small">Khách hàng</p>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="counter-box">
              <h2 class="display-4 fw-black text-hl-gold mb-0">20+</h2>
              <p class="mb-0 fw-bold text-uppercase tracking-widest small">Tỉnh thành</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-6 about-section">
  <div class="container">
    <div class="d-flex flex-wrap align-items-end justify-content-between mb-5 section-title fade-in-up">
      <div class="mb-3 mb-md-0">
        <h6 class="text-hl-red fw-bold text-uppercase tracking-widest mb-2">Góc chia sẻ</h6>
        <h2 class="display-5 fw-black text-hl-brown mb-0 position-relative pb-3">
          CHUYỆN NHÀ HIN
          <span class="title-underline"></span>
        </h2>
      </div>
      <button class="btn btn-link text-hl-brown fw-bold text-decoration-none p-0 group" @click="router.push('/articles')">
        Xem tất cả bài viết <CIcon icon="cil-arrow-right" class="ms-1 group-hover-translate transition"/>
      </button>
    </div>

    <div class="row g-4">
      <div v-for="(post, index) in latestPosts" :key="post.id" class="col-md-4 fade-in-up" :style="{ animationDelay: `${index * 0.15}s` }">
        <article class="cursor-pointer group blog-card h-100 d-flex flex-column" @click="goToArticle(post.id)">

          <div class="rounded-4 overflow-hidden mb-4 position-relative shadow-sm">
            <div class="ratio ratio-4x3">
              <img :src="post.imageUrl" class="object-fit-cover transition-transform w-100 h-100" />
            </div>
            <div class="position-absolute bottom-0 start-0 m-3 bg-white text-hl-brown text-uppercase px-3 py-1 rounded-pill small fw-bold shadow-sm" style="z-index: 2;">
              Tin tức
            </div>
          </div>
          <div class="blog-content flex-grow-1">
            <p class="small text-muted fw-bold mb-2">12 Tháng 05, 2026</p>
            <h4 class="fw-bold text-hl-brown group-hover-red transition mb-3 text-truncate-2 lh-base">
              {{ post.title }}
            </h4>
            <p class="text-muted text-truncate-3 mb-0 fw-light">
              {{ post.summary || post.content }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </div>
</section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useCart } from '../composables/useCart'

const router = useRouter()

// Dùng useCart thay thế cartStore
const { addToCart: addProductToCart } = useCart()

const banners = ref<any[]>([])
const products = ref<any[]>([])
const latestPosts = ref<any[]>([])

const formatPrice = (p: number) => p ? p.toLocaleString('vi-VN') : '0'

const goToProduct = (id: number) => router.push(`/products/${id}`)
const goToArticle = (id: number) => router.push(`/articles/${id}`)

const addToCart = (product: any) => {
  // Gán availability mặc định nếu API bị thiếu để tránh lỗi NaN ở LocalStorage
  const cartItem = {
    ...product,
    availability: product.availability || 99
  }

  addProductToCart(cartItem)
  alert('Đã thêm ' + product.productName + ' vào giỏ hàng!')
}

onMounted(async () => {
  try {
    const [bRes, pRes, aRes] = await Promise.all([
      api.getBanners(),
      api.getProducts({ page: 0, size: 8 }),
      api.getArticles({ page: 0, size: 3 })
    ])
    banners.value = bRes.data || []
    products.value = pRes.data.content || []
    latestPosts.value = aRes.data.content || []
  } catch (err) {
    console.error('Lỗi tải dữ liệu:', err)
  }
})
</script>

<style scoped>
/* =========================================
   VARIABLES & GLOBAL
   ========================================= */
.page-bg { background-color: #FBF8F5; } /* Kem nhạt sang trọng */
.py-6 { padding-top: 5rem; padding-bottom: 5rem; }

.fw-black { font-weight: 900; }
.tracking-widest { letter-spacing: 0.15em; }

/* Bảng màu chuẩn Brand Cà Phê */
.text-hl-brown { color: #3A2318; }
.text-hl-red { color: #C92A2A; }
.text-hl-gold { color: #D4AF37; }

.bg-hl-red { background-color: #C92A2A; color: white; border: none; }
.bg-hl-red:hover { background-color: #A61E1E; }
.bg-hl-gold { background-color: #D4AF37; }

.bg-hl-red-light { background-color: rgba(201, 42, 42, 0.1); }
.bg-hl-gold-light { background-color: rgba(212, 175, 55, 0.1); }

/* =========================================
   BUTTONS
   ========================================= */
.btn-hl-red { background-color: #C92A2A; color: white; border: none; transition: all 0.3s ease;}
.btn-hl-red:hover { background-color: #A61E1E; color: white; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(201,42,42,0.3) !important; }

.btn-outline-hl-brown { border: 2px solid #3A2318; color: #3A2318; transition: all 0.3s ease; }
.btn-outline-hl-brown:hover { background-color: #3A2318; color: white; }

.hover-lift { transition: transform 0.3s ease; }
.hover-lift:hover { transform: translateY(-5px); }
.hover-scale { transition: transform 0.3s ease; }
.hover-scale:hover { transform: scale(1.1); }

/* =========================================
   HERO BANNER
   ========================================= */
.hero-section { height: 650px; }
.bg-overlay-premium {
  background: linear-gradient(100deg, rgba(20,10,5,0.9) 0%, rgba(20,10,5,0.6) 50%, rgba(20,10,5,0.2) 100%);
}
.text-shadow-sm { text-shadow: 2px 2px 10px rgba(0,0,0,0.5); }

/* =========================================
   ABOUT SECTION (TINH HOA)
   ========================================= */
.img-composition { position: relative; width: 100%; height: 500px; }
.img-main { width: 85%; height: 100%; position: absolute; top: 0; left: 0; }
.img-float {
  width: 200px; height: 200px;
  position: absolute; bottom: -30px; right: 0;
  z-index: 2;
  animation: floatAnim 6s ease-in-out infinite;
}
.icon-box { width: 60px; height: 60px; flex-shrink: 0; }

@keyframes floatAnim {
  0% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0); }
}

/* =========================================
   PRODUCTS (THỰC ĐƠN)
   ========================================= */
.title-underline { position: absolute; bottom: 0; left: 0; width: 60px; height: 4px; background-color: #C92A2A; border-radius: 2px; }
.center-underline { left: 50%; transform: translateX(-50%); }

.product-img-wrap {
  border-radius: 1.5rem;
  isolation: isolate;
}
.transition-transform { transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1); }
.product-card:hover .transition-transform { transform: scale(1.08); }
.group-hover-red:hover { color: #C92A2A !important; }

/* Giỏ hàng trượt từ dưới lên */
.cart-action-overlay {
  position: absolute;
  bottom: -60px; /* Ẩn ở dưới */
  left: 0;
  width: 100%;
  padding-bottom: 20px;
  background: linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 100%);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.product-card:hover .cart-action-overlay {
  bottom: 0;
  opacity: 1;
}

/* =========================================
   PARALLAX COUNTER (KHÔNG GIAN)
   ========================================= */
.parallax-section { background-size: cover; background-attachment: fixed; background-position: center; }
.bg-overlay-dark-heavy { background: rgba(15, 8, 5, 0.85); }
.counter-box { padding: 1.5rem; border-left: 1px solid rgba(255,255,255,0.1); }
@media (max-width: 768px) { .counter-box { border-left: none; margin-bottom: 1rem; } }

/* =========================================
   BLOGS (CHUYỆN NHÀ)
   ========================================= */
.blog-card:hover .transition-transform { transform: scale(1.05); }
.group-hover-translate { transition: transform 0.3s ease; }
.group:hover .group-hover-translate { transform: translateX(5px); }
.text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.text-truncate-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

/* =========================================
   ANIMATIONS
   ========================================= */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; opacity: 0; }
.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }

@keyframes slowZoom {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}
.zoom-anim { animation: slowZoom 25s infinite ease-in-out; }
</style>
