import { create } from "zustand";

export interface Product {
  description: string;
  name: string;
  barcode: string | null;
  productId: number;
  categoryid: number; // category Name or id?
  quantity: number;
  unit: string;
  // size: number;
}

export interface Fridge {
  // userLogin: string; // maybe something more intuitive
  name: string;
  id: number;
}

type FridgesState = {
  fridges: Fridge[];
  currentFridgeId: number;
};

// interface productStore {
//   id: number;
//   name: string;
// }

type ProductsState = {
  products: Product[];
}; // using arrays here is causing a lot of reloads

const useFridgesStore = create<ProductsState & FridgesState>(() => ({
  products: [],
  fridges: [],
  currentFridgeId: -1,
}));

export const syncFridgeStore = {
  //more getState functions here, because they don't need to be updated

  products: () => useFridgesStore().products, // useShallow will be needed here, at least i think so
  fridges: () => useFridgesStore().fridges, // no need for useShallow here, at least i think so, well i was wrong

  currentFridgeId: () => useFridgesStore().currentFridgeId,
  currentFridge: () => {
    const storeId = useFridgesStore().currentFridgeId;
    if (!storeId) return undefined;

    useFridgesStore().fridges.find((store) => store.id === storeId);
  },

  loadFridges: async (getFridges) => {
    const loadedFridges = await getFridges();

    console.log("Loaded fridges", loadedFridges);
    useFridgesStore.setState({
      fridges: loadedFridges,
    });
  },

  setFridge: async (fridge: Fridge, getFridgeProducts) => {
    const fridgeId = fridge.id;

    console.log("Setting fridge", fridge, fridgeId);
    const { id, name, fridgeProducts } = await getFridgeProducts(fridgeId);

    console.log(id, name, fridgeProducts);

    useFridgesStore.setState({
      currentFridgeId: id,
    });
  },

  addProduct: async (product: Product, updateProductQuantity) => {
    console.log("Adding product to store", product);
    await updateProductQuantity(
      useFridgesStore().currentFridgeId,
      product.productId,
      product.quantity,
    );

    useFridgesStore.setState((state) => ({
      products: [...state.products, product],
    }));
  },

  updateProduct: async (
    prevProduct: Product,
    product: Product,
    updateProductQuantity,
  ) => {
    // change, no prevProduct needed !!!
    await updateProductQuantity(
      useFridgesStore().currentFridgeId,
      prevProduct.productId,
      product.quantity,
    );

    console.log("Updating product in store", prevProduct, "to", product);
    useFridgesStore.setState((state) => ({
      products: state.products.map((p: Product) =>
        p.productId === prevProduct.productId ? product : p,
      ),
    }));
  },
  removeProduct: async (product: Product, updateProductQuantity) => {
    await updateProductQuantity(
      useFridgesStore().currentFridgeId,
      product.productId,
      0,
    );

    console.log("Removing product from store", product);
    useFridgesStore.setState((state) => ({
      products: state.products.filter((p) => p.name !== product.name),
    }));
  },
  getProductCopy: (productName: string) =>
    useFridgesStore
      .getState()
      .products.find((product) => product.name === productName),

  createFridge: async (fridgeName: string, createFridge) => {
    const id = await createFridge(fridgeName);
    console.log("Creating fridge", fridgeName, id);

    useFridgesStore.setState((state) => ({
      fridges: [...state.fridges, { id, name: fridgeName }],
    }));
  },
};
