import {create} from "zustand";

let counter = 0;

export const useUiStore = create((set) => ({
  toasts: [],
  pushToast: (toast) => {
    const id = toast.id || `toast-${Date.now()}-${counter++}`;
    const payload = {
      id,
      type: toast.type || "info",
      message: toast.message || "",
      duration: toast.duration || 4000,
    };
    set((state) => ({toasts: [...state.toasts, payload]}));
    return id;
  },
  removeToast: (id) =>
    set((state) => ({toasts: state.toasts.filter((toast) => toast.id !== id)})),
  clearToasts: () => set({toasts: []}),
}));
