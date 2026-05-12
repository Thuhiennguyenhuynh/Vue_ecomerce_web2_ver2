<template>
  <div class="cart-page" style="margin-top: 80px;">

    <div class="cart-header fade-in-up">
      <button class="back-btn" @click="$router.push('/products')">
        <span class="back-arrow">←</span>
        <span>Tiếp tục mua sắm</span>
      </button>
      <div class="header-title mt-2">
        <h1 class="page-title text-hl-brown text-uppercase tracking-widest">Giỏ hàng</h1>
        <span class="item-count badge bg-hl-gold text-dark rounded-pill px-3 py-2 ms-3" v-if="cartItems.length">
          {{ totalCount }} sản phẩm
        </span>
      </div>
    </div>

    <div v-if="cartItems.length === 0" class="empty-state fade-in-up delay-1">
      <div class="empty-icon text-muted opacity-50 mb-3">
        <CIcon icon="cil-basket" size="3xl" style="width: 80px; height: 80px;"/>
      </div>
      <h2 class="empty-title fw-black text-hl-brown">Giỏ hàng trống</h2>
      <p class="empty-sub text-muted">Hãy khám phá các hương vị cà phê và thêm vào giỏ nhé!</p>
      <button class="btn-primary mt-4 hover-lift" @click="$router.push('/products')">Khám phá Thực đơn</button>
    </div>

    <div v-else class="cart-layout">

      <div class="cart-items">
        <transition-group name="list" tag="div">
          <div v-for="(item, index) in cartItems" :key="item.id" class="cart-item fade-in-up" :style="{ animationDelay: `${index * 0.1}s` }">

            <div class="item-img-wrap shadow-sm" @click="$router.push(`/products/${item.id}`)">
              <img :src="item.imageUrl" :alt="item.productName" class="item-img" />
            </div>

            <div class="item-info">
              <p class="item-name text-hl-brown" @click="$router.push(`/products/${item.id}`)">
                {{ item.productName }}
              </p>
              <p class="item-unit-price">{{ formatPrice(item.price) }} đ / sản phẩm</p>
              <div class="item-bottom mt-auto">
                <div class="qty-control shadow-sm">
                  <button
                    class="qty-btn"
                    @click="updateQuantity(item.id, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                  >−</button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button
                    class="qty-btn"
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    :disabled="item.quantity >= (item.availability || 99)"
                  >+</button>
                </div>
                <p class="item-subtotal text-hl-red">{{ formatPrice(item.price * item.quantity) }} đ</p>
              </div>
            </div>

            <button class="remove-btn hover-scale" @click="confirmRemove(item)" title="Xóa">✕</button>

          </div>
        </transition-group>

        <div class="clear-row fade-in-up delay-2">
          <button class="clear-btn" @click="showClearConfirm = true">
            <CIcon icon="cil-trash" class="me-1"/> Xóa tất cả
          </button>
        </div>
      </div>

      <aside class="cart-summary fade-in-up delay-1">
        <h2 class="summary-title text-hl-brown">TÓM TẮT ĐƠN HÀNG</h2>
        <div class="title-underline mb-4"></div>

        <div class="summary-lines">
          <div class="summary-line" v-for="item in cartItems" :key="item.id">
            <span class="summary-line-name">{{ item.productName }} × {{ item.quantity }}</span>
            <span class="summary-line-val">{{ formatPrice(item.price * item.quantity) }} đ</span>
          </div>
        </div>

        <div class="summary-divider my-4"></div>

        <div class="summary-shipping mb-3">
          <span class="fw-bold text-muted">Phí vận chuyển</span>
          <span class="shipping-free">Miễn phí</span>
        </div>

        <div class="summary-total mb-4">
          <span class="fw-bold text-hl-brown text-uppercase">Tổng cộng</span>
          <span class="total-price text-hl-red">{{ formatPrice(totalPrice) }} đ</span>
        </div>

        <button class="btn-primary btn-checkout hover-lift" @click="handleCheckout">
          Tiến hành thanh toán <CIcon icon="cil-arrow-right" class="ms-2"/>
        </button>

        <div class="summary-meta mt-4 text-center">
          <span class="d-block mb-2"><CIcon icon="cil-lock-locked" class="me-1"/> Thanh toán bảo mật 100%</span>
          <span class="d-block"><CIcon icon="cil-loop-circular" class="me-1"/> Hỗ trợ đổi trả nhanh chóng</span>
        </div>
      </aside>

    </div>

    <transition name="modal">
      <div class="modal-backdrop" v-if="itemToRemove" @click.self="itemToRemove = null">
        <div class="modal-box">
          <div class="modal-icon text-hl-red mb-3"><CIcon icon="cil-warning" size="xl"/></div>
          <p class="modal-msg">Xóa <b>{{ itemToRemove?.productName }}</b> khỏi giỏ hàng?</p>
          <div class="modal-actions mt-4">
            <button class="btn-ghost" @click="itemToRemove = null">Hủy</button>
            <button class="btn-danger hover-lift" @click="doRemove">Đồng ý Xóa</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div class="modal-backdrop" v-if="showClearConfirm" @click.self="showClearConfirm = false">
        <div class="modal-box">
          <div class="modal-icon text-hl-red mb-3"><CIcon icon="cil-trash" size="xl"/></div>
          <p class="modal-msg">Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ?</p>
          <div class="modal-actions mt-4">
            <button class="btn-ghost" @click="showClearConfirm = false">Hủy</button>
            <button class="btn-danger hover-lift" @click="doClear">Xóa tất cả</button>
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
/* Đồng bộ biến CSS nhận diện thương hiệu HinCoffee */
.cart-page {
  --bg-color: #FBF8F5;
  --ink: #3A2318;
  --ink-soft: #665045;
  --gold: #D4AF37;
  --brand-red: #C92A2A;
  --brand-red-hover: #A61E1E;
  --border: #E8E2D9;
  --radius: 16px;
  --shadow: 0 10px 30px rgba(58,35,24,0.08);

  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg-color);
  min-height: 100vh;
  color: var(--ink);
  padding: 0 0 80px;
}

