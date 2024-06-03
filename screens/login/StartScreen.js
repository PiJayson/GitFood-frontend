import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import Background from "../../components/universal/Background";
import Logo from "../../components/universal/Logo";
import Header from "../../components/universal/Header";
import Button from "../../components/universal/Button";
import Paragraph from "../../components/universal/Paragraph";
import { theme } from "../../assets/theme";

const StartScreen = ({ navigation }) => {
  return (
    <Background style={styles.container}>
        <View style={styles.content}>
          <Logo />
          <Header>Hey there!</Header>
          <Paragraph>Do you have an account?</Paragraph>
          <Button mode="contained" onPress={() => navigation.navigate("Login")}>
            Login
          </Button>
          <Button mode="outlined" onPress={() => navigation.navigate("SignUp")}>
            Sign Up
          </Button>
        </View>
        {Platform.OS === 'web' && (
          <Button
            mode="text"
            onPress={() => window.location.href = 'https://expo.dev/artifacts/eas/5ZaQWzyqnUcF4BLAWJYWCt.apk'}
            style={styles.downloadButton}
            textStyle={{ color: "white" }}
          >
            Download APK
          </Button>
        )}
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    width: "100%",
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: theme.colors.secondary,
    marginBottom: 30,
    alignSelf: 'center',
  },
});

export default StartScreen;
