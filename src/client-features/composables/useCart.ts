import { ref, computed, watch } from 'vue'

export interface CartItem {
  id: number
  productName: string
  price: number
  imageUrl: string
  quantity: number
  availability: number
}

const STORAGE_KEY = 'hincoffee_cart'

// Load cart từ localStorage
const loadCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const cartItems = ref<CartItem[]>(loadCart())

// Auto save localStorage
watch(
  cartItems,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  },
  { deep: true }
)

// Sync giữa nhiều tab
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY) {
    try {
      cartItems.value = event.newValue ? JSON.parse(event.newValue) : []
    } catch {
      cartItems.value = []
    }
  }
})

export function useCart() {
  const totalCount = computed(() =>
    cartItems.value.reduce((s, i) => s + i.quantity, 0)
  )

  const totalPrice = computed(() =>
    cartItems.value.reduce((s, i) => s + i.price * i.quantity, 0)
  )

  const addToCart = (product: Omit<CartItem, 'quantity'>, qty = 1) => {
    const item = cartItems.value.find(i => i.id === product.id)

    if (item) {
      item.quantity = Math.min(item.quantity + qty, product.availability)
    } else {
      cartItems.value.push({
        ...product,
        quantity: Math.min(qty, product.availability)
      })
    }
  }

  const removeFromCart = (id: number) => {
    cartItems.value = cartItems.value.filter(i => i.id !== id)
  }

  const updateQuantity = (id: number, qty: number) => {
    const item = cartItems.value.find(i => i.id === id)
    if (item) {
      item.quantity = Math.max(1, Math.min(qty, item.availability))
    }
  }

  const clearCart = () => {
    cartItems.value = []
  }

  const isInCart = (id: number) =>
    cartItems.value.some(i => i.id === id)

  const getQuantityInCart = (id: number) =>
    cartItems.value.find(i => i.id === id)?.quantity ?? 0

  return {
    cartItems,
    totalCount,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getQuantityInCart,
  }
}
