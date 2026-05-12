<template>
  <div class="d-flex flex-column min-vh-100 overflow-hidden">
    <ClientHeader />
    <main class="flex-grow-1 overflow-auto pt-5 mt-4 custom-scrollbar bg-light">
      <router-view />
    </main>
    <ClientFooter />
  </div>
</template>

<script setup>
import ClientHeader from '../components/ClientHeader.vue'
import ClientFooter from '../components/ClientFooter.vue'
</script>

<style scoped>
/* Thanh cuộn */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #166534;
  border-radius: 10px;
}
</style>
