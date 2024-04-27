import { create } from "zustand";
import { useRestApi } from "../../providers/RestApiProvider";

export interface Product {
  name: string;
  productId: number;
  quantity: number;
  barcode: string | null;
}

type State = {
  productStoreName: string;
  products: Product[];
};

const useProductStore = create<State>(() => ({
  productStoreName: "",
  products: [],
}));

export const syncProductStore = {
  products: () => useProductStore().products,
  productStoreName: () => useProductStore().productStoreName,
  loadProducts: async (productStoreName: string) => {
    // const loadedProducts = await useRestApi().getFridgeProducts();

    const loadedProducts = [];

    useProductStore.setState({
      productStoreName,
      products: loadedProducts,
    });
  },
  addProduct: async (product: Product) => {
    // await useRestApi().addProductToFridge(product);

    useProductStore.setState((state) => ({
      products: [...state.products, product],
    }));
  },
  updateProduct: async (prevProduct: Product, product: Product) => {
    // await useRestApi().updateProductInFridge(product);

    useProductStore.setState((state) => ({
      products: state.products.map((p) =>
        p.name === prevProduct.name ? product : p,
      ),
    }));
  },
  removeProduct: async (productName: string) => {
    // await useRestApi().removeProductFromFridge(productName);

    useProductStore.setState((state) => ({
      products: state.products.filter(
        (product) => product.name !== productName,
      ),
    }));
  },
  getProductCopy: (productName: string) =>
    useProductStore
      .getState()
      .products.find((product) => product.name === productName),
};
