import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

export default function SectionHeader({ title, editAction }) {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{title}:</Text>
      {editAction && (
        <IconButton
          icon="pencil"
          onPress={editAction}
          size={25}
          style={{ alignSelf: "center", position: "absolute", right: 10 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // borderColor: "#d3d3d3",
    // borderWidth: 1,

    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    padding: 10,
  },
  paragraph: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
