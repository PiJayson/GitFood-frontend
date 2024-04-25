import { create } from "zustand";

export interface Product {
  name: string;
  count: number;
  barcode: string | null;
}

type State = {
  productStoreName: string;
  products: Product[];
};

type Actions = {
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  removeProduct: (productName: string) => void;
  updateProduct: (product: Product) => void;
};

export const useProductStore = create<State & Actions>((set, get) => ({
  productStoreName: "",
  products: [],
  setProducts: (products: Product[]) => set({ products }),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  removeProduct: (productName) =>
    set((state) => ({
      products: state.products.filter(
        (product) => product.name !== productName,
      ),
    })),
  updateProduct: (product) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.name === product.name ? product : p,
      ),
    })),
  getProduct: (productName: string) =>
    get().products.find((product) => product.name === productName),

  // getFridgeName: () => get().storeName,
}));
