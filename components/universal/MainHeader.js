import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useRestApi } from "../../providers/RestApiProvider";
import { SafeAreaView } from "react-native";

const MainHeader = ({ title }) => {
  const navigation = useNavigation();

  const { username } = useRestApi();

  return (
    <SafeAreaView style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.userContainer}>
        <Text style={styles.username}>{username}</Text>
        <Image
          source={{
            uri: "https://img.freepik.com/free-photo/cute-ai-generated-cartoon-bunny_23-2150288870.jpg?t=st=1716447330~exp=1716450930~hmac=dfc730c516527ee1e49c3fd4a6661b81710252c2c61c0aafe64e7b71e8baa07e&w=740",
          }} // Replace with your user's image URL
          style={styles.userImage}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    marginRight: 24,
    fontSize: 18,
    fontWeight: "bold",
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 5,
    marginBottom: 10,
  },
});

export default MainHeader;
