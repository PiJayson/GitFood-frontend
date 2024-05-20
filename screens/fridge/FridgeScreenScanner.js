import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ScannerComponent from "../../components/scanner/ScannerComponent";
import ProductForm from "../../components/scanner/NewProductForm";
import { useRestApi } from "../../providers/RestApiProvider";
import { syncFridgeStore } from "../../screens/fridge/FridgeStore";
import FridgeScreen from "./FridgeScreen";

export default function FridgeScannerScreen({ navigation }) {
  const { getProductByBarcode, updateProductQuantity, categoryGetAll, productAdd, categoryGetUnits } = useRestApi();
  const [formVisible, setFormVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [lastScannedItem, setLastScannedItem] = useState(null);
  
  const products = syncFridgeStore.elements();
  
  useEffect(() => {
    const fetchCategories = async () => {
      const resCategories = await categoryGetAll();
      const resUnits = await categoryGetUnits();
      
      setCategories(resCategories);
      setUnits(resUnits);
    };

    fetchCategories();
  }, [categoryGetAll, categoryGetUnits]);

  const findProductInFridgeStore = (barcode) => {
    for (let category of products) {
      const product = category.products.find(product => product.barcode === barcode);
      if (product) {
        return product;
      }
    }
    return null;
  };

  const handleBarcodeDetected = async (scannedData) => {
    // If already scanned then do nothing.
    if (lastScannedItem && lastScannedItem.barcode === scannedData) {
      return;
    }

    // Check if product exist in database.
    const productInDatabase = await getProductByBarcode(scannedData);

    if (productInDatabase) {
      // Check if scanned product exist in fridge.
      const productFromFridge = findProductInFridgeStore(scannedData);

      if (productFromFridge) {
        // Product already in firdge - edit.
        setLastScannedItem(productFromFridge);
      } else {
        // Product not in fridge - add.
        const newScannedItem = {
          description: productInDatabase.product.innerInformation.description,
          productName: productInDatabase.product.innerInformation.name,
          categoryName: productInDatabase.category.innerInformation.name,
          productId: productInDatabase.product.id,
          categoryId: productInDatabase.category.id,
          barcode: scannedData,
          quantity: 1,
          unit: productInDatabase.product.innerInformation.unit,
        };

        setLastScannedItem(newScannedItem);

        syncFridgeStore.addProduct(
          newScannedItem,
          updateProductQuantity,
        );
      }
    } else {
      const newScannedItem = {
        description: "",
        productName: "",
        categoryName: "",
        productId: -1,
        categoryId: -1,
        barcode: scannedData,
        unit: "amount",
        quantity: 1,
      };

      setLastScannedItem(newScannedItem);
      setFormVisible(true);
    }
  };

  const handleAddProduct = async (productData) => {
    const categoryId = categories.find(
      (category) => category.name == productData.categoryName,
    ).id;

    const productId = await productAdd(productData.productName, productData.description, productData.barcode, categoryId, productData.quantity);

    const newScannedItem = {
      ...lastScannedItem,
      description: productData.description,
      productName: productData.productName,
      categoryName: productData.categoryName,
      productId: productId,
      categoryId: categoryId,
      quantity: productData.quantity,
      unit: productData.unit,
    };

    setLastScannedItem(newScannedItem);
    
    syncFridgeStore.addProduct(
      newScannedItem,
      updateProductQuantity,
    );

    setFormVisible(false);
  };

  const incrementCount = () => {
    const newScannedItem = {
      ...lastScannedItem,
      quantity: lastScannedItem.quantity + 1,
    };

    setLastScannedItem(newScannedItem);
    
    syncFridgeStore.updateProduct(
      newScannedItem,
      updateProductQuantity,
    );
  };

  const decrementCount = () => {
    const newScannedItem = {
      ...lastScannedItem,
      quantity: Math.max(0, lastScannedItem.quantity - 1),
    };

    setLastScannedItem(newScannedItem);

    syncFridgeStore.updateProduct(
      newScannedItem,
      updateProductQuantity,
    );
  };

  return (
    <View style={styles.container}>
      <ScannerComponent onBarcodeScanned={handleBarcodeDetected} />
      <View style={styles.productDetails}>
        {lastScannedItem ? (
          <View>
            <Text>{lastScannedItem.productName}</Text>
            <View style={styles.buttonContainer}>
              <Button title="-" onPress={decrementCount} />
              <Text>{lastScannedItem.quantity}</Text>
              <Button title="+" onPress={incrementCount} />
            </View>
            <View>
              <ProductForm
                visible={formVisible}
                initialData={lastScannedItem}
                categories={categories.map(category => category.name)}
                units={units}
                onSubmit={handleAddProduct}
                onClose={() => {setFormVisible(false), lastScannedItem = null;}}
              />
            </View>
          </View>
        ) : (
          <Text>No Product Scanned</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productDetails: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: 100,
  },
});
