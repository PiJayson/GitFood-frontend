import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import IncrementDecrement from "../universal/IncrementDecrement";

export default function CategoryComponent({
  item: category,
  index,
  renderProduct,
  syncStore,
  updateProductQuantity,
  shoppingStarted
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const updateCount = (change) => {
    if (category.quantity + change < 0 || category.quantity + change >= 100) {
        return;
    }

    const newCategory = { ...category, quantity: category.quantity + change }

    if (newCategory.quantity <= 0) {
        syncStore.removeCategory(category.categoryId, updateProductQuantity);
        return;
    }

    syncStore.updateCategory(newCategory, updateProductQuantity);
  };

  const boughtItems = category.products.reduce((acc, product) => {
    return acc + product.quantity;
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{category.categoryName}</Text>
        <IncrementDecrement update={updateCount} />
        {!shoppingStarted && (
          <Text style={styles.categoryQuantity}>{category.quantity}</Text>
        )}
        {shoppingStarted && (
          <Text style={styles.categoryQuantity}>{boughtItems}/{category.quantity}</Text>
        )}
        {shoppingStarted && (
          <IconButton
            icon={isExpanded ? "chevron-up" : "chevron-down"}
            onPress={handleExpand}
            style={styles.expandButton}
          />
        )}
      </View>
      {isExpanded && shoppingStarted && (
        <View>
          {category.products.map((baseProduct) =>
            renderProduct({ baseProduct, category, syncStore })
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryQuantity: {
    fontSize: 18,
  },
  expandButton: {
    marginLeft: 10,
  },
});
