import { create } from "zustand";

interface Product {
  _id: string;
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
  currentProduct: Product | null;
  loading: boolean;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
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
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    set({ products: data, loading: false });
  },

  addProduct: async (product) => {
    set({ loading: true });
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (res.ok) {
      await get().fetchProducts();
    }
    set({ loading: false });
  },

  fetchProductById: async (id: string) => {
    set({ loading: true, currentProduct: null });
    try {
      const res = await fetch(`/api/admin/products/${id}`);
      const result = await res.json();
      if (result.success) {
        // Save the nested 'data' object specifically
        set({ currentProduct: result.data, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      set({ loading: false });
    }
  },

  updateProduct: async (id, updates) => {
    set({ loading: true });
    const res = await fetch(`/api/admin/products/${id}`, {
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
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    set({ products: get().products.filter((p) => p.productId !== id) });
  },

  clearCurrentProduct: () => set({ currentProduct: null }),
}));
