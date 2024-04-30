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
  loadProducts: async () => {
    // const loadedProducts = await useRestApi().getFridgeProducts();

    const loadedProducts = [
      {
        name: "Milk",
        productId: 1,
        quantity: 1,
        barcode: "123456789",
      },
      {
        name: "Eggs",
        productId: 2,
        quantity: 12,
        barcode: "987654321",
      },
      {
        name: "Bread",
        productId: 3,
        quantity: 1,
        barcode: "123456789",
      },
      {
        name: "Butter",
        productId: 4,
        quantity: 1,
        barcode: "987654321",
      },
    ];
    console.log("Loaded products", loadedProducts);

    useProductStore.setState({
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

    console.log("Updating product in store", prevProduct, "to", product);
    useProductStore.setState((state) => ({
      products: state.products.map((p) =>
        p.name === prevProduct.name ? product : p,
      ),
    }));
  },
  removeProduct: async (product: Product) => {
    // await useRestApi().removeProductFromFridge(productName);

    console.log("Removing product from store", product);
    useProductStore.setState((state) => ({
      products: state.products.filter((p) => p.name !== product.name),
    }));
  },
  getProductCopy: (productName: string) =>
    useProductStore
      .getState()
      .products.find((product) => product.name === productName),
};
