import React from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { View, FlatList } from "react-native";
import Header from "../universal/Header";
import Button from "../universal/Button";
import SingleProduct from "./SingleProduct";

export default function ProductList({
  syncStore,
  normalProductView,
  editProductView,
}) {
  const [refreshing, setRefreshing] = React.useState(false);

  const products = syncStore.products();

  const productStoreName = syncStore.currentFridge()?.name;
  return (
    <View style={styles.container}>
      <Header> {productStoreName} </Header>
      <FlatList
        style={styles.list}
        data={products}
        renderItem={({ item, index }) => (
          <SingleProduct
            index={index}
            productName={item.name}
            syncStore={syncStore}
            editView={editProductView}
            normalView={normalProductView}
          />
        )}
        // extraData={syncStore
        //   .products()
        //   .map((product) => product.quantity)
        //   .join("")}
        scrollEnabled={true}
        keyExtractor={(item) => item.name}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => await syncStore.loadProducts()}
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
