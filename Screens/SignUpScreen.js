import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Implement your login logic here
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
    // For a real application, you would send the credentials to your server for authentication
    try {
      const response = await axios.post("YOUR_API_ENDPOINT", {
        username,
        password,
      });
      await AsyncStorage.setItem("jwtToken", response.data.token);
      navigation.navigate("Login");
    } catch (error) {
      alert("Signup failed!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Signup" onPress={handleLogin} />
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: "blue",
  },
});

export default SignUpScreen;