/* Utilities */
.fw-black { font-weight: 900; }
.tracking-widest { letter-spacing: 0.1em; }
.text-hl-brown { color: var(--ink); }
.text-hl-red { color: var(--brand-red); }
.bg-hl-gold { background-color: var(--gold); }

/* Header */
.cart-header { max-width: 1200px; margin: 0 auto; padding: 20px 32px 0; display: flex; flex-direction: column; gap: 4px; }
.back-btn { display: inline-flex; align-items: center; gap: 8px; background: none; border: none; font-weight: 600; color: var(--ink-soft); cursor: pointer; padding: 0; transition: color 0.2s; width: fit-content; }
.back-btn:hover { color: var(--brand-red); }
.back-arrow { font-size: 1.2rem; transition: transform 0.2s; }
.back-btn:hover .back-arrow { transform: translateX(-5px); }

.header-title { display: flex; align-items: center; }
.page-title { font-size: 2.2rem; font-weight: 900; margin: 0; }
.item-count { font-size: 0.85rem; font-weight: bold; }

/* Empty State */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; text-align: center; }
.empty-title { font-size: 1.8rem; margin: 0; text-transform: uppercase; }

/* Layout Grid */
.cart-layout { max-width: 1200px; margin: 32px auto 0; padding: 0 32px; display: grid; grid-template-columns: 1fr 380px; gap: 40px; align-items: start; }
.cart-items { display: flex; flex-direction: column; }

/* Cart Item */
.cart-item {
  display: grid; grid-template-columns: 120px 1fr 40px; gap: 24px; align-items: stretch;
  background: #fff; border-radius: var(--radius); padding: 20px; margin-bottom: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: all 0.3s ease; border: 1px solid transparent;
}
.cart-item:hover { transform: translateY(-3px); box-shadow: var(--shadow); border-color: var(--border); }

.item-img-wrap { width: 120px; height: 120px; border-radius: 12px; overflow: hidden; cursor: pointer; background: var(--bg-color); }
.item-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.item-img-wrap:hover .item-img { transform: scale(1.08); }

.item-info { display: flex; flex-direction: column; justify-content: center;}
.item-name { font-size: 1.15rem; font-weight: 900; margin: 0 0 6px 0; cursor: pointer; transition: color 0.2s; line-height: 1.4; text-transform: uppercase;}
.item-name:hover { color: var(--brand-red); }
.item-unit-price { font-size: 0.9rem; color: var(--ink-soft); margin: 0; font-weight: 500;}

.item-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }

