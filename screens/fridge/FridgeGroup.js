import React, { useEffect } from "react";
import { Stack } from "react-native-screens";
import FridgeScreen from "./FridgeScreen";
import { EventProvider } from "react-native-outside-press";
import FridgeScannerScreen from "./FridgeScreenScanner";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { syncFridgeStore } from "./FridgeStore";
import { useRestApi } from "../../providers/RestApiProvider";

const FridgeStack = createStackNavigator();

export default function FridgeGroup({ navigation }) {
  // load the products from the server
  const { getFridges } = useRestApi();

  useEffect(() => {
    syncFridgeStore.loadStores(getFridges);
  }, [getFridges]);

  return (
    <EventProvider style={{ flex: 1 }}>
      <FridgeStack.Navigator>
        <FridgeStack.Screen name="Fridge" component={FridgeScreen}  options={{ headerShown: false }}/>
        <FridgeStack.Screen
          name="FridgeScanner"
          component={FridgeScannerScreen}
          options={{ headerShown: false }}
        />
      </FridgeStack.Navigator>
    </EventProvider>
  );
}
