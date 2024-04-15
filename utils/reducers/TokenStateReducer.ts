export type TokenState = {
  isLoading: boolean;
  isSignout: boolean;
  userToken: boolean;
};

export const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: false,
};

type TokenStateAction =
  | { type: "RESTORE_TOKEN"; token: boolean }
  | { type: "SIGN_IN"; token: boolean }
  | { type: "SIGN_OUT" };

export default function tokenStateReducer(
  state = initialState,
  action: TokenStateAction,
): TokenState {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...state,
        userToken: action.token,
        isLoading: false,
      };
    case "SIGN_IN":
      return {
        ...state,
        isSignout: false,
        userToken: action.token,
      };
    case "SIGN_OUT":
      return {
        ...state,
        isSignout: true,
        userToken: false,
      };
  }
}
