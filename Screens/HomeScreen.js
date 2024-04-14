import React from "react";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";

// TODO: plan what is supposed to be on the home screen
const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Paragraph>Home screen stuff</Paragraph>
      <Button mode="outlined" onPress={() => navigation.navigate("Scanner")}>
        Scan
      </Button>
    </View>
  );
};

export default HomeScreen;
