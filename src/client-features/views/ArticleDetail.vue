<template>
  <div class="article-detail-page bg-light min-vh-100 py-5">
    <div class="container py-4" style="max-width: 800px;">

      <!-- Back button -->
      <button @click="$router.back()" class="btn btn-link text-decoration-none text-success p-0 mb-4 fw-bold">
        &larr; Quay lại
      </button>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-3 text-muted">Đang tải bài viết...</p>
      </div>

      <div v-else-if="!article" class="text-center py-5 bg-white rounded-4 shadow-sm border">
        <h3 class="text-muted">Không tìm thấy bài viết!</h3>
        <router-link to="/articles" class="btn btn-success mt-3 rounded-pill fw-bold">Xem bài viết khác</router-link>
      </div>

      <div v-else>
        <!-- Article Content -->
        <article class="bg-white rounded-4 shadow-sm border overflow-hidden mb-5">
          <!-- Cover Image -->
          <div class="ratio ratio-21x9 bg-dark">
            <img :src="article.imageUrl" class="object-fit-cover w-100 h-100 opacity-75" />
          </div>

          <div class="p-4 p-md-5">
            <h1 class="display-5 fw-black text-dark mb-3">{{ article.title }}</h1>
            <div class="d-flex align-items-center text-muted small mb-5 pb-3 border-bottom">
              <CIcon icon="cil-calendar" class="me-2" />
              <span>Đăng ngày: {{ formatDate(article.createdAt) }}</span>
            </div>

            <div class="article-content fs-5 lh-lg text-dark" style="white-space: pre-line;">
              {{ article.content || article.summary }}
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const article = ref<any>(null)
const loading = ref(true)

const formatDate = (dateArr: number[]) => {
  if (!dateArr || !Array.isArray(dateArr)) return new Date().toLocaleDateString('vi-VN')
  const [year, month, day] = dateArr
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
}

const fetchArticleData = async (id: string | number) => {
  loading.value = true
  try {
    const res = await fetch(`http://localhost:8900/api/articles/${id}`)
    if (res.ok) {
      article.value = await res.json()
    } else {
      article.value = null
    }
  } catch (err) {
    console.error(err)
    article.value = null
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchArticleData(newId as string)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

onMounted(() => {
  const id = route.params.id
  if (id) {
    fetchArticleData(id as string)
  }
})
</script>

<style scoped>
.fw-black { font-weight: 900; }
.article-content {
  color: #333;
}
.article-content img {
  max-width: 100%;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}
</style>
