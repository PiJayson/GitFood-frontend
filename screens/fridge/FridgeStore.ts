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

type ProductsState = {
  products: Product[];
}; // using arrays here is causing a lot of reloads

export const useFridgesStore = create<ProductsState & FridgesState>(() => ({
  products: [],
  fridges: [],
  currentFridgeId: -1,
}));

export const syncFridgeStore = {
  //more getState functions here, because they don't need to be updated

  products: () => useFridgesStore().products, // useShallow will be needed here, at least i think so
  fridges: () => useFridgesStore().fridges, // no need for useShallow here, at least i think so, well i was wrong

  currentFridgeId: () => useFridgesStore().currentFridgeId,
  currentFridgeIdCopy: () => useFridgesStore.getState().currentFridgeId,
  currentFridge: () => {
    //also copies, doesn't update
    const storeId = useFridgesStore.getState().currentFridgeId;

    if (storeId == -1) return undefined;

    return useFridgesStore
      .getState()
      .fridges.find((store) => store.id === storeId);
  },

  loadFridges: async (getFridges) => {
    const loadedFridges = await getFridges();

    console.log("Loaded fridges", loadedFridges);
    useFridgesStore.setState({
      fridges: loadedFridges,
    });
  },

  setFridge: async (fridgeId: Number, getFridgeProducts) => {
    console.log("Setting fridge", fridgeId);
    const { id, name, fridgeProducts } = await getFridgeProducts(fridgeId);

    console.log(id, name, fridgeProducts);

    useFridgesStore.setState({
      currentFridgeId: id,
      products: fridgeProducts.map((product) => ({
        description: product.product.description,
        name: product.product.name,
        barcode: product.product.barcode,
        productId: product.product.id,
        categoryId: product.product.category,
        quantity: product.ammount,
        unit: product.product.categoryNavigation.unit,
      })),
    });
  },

  addProduct: async (product: Product, updateProductQuantity) => {
    console.log("Adding product to store", product);

    await updateProductQuantity(
      useFridgesStore.getState().currentFridgeId,
      product.productId,
      product.quantity,
    );

    console.log("sent");

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
      useFridgesStore.getState().currentFridgeId,
      product.productId,
      product.quantity,
    );

    console.log("Updating product in store", prevProduct, "to", product);
    useFridgesStore.setState((state) => ({
      products: state.products.map((p: Product) =>
        p.productId == product.productId ? product : p,
      ),
    }));
  },
  removeProduct: async (product: Product, updateProductQuantity) => {
    await updateProductQuantity(
      useFridgesStore.getState().currentFridgeId,
      product.productId,
      0,
    );

    console.log("Removing product from store", product);
    useFridgesStore.setState((state) => ({
      products: state.products.filter((p) => p.productId !== product.productId),
    }));
  },
  getProductCopy: (productId: number) =>
    useFridgesStore
      .getState()
      .products.find((product) => product.productId == productId),

  createFridge: async (fridgeName: string, createFridge) => {
    const id = await createFridge(fridgeName);
    console.log("Creating fridge", fridgeName, id);

    useFridgesStore.setState((state) => ({
      fridges: [...state.fridges, { id, name: fridgeName }],
    }));
  },
};
