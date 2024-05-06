import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { theme } from "./assets/theme";
// import { EventProvider } from "react-native-outside-press";
import { NotificationProvider } from "./providers/NotificationProvider";
import { RestApiProvider, useRestApi } from "./providers/RestApiProvider";

import {
  LoginScreen,
  HomeScreen,
  ShoppingScreen,
  ShoppingScannerScreen,
  SignUpScreen,
  StartScreen,
  RecipesScreens,
  SplashScreen,
  FridgeGroup,
} from "./screens";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

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
      {isSignedIn ? (
        <Tab.Navigator
          initialRouteName="Shopping"
          screenOptions={{ headerShown: false }}
        >
          <Tab.Screen name="Shopping" component={ShoppingScreen} />
          <Tab.Screen name="Scanner" component={ShoppingScannerScreen} />
          <Tab.Screen name="FridgeGroup" component={FridgeGroup} />
          <Tab.Screen name="Recipes" component={RecipesScreens} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator
          initialRouteName="Start"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Start" component={StartScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <NotificationProvider>
        <RestApiProvider>
          <QueryClientProvider client={queryClient}>
            <Provider theme={theme}>
              {/* <EventProvider style={{ flex: 1 }}> */}
              <AppNavigation />
              {/* </EventProvider> */}
            </Provider>
          </QueryClientProvider>
        </RestApiProvider>
      </NotificationProvider>
    </SafeAreaProvider>
  );
}

export default App;
