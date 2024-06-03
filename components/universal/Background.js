import React from "react";
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { theme } from "../../assets/theme";

export default function Background({ children, style }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../assets/background_dot.png")}
        resizeMode="repeat"
        style={StyleSheet.flatten([styles.background])}
      >
        <KeyboardAvoidingView
          style={[styles.container, style]}
          behavior="padding"
        >
          {children}
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});
