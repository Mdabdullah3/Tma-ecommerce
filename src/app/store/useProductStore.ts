import { create } from "zustand";

interface Product {
  productId: string;
  name: string;
  description: string;
  image: string;
  priceTon: number;
  royalty: number;
  status: "listed" | "draft" | "sold";
  views: number;
  mintDate: string;
  category: string;
  contractAddress: string;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null; // Added for single product focus
  loading: boolean;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>; // Fetch single
  addProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearCurrentProduct: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    const res = await fetch("/api/products");
    const data = await res.json();
    set({ products: data, loading: false });
  },

  addProduct: async (product) => {
    set({ loading: true });
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (res.ok) {
      await get().fetchProducts();
    }
    set({ loading: false });
  },

  fetchProductById: async (id) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      set({ currentProduct: data, loading: false });
    } catch (error) {
      console.error("Fetch product error:", error);
      set({ loading: false });
    }
  },

  updateProduct: async (id, updates) => {
    set({ loading: true });
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      await get().fetchProducts();
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    set({ products: get().products.filter((p) => p.productId !== id) });
  },

  clearCurrentProduct: () => set({ currentProduct: null }),
}));
