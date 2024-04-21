import React from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { View, FlatList } from "react-native";
import Header from "../universal/Header";
import Button from "../universal/Button";
import SingleProduct from "./SingleProduct";
import { useReducer } from "react";
import productListReducer from "../../utils/reducers/productListReducer";

export default function ProductList({ products = [], ListName = "" }) {
  const [productList, dispatch] = useReducer(productListReducer, products);

  return (
    <View style={styles.container}>
      <Header> {ListName} </Header>
      <Button
        title="Add Product"
        mode="contained"
        onPress={() => console.log("")}
      />
      <FlatList
        style={styles.list}
        data={productList}
        renderItem={({ item }) => (
          <SingleProduct product={item} dispatch={dispatch} />
        )}
        scrollEnabled={true}
        keyExtractor={(item) => item.name}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={loadUserData} />
        // }
      />
      <Button mode="outlined" title="begin Scanning"></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 15,
    paddingLeft: 15,
    width: "100%",
    margin: 12,

    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    flex: 1,
    width: "100%",
    marginTop: 10,
    alignSelf: "center",
  },
});
