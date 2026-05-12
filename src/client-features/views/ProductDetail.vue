<template>
  <div class="detail-page" style="margin-top: 80px;">

    <button class="back-btn" @click="$router.back()">
      <span class="back-arrow">←</span>
      <span>Quay lại Thực Đơn</span>
    </button>

    <div v-if="loading" class="state-screen">
      <div class="loader"><span></span><span></span><span></span></div>
      <p class="state-text">Đang chuẩn bị...</p>
    </div>

    <div v-else-if="!product" class="state-screen">
      <div class="not-found-icon">☕</div>
      <h3 class="state-text mt-3 fw-bold">Không tìm thấy sản phẩm</h3>
      <button class="btn-primary mt-3" @click="$router.push('/products')">Xem tất cả sản phẩm</button>
    </div>

    <div v-else class="detail-content fade-in">
      <section class="product-section">
        <div class="gallery">
          <div class="main-img-wrap">
            <img :src="mainImage" :alt="product.productName" class="main-img" />
            <div v-if="product.availability === 0" class="sold-out-badge">Hết hàng</div>
          </div>
          <div class="thumb-list" v-if="allImages.length > 1">
            <button
              v-for="(img, i) in allImages" :key="i"
              class="thumb-btn" :class="{ active: mainImage === img }"
              @click="mainImage = img"
            >
              <img :src="img" :alt="`Ảnh ${i + 1}`" />
            </button>
          </div>
        </div>

        <div class="info">
          <div class="info-top">
            <p class="category-tag" v-if="product.category?.categoryName">
              {{ product.category.categoryName }}
            </p>
            <h1 class="product-name">{{ product.productName }}</h1>
            <p class="product-price">
              {{ formatPrice(product.price) }}<span class="currency">đ</span>
            </p>
          </div>

          <div class="divider"></div>
          <p class="product-desc">{{ product.discription || 'Một thức uống hoàn hảo để đánh thức ngày mới của bạn. Được pha chế từ những nguyên liệu chọn lọc nhất.' }}</p>

          <div class="stock-row">
            <span class="stock-dot" :class="product.availability > 0 ? 'in-stock' : 'out-stock'"></span>
            <span class="stock-label">
              {{ product.availability > 0 ? `Sẵn sàng phục vụ (${product.availability})` : 'Tạm hết hàng' }}
            </span>
          </div>

          <div class="qty-section">
            <label class="qty-label">Số lượng</label>
            <div class="qty-control">
              <button class="qty-btn" @click="decrease" :disabled="quantity <= 1">−</button>
              <span class="qty-value">{{ quantity }}</span>
              <button class="qty-btn" @click="increase" :disabled="quantity >= product.availability">+</button>
            </div>
          </div>

          <div class="action-row">
            <button class="btn-primary btn-cart" :disabled="product.availability === 0" @click="handleAddToCart">
              <span v-if="!addedToCart"><CIcon icon="cil-basket" class="me-2"/> Thêm vào giỏ</span>
              <span v-else>✓ Đã thêm thành công!</span>
            </button>
            <button class="btn-secondary btn-buy" :disabled="product.availability === 0" @click="handleBuyNow">
              Mua ngay
            </button>
          </div>

          <transition name="fade">
            <div class="cart-feedback" v-if="addedToCart">
              <span>🛍 Giỏ hàng của bạn đang có <b>{{ totalCount }}</b> sản phẩm</span>
              <button class="go-cart-btn" @click="$router.push('/cart')">Xem giỏ hàng →</button>
            </div>
          </transition>

          <div class="meta-row mt-3">
            <span class="meta-item"><CIcon icon="cil-truck" class="me-1"/> Giao hàng tận nơi</span>
            <span class="meta-item"><CIcon icon="cil-shield-alt" class="me-1"/> Đảm bảo chất lượng 100%</span>
          </div>
        </div>
      </section>

      <section class="related-section" v-if="relatedProducts.length">
        <div class="section-header text-center mb-5">
          <h2 class="section-title">Gợi Ý Dành Cho Bạn</h2>
          <div class="title-underline mx-auto mt-3"></div>
        </div>
        <div class="related-grid">
          <div v-for="p in relatedProducts" :key="p.id" class="related-card" @click="goToProduct(p.id)">
            <div class="related-img-wrap">
              <img :src="p.imageUrl" :alt="p.productName" class="related-img" />
              <div class="related-overlay"><span>Xem chi tiết</span></div>
            </div>
            <div class="related-info text-center">
              <p class="related-name">{{ p.productName }}</p>
              <p class="related-price">{{ formatPrice(p.price) }} đ</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
