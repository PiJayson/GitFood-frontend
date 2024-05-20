import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

export default function CategoryComponent({
  item: category,
  index,
  renderProduct,
  syncStore,
  updateProductQuantity
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{category.categoryName}</Text>
        <Text style={styles.categoryQuantity}>{category.quantity}</Text>
        <IconButton
          icon={isExpanded ? "chevron-up" : "chevron-down"}
          onPress={handleExpand}
          style={styles.expandButton}
        />
      </View>
      {isExpanded && (
        <View>
          {category.products.map((baseProduct) =>
            renderProduct({ baseProduct, updateProductQuantity, syncStore })
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
