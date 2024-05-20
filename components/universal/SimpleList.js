import React from "react";
import { FlatList } from "react-native";
import { Button } from "react-native-paper";

export default SimpleList = ({ data }) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Button>{item}</Button>}
      keyExtractor={(item) => item}
    />
  );
};
