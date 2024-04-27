import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ScannerComponent from "../../components/scanner/ScannerComponent";
import BackButton from "../../components/universal/BackButton";
import ProductForm from "../../components/scanner/ProductForm";
import { useRestApi } from "../../providers/RestApiProvider";
import { syncProductStore } from "../../screens/fridge/ProductStore";

export default function FridgeScannerScreen({ navigation }) {
  const [formVisible, setFormVisible] = useState(false);
  const lastScannedItem = useRef(null);
  const [, forceUpdate] = useState();
  const update = () => forceUpdate({});
  const products = syncProductStore.products();
  const { getProductByBarcode } = useRestApi();

  const handleBarcodeDetected = async (scannedData) => {
    console.log(lastScannedItem.current); // Access via .current
    if (
      lastScannedItem.current &&
      lastScannedItem.current.barcode === scannedData
    ) {
      console.log("SCANNED");
      return;
    }
    console.log("new scan");
    const productInDatabase = await getProductByBarcode(scannedData);
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

        syncProductStore.addProduct(lastScannedItem.current);
      }
    } else {
      lastScannedItem.current = {
        name: "",
        quantity: 1,
        barcode: scannedData,
      };
      setFormVisible(true);
    }
    update();
  };

  const handleAddProduct = async (productData) => {
    console.log("Product Added:", productData);

    lastScannedItem.current = {
      ...lastScannedItem.current,
      name: productData.name,
    };
    syncProductStore.addProduct({
      name: productData.name,
      quantity: lastScannedItem.current.quantity,
      barcode: lastScannedItem.current.barcode,
    });

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
    syncProductStore.updateProduct(prevItem, lastScannedItem.current);

    update();
  };

  const decrementCount = () => {
    prevItem = lastScannedItem.current;
    lastScannedItem.current = {
      ...lastScannedItem.current,
      quantity: Math.max(0, lastScannedItem.current.quantity - 1), // Update with .current
    };

    syncProductStore.updateProduct(prevItem, lastScannedItem.current);

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
