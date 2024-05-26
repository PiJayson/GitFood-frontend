import React, { useEffect } from "react";
import { EventProvider } from "react-native-outside-press";
import { createStackNavigator } from "@react-navigation/stack";
import { syncShoppingStore } from "./ShoppingStore";
import { useRestApi } from "../../providers/RestApiProvider";
import ShoppingScreen from "./ShoppingScreen";
import ShoppingScannerScreen from "./ShoppingScannerScreen";

const ShoppingStack = createStackNavigator();

export default function ShoppingeGroup({ navigation }) {
  // load the categories from the server
  const { getShoppingLists } = useRestApi();

  useEffect(() => {
    syncShoppingStore.loadStores(getShoppingLists);
  }, [getShoppingLists]);

  return (
    <EventProvider style={{ flex: 1 }}>
      <ShoppingStack.Navigator>
        <ShoppingStack.Screen name="Shopping" component={ShoppingScreen} options={{ headerShown: false }}/>
        <ShoppingStack.Screen
          name="ShoppingScanner"
          component={ShoppingScannerScreen}
          options={{ headerShown: false }}
        />
      </ShoppingStack.Navigator>
    </EventProvider>
  );
}
