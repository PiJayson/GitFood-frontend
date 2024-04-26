import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { theme } from "./assets/theme";
import { EventProvider } from "react-native-outside-press";
import { NotificationProvider } from "./providers/NotificationProvider";
import { RestApiProvider, useRestApi } from "./providers/RestApiProvider";

import {
  LoginScreen,
  HomeScreen,
  ShoppingScreen,
  ShoppingScannerScreen,
  SignUpScreen,
  StartScreen,
  FridgeScreen,
} from "./screens";

const Stack = createNativeStackNavigator();

function AppNavigation() {
  const { isSignedIn } = useRestApi(); // Hook into the RestApiProvider

  const linking = {
    config: {
      screens: {
        Start: "",
        Login: "login",
        SignUp: "signUp",
        Home: "home",
        Shopping: "shopping",
        Scanner: "shopping/scanner",
        Fridge: "fridge",
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName={isSignedIn ? "Home" : "Start"}
        screenOptions={{ headerShown: false }}
      >
        {!isSignedIn ? (
          <>
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Fridge" component={FridgeScreen} />
            <Stack.Screen name="Shopping" component={ShoppingScreen} />
            <Stack.Screen name="Scanner" component={ShoppingScannerScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <NotificationProvider>
        <RestApiProvider>
          <Provider theme={theme}>
            <EventProvider style={{ flex: 1 }}>
              <AppNavigation />
            </EventProvider>
          </Provider>
        </RestApiProvider>
      </NotificationProvider>
    </SafeAreaProvider>
  );
}

export default App;
