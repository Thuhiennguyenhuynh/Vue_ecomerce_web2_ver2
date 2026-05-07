<!-- ClientLoginView.vue -->
<template>
  <div class="login-container">
    <h2>Đăng nhập</h2>
    <form @submit.prevent="login">
      <input v-model="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mật khẩu" required />
      <button type="submit">Đăng nhập</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
const email = ref('');
const password = ref('');
const authStore = useAuthStore();

const login = async () => {
  await authStore.login({ email: email.value, password: password.value });
  // Sau khi login, đồng bộ giỏ hàng với DB
};
</script>

<!-- AIAssistant.vue -->
<template>
  <div class="ai-assistant">
    <button @click="toggleChat">Trợ lý AI</button>
    <div v-if="isOpen" class="chat-box">
      <input v-model="query" @keyup.enter="askAI" placeholder="Hỏi về món ngon..." />
      <p>{{ response }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const isOpen = ref(false);
const query = ref('');
const response = ref('');

const askAI = async () => {
  const res = await axios.post('http://localhost:8900/api/ai', { query: query.value });
  response.value = res.data.answer;
};
</script>
