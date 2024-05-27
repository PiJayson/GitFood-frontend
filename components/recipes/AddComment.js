import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Card, Avatar } from "react-native-paper";

const AddComment = ({ onAddComment }) => {
  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    if (comment.trim()) {
      onAddComment(comment);
      setComment("");
    } else {
      Alert.alert("Error", "Comment cannot be empty");
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Content style={styles.content}>
        <Avatar.Icon size={36} icon="account" />
        <TextInput
          style={styles.input}
          placeholder="Add a public comment..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button onPress={handleAddComment}>Post</Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "transparent",
  },
  actions: {
    justifyContent: "flex-end",
  },
});

export default AddComment;
