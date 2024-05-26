import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Avatar, Text } from "react-native-paper";

const CommentList = ({ comments }) => {
  return (
    <View style={styles.list}>
      {comments.map((item, index) => (
        <Card key={index} style={styles.commentContainer}>
          <Card.Content style={styles.content}>
            <Avatar.Icon size={36} icon="account" />
            <View style={styles.textContainer}>
              <Text style={styles.username}>{item.user}</Text>
              <Text style={styles.comment}>{item.message}</Text>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
  commentContainer: {
    marginBottom: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  username: {
    fontWeight: "bold",
  },
  comment: {
    marginTop: 5,
  },
});

export default CommentList;
