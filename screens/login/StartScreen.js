import React from "react";
import Background from "../../components/universal/Background";
import Logo from "../../components/universal/Logo";
import Header from "../../components/universal/Header";
import Button from "../../components/universal/Button";
import Paragraph from "../../components/universal/Paragraph";

const StartScreen = ({ navigation }) => {
  return (
    <Background>
      <Logo />
      <Header>Hey there!</Header>
      <Paragraph>Do you have an account?</Paragraph>
      <Button mode="contained" onPress={() => navigation.navigate("Login")}>
        Login
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate("SignUp")}>
        Sign Up
      </Button>
    </Background>
  );
};

export default StartScreen;
