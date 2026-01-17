/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface Order {
  _id?: string;
  user: string;
  products: any[];
  totalAmount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "DEMO_COMPLETED" | string;
  transactionHash?: string;
  createdAt?: string;
}

interface OrderState {
  orders: Order[];
  userOrders: Order[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchAllOrders: () => Promise<void>;
  fetchUserOrders: (userId: string) => Promise<void>;
  placeOrder: (orderData: Order) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  userOrders: [],
  loading: false,
  error: null,

  // Load ALL orders (for Admin Dashboard)
  fetchAllOrders: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) set({ orders: data.data, error: null });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // Load orders for a SPECIFIC user (for Profile/History page)
  fetchUserOrders: async (userId: string) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/users/${userId}/orders`);
      const result = await res.json();
      if (result.success) {
        set({
          userOrders: result.data.recentOrders,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Dashboard Load Error:", error);
      set({ loading: false });
    }
  },

  // Create a new order after payment
  placeOrder: async (orderData: Order) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (data.success) {
        set((state) => ({ userOrders: [data.data, ...state.userOrders] }));
        return true;
      }
      return false;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Update status (e.g., mark as COMPLETED)
  updateOrderStatus: async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH", // You'll need to add a PATCH route if you want this
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        set((state) => ({
          orders: state.orders.map((o) =>
            o._id === orderId ? { ...o, status } : o
          ) as Order[],
        }));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  },
}));
