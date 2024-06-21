import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import IncrementDecrement from "../universal/IncrementDecrement";
import { theme } from "../../assets/theme";

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
        <View style={styles.incrementDecrementContainer}>
          <IncrementDecrement update={updateCount} buttonStyle={styles.customButton}/>
        </View>
        {!shoppingStarted && (
          <Text style={styles.categoryQuantity}>
            {category.quantity}
            <Text style={styles.unit}> {category.unit}</Text></Text>
        )}
        {shoppingStarted && (
          <Text style={styles.categoryQuantity}>
            {boughtItems}
          <Text style={styles.slash}> / </Text>
            {category.quantity}
            <Text style={styles.unit}> {category.unit}</Text>
          </Text>
        )}
        <View style={styles.toggleButtonContainer}>
          {shoppingStarted && (
            <IconButton
              icon={isExpanded ? "chevron-up" : "chevron-down"}
              onPress={handleExpand}
              style={styles.expandButton}
            />
          )}
        </View>
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
    height: 50,  // Fixed height for header
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 20,
    flex: 2,
  },
  incrementDecrementContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  categoryQuantity: {
    fontSize: 20,
    marginLeft: 10,
    flex: 1,
    textAlign: 'right',
  },
  toggleButtonContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandButton: {
    marginLeft: 10,
  },
  slash: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },

  customButton: {
    backgroundColor: theme.colors.primary,
    iconColor: 'white',
  },
  unit: {
    fontWeight: "bold",
    color: theme.colors.primary
  }
});

