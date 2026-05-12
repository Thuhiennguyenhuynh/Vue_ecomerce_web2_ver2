<template>
  <div class="products-page bg-page min-vh-100 pb-5" style="margin-top: 80px;">

    <section class="menu-banner position-relative d-flex align-items-center justify-content-center text-center">
      <img src="https://images.unsplash.com/photo-1495474472204-51e65a5b3669?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" alt="Menu Banner" class="position-absolute w-100 h-100 object-fit-cover" />
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-overlay"></div>
      <div class="position-relative z-1 container pt-4 pb-5">
        <h1 class="display-4 fw-black text-white text-uppercase tracking-widest mb-3 text-shadow">Thực Đơn</h1>
        <p class="lead text-light mb-0 mx-auto fw-light" style="max-width: 600px;">
          Khám phá những hương vị tuyệt hảo được rang xay và pha chế bằng cả trái tim dành riêng cho bạn.
        </p>
      </div>
    </section>

    <div class="container" style="margin-top: -30px; position: relative; z-index: 2;">
      <div class="row justify-content-center mb-5">
        <div class="col-md-8 col-lg-6">
          <div class="bg-white p-2 rounded-pill shadow-lg d-flex align-items-center border">
            <CIcon icon="cil-search" class="ms-3 text-muted" size="lg"/>
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Hôm nay bạn muốn uống gì?..."
              class="form-control border-0 shadow-none bg-transparent ms-2 py-2"
            />
          </div>
        </div>
      </div>

      <div class="row g-4 g-lg-5">
        <aside class="col-12 col-md-4 col-lg-3">
          <div class="bg-white rounded-4 shadow-sm p-4 sticky-top" style="top: 100px;">
            <h5 class="fw-black text-hl-brown mb-4 text-uppercase tracking-widest border-bottom pb-3">
              Danh mục
            </h5>
            <ul class="list-unstyled mb-0 d-flex flex-row flex-md-column gap-2 overflow-auto hide-scrollbar">
              <li
                @click="filterByCategory(null)"
                class="category-item rounded-pill px-4 py-2 transition fw-bold text-nowrap"
                :class="selectedCategoryId === null ? 'active' : ''"
              >
                Tất cả sản phẩm
              </li>
              <li
                v-for="cat in categories" :key="cat.id"
                @click="filterByCategory(cat.id)"
                class="category-item rounded-pill px-4 py-2 transition fw-bold text-nowrap"
                :class="selectedCategoryId === cat.id ? 'active' : ''"
              >
                {{ cat.categoryName }}
              </li>
            </ul>
          </div>
        </aside>

        <main class="col-12 col-md-8 col-lg-9">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-bold text-hl-brown mb-0">
              {{ selectedCategoryId ? 'Sản phẩm theo danh mục' : 'Tất cả sản phẩm' }}
            </h4>
            <div class="d-flex align-items-center bg-white rounded-pill px-3 py-1 shadow-sm border">
              <CIcon icon="cil-sort-ascending" class="text-hl-red me-2"/>
              <select v-model="sortOption" @change="handleSort" class="form-select form-select-sm border-0 shadow-none bg-transparent fw-bold text-hl-brown cursor-pointer" style="min-width: 150px;">
                <option value="">Sắp xếp mặc định</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          <div v-if="products.length > 0" class="row g-4">
            <div v-for="p in products" :key="p.id" class="col-6 col-lg-4 fade-in-up">
              <div class="card h-100 product-card border-0 rounded-4 transition cursor-pointer bg-white d-flex flex-column" @click="goToProduct(p.id)">
                <div class="p-2 pb-0">
                  <div class="ratio ratio-1x1 bg-light rounded-4 overflow-hidden position-relative">
                    <img :src="p.imageUrl" class="object-fit-cover product-img transition" />
                    <div class="quick-buy-overlay d-flex align-items-center justify-content-center">
                      <button class="btn btn-hl-red rounded-circle p-0 d-flex align-items-center justify-content-center shadow-lg hover-scale" style="width: 45px; height: 45px;" @click.stop="addToCart(p)">
                        <CIcon icon="cil-basket" size="lg"/>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="card-body p-3 d-flex flex-column text-center flex-grow-1">
                  <h6 class="fw-bold text-hl-brown mb-2 text-truncate-2 product-title transition" style="font-size: 1rem;">
                    {{ p.productName }}
                  </h6>
                  <p class="small text-muted text-truncate mb-3 fw-light">{{ p.discription || 'Hương vị nguyên bản, đậm đà khó quên.' }}</p>
                  <div class="mt-auto">
                    <span class="text-hl-red fw-black fs-5">{{ formatPrice(p.price) }}đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-5 bg-white rounded-4 shadow-sm border mt-4">
            <CIcon icon="cil-mug" size="3xl" class="text-muted mb-3 opacity-50" />
            <h5 class="fw-bold text-hl-brown">Không tìm thấy sản phẩm</h5>
            <p class="text-muted mb-0">Vui lòng thử nghiệm với từ khóa khác.</p>
          </div>

          <div v-if="totalPages > 1" class="d-flex justify-content-center mt-5 gap-2 pb-4">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0" class="btn btn-page rounded-circle fw-bold">&larr;</button>
            <button
              v-for="page in totalPages" :key="page"
              @click="changePage(page - 1)"
              class="btn btn-page rounded-circle fw-bold"
              :class="currentPage === page - 1 ? 'active shadow-sm' : ''"
            > {{ page }} </button>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages - 1" class="btn btn-page rounded-circle fw-bold">&rarr;</button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { debounce } from 'lodash'
