import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, IconButton } from "react-native-paper";
import IncrementDecrement from "../universal/IncrementDecrement";
// import Swipeable from "react-native-gesture-handler/Swipeable";
import { theme } from "../../assets/theme";
import ProductName from "./ProductName";
import Animated, {
  ZoomIn,
  ZoomOut,
  StretchInX,
  StretchOutX,
} from "react-native-reanimated";

export function editedFridgeProductView(product, updateCount, handleExpand) {
  return (
    <Animated.View entering={StretchInX} exiting={StretchOutX}>
      <View style={styles.container}>
        <View style={styles.info}>
          <Text variant="displayMedium" style={styles.count}>
            {product.quantity}x
          </Text>
          <ProductName> {product.name} </ProductName>
        </View>
        <IncrementDecrement update={updateCount} />
        <IconButton
          // mode="outlined"
          icon="chevron-up"
          style={styles.expandButton}
          onPress={() => handleExpand()}
        />
      </View>
    </Animated.View>
  );
}

export function fridgeProductView(product, handleExpand) {
  return (
    <Animated.View entering={ZoomIn} exiting={ZoomOut}>
      <View style={styles.container}>
        <View style={styles.info}>
          <Text variant="displayMedium" style={styles.count}>
            {product.quantity}x
          </Text>
          <ProductName> {product.name} </ProductName>
        </View>
        <IconButton
          // mode="outlined"
          icon="chevron-down"
          style={styles.expandButton}
          onPress={() => handleExpand()}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 1,
    flex: 1,

    // padding: 20,
    width: "98%",
    maxWidth: 600,
    alignSelf: "center",
    alignItems: "left",

    borderRadius: 5,
    margin: 2,
    borderStyle: "solid",
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.surface,
  },
  info: {
    flexDirection: "row",
    flex: 1,
    alignSelf: "left",
    alignItems: "left",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  count: {
    paddingLeft: 8,
    color: theme.colors.primary,
    fontWeight: "800",
    fontSize: 40,
    maxWidth: 90,
    width: 90,
    textAlign: "center",
  },
  expandButton: {
    flex: 1,
    marginTop: 10,
    padding: 0,
    width: "100%",
    height: 30,
    maxWidth: "100%",

    // alignSelf: "stretch",
  },
});
