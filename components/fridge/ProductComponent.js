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
      <View style={styles.incrementDecrementContainer}>
        <IncrementDecrement update={updateCount} buttonStyle={styles.customButton} />
      </View>
      <Text style={styles.productQuantity}>{product.quantity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    width: '100%',
  },
  productName: {
    flex: 2,
    marginLeft: 15,
    fontSize: 16,
  },
  incrementDecrementContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  productQuantity: {
    fontSize: 16,
    flex: 1,
    marginRight: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  }
});
