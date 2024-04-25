import React from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { View, FlatList } from "react-native";
import Header from "../universal/Header";
import Button from "../universal/Button";
import SingleProduct from "./SingleProduct";
// import { useProductStore } from "../../screens/fridge/ProductStore";

export default function ProductList({ store }) {
  const [refreshing, setRefreshing] = React.useState(false);

  const { productStoreName, products } = store();

  return (
    <View style={styles.container}>
      <Header> {productStoreName} </Header>
      <Button
        title="Add Product"
        mode="contained"
        onPress={() => console.log("")}
      />
      <FlatList
        style={styles.list}
        data={products}
        renderItem={({ item }) => (
          <SingleProduct productName={item.name} store={store} />
        )}
        scrollEnabled={true}
        keyExtractor={(item) => item.name}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => console.log("refresh")}
          />
        }
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
