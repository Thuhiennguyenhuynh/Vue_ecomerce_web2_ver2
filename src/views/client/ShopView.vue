<template>
  <div class="shop-view">
    <header class="brown-header">
      <h1>Menu Coffee Shop</h1>
      <router-link to="/">Quay lại trang chủ</router-link>
    </header>
    <main class="menu-container">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="product.imageUrl" :alt="product.productName" />
        <h3>{{ product.productName }}</h3>
        <p>{{ product.price }} VNĐ</p>
        <button class="btn-order" @click="cartStore.addToCart(product)">Thêm vào giỏ</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useCartStore } from '@/stores/cart';

const products = ref([]);
const cartStore = useCartStore();

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8900/api/catalog/products');
    products.value = response.data;
  } catch (error) {
    console.error('Lỗi khi tải sản phẩm:', error);
  }
});
</script>

<style scoped>
.brown-header { background-color: #6f4e37; color: white; padding: 1rem; }
.menu-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; padding: 20px; }
.product-card { border: 1px solid #ddd; padding: 10px; border-radius: 8px; text-align: center; background: #fdfaf6; }
.btn-order { background-color: #6f4e37; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
</style>
