import * as React from "react";
import { useReducer } from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"; // change back to native-stack
import * as SecureStore from "expo-secure-store";
import { theme } from "./core/theme";
import {
  LoginScreen,
  HomeScreen,
  ScannerScreen,
  SignUpScreen,
  StartScreen,
  SplashScreen,
  FridgeScreen,
} from "./screens";
import tokenStateReducer from "./utils/reducers/TokenStateReducer";
import { initialState } from "./utils/reducers/TokenStateReducer";
import RestApiService from "./services/RestApiService";
import { AuthContext } from "./utils/contexts/AuthContext";
import ErrorHandler from "./utils/decorators/RestApiErrorHandler";

const Stack = createStackNavigator();

function App() {
  const [state, dispatch] = useReducer(tokenStateReducer, initialState);

  React.useEffect(() => {
    // TODO: solution for web tokenw
    async function getToken() {
      let token;
      try {
        token = await SecureStore.getItemAsync("jwtToken");
        console.log("Token: " + token);
      } catch (e) {
        console.log("Error getting token");
        console.log(e);
        dispatch({ type: "RESTORE_TOKEN", token: false });
        return;
      }
      RestApiService.setToken(token);
      dispatch({ type: "RESTORE_TOKEN", token: token !== null });
    }
    getToken();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (username, password) => {
        let response;
        try {
          response = await RestApiService.login(username, password);
          dispatch({ type: "SIGN_IN", token: true });
        } catch (error) {
          console.log(error);
          if (error.response.status == 401) {
            alert("Invalid credentials!");
          } else if (error.response.status == 500) {
            alert("Server error!");
          }
          throw error;
        }

        try {
          await SecureStore.setItemAsync("jwtToken", response.data);
        } catch (e) {
          console.log("Error setting token: " + response.data);
          console.log(e);
        } // I assume fail during setting token is not critical
      },
      signOut: async () => {
        try {
          await SecureStore.deleteItemAsync("jwtToken");
        } catch (e) {
          console.log("Error removing token");
          console.log(e);
        } // I assume fail during removing token is not critical
        RestApiService.resetToken();
        dispatch({ type: "SIGN_OUT" });
      },
      signUp: async (username, password) => {
        let response;
        try {
          response = await RestApiService.register(username, password);
          dispatch({ type: "SIGN_IN", token: true });
        } catch (error) {
          console.log(error);
          if (error.response.status == 409) {
            alert("User already exists!");
          } else if (error.response.status == 500) {
            alert("Server error!");
          }
          throw error;
        }

        try {
          await SecureStore.setItemAsync("jwtToken", response.data);
        } catch (e) {
          console.log("Error setting token");
          console.log(e);
        } // I assume fail during setting token is not critical
      },
      call: async (func, args) => {
        return await ErrorHandler(func, args);
      },
    }),
    [],
  );

  if (state.isLoading) {
    return <SplashScreen />;
  }

  const linking = {
    config: {
      screens: {
        Start: "",
        Login: "login",
        SignUp: "signUp",
        Home: "home",
        Scanner: "scanner",
        Fridge: "fridge",
      },
    },
  };

  return (
    <Provider theme={theme}>
      <NavigationContainer linking={linking}>
        <AuthContext.Provider value={authContext}>
          <Stack.Navigator
            initialRouteName={state.userToken ? "Fridge" : "Start"}
            screenOptions={{ headerShown: false }}
          >
            {state.userToken == false ? (
              <>
                <Stack.Screen
                  name="Start"
                  URL="start"
                  component={StartScreen}
                  options={{
                    animationTypeForReplace: state.isSignout ? "pop" : "push",
                  }} //to test if looks better
                />
                <Stack.Screen
                  name="Login"
                  URL="login"
                  component={LoginScreen}
                />
                <Stack.Screen
                  name="SignUp"
                  URL="signup"
                  component={SignUpScreen}
                />
              </>
            ) : (
              <>
                <Stack.Screen name="Fridge" component={FridgeScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Scanner" component={ScannerScreen} />
              </>
            )}
          </Stack.Navigator>
        </AuthContext.Provider>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
