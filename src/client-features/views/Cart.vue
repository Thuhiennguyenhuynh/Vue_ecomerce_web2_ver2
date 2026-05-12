<template>
  <div class="cart-page">

    <div class="cart-header">
      <button class="back-btn" @click="$router.back()">
        <span class="back-arrow">←</span>
        <span>Tiếp tục mua sắm</span>
      </button>
      <div class="header-title">
        <h1 class="page-title">Giỏ hàng</h1>
        <span class="item-count" v-if="cartItems.length">{{ totalCount }} sản phẩm</span>
      </div>
    </div>

    <div v-if="cartItems.length === 0" class="empty-state">
      <div class="empty-icon">🛍</div>
      <h2 class="empty-title">Giỏ hàng trống</h2>
      <p class="empty-sub">Hãy khám phá các sản phẩm và thêm vào giỏ nhé!</p>
      <button class="btn-primary" @click="$router.push('/products')">Xem sản phẩm</button>
    </div>

    <div v-else class="cart-layout">

      <div class="cart-items">
        <transition-group name="list" tag="div">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">

            <div class="item-img-wrap" @click="$router.push(`/products/${item.id}`)">
              <img :src="item.imageUrl" :alt="item.productName" class="item-img" />
            </div>

            <div class="item-info">
              <p class="item-name" @click="$router.push(`/products/${item.id}`)">
                {{ item.productName }}
              </p>
              <p class="item-unit-price">{{ formatPrice(item.price) }} đ / sản phẩm</p>
              <div class="item-bottom">
                <div class="qty-control">
                  <button
                    class="qty-btn"
                    @click="updateQuantity(item.id, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                  >−</button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button
                    class="qty-btn"
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    :disabled="item.quantity >= item.availability"
                  >+</button>
                </div>
                <p class="item-subtotal">{{ formatPrice(item.price * item.quantity) }} đ</p>
              </div>
            </div>

            <button class="remove-btn" @click="confirmRemove(item)" title="Xóa">✕</button>

          </div>
        </transition-group>

        <div class="clear-row">
          <button class="clear-btn" @click="showClearConfirm = true">🗑 Xóa tất cả</button>
        </div>
      </div>

      <aside class="cart-summary">
        <h2 class="summary-title">Tóm tắt đơn hàng</h2>

        <div class="summary-lines">
          <div class="summary-line" v-for="item in cartItems" :key="item.id">
            <span class="summary-line-name">{{ item.productName }} × {{ item.quantity }}</span>
            <span class="summary-line-val">{{ formatPrice(item.price * item.quantity) }} đ</span>
          </div>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-shipping">
          <span>Phí vận chuyển</span>
          <span class="shipping-free">Miễn phí</span>
        </div>

        <div class="summary-total">
          <span>Tổng cộng</span>
          <span class="total-price">{{ formatPrice(totalPrice) }} đ</span>
        </div>

        <button class="btn-primary btn-checkout" @click="handleCheckout">
          Tiến hành thanh toán →
        </button>

        <div class="summary-meta">
          <span>🔒 Thanh toán bảo mật</span>
          <span>🔄 Đổi trả trong 7 ngày</span>
        </div>
      </aside>

    </div>

    <transition name="modal">
      <div class="modal-backdrop" v-if="itemToRemove" @click.self="itemToRemove = null">
        <div class="modal">
          <p class="modal-msg">Xóa <b>{{ itemToRemove?.productName }}</b> khỏi giỏ?</p>
          <div class="modal-actions">
            <button class="btn-ghost" @click="itemToRemove = null">Hủy</button>
            <button class="btn-danger" @click="doRemove">Xóa</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div class="modal-backdrop" v-if="showClearConfirm" @click.self="showClearConfirm = false">
        <div class="modal">
          <p class="modal-msg">Xóa tất cả sản phẩm trong giỏ?</p>
          <div class="modal-actions">
            <button class="btn-ghost" @click="showClearConfirm = false">Hủy</button>
            <button class="btn-danger" @click="doClear">Xóa tất cả</button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'
