import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { theme } from "../../assets/theme";

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
        <Text style={styles.categoryQuantity}>
          {category.quantity}
          <Text style={styles.unit}> {category.unit}</Text>
        </Text>
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
    padding: 15,
    margin: 10,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 25,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 20,
    flex: 2,
  },
  categoryQuantity: {
    fontSize: 20,
    marginLeft: 10,
    flex: 1,
    textAlign: 'right',
  },
  expandButton: {
    marginLeft: 10,
  },
  unit: {
    fontWeight: "bold",
    color: theme.colors.primary
  }
});