/* Qty Control */
.qty-control { display: inline-flex; align-items: center; border: 2px solid var(--border); border-radius: 30px; overflow: hidden; background: #fff; }
.qty-btn { width: 36px; height: 36px; border: none; background: none; font-size: 1.2rem; font-weight: bold; cursor: pointer; color: var(--ink); transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.qty-btn:hover:not(:disabled) { background: var(--bg-color); color: var(--brand-red); }
.qty-btn:disabled { color: #ccc; cursor: not-allowed; }
.qty-value { width: 40px; text-align: center; font-weight: bold; font-size: 1rem; line-height: 36px; color: var(--ink); }

.item-subtotal { font-weight: 900; font-size: 1.2rem; margin: 0; }

/* Buttons */
.remove-btn { background: none; border: none; color: #ccc; font-size: 1.2rem; cursor: pointer; padding: 8px; border-radius: 50%; transition: all 0.2s; align-self: center; }
.remove-btn:hover { color: var(--brand-red); background: rgba(201,42,42,0.1); }

.clear-row { display: flex; justify-content: flex-end; margin-top: 10px; }
.clear-btn { background: none; border: none; font-weight: 600; font-size: 0.9rem; color: var(--ink-soft); cursor: pointer; padding: 8px 16px; border-radius: 20px; transition: all 0.2s; }
.clear-btn:hover { color: var(--brand-red); background: #fff; box-shadow: var(--shadow);}

/* Summary Aside */
.cart-summary { background: #fff; border-radius: var(--radius); box-shadow: var(--shadow); padding: 32px; position: sticky; top: 100px; }
.summary-title { font-size: 1.2rem; font-weight: 900; margin: 0; letter-spacing: 1px;}
.title-underline { width: 40px; height: 3px; background-color: var(--brand-red); border-radius: 2px; }

.summary-lines { display: flex; flex-direction: column; gap: 12px; }
.summary-line { display: flex; justify-content: space-between; font-size: 0.95rem; color: var(--ink-soft); font-weight: 500;}
.summary-line-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; padding-right: 10px;}
.summary-line-val { flex-shrink: 0; font-weight: 700; color: var(--ink); }

.summary-divider { height: 1px; background: var(--border); }
.shipping-free { color: #28a745; font-weight: bold; text-transform: uppercase; font-size: 0.85rem;}
.total-price { font-size: 1.8rem; font-weight: 900; }

.btn-primary { background: var(--brand-red); color: #fff; border: none; border-radius: 30px; padding: 16px 24px; font-size: 1rem; font-weight: bold; text-transform: uppercase; cursor: pointer; transition: all 0.3s; text-align: center; box-shadow: 0 8px 20px rgba(201,42,42,0.25); }
.btn-primary:hover { background: var(--brand-red-hover); transform: translateY(-3px); }
.btn-checkout { width: 100%; display: flex; justify-content: center; align-items: center;}

.summary-meta span { font-size: 0.85rem; color: var(--ink-soft); font-weight: 500;}

/* Modal Xóa */
.modal-backdrop { position: fixed; inset: 0; background: rgba(58,35,24,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
.modal-box { background: #fff; border-radius: var(--radius); padding: 32px; max-width: 400px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; }
.modal-msg { font-size: 1.1rem; line-height: 1.6; margin: 0; color: var(--ink); }
.modal-actions { display: flex; gap: 16px; justify-content: center; }

.btn-ghost { background: var(--bg-color); border: 2px solid var(--border); border-radius: 30px; padding: 10px 24px; font-weight: bold; cursor: pointer; color: var(--ink-soft); transition: all 0.2s; }
.btn-ghost:hover { border-color: var(--ink); color: var(--ink); background: #fff;}
.btn-danger { background: var(--brand-red); color: #fff; border: none; border-radius: 30px; padding: 10px 24px; font-weight: bold; cursor: pointer; transition: all 0.2s; }
.btn-danger:hover { background: var(--brand-red-hover); }

/* Animations */
.hover-lift { transition: transform 0.3s ease; }
.hover-lift:hover { transform: translateY(-3px); }
.hover-scale { transition: transform 0.3s ease; }
.hover-scale:hover { transform: scale(1.1); }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; opacity: 0; }
.delay-1 { animation-delay: 0.15s; }
.delay-2 { animation-delay: 0.3s; }

.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from { opacity: 0; transform: translateX(-30px); }
.list-leave-to { opacity: 0; transform: translateX(30px); }
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } .cart-summary { position: static; } }
@media (max-width: 560px) {
  .cart-layout { padding: 0 16px; } .cart-header { padding: 20px 16px 0; }
  .cart-item { grid-template-columns: 90px 1fr 30px; gap: 16px; padding: 16px; }
  .item-img-wrap { width: 90px; height: 90px; }
}
</style>