import { useCartStore } from '../../stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const products = ref<any[]>([])
const categories = ref<any[]>([])
const searchQuery = ref('')
const selectedCategoryId = ref<number | null>(null)
const sortOption = ref('')
const currentPage = ref(0)
const totalPages = ref(0)
const pageSize = 9

const formatPrice = (price: number) => price ? price.toLocaleString('vi-VN') : '0'

const fetchProducts = async () => {
  try {
    let sortBy = '', sortDir = ''
    if (sortOption.value === 'price_asc') { sortBy = 'price'; sortDir = 'asc' }
    else if (sortOption.value === 'price_desc') { sortBy = 'price'; sortDir = 'desc' }

    const res = await api.getProducts({
      name: searchQuery.value || undefined,
      categoryId: selectedCategoryId.value || undefined,
      sortBy: sortBy || undefined,
      sortDir: sortDir || undefined,
      page: currentPage.value,
      size: pageSize
    })
    products.value = res.data.content || []
    totalPages.value = res.data.totalPages || 0
  } catch (err) { console.error(err) }
}

const handleSearch = debounce(() => { currentPage.value = 0; fetchProducts() }, 500)
const filterByCategory = (id: number | null) => { selectedCategoryId.value = id; currentPage.value = 0; fetchProducts() }
const handleSort = () => { currentPage.value = 0; fetchProducts() }
const changePage = (page: number) => { currentPage.value = page; fetchProducts(); window.scrollTo({ top: 300, behavior: 'smooth' }) }

const fetchCategories = async () => {
  try {
    const res = await api.getCategories()
    categories.value = res.data || []
  } catch (err) { console.error(err) }
}

const addToCart = (product: any) => { cartStore.addToCart(product); alert('Đã thêm ' + product.productName + ' vào giỏ hàng!') }
const goToProduct = (id: number) => { router.push(`/products/${id}`) }

watch(() => route.query.search, (newSearch) => {
  if (newSearch) { searchQuery.value = newSearch as string; currentPage.value = 0; fetchProducts() }
})

onMounted(() => {
  if (route.query.search) { searchQuery.value = route.query.search as string }
  fetchCategories()
  fetchProducts()
})
</script>

<style scoped>
.bg-page { background-color: #FBF8F5; }
.fw-black { font-weight: 900; }
.tracking-widest { letter-spacing: 0.15em; }
.text-hl-brown { color: #3A2318; }
.text-hl-red { color: #C92A2A; }
.bg-hl-red { background-color: #C92A2A; color: white; border: none; }
.bg-hl-red:hover { background-color: #A61E1E; }

/* Banner */
.menu-banner { height: 350px; }
.bg-overlay { background: linear-gradient(0deg, rgba(20,10,5,0.8) 0%, rgba(20,10,5,0.4) 100%); }
.text-shadow { text-shadow: 2px 2px 10px rgba(0,0,0,0.5); }

/* Sidebar */
.category-item { color: #555; cursor: pointer; border: 1px solid transparent; }
.category-item:hover { background-color: #f5f5f5; color: #C92A2A; }
.category-item.active { background-color: #C92A2A; color: white; box-shadow: 0 4px 10px rgba(201,42,42,0.3); }
.hide-scrollbar::-webkit-scrollbar { display: none; }

/* Product Cards */
.product-card { box-shadow: 0 4px 15px rgba(0,0,0,0.03); top: 0; position: relative; }
.product-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(58,35,24,0.1) !important; }
.product-card:hover .product-title { color: #C92A2A; }
.product-img { width: 100%; height: 100%; }
.product-card:hover .product-img { transform: scale(1.08); }

.quick-buy-overlay {
  position: absolute; bottom: -50px; left: 0; width: 100%; padding-bottom: 15px;
  background: linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 100%);
  opacity: 0; transition: all 0.3s ease;
}
.product-card:hover .quick-buy-overlay { bottom: 0; opacity: 1; }
.hover-scale:hover { transform: scale(1.1); }

/* Pagination */
.btn-page { width: 40px; height: 40px; border: 1px solid #ddd; color: #3A2318; background: white; display: flex; align-items: center; justify-content: center;}
.btn-page:hover:not(:disabled) { background: #f5f5f5; color: #C92A2A; border-color: #C92A2A; }
.btn-page.active { background: #C92A2A; color: white; border-color: #C92A2A; }
.btn-page:disabled { opacity: 0.5; cursor: not-allowed; }

/* Animations */
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.fade-in-up { animation: fadeInUp 0.5s ease forwards; }
.transition { transition: all 0.3s ease; }
</style>
