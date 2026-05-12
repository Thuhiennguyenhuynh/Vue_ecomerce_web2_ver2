<template>
  <div class="bg-light min-vh-100 py-5">
    <div class="container py-4">
      <h1 class="display-5 fw-bold text-dark text-center mb-5 text-uppercase">Chuyện Nhà</h1>
      
      <div v-if="articles.length > 0" class="row g-4">
        <div v-for="post in articles" :key="post.id" class="col-12 col-md-6 col-lg-4">
          <article class="card h-100 border-0 shadow-sm rounded-4 hover-shadow transition cursor-pointer" @click="goToArticle(post.id)">
            <!-- Cover image -->
            <div class="ratio ratio-16x9 bg-light rounded-top-4 overflow-hidden">
              <img :src="post.imageUrl || 'https://via.placeholder.com/400x225?text=No+Image'" class="object-fit-cover w-100 h-100 transition img-hover-zoom" />
            </div>
            
            <div class="card-body p-4 d-flex flex-column">
              <h5 class="card-title fw-bold text-dark mb-3 text-truncate-2 group-hover-success transition">{{ post.title }}</h5>
              <p class="card-text text-muted small text-truncate-3 flex-grow-1 mb-4">{{ post.summary || post.content }}</p>
              
              <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                <span class="small text-muted"><CIcon icon="cil-calendar" class="me-1" /> {{ formatDate(post.createdAt) }}</span>
                <span class="text-success fw-bold small text-uppercase">Đọc thêm &rarr;</span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div v-else class="text-center py-5 bg-white rounded-4 shadow-sm border">
        <p class="text-muted fs-5 mb-0">Chưa có bài viết nào.</p>
      </div>

      <div v-if="totalPages > 1" class="d-flex justify-content-center mt-5 gap-2">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0" class="btn btn-outline-success rounded-circle fw-bold" style="width: 40px; height: 40px;">&larr;</button>
        <button 
          v-for="page in totalPages" :key="page"
          @click="changePage(page - 1)"
          class="btn rounded-circle fw-bold"
          :class="currentPage === page - 1 ? 'btn-success text-white shadow-sm' : 'btn-outline-success'"
          style="width: 40px; height: 40px;"
        > {{ page }} </button>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages - 1" class="btn btn-outline-success rounded-circle fw-bold" style="width: 40px; height: 40px;">&rarr;</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const articles = ref<any[]>([])
const currentPage = ref(0)
const totalPages = ref(0)

const fetchArticles = async () => {
  const res = await api.getArticles({ page: currentPage.value, size: 6 })
  articles.value = res.data.content || []
  totalPages.value = res.data.totalPages || 0
}

const changePage = (page: number) => {
  currentPage.value = page
  fetchArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToArticle = (id: number) => {
  router.push(`/articles/${id}`)
}

const formatDate = (dateArr: number[]) => {
  if (!dateArr || !Array.isArray(dateArr)) return new Date().toLocaleDateString('vi-VN')
  const [year, month, day] = dateArr
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
}

onMounted(fetchArticles)
</script>

<style scoped>
.hover-shadow:hover { box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important; }
.transition { transition: all 0.3s ease; }
.cursor-pointer { cursor: pointer; }
.img-hover-zoom { transition: transform 0.5s ease; }
.cursor-pointer:hover .img-hover-zoom { transform: scale(1.05); }

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.group-hover-success:hover {
  color: #198754 !important;
}
</style>