import { create } from "zustand";

export interface Product {
  description: string;
  productName: string;
  categoryName: string;
  productId: number;
  categoryId: number;
  barcode: string | null;
  quantity: number;
  unit: string;
  // size: number;
}

export interface Fridge {
  // userLogin: string; // maybe something more intuitive
  name: string;
  id: number;
}

export interface FridgeListProduct {
  description: string;
  categoryName: string;
  categoryId: number;
  quantity: number;
  unit: string;
  products: Product[];
}

type FridgesState = {
  fridges: Fridge[];
  currentStoreId: number;
};

type FridgeListProductState = {
  fridgeListProducts: FridgeListProduct[];
}; // using arrays here is causing a lot of reloads

export const useFridgesStore = create<FridgeListProductState & FridgesState>(
  () => ({
    fridgeListProducts: [],
    fridges: [],
    currentStoreId: -1,
  }),
);

export const syncFridgeStore = {
  elements: () => useFridgesStore().fridgeListProducts, // useShallow will be needed here, at least i think so
  stores: () => useFridgesStore().fridges, // no need for useShallow here, at least i think so, well i was wrong

  currentStoreId: () => useFridgesStore().currentStoreId,
  currentStore: () => {
    const storeId = useFridgesStore().currentStoreId;
    if (!storeId) return undefined;

    return useFridgesStore
      .getState()
      .fridges.find((store) => store.id === storeId);
  },

  loadStores: async (getFridges) => {
    const loadedFridges = await getFridges();

    useFridgesStore.setState({
      fridges: loadedFridges,
    });
  },

  setStore: async (fridge: Fridge, getFridgeProducts) => {
    const fridgeId = fridge.id;

    console.log("Setting fridge: ", fridge, fridgeId);
    const { products } = await getFridgeProducts(fridgeId);

    const fridgeListProducts: FridgeListProduct[] = products.reduce(
      (acc: FridgeListProduct[], product: any) => {
        const parsedProduct: Product = {
          description: product.description,
          productName: product.name,
          categoryName: product.categoryName,
          barcode: product.barcode,
          productId: product.id,
          categoryId: product.categoryId,
          quantity: product.quantity,
          unit: product.categoryUnit,
        };

        const categoryIndex = acc.findIndex(
          (cat) => cat.categoryId === parsedProduct.categoryId,
        );
        if (categoryIndex === -1) {
          acc.push({
            description: parsedProduct.description,
            categoryName: parsedProduct.categoryName,
            categoryId: parsedProduct.categoryId,
            quantity: parsedProduct.quantity,
            unit: parsedProduct.unit,
            products: [parsedProduct],
          });
        } else {
          acc[categoryIndex].products.push(parsedProduct);
          acc[categoryIndex].quantity += parsedProduct.quantity;
        }
        return acc;
      },
      [],
    );

    console.log("Fridge products", products, fridgeListProducts);

    useFridgesStore.setState({
      currentStoreId: fridgeId,
      fridgeListProducts: fridgeListProducts,
    });
  },

  addProduct: async (product: Product, updateProductQuantity) => {
    console.log("Adding product to store", product);

    await updateProductQuantity(
      useFridgesStore.getState().currentStoreId,
      product.productId,
      product.quantity,
    );

    console.log("sent");

    useFridgesStore.setState((state) => {
      const categoryIndex = state.fridgeListProducts.findIndex(
        (cat) => cat.categoryId === product.categoryId,
      );
      if (categoryIndex === -1) {
        return {
          fridgeListProducts: [
            ...state.fridgeListProducts,
            {
              description: product.description,
              categoryName: product.categoryName,
              categoryId: product.categoryId,
              quantity: product.quantity,
              unit: product.unit,
              products: [product],
            },
          ],
        };
      } else {
        const updatedCategory = { ...state.fridgeListProducts[categoryIndex] };
        updatedCategory.products.push(product);
        updatedCategory.quantity += product.quantity;

        const updatedFridgeListProducts = [...state.fridgeListProducts];
        updatedFridgeListProducts[categoryIndex] = updatedCategory;

        return { fridgeListProducts: updatedFridgeListProducts };
      }
    });
  },

  updateProduct: async (product: Product, updateProductQuantity) => {
    await updateProductQuantity(
      useFridgesStore.getState().currentStoreId,
      product.productId,
      product.quantity,
    );

    console.log("Updating product in store", product);

    useFridgesStore.setState((state) => {
      const categoryIndex = state.fridgeListProducts.findIndex(
        (cat) => cat.categoryId === product.categoryId,
      );
      if (categoryIndex === -1) return state;

      const updatedCategory = { ...state.fridgeListProducts[categoryIndex] };
      const productIndex = updatedCategory.products.findIndex(
        (p) => p.productId === product.productId,
      );
      if (productIndex === -1) return state;

      const oldQuantity = updatedCategory.products[productIndex].quantity;
      updatedCategory.products[productIndex] = product;
      updatedCategory.quantity += product.quantity - oldQuantity;

      const updatedFridgeListProducts = [...state.fridgeListProducts];
      updatedFridgeListProducts[categoryIndex] = updatedCategory;

      return { fridgeListProducts: updatedFridgeListProducts };
    });
  },
  removeProduct: async (product: Product, updateProductQuantity) => {
    await updateProductQuantity(
      useFridgesStore.getState().currentStoreId,
      product.productId,
      0,
    );

    console.log("Removing product from store", product);

    useFridgesStore.setState((state) => {
      const categoryIndex = state.fridgeListProducts.findIndex(
        (cat) => cat.categoryId === product.categoryId,
      );
      if (categoryIndex === -1) return state;

      const updatedCategory = { ...state.fridgeListProducts[categoryIndex] };
      updatedCategory.products = updatedCategory.products.filter(
        (p) => p.productId !== product.productId,
      );
      updatedCategory.quantity -= product.quantity;

      const updatedFridgeListProducts = [...state.fridgeListProducts];
      if (updatedCategory.products.length === 0) {
        updatedFridgeListProducts.splice(categoryIndex, 1);
      } else {
        updatedFridgeListProducts[categoryIndex] = updatedCategory;
      }

      return { fridgeListProducts: updatedFridgeListProducts };
    });
  },

  createStore: async (fridgeName: string, createStore) => {
    const id = await createStore(fridgeName);
    console.log("Creating fridge", fridgeName, id);

    useFridgesStore.setState((state) => ({
      fridges: [...state.fridges, { id, name: fridgeName }],
    }));
  },
};
