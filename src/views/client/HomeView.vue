<template>
  <div class="home min-h-screen bg-gray-50">
    <header class="banner bg-gradient-to-r from-indigo-600 to-purple-700 py-16 text-white text-center shadow-lg">
      <h1 class="text-5xl font-bold mb-4">Welcome to Our Store</h1>
      <p class="text-xl opacity-90">Discover the latest and greatest products.</p>
    </header>

    <section class="latest-articles container mx-auto py-12 px-6">
      <h2 class="text-3xl font-semibold mb-8 text-gray-800">Latest Articles</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="article in articles" :key="article.id" class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 class="text-xl font-bold mb-2 text-indigo-600">{{ article.title }}</h3>
          <p class="text-gray-600 mb-4 line-clamp-3">{{ article.summary || article.content }}</p>
          <a href="#" class="text-indigo-500 font-medium hover:underline">Read more &rarr;</a>
        </div>
        <div v-if="articles.length === 0" class="text-gray-500 italic">No articles available.</div>
      </div>
    </section>

    <section class="latest-products container mx-auto py-12 px-6 bg-white rounded-lg shadow-sm">
      <h2 class="text-3xl font-semibold mb-8 text-gray-800">Latest Products</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="product in products" :key="product.id" class="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-300 transition-colors group">
          <div class="h-48 bg-gray-200 rounded-md mb-4 overflow-hidden">
            <div class="w-full h-full flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
              No Image
            </div>
          </div>
          <h3 class="font-semibold text-gray-800 mb-2">{{ product.name }}</h3>
          <div class="flex justify-between items-center">
            <span class="text-indigo-600 font-bold">${{ product.price || 'N/A' }}</span>
            <button class="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors">Add to Cart</button>
          </div>
        </div>
        <div v-if="products.length === 0" class="text-gray-500 italic">No products available.</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../client-features/services/api'

const articles = ref([])
const products = ref([])

onMounted(async () => {
  try {
    const [articlesRes, productsRes] = await Promise.all([
      api.getLatestPosts(),
      api.getLatestProducts()
    ])
    articles.value = articlesRes.data
    products.value = productsRes.data
  } catch (error) {
    console.error('Error fetching home data:', error)
  }
})
</script>
