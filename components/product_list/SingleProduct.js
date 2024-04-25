import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Button from "../universal/Button";
import IncrementDecrement from "../universal/IncrementDecrement";
// import Swipeable from "react-native-gesture-handler/Swipeable";
import OutsidePressHandler from "react-native-outside-press";
import { theme } from "../../core/theme";
import ProductName from "./ProductName";
import { useProductStore } from "../../screens/fridge/ProductStore";

export default function SingleProduct({ productName, store }) {
  // const [count, setCount] = useState(product.count);
  const { removeProduct, updateProduct } = store();
  const product = useProductStore().products.find(
    (p) => p.name === productName,
  );

  const outsidePressHandler = () => {
    if (product.count == 0) {
      removeProduct(product);
    }
  }; // well this one will be a little bit of a perfomance killer

  const updateCount = (change) => {
    const newProduct = { ...product, count: product.count + change };
    updateProduct(newProduct);
  };

  return (
    <OutsidePressHandler onOutsidePress={() => outsidePressHandler()}>
      <View style={styles.container}>
        <Text variant="displayMedium" style={styles.count}>
          {product.count}x
        </Text>
        <ProductName> {product.name} </ProductName>
        <IncrementDecrement update={updateCount} />
      </View>
    </OutsidePressHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    flex: 1,
    flexDirection: "row",
    // padding: 20,
    width: "98%",
    maxWidth: 600,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",

    borderRadius: 10,
    margin: 5,
    borderStyle: "solid",
    borderColor: theme.colors.primary,
    borderWidth: 3,

    backgroundColor: theme.colors.surface,
  },
  count: {
    paddingLeft: 8,
    color: theme.colors.primary,
    fontWeight: "800",
    textAlign: "center",
  },
});
