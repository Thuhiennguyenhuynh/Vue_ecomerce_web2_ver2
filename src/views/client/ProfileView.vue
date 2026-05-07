<template>
  <div class="profile-view">
    <h2>Hồ sơ cá nhân</h2>
    <form @submit.prevent="updateProfile">
      <input v-model="user.userName" placeholder="Tên người dùng" disabled />
      <input v-model="user.userDetails.phoneNumber" placeholder="Số điện thoại" />
      <input v-model="user.userDetails.address" placeholder="Địa chỉ" />
      <div class="mb-3">
        <label>Ảnh người dùng (tên file):</label>
        <div>{{ userImageFileName }}</div>
      </div>
      <button type="submit">Lưu thay đổi</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const user = ref({ userName: '', userDetails: { phoneNumber: '', address: '' } });

const sanitizeFileName = (value) => {
  if (!value) return ''
  return value.toString().toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_\-\.]/gi, '')
}

const userImageFileName = computed(() => {
  if (!user.value.userName) return ''
  return `${sanitizeFileName(user.value.userName)}.png`
})

onMounted(async () => {
  const userId = authStore.user.id;
  const res = await axios.get(`http://localhost:8900/api/accounts/users/${userId}`);
  user.value = res.data;
});

const updateProfile = async () => {
  try {
    await axios.put(`http://localhost:8900/api/accounts/users/${authStore.user.id}`, user.value);
    alert('Cập nhật thành công!');
  } catch (error) {
    alert('Lỗi cập nhật: ' + error.response.data.message);
  }
};
</script>
