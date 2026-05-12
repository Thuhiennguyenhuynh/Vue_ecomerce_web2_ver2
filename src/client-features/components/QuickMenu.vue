<template>
  <div class="quick-menu border-bottom shadow-sm fixed-top slide-down">
    <div class="container">
      <ul class="nav justify-content-center py-2">
        <li class="nav-item">
          <router-link to="/products" class="nav-link fw-bold px-4 menu-item">
            <CIcon icon="cil-grid" class="me-1" /> SẢN PHẨM
          </router-link>
        </li>
        <li class="nav-item border-start custom-border">
          <router-link to="/articles" class="nav-link fw-bold px-4 menu-item">
            <CIcon icon="cil-notes" class="me-1" /> BÀI VIẾT VỀ CÀ PHÊ
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideDown {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.slide-down {
  animation: slideDown 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.quick-menu {
  top: 75px; /* Chiều cao header */
  z-index: 1020;
  background-color: #faf9f8 !important;
}

.menu-item {
  color: #4a2c2a;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.menu-item:hover { color: #b22830; background-color: rgba(178, 40, 48, 0.05); border-radius: 8px; }
.custom-border { border-color: #c5a059 !important; border-width: 2px !important; }
</style>