import type { CartItem } from '../composables/useCart'

const router = useRouter()
const { cartItems, totalCount, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()

const itemToRemove = ref<CartItem | null>(null)
const showClearConfirm = ref(false)

const formatPrice = (p: number) => p ? p.toLocaleString('vi-VN') : '0'

const confirmRemove = (item: CartItem) => {
  itemToRemove.value = item
}

const doRemove = () => {
  if (itemToRemove.value) {
    removeFromCart(itemToRemove.value.id)
    itemToRemove.value = null
  }
}

const doClear = () => {
  clearCart()
  showClearConfirm.value = false
}

const handleCheckout = () => {
  alert('Chức năng thanh toán đang phát triển!')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

.cart-page {
  --cream: #faf8f5;
  --ink: #1a1a1a;
  --ink-soft: #555;
  --gold: #b8934a;
  --green: #2d6a4f;
  --green-lt: #40916c;
  --red: #c0392b;
  --red-lt: #e74c3c;
  --border: #e8e2d9;
  --radius: 12px;
  --shadow: 0 4px 24px rgba(0,0,0,0.08);
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  min-height: 100vh;
  color: var(--ink);
  padding: 0 0 80px;
}

.cart-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 32px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.back-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: none; border: none;
  font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: var(--ink-soft);
  cursor: pointer; padding: 0; transition: color 0.2s; width: fit-content;
}
.back-btn:hover { color: var(--ink); }
.back-arrow { font-size: 1.1rem; transition: transform 0.2s; }
.back-btn:hover .back-arrow { transform: translateX(-4px); }

.header-title { display: flex; align-items: baseline; gap: 14px; padding-top: 12px; }
.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem; font-weight: 700; margin: 0;
}
.item-count { font-size: 0.875rem; color: var(--ink-soft); }

.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; min-height: 60vh; gap: 16px; text-align: center;
}
.empty-icon { font-size: 4rem; }
.empty-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin: 0; }
.empty-sub { color: var(--ink-soft); font-size: 0.95rem; margin: 0; }

.cart-layout {
  max-width: 1200px; margin: 32px auto 0; padding: 0 32px;
  display: grid; grid-template-columns: 1fr 360px;
  gap: 40px; align-items: start;
}

.cart-items { display: flex; flex-direction: column; }

.cart-item {
  display: grid; grid-template-columns: 100px 1fr 36px;
  gap: 20px; align-items: start;
  background: #fff; border-radius: var(--radius);
  padding: 20px; margin-bottom: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: box-shadow 0.2s;
}
.cart-item:hover { box-shadow: var(--shadow); }

.item-img-wrap {
  width: 100px; height: 100px;
  border-radius: 8px; overflow: hidden;
  cursor: pointer; background: var(--cream);
}
.item-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.item-img-wrap:hover .item-img { transform: scale(1.06); }

.item-info { display: flex; flex-direction: column; gap: 6px; }

.item-name {
  font-family: 'Playfair Display', serif;
  font-size: 1rem; font-weight: 600; margin: 0;
  cursor: pointer; color: var(--ink);
  transition: color 0.2s; line-height: 1.35;
}
.item-name:hover { color: var(--green); }
.item-unit-price { font-size: 0.8rem; color: var(--ink-soft); margin: 0; }

.item-bottom {
  display: flex; align-items: center;
  justify-content: space-between; margin-top: 8px;
}

