type Product = {
  name: string;
  count: number;
  barcode: string | null;
}; // probably more fields are needed

export type ProductListState = {
  products: Product[];
};

type ProductListAction =
  | { type: "REMOVE_PRODUCT"; name: string }
  | { type: "ADD_PRODUCT"; product: Product }
  | { type: "UPDATE_PRODUCT"; product: Product };

export default function productListReducer(
  state: ProductListState,
  action: ProductListAction,
): ProductListState {
  switch (action.type) {
    case "REMOVE_PRODUCT":
      return {
        ...state,
        products: state.products.filter(
          (product) => product.name !== action.name,
        ),
      };
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [...state.products, action.product],
      };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) =>
          product.name === action.product.name ? action.product : product,
        ),
      };
  }
}