/* === GIỮ NGUYÊN HOÀN TOÀN LOGIC JAVASCRIPT CỦA BẠN BÊN TRONG THẺ <script> === */
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { useCart } from '../composables/useCart'

const route = useRoute()
const router = useRouter()
const { addToCart, totalCount, isInCart, getQuantityInCart } = useCart()

const product = ref<any>(null)
const loading = ref(true)
const mainImage = ref('')
const quantity = ref(1)
const relatedProducts = ref<any[]>([])
const addedToCart = ref(false)

const allImages = computed(() => {
  if (!product.value) return []
  const imgs: string[] = []
  if (product.value.imageUrl) imgs.push(product.value.imageUrl)
  if (product.value.images) {
    product.value.images.forEach((i: any) => {
      if (i.imageUrl) imgs.push(i.imageUrl)
    })
  }
  return imgs
})

const formatPrice = (p: number) => p ? p.toLocaleString('vi-VN') : '0'

const fetchProduct = async (id: string | number) => {
  loading.value = true; product.value = null; relatedProducts.value = []; quantity.value = 1; addedToCart.value = false
  try {
    const res = await fetch(`http://localhost:8900/api/products/${id}`)
    if (!res.ok) throw new Error('Not found')
    const data = await res.json()
    product.value = data; mainImage.value = data.imageUrl || ''
    if (isInCart(data.id)) { quantity.value = getQuantityInCart(data.id) }
    if (data.category?.id) {
      const rel = await api.getProducts({ categoryId: data.category.id, page: 0, size: 5 })
      const content = rel?.data?.content ?? rel?.content ?? []
      relatedProducts.value = Array.isArray(content) ? content.filter((p: any) => p.id !== data.id).slice(0, 4) : []
    }
  } catch (e) { console.error(e); product.value = null }
  finally { loading.value = false }
}

const handleAddToCart = () => {
  if (!product.value || product.value.availability === 0) return
  addToCart({ id: product.value.id, productName: product.value.productName, price: product.value.price, imageUrl: product.value.imageUrl, availability: product.value.availability }, quantity.value)
  addedToCart.value = true; setTimeout(() => { addedToCart.value = false }, 3000)
}
const handleBuyNow = () => { handleAddToCart(); router.push('/cart') }
const increase = () => { if (product.value && quantity.value < product.value.availability) quantity.value++ }
const decrease = () => { if (quantity.value > 1) quantity.value-- }
const goToProduct = (id: number) => { router.push(`/products/${id}`) }

watch(() => route.params.id, (id) => { if (id) fetchProduct(id as string) })
onMounted(() => { if (route.params.id) fetchProduct(route.params.id as string) })
</script>

<style scoped>
/* Đã thay đổi toàn bộ biến CSS sang nhận diện thương hiệu HinCoffee */
.detail-page {
  --bg-color: #FBF8F5;
  --ink: #3A2318;
  --ink-soft: #665045;
  --gold: #D4AF37;
  --brand-red: #C92A2A;
  --brand-red-hover: #A61E1E;
  --border: #E8E2D9;
  --radius: 16px;
  --shadow: 0 10px 30px rgba(58,35,24,0.08);

  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg-color);
  min-height: 100vh;
  color: var(--ink);
  padding: 0 0 80px;
}

