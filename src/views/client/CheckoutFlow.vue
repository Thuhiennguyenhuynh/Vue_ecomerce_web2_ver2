<!-- CartView.vue -->
<template>
  <div class="cart-view">
    <h2>Giỏ hàng của bạn</h2>
    <div v-if="cartStore.items.length === 0">Giỏ hàng trống</div>
    <div v-else>
      <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
        {{ item.productName }} - {{ item.quantity }} x {{ item.price }} VNĐ
      </div>
      <router-link to="/checkout" class="btn-checkout">Thanh toán</router-link>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';
const cartStore = useCartStore();
</script>

<!-- CheckoutView.vue -->
<template>
  <div class="checkout-view">
    <h2>Thanh toán</h2>
    <form @submit.prevent="placeOrder">
      <input type="text" placeholder="Địa chỉ giao hàng" v-model="address" required />
      <button type="submit" class="btn-order">Đặt hàng</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';

const address = ref('');
const cartStore = useCartStore();
const authStore = useAuthStore();

const placeOrder = async () => {
  if (!authStore.user || !authStore.user.id) {
    alert('Vui lòng đăng nhập trước khi đặt hàng.');
    return;
  }

  try {
    await axios.post(
      `http://localhost:8900/api/shop/order/${authStore.user.id}`,
      {
        items: cartStore.items,
        address: address.value
      },
      {
        withCredentials: true
      }
    );
    alert('Đặt hàng thành công!');
    cartStore.items = [];
    localStorage.removeItem('cart');
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Lỗi không xác định';
    alert('Đặt hàng thất bại: ' + message);
  }
};
</script>
