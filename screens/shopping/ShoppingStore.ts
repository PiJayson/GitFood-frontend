import { create } from "zustand";

export interface Product {
  description: string;
  name: string;
  barcode: string | null;
  productId: number;
  categoryId: number; // category Name or id?
  quantity: number;
  unit: string;
  // size: number;
}

export interface Fridge {
  // userLogin: string; // maybe something more intuitive
  name: string;
  id: number;
}

type ShoppingListsState = {
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

export const useShoppingStore = create<ProductsState & ShoppingListsState>(() => ({
  products: [],
  fridges: [],
  currentFridgeId: -1,
}));

export const syncShoppingStore = {
  //more getState functions here, because they don't need to be updated

  products: () => useShoppingStore().products, // useShallow will be needed here, at least i think so
  fridges: () => useShoppingStore().fridges, // no need for useShallow here, at least i think so, well i was wrong

  currentFridgeId: () => useShoppingStore().currentFridgeId,
  currentFridge: () => {
    const storeId = useShoppingStore().currentFridgeId;
    if (!storeId) return undefined;

    useShoppingStore().fridges.find((store) => store.id === storeId);
  },

  loadShoppingLists: async (getShoppingLists) => {
    const loadedShoppingLists = await getShoppingLists();

    console.log("Loaded fridges", loadedShoppingLists);
    useShoppingStore.setState({
      fridges: loadedShoppingLists,
    });
  },

  setShoppingList: async (fridge: Fridge, getShoppingProducts) => {
    const fridgeId = fridge.id;

    const { id, name, shoppingListProducts } = await getShoppingProducts(fridgeId);

    console.log("fasfasd")
    console.log(id, name, shoppingListProducts);

    useShoppingStore.setState({
      currentFridgeId: id,
      products: shoppingListProducts.map((category) => ({
        description: "",
        name: category.categoryNavigation.name,
        barcode: "",
        productId: -1,
        categoryId: category.category,
        quantity: category.quantity,
        unit: category.categoryNavigation.unit
      }))
    });
  },

  addProduct: async (product: Product, updateProductQuantity) => {
    console.log("Adding product to store", product);

    await updateProductQuantity(
      useShoppingStore.getState().currentFridgeId,
      product.categoryId,
      product.quantity,
    );

    console.log("sent");

    useShoppingStore.setState((state) => ({
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
      useShoppingStore.getState().currentFridgeId,
      prevProduct.categoryId,
      product.quantity,
    );

    console.log("Updating category in store", prevProduct, "to", product);
    useShoppingStore.setState((state) => ({
      products: state.products.map((p: Product) =>
        p.categoryId == product.categoryId ? product : p,
      ),
    }));
  },
  removeProduct: async (product: Product, updateProductQuantity) => {
    await updateProductQuantity(
      useShoppingStore().currentFridgeId,
      product.productId,
      0,
    );

    console.log("Removing product from store", product);
    useShoppingStore.setState((state) => ({
      products: state.products.filter((p) => p.name !== product.name),
    }));
  },
  getProductCopy: (productName: string) =>
    useShoppingStore()
      .products.find((product) => product.name == productName),

  createShoppingList: async (fridgeName: string, createShoppingList) => {
    const id = await createShoppingList(fridgeName);
    console.log("Creating fridge", fridgeName, id);

    useShoppingStore.setState((state) => ({
      fridges: [...state.fridges, { id, name: fridgeName }],
    }));
  },
};
