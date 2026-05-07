<template>
  <div class="client-home">
    <header class="brown-header">
      <h1>Coffee Shop</h1>
      <nav>
        <router-link to="/">Trang chủ</router-link>
        <router-link to="/menu">Menu</router-link>
        <router-link to="/cart">Giỏ hàng</router-link>
      </nav>
    </header>
    <main>
      <section class="banner">
        <h2>Chào mừng đến với Coffee Shop</h2>
        <p>Thưởng thức hương vị cà phê đậm đà</p>
      </section>
      <section class="posts">
        <h3>Bài viết mới</h3>
        <!-- Posts will be listed here -->
      </section>
    </main>
  </div>
</template>

<style scoped>
.brown-header {
  background-color: #6f4e37;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
}
.banner {
  background-color: #eaddca;
  padding: 2rem;
  text-align: center;
}
</style>
