import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import Background from "../../components/universal/Background";
import Logo from "../../components/universal/Logo";
import Header from "../../components/universal/Header";
import Button from "../../components/universal/Button";
import TextInput from "../../components/universal/TextInput";
import BackButton from "../../components/universal/BackButton";
import { theme } from "../../assets/theme";
import { usernameValidator } from "../../utils/UsernameValidator";
import { passwordValidator } from "../../utils/PasswordValidator";
import { emailValidator } from "../../utils/EmailValidator";
import { useRestApi } from "../../providers/RestApiProvider";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [isWaiting, setIsWaiting] = useState(false);
  const { register } = useRestApi();

  const handleSignUp = async () => {
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Email:", email);

    const usernameError = usernameValidator(username.value);
    const passwordError = passwordValidator(password.value);
    const emailError = emailValidator(email.value);

    if (usernameError || passwordError || emailError) {
      setUsername({ ...username, error: usernameError });
      setPassword({ ...password, error: passwordError });
      setEmail({ ...email, error: emailError });
      return;
    }

    try {
      setIsWaiting(true);
      await register(email.value, username.value, password.value);
      navigation.navigate("Verification", { email: email.value, login: username.value });
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        disable={isWaiting}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        label="Username"
        returnKeyType="next"
        value={username.value}
        disable={isWaiting}
        onChangeText={(text) => setUsername({ value: text, error: "" })}
        error={!!username.error}
        errorText={username.error}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        disable={isWaiting}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <Button
        mode="contained"
        disable={isWaiting}
        onPress={handleSignUp}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});

export default SignUpScreen;
