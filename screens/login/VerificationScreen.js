import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput } from "react-native-paper";
import Background from "../../components/universal/Background";
import Header from "../../components/universal/Header";
import Button from "../../components/universal/Button";
import Logo from "../../components/universal/Logo";
import BackButton from "../../components/universal/BackButton";
import { useRestApi } from "../../providers/RestApiProvider";

const VerificationScreen = ({ navigation, route }) => {
  const { email, login } = route.params;
  const [isWaiting, setIsWaiting] = useState(false);
  const [code, setCode] = useState("");
  const { resendVerification, verify } = useRestApi();

  const handleResendEmail = async () => {
    try {
      setIsWaiting(true);
      await resendVerification(login);
    } finally {
      setIsWaiting(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setIsWaiting(true);
      await verify(code, login);
      navigation.navigate("Login")
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Email Verification</Header>
      <Text style={styles.text}>
        A verification email has been sent to <Text style={styles.bold}>{email}</Text>. Please check your inbox and click the link to verify your email address.
      </Text>
      <TextInput
        label="Verification Code"
        value={code}
        onChangeText={(text) => setCode(text)}
        keyboardType="numeric"
        maxLength={8}
        style={styles.codeInput}
      />
      <Button
        mode="contained"
        disable={isWaiting}
        onPress={handleVerifyCode}
        style={{ marginTop: 24 }}
      >
        Verify Code
      </Button>
      <Button
        mode="outlined"
        disable={isWaiting}
        onPress={handleResendEmail}
        style={{ marginTop: 24 }}
      >
        Resend Email
      </Button>
    </Background>
  );
};

const styles = StyleSheet.create({
  text: {
    marginBottom: 20,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  codeInput: {
    marginVertical: 20,
    fontSize: 18,
  },
});

export default VerificationScreen;
