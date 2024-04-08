import * as React from "react";
import { Button, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"; // change back to native-stack
import LoginScreen from "./Screens/LoginScreen";
import ScannerScreen from "./Screens/ScannerScreen";
import SignUpScreen from "./Screens/SignUpScreen";

//for now here
const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button title="Scanner" onPress={() => navigation.navigate("Scanner")} />
    </View>
  );
};

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ gestureEnabled: false, headerShown: false }}
        />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ gestureEnabled: false, headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ gestureEnabled: false, headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// const Tab = createBottomTabNavigator();

// function MyTabs() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Settings" component={SettingsScreen} />
//     </Tab.Navigator>
//   );
// }

export default App;