/* Utilities & Animations */
.fade-in { animation: fadeIn 0.6s ease forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

/* Back Button */
.back-btn { display: inline-flex; align-items: center; gap: 8px; background: none; border: none; font-weight: 600; color: var(--ink-soft); cursor: pointer; padding: 20px 32px; transition: color 0.2s; }
.back-btn:hover { color: var(--brand-red); }
.back-arrow { font-size: 1.2rem; transition: transform 0.2s; }
.back-btn:hover .back-arrow { transform: translateX(-5px); }

/* Layout */
.detail-content { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
.product-section { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: start; padding-bottom: 80px; }

/* Image Gallery */
.gallery { display: flex; flex-direction: column; gap: 16px; }
.main-img-wrap { position: relative; background: #fff; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); aspect-ratio: 1 / 1; }
.main-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.main-img-wrap:hover .main-img { transform: scale(1.05); }

.sold-out-badge { position: absolute; top: 16px; left: 16px; background: #333; color: #fff; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; padding: 6px 14px; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }

.thumb-list { display: flex; gap: 12px; }
.thumb-btn { width: 80px; height: 80px; padding: 0; border: 2px solid transparent; border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.2s; }
.thumb-btn img { width: 100%; height: 100%; object-fit: cover; }
.thumb-btn.active { border-color: var(--brand-red); transform: translateY(-3px); box-shadow: 0 4px 10px rgba(201,42,42,0.2); }

/* Info Section */
.info { display: flex; flex-direction: column; gap: 20px; padding-top: 10px;}
.category-tag { font-size: 0.85rem; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); margin: 0; }
.product-name { font-size: 2.2rem; font-weight: 900; line-height: 1.2; color: var(--ink); margin: 0; }
.product-price { font-size: 2rem; font-weight: 900; color: var(--brand-red); margin: 0; }
.currency { font-size: 1.2rem; font-weight: 600; margin-left: 4px; color: var(--brand-red); text-decoration: underline; }

.divider { height: 1px; background: var(--border); }
.product-desc { font-size: 1.05rem; line-height: 1.8; color: var(--ink-soft); margin: 0; }

/* Stock & Qty */
.stock-row { display: flex; align-items: center; gap: 10px; }
.stock-dot { width: 10px; height: 10px; border-radius: 50%; }
.stock-dot.in-stock  { background: #28a745; box-shadow: 0 0 0 4px rgba(40,167,69,0.2); }
.stock-dot.out-stock { background: #dc3545; box-shadow: 0 0 0 4px rgba(220,53,69,0.2); }
.stock-label { font-weight: 600; color: var(--ink-soft); }

.qty-label { font-size: 0.85rem; font-weight: bold; text-transform: uppercase; color: var(--ink-soft); letter-spacing: 1px;}
.qty-control { display: inline-flex; align-items: center; border: 2px solid var(--border); border-radius: 30px; overflow: hidden; width: fit-content; background: #fff; }
.qty-btn { width: 45px; height: 45px; border: none; background: none; font-size: 1.5rem; cursor: pointer; color: var(--ink); display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.qty-btn:hover:not(:disabled) { background: var(--bg-color); color: var(--brand-red); }
.qty-value { width: 40px; text-align: center; font-weight: bold; font-size: 1.1rem; }

/* Buttons */
.action-row { display: flex; gap: 16px; margin-top: 10px; }
.btn-primary, .btn-secondary { border-radius: 30px; padding: 16px 24px; font-size: 1rem; font-weight: bold; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
.btn-primary { flex: 1; background: var(--brand-red); color: #fff; border: none; box-shadow: 0 8px 20px rgba(201,42,42,0.25); }
.btn-primary:hover:not(:disabled) { background: var(--brand-red-hover); transform: translateY(-3px); }
.btn-secondary { background: #fff; color: var(--brand-red); border: 2px solid var(--brand-red); }
.btn-secondary:hover:not(:disabled) { background: var(--brand-red); color: #fff; }
.btn-primary:disabled, .btn-secondary:disabled { background: #ccc; border-color: #ccc; color: #fff; box-shadow: none; cursor: not-allowed; }

/* Feedback */
.cart-feedback { display: flex; justify-content: space-between; background: rgba(201,42,42,0.05); border: 1px solid rgba(201,42,42,0.2); border-radius: 12px; padding: 16px; color: var(--ink); }
.go-cart-btn { background: none; border: none; color: var(--brand-red); font-weight: bold; cursor: pointer; }

/* Related Products */
.related-section { padding-top: 40px; }
.title-underline { width: 60px; height: 4px; background-color: var(--brand-red); border-radius: 2px; }
.section-title { font-size: 1.8rem; font-weight: 900; margin: 0; color: var(--ink); text-transform: uppercase;}
.related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.related-card { cursor: pointer; background: #fff; border-radius: var(--radius); overflow: hidden; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
.related-card:hover { transform: translateY(-8px); box-shadow: var(--shadow); }
.related-img-wrap { position: relative; aspect-ratio: 1/1; overflow: hidden; }
.related-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.related-card:hover .related-img { transform: scale(1.1); }
.related-overlay { position: absolute; inset: 0; background: rgba(58,35,24,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
.related-overlay span { background: var(--brand-red); color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 0.85rem; }
.related-card:hover .related-overlay { opacity: 1; }
.related-info { padding: 16px; }
.related-name { font-size: 1rem; font-weight: bold; margin-bottom: 8px; color: var(--ink); transition: color 0.3s; }
.related-card:hover .related-name { color: var(--brand-red); }
.related-price { font-size: 1.1rem; font-weight: 900; color: var(--brand-red); margin: 0; }

@media (max-width: 900px) { .product-section { grid-template-columns: 1fr; } .related-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .action-row { flex-direction: column; } }
</style>
