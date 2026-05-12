<template>
  <footer class="fixed-bottom text-white border-top shadow-lg hl-footer slide-up-anim" style="height: 60px;">
    <div class="container h-100 d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center gap-3 gap-md-4 small fw-bold text-uppercase tracking-widest">
        <span class="d-none d-sm-inline text-gold">© 2026 HinCoffee</span>
        <a href="#" class="text-white text-decoration-none hover-gold transition">Điều khoản</a>
        <a href="#" class="text-white text-decoration-none hover-gold transition">Bảo mật</a>
      </div>

      <div class="d-flex align-items-center gap-4">
        <span class="text-white d-none d-sm-inline small fw-bold bg-hl-red px-3 py-2 rounded-pill shadow-sm pulse-soft">
          HOTLINE: 1900 6789
        </span>
        <div class="d-flex gap-2">
          <a href="#" class="btn btn-social rounded-circle p-0 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
            <span class="fw-bold fs-6">f</span>
          </a>
          <a href="#" class="btn btn-social rounded-circle p-0 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
            <span class="fw-bold fs-6">in</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.slide-up-anim { animation: slideUp 0.8s ease-out; }

.hl-footer { background-color: #3a2115; border-top: 4px solid #b22830 !important; z-index: 1040; }
.text-gold { color: #c5a059; }
.hover-gold:hover { color: #c5a059 !important; transform: translateY(-2px); display: inline-block; }
.bg-hl-red { background-color: #b22830; }
.tracking-widest { letter-spacing: 0.08em; }
.transition { transition: all 0.3s ease; }

@keyframes pulseSoft { 0% { box-shadow: 0 0 0 0 rgba(178, 40, 48, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(178, 40, 48, 0); } 100% { box-shadow: 0 0 0 0 rgba(178, 40, 48, 0); } }
.pulse-soft { animation: pulseSoft 2.5s infinite; }

.btn-social { background-color: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); transition: all 0.3s ease; }
.btn-social:hover {
  background-color: #c5a059; border-color: #c5a059; color: #fff; transform: translateY(-3px) scale(1.1);
  box-shadow: 0 5px 15px rgba(197, 160, 89, 0.4);
}
</style>
