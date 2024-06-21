import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import IncrementDecrement from "../universal/IncrementDecrement";
import OutsidePressHandler from "react-native-outside-press";

export default function ProductComponent({ baseProduct, updateProductQuantity, syncStore }) {
  const [product, setProduct] = useState(baseProduct);

  const updateCount = (change) => {
    const newQuantity = product.quantity + change;
    if (newQuantity < 0 || newQuantity >= 999) {
      return;
    }

    const newProduct = { ...product, quantity: newQuantity }

    setProduct(newProduct);

    if (newProduct.quantity <= 0) {
      syncStore.removeProduct(product, updateProductQuantity);
      return;
    }

    syncStore.updateProduct(newProduct, updateProductQuantity);
  };

  const handleQuantityChange = (text) => {
    const newQuantity = parseInt(text, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0 && newQuantity < 999) {
      const newProduct = { ...product, quantity: newQuantity };
      setProduct(newProduct);
      syncStore.updateProduct(newProduct, updateProductQuantity);
    }
  };

  return (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{product.productName}</Text>
      <View style={styles.incrementDecrementContainer}>
        <IncrementDecrement update={updateCount} buttonStyle={styles.customButton} />
      </View>
      <TextInput
        style={styles.productQuantity}
        value={String(product.quantity)}
        keyboardType="numeric"
        onChangeText={handleQuantityChange}
      />
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
    fontSize: 14,
  },
  incrementDecrementContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  productQuantity: {
    fontSize: 14,
    flex: 0.5,
    marginRight: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    textAlignVertical: 'center',
  }
});
