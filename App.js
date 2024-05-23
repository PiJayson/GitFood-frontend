import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { theme } from "./assets/theme";
// import { EventProvider } from "react-native-outside-press";
import { NotificationProvider } from "./providers/NotificationProvider";
import { RestApiProvider, useRestApi } from "./providers/RestApiProvider";

import {
  LoginScreen,
  HomeScreen,
  SignUpScreen,
  StartScreen,
  RecipesScreens,
  SplashScreen,
  FridgeGroup,
  ShoppingGroup,
} from "./screens";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserScreen from "./screens/user/UserScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const queryClient = new QueryClient();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="ShoppingGroup"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="ShoppingGroup" component={ShoppingGroup} />
      <Tab.Screen name="FridgeGroup" component={FridgeGroup} />
      <Tab.Screen name="Recipes" component={RecipesScreens} />
    </Tab.Navigator>
  );
}

function AppNavigation() {
  const { isSignedIn } = useRestApi();

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
        <Drawer.Navigator drawerContent={(props) => <UserScreen {...props}></UserScreen>}>
          <Drawer.Screen name="MainTabs" component={MainTabs} />
        </Drawer.Navigator>
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
              <AppNavigation />
            </Provider>
          </QueryClientProvider>
        </RestApiProvider>
      </NotificationProvider>
    </SafeAreaProvider>
  );
}

export default App;
