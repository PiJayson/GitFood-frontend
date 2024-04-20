export type TokenState = {
  isLoading: boolean;
  isSignout: boolean;
  error: string | null; // error property may not be usefull, but it will keep information about the error type after dispatch
  userToken: boolean;
};

export const initialState = {
  isLoading: true,
  isSignout: false,
  error: null,
  userToken: false,
};

type TokenStateAction =
  | { type: "RESTORE_TOKEN"; token: boolean }
  | { type: "SIGN_IN"; token: boolean }
  | { type: "SIGN_OUT" }
  | { type: "ERROR"; error: string };

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
        error: null,
        isSignout: false,
        userToken: action.token,
      };
    case "SIGN_OUT":
      return {
        ...state,
        isSignout: true,
        userToken: false,
      };
    case "ERROR":
      return {
        ...state,
        error: action.error,
        isSignout: true,
        userToken: false,
      };
  }
}
