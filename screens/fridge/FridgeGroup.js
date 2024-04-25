import React from "react";
import { Stack } from "react-native-screens";
import FridgeScreen from "./FridgeScreen";
import { EventProvider } from "react-native-outside-press";
import FridgeScannerScreen from "./FridgeScreenScanner";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const FridgeStack = createStackNavigator();

export default function FridgeGroup({ navigation }) {
  return (
    <EventProvider style={{ flex: 1 }}>
      <FridgeStack.Navigator>
        <FridgeStack.Screen name="Fridge" component={FridgeScreen} />
        <FridgeStack.Screen
          name="FridgeScanner"
          component={FridgeScannerScreen}
        />
      </FridgeStack.Navigator>
    </EventProvider>
  );
}
