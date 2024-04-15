import * as React from "react";
import { useReducer } from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"; // change back to native-stack
import { theme } from "./core/theme";
import {
  LoginScreen,
  HomeScreen,
  ScannerScreen,
  SignUpScreen,
  StartScreen,
  SplashScreen,
} from "./screens";
import tokenStateReducer from "./utils/reducers/TokenStateReducer";
import { initialState } from "./utils/reducers/TokenStateReducer";
import RestApiService from "./services/RestApiService";
import { AuthContext } from "./utils/contexts/AuthContext";

const Stack = createStackNavigator();

function App() {
  const [state, dispatch] = useReducer(tokenStateReducer, initialState);

  React.useEffect(() => {
    async function fetchData() {
      // Fetch the token from storage then navigate to our appropriate place

      const result = await RestApiService.bootstrap();
      if (result) dispatch({ type: "RESTORE_TOKEN", token: true });
      else dispatch({ type: "RESTORE_TOKEN", token: false });
    }
    fetchData();
  }, []);
  // const authContext = React.useContext(AuthContext);

  const authContext = React.useMemo(
    () => ({
      signIn: async (username, password) => {
        try {
          console.log("before");

          await RestApiService.login(username, password);
          console.log("been there");
          dispatch({ type: "SIGN_IN", token: true });
        } catch (error) {
          console.log(error);
          alert("Invalid credentials!");
        }
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
    }),
    [],
  );

  if (state.isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <AuthContext.Provider value={authContext}>
          <Stack.Navigator
            initialRouteName={state.userToken ? "Home" : "Start"} // will it work?
            screenOptions={{ headerShown: false }}
          >
            {!state.userToken ? (
              <>
                <Stack.Screen
                  name="Start"
                  component={StartScreen}
                  options={{
                    animationTypeForReplace: state.isSignout ? "pop" : "push",
                  }} //to test if looks better
                />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
              </>
            ) : (
              <>
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
