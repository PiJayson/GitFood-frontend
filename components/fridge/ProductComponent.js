import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import IncrementDecrement from "../universal/IncrementDecrement";
import OutsidePressHandler from "react-native-outside-press";

export default function ProductComponent({ baseProduct, updateProductQuantity, syncStore }) {
  const [product, setProduct] = useState(baseProduct);

  const updateCount = (change) => {
    if (product.quantity + change < 0 || product.quantity + change >= 100) {
        return;
    }

    const newProduct = { ...product, quantity: product.quantity + change }

    setProduct(newProduct);

    if (newProduct.quantity <= 0) {
        syncStore.removeProduct(product, updateProductQuantity);
        return;
    }

    syncStore.updateProduct(newProduct, updateProductQuantity);
  };

  return (
    <View style={styles.productItem}>
        <Text style={styles.productName}>{product.productName}</Text>
        <Text style={styles.productQuantity}>{product.quantity}</Text>
        <IncrementDecrement update={updateCount} />
    </View>
  );
}

const styles = StyleSheet.create({
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  productName: {
    flex: 1,
    fontSize: 16,
  },
  productQuantity: {
    width: 50,
    textAlign: "center",
  },
});
