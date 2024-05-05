import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ScannerComponent from "../../components/scanner/ScannerComponent";
import BackButton from "../../components/universal/BackButton";
import ProductForm from "../../components/scanner/ProductForm";
import { useRestApi } from "../../providers/RestApiProvider";
import { syncFridgeStore } from "../../screens/fridge/FridgeStore";

export default function FridgeScannerScreen({ navigation }) {
  const { getProductByBarcode, updateProductQuantity, categoryGetAll, productAdd } = useRestApi();
  const [formVisible, setFormVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const lastScannedItem = useRef(null);
  const [, forceUpdate] = useState();
  const update = () => forceUpdate({});
  
  const products = syncFridgeStore.products();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await categoryGetAll();
        setCategories(result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [categoryGetAll]);


  const handleBarcodeDetected = async (scannedData) => {
    console.log(lastScannedItem.current); // Access via .current
    console.log("scanned: ", categories);
    if (
      lastScannedItem.current &&
      lastScannedItem.current.barcode === scannedData
    ) {
      console.log("SCANNED");
      return;
    }
    console.log("new scan");
    const productInDatabase = await getProductByBarcode(scannedData);
    console.log("productInDatabase");
    console.log(productInDatabase);
    const productFromFridge = products.find(
      (product) => product.barcode == scannedData,
    );

    if (productInDatabase) {
      if (productFromFridge) {
        lastScannedItem.current = productFromFridge; // Set with .current
      } else {
        lastScannedItem.current = {
          name: productInDatabase.product.name,
          quantity: 1,
          barcode: scannedData,
        };

        syncFridgeStore.addProduct(
          lastScannedItem.current,
          updateProductQuantity,
        );
      }
    } else {
      lastScannedItem.current = {
        name: "",
        description: "",
        barcode: scannedData,
        productId: -1,
        categoryid: -1,
        unit: "amount",
        quantity: 1,
      };
      setFormVisible(true);
    }
    update();
  };

  const handleAddProduct = async (productData) => {
    console.log("Product Added:", productData);

    const productId = await productAdd(productData.name, productData.description, productData.barcode, 1, productData.quantity);
    
    lastScannedItem.current = {
      ...lastScannedItem.current,
      name: productData.name,
      productId: productId
    };
    
    syncFridgeStore.addProduct(
      lastScannedItem.current,
      updateProductQuantity,
    );

    setFormVisible(false);
    update();
  };

  const incrementCount = () => {
    const prevItem = lastScannedItem.current;
    console.log(lastScannedItem.current);

    lastScannedItem.current = {
      ...lastScannedItem.current,
      quantity: lastScannedItem.current.quantity + 1, // Update with .current
    };
    console.log(lastScannedItem.current);
    syncFridgeStore.updateProduct(
      prevItem,
      lastScannedItem.current,
      updateProductQuantity,
    );

    update();
  };

  const decrementCount = () => {
    prevItem = lastScannedItem.current;
    lastScannedItem.current = {
      ...lastScannedItem.current,
      quantity: Math.max(0, lastScannedItem.current.quantity - 1), // Update with .current
    };

    syncFridgeStore.updateProduct(
      prevItem,
      lastScannedItem.current,
      updateProductQuantity,
    );

    update();
  };

  return (
    <View style={styles.container}>
      <BackButton goBack={navigation.goBack} />
      <ScannerComponent onBarcodeScanned={handleBarcodeDetected} />
      <View style={styles.productDetails}>
        {lastScannedItem.current ? (
          <View>
            <Text>{lastScannedItem.current.name}</Text>
            <View style={styles.buttonContainer}>
              <Button title="-" onPress={decrementCount} />
              <Text>{lastScannedItem.current.quantity}</Text>
              <Button title="+" onPress={incrementCount} />
            </View>
            <View>
              <Button
                title="Edit Product"
                onPress={() => setFormVisible(true)}
              />
              <ProductForm
                visible={formVisible}
                initialData={lastScannedItem.current}
                categories={categories.map(category => category.name)}
                units={["ml", "l", "dl", "mg", "g", "kg", "amount"]}
                onSubmit={handleAddProduct}
                onClose={() => setFormVisible(false)}
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
