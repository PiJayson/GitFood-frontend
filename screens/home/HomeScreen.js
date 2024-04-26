import React from "react";
import { View } from "react-native";
import Button from "../../components/universal/Button";
import Paragraph from "../../components/universal/Paragraph";
import { useRestApi } from "../../providers/RestApiProvider";

// TODO: plan what is supposed to be on the home screen
const HomeScreen = ({ navigation }) => {
  const { signOut } = useRestApi();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Paragraph>Home screen stuff</Paragraph>
      <Button mode="outlined" onPress={() => navigation.navigate("Shopping")}>
        Shopping
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate("Fridge")}>
        Fridge
      </Button>
      <Button
        mode="outlined"
        onPress={async () => {
          await signOut(); // disabling when clicked?
        }}
      >
        log out
      </Button>
    </View>
  );
};

export default HomeScreen;
