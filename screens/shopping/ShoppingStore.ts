import { create } from "zustand";

export interface Product {
  description: string;
  productName: string;
  categoryName: string;
  productId: number;
  categoryId: number;
  barcode: string | null;
  quantity: number,
  unit: string;
}

export interface ShoppingListProduct {
  description: string;
  categoryName: string;
  categoryId: number;
  quantity: number;
  unit: string;
  products: Product[];
}

export interface ShoppingList {
  name: string;
  id: number;
}

type ShoppingListsState = {
  shoppingLists: ShoppingList[];
  currentStoreId: number;
};

type ShoppingListProductState = {
  shoppingListProducts: ShoppingListProduct[];
};

export const useShoppingStore = create<ShoppingListsState & ShoppingListProductState>(() => ({
  shoppingLists: [],
  currentStoreId: -1,
  shoppingListProducts: []
}));

export const syncShoppingStore = {
  //more getState functions here, because they don't need to be updated

  elements: () => useShoppingStore().shoppingListProducts, // useShallow will be needed here, at least i think so
  stores: () => useShoppingStore().shoppingLists, // no need for useShallow here, at least i think so, well i was wrong

  currentStoreId: () => useShoppingStore().currentStoreId,
  currentStore: () => {
    const storeId = useShoppingStore().currentStoreId;
    if (!storeId) return undefined;

    useShoppingStore().shoppingLists.find((store) => store.id === storeId);
  },

  loadStores: async (getShoppingLists) => {
    const loadedShoppingLists = await getShoppingLists();

    useShoppingStore.setState({
      shoppingLists: loadedShoppingLists,
    });
  },

  setStore: async (shoppingList: ShoppingList, getShoppingProducts) => {
    const shoppingListId = shoppingList.id;

    const { id, name, shoppingListProducts } = await getShoppingProducts(shoppingListId);

    useShoppingStore.setState({
      currentStoreId: id,
      shoppingListProducts: shoppingListProducts.map((category) => ({
        description: category.categoryNavigation.description,
        categoryName: category.categoryNavigation.name,
        categoryId: category.category,
        quantity: category.quantity,
        unit: category.categoryNavigation.unit,
        products: []
      }))
    });
  },

  addProduct: async (product: Product, updateProductQuantity) => {
    console.log("Adding product to store", product);

    useShoppingStore.setState((state) => {
      const categoryIndex = state.shoppingListProducts.findIndex((cat) => cat.categoryId === product.categoryId);
      if (categoryIndex === -1) {
        return {
          shoppingListProducts: [
            ...state.shoppingListProducts,
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
        const updatedCategory = { ...state.shoppingListProducts[categoryIndex] };
        updatedCategory.products.push(product);

        const updatedShoppingListProducts = [...state.shoppingListProducts];
        updatedShoppingListProducts[categoryIndex] = updatedCategory;

        return { shoppingListProducts: updatedShoppingListProducts };
      }
    });
  },

  updateProduct: async (
    product: Product,
    updateProductQuantity,
  ) => {
    console.log("Updating category in store", product);

    useShoppingStore.setState((state) => {
      const categoryIndex = state.shoppingListProducts.findIndex((cat) => cat.categoryId === product.categoryId);
      if (categoryIndex === -1) return state;

      const updatedCategory = { ...state.shoppingListProducts[categoryIndex] };
      const productIndex = updatedCategory.products.findIndex((p) => p.productId === product.productId);
      if (productIndex === -1) return state;

      updatedCategory.products[productIndex] = product;

      const updatedShoppingListProducts = [...state.shoppingListProducts];
      updatedShoppingListProducts[categoryIndex] = updatedCategory;

      return { shoppingListProducts: updatedShoppingListProducts };
    });
  },
  removeProduct: async (product: Product, updateProductQuantity) => {
    console.log("Removing product from store", product);

    useShoppingStore.setState((state) => {
      const categoryIndex = state.shoppingListProducts.findIndex((cat) => cat.categoryId === product.categoryId);
      if (categoryIndex === -1) return state;

      const updatedCategory = { ...state.shoppingListProducts[categoryIndex] };
      updatedCategory.products = updatedCategory.products.filter((p) => p.productId !== product.productId);

      const updatedShoppingListProducts = [...state.shoppingListProducts];
      if (updatedCategory.products.length === 0) {
        updatedShoppingListProducts.splice(categoryIndex, 1);
      } else {
        updatedShoppingListProducts[categoryIndex] = updatedCategory;
      }

      return { shoppingListProducts: updatedShoppingListProducts };
    });
  },

  addCategory: async (category: ShoppingListProduct, updateCategoryQuantity) => {
    await updateCategoryQuantity(
      useShoppingStore.getState().currentStoreId,
      category.categoryId,
      category.quantity,
    );

    useShoppingStore.setState((state) => ({
      shoppingListProducts: [...state.shoppingListProducts, category]
    }));
  },

  updateCategory: async (category: ShoppingListProduct, updateCategoryQuantity) => {
    await updateCategoryQuantity(
      useShoppingStore.getState().currentStoreId,
      category.categoryId,
      category.quantity,
    );

    useShoppingStore.setState((state) => {
      const categoryIndex = state.shoppingListProducts.findIndex((cat) => cat.categoryId === category.categoryId);
      if (categoryIndex === -1) return state;

      const updatedCategory = { 
        ...state.shoppingListProducts[categoryIndex], 
        ...category,
        quantity: category.quantity,
      };

      const updatedShoppingListProducts = [...state.shoppingListProducts];
      updatedShoppingListProducts[categoryIndex] = updatedCategory;

      return { shoppingListProducts: updatedShoppingListProducts };
    });
  },

  removeCategory: async (categoryId: number, updateCategoryQuantity) => {
    console.log("Removing category from store", categoryId);

    await updateCategoryQuantity(
      useShoppingStore.getState().currentStoreId,
      categoryId,
      0,
    );

    useShoppingStore.setState((state) => ({
      shoppingListProducts: state.shoppingListProducts.filter((cat) => cat.categoryId !== categoryId)
    }));
  },

  createStore: async (shoppingListName: string, createStore) => {
    const id = await createStore(shoppingListName);
    console.log("Creating shopping list", shoppingListName, id);

    useShoppingStore.setState((state) => ({
      shoppingLists: [...state.shoppingLists, { id, name: shoppingListName }],
    }));
  },
};
