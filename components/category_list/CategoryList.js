import React, { useState } from "react";
import { RefreshControl, StyleSheet, View, FlatList } from "react-native";

export default function CategoryList({
  syncStore,
  renderCategory,
  updateProductQuantity
}) {

  const elements = syncStore.elements();
  const [refreshing, setRefreshing] = useState(false);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={elements}
        renderItem={({ item, index }) => renderCategory({ item, index, syncStore, updateProductQuantity })}
        keyExtractor={(item) => item.categoryId.toString()}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={async () => await syncStore.loadProducts()} />
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
