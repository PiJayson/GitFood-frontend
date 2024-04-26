import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Button from "../universal/Button";
import IncrementDecrement from "../universal/IncrementDecrement";
// import Swipeable from "react-native-gesture-handler/Swipeable";
import OutsidePressHandler from "react-native-outside-press";
import { theme } from "../../assets/theme";
import ProductName from "./ProductName";

export default function SingleProduct({ product, dispatch }) {
  const [count, setCount] = useState(product.count);

  const outsidePressHandler = () => {
    if (count == 0) {
      dispatch({ type: "REMOVE_PRODUCT", productName: product.name });
    }
  }; // well this one will be a little bit of a perfomance killer

  const updateCount = (value) => {
    product.count = product.count + value > 0 ? product.count + value : 0;
    setCount(product.count);
    dispatch({
      type: "UPDATE_PRODUCT",
      product: product,
    });
  };

  return (
    <OutsidePressHandler onOutsidePress={() => outsidePressHandler()}>
      <View style={styles.container}>
        <Text variant="displayMedium" style={styles.count}>
          {count}x
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