.qty-control {
  display: inline-flex; align-items: center;
  border: 1px solid var(--border); border-radius: 8px;
  overflow: hidden; background: var(--cream);
}
.qty-btn {
  width: 34px; height: 34px; border: none; background: none;
  font-size: 1.1rem; cursor: pointer; color: var(--ink);
  transition: background 0.15s;
  display: flex; align-items: center; justify-content: center;
}
.qty-btn:hover:not(:disabled) { background: #ede8e0; }
.qty-btn:disabled { color: #ccc; cursor: not-allowed; }
.qty-value {
  width: 40px; text-align: center; font-weight: 500; font-size: 0.9rem;
  border-left: 1px solid var(--border); border-right: 1px solid var(--border);
  line-height: 34px;
}

.item-subtotal { font-weight: 600; font-size: 1rem; color: var(--green); margin: 0; }

.remove-btn {
  background: none; border: none; color: #ccc;
  font-size: 0.85rem; cursor: pointer; padding: 4px;
  border-radius: 4px; transition: color 0.2s, background 0.2s;
  line-height: 1; margin-top: 2px;
}
.remove-btn:hover { color: var(--red); background: #fdf0ee; }

.clear-row { display: flex; justify-content: flex-end; margin-top: 4px; }
.clear-btn {
  background: none; border: none;
  font-family: 'DM Sans', sans-serif; font-size: 0.825rem; color: var(--ink-soft);
  cursor: pointer; padding: 6px 0; transition: color 0.2s;
}
.clear-btn:hover { color: var(--red); }

.cart-summary {
  background: #fff; border-radius: var(--radius);
  box-shadow: var(--shadow); padding: 28px;
  position: sticky; top: 24px;
  display: flex; flex-direction: column; gap: 16px;
}
.summary-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 600; margin: 0; }

.summary-lines { display: flex; flex-direction: column; gap: 8px; }
.summary-line { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--ink-soft); gap: 12px; }
.summary-line-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
.summary-line-val { flex-shrink: 0; font-weight: 500; color: var(--ink); }

.summary-divider { height: 1px; background: var(--border); }

.summary-shipping { display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--ink-soft); }
.shipping-free { color: var(--green); font-weight: 500; }

.summary-total { display: flex; justify-content: space-between; align-items: baseline; font-weight: 600; font-size: 1rem; }
.total-price { font-size: 1.4rem; font-weight: 700; color: var(--green); }

.btn-primary {
  background: var(--green); color: #fff; border: none;
  border-radius: 8px; padding: 14px 24px;
  font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500;
  cursor: pointer; transition: background 0.2s, transform 0.15s; text-align: center;
}
.btn-primary:hover { background: var(--green-lt); transform: translateY(-1px); }
.btn-checkout { width: 100%; }

.summary-meta { display: flex; flex-direction: column; gap: 6px; padding-top: 4px; }
.summary-meta span { font-size: 0.78rem; color: var(--ink-soft); }

.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 100; backdrop-filter: blur(2px);
}
.modal {
  background: #fff; border-radius: var(--radius);
  padding: 32px; max-width: 360px; width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  display: flex; flex-direction: column; gap: 24px;
}
.modal-msg { font-size: 1rem; line-height: 1.6; margin: 0; color: var(--ink); }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; }

.btn-ghost {
  background: none; border: 1px solid var(--border); border-radius: 8px;
  padding: 10px 20px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
  cursor: pointer; color: var(--ink-soft); transition: border-color 0.2s, color 0.2s;
}
.btn-ghost:hover { border-color: var(--ink); color: var(--ink); }

.btn-danger {
  background: var(--red); color: #fff; border: none;
  border-radius: 8px; padding: 10px 20px;
  font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
  cursor: pointer; transition: background 0.2s;
}
.btn-danger:hover { background: var(--red-lt); }

.list-enter-active { transition: all 0.3s ease; }
.list-leave-active { transition: all 0.25s ease; }
.list-enter-from { opacity: 0; transform: translateX(-16px); }
.list-leave-to { opacity: 0; transform: translateX(16px); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .cart-layout { grid-template-columns: 1fr; }
  .cart-summary { position: static; }
}
@media (max-width: 560px) {
  .cart-layout { padding: 0 16px; }
  .cart-header { padding: 20px 16px 0; }
  .cart-item { grid-template-columns: 80px 1fr 28px; gap: 12px; padding: 14px; }
  .item-img-wrap { width: 80px; height: 80px; }
}
</style>
