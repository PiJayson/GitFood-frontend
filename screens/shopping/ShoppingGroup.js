import React, { useEffect } from "react";
import { EventProvider } from "react-native-outside-press";
import { createStackNavigator } from "@react-navigation/stack";
import { syncShoppingStore } from "./ShoppingStore";
import { useRestApi } from "../../providers/RestApiProvider";
import ShoppingScreen from "./ShoppingScreen";
import ShoppingScannerScreen from "./ShoppingScannerScreen";

const ShoppingStack = createStackNavigator();

export default function ShoppingeGroup({ navigation }) {
  // load the products from the server
  const { getShoppingLists } = useRestApi();

  useEffect(() => {
    syncShoppingStore.loadShoppingLists(getShoppingLists);
  }, [getShoppingLists]);

  return (
    <EventProvider style={{ flex: 1 }}>
      <ShoppingStack.Navigator>
        <ShoppingStack.Screen name="Shopping" component={ShoppingScreen} />
        <ShoppingStack.Screen
          name="ShoppingScanner"
          component={ShoppingScannerScreen}
        />
      </ShoppingStack.Navigator>
    </EventProvider>
  );
}
