import React from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { View, FlatList } from "react-native";
import Header from "../universal/Header";
import Button from "../universal/Button";
import SingleProduct from "./SingleProduct";
import { useFridgesStore } from "../../screens/fridge/FridgeStore";

export default function ProductList({
  syncStore,
  normalProductView,
  editProductView,
  updateProductQuantity,
  onRefresh,
}) {
  const [refreshing, setRefreshing] = React.useState(false);

  const products = syncStore.products();

  const productStoreName = syncStore.currentFridge()?.name;
  console.log("fridge list rendered", productStoreName);
  return (
    <View style={styles.container}>
      <Header> {productStoreName} </Header>
      <FlatList
        style={styles.list}
        data={useFridgesStore().products}
        renderItem={({ item, index }) => (
          <SingleProduct
            index={index}
            productId={item.productId}
            syncStore={syncStore}
            editView={editProductView}
            normalView={normalProductView}
            updateProductQuantity={updateProductQuantity}
          />
        )}
        // extraData={syncStore
        //   .products()
        //   .map((product) => product.quantity)
        //   .join("")}
        scrollEnabled={true}
        keyExtractor={(item) => item.productId + item.quantity}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
