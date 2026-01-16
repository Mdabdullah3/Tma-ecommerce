import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  _id: string; // Using _id from your MongoDB data
  name: string;
  priceTon: number;
  productId: string;
  category: string;
  image: string;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],

      // Add to cart with duplicate check
      addToCart: (product) => {
        const currentItems = get().cartItems;
        const isAlreadyInCart = currentItems.some(
          (item) => item._id === product._id
        );

        if (!isAlreadyInCart) {
          set({ cartItems: [...currentItems, product] });
        }
      },

      removeFromCart: (productId) => {
        set({
          cartItems: get().cartItems.filter((item) => item._id !== productId),
        });
      },

      clearCart: () => set({ cartItems: [] }),

      getSubtotal: () => {
        return get().cartItems.reduce((acc, item) => acc + item.priceTon, 0);
      },
    }),
    {
      name: "cart-storage", // Key for LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
