import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ScannerComponent from "../../components/scanner/ScannerComponent";
import BackButton from "../../components/universal/BackButton";
import ProductForm from "../../components/scanner/ProductForm";
import RestApiService from "../../services/RestApiService";
import { useProductStore } from "../../screens/fridge/ProductStore";

export default function FridgeScannerScreen({ navigation }) {
  const [formVisible, setFormVisible] = useState(false);
  const lastScannedItem = useRef(null);
  const [, forceUpdate] = useState();
  const update = () => forceUpdate({});
  const { addProduct, updateProduct, products } = useProductStore();

  const handleBarcodeDetected = async (scannedData) => {
    console.log(lastScannedItem.current); // Access via .current
    if (
      lastScannedItem.current &&
      lastScannedItem.current.barcode === scannedData
    ) {
      console.log("SCANNED");
      return;
    }
    const productInDatabase =
      await RestApiService.getProductByBarcode(scannedData);

    const productFromFridge = products.find(
      (product) => product.barcode == scannedData,
    );

    console.log(scannedData);
    console.log(productInDatabase);
    console.log(productFromFridge);

    if (productInDatabase) {
      if (productFromFridge) {
        lastScannedItem.current = productFromFridge; // Set with .current
      } else {
        lastScannedItem.current = {
          name: productInDatabase.product.innerInformation.name,
          count: 1,
          barcode: scannedData,
        };

        // dispatch({
        //   type: "ADD_PRODUCT",
        //   product: {
        //     name: productInDatabase.product.innerInformation.name,
        //     count: 1,
        //     barcode: scannedData,
        //   },
        // });
        addProduct(lastScannedItem.current);
      }
    } else {
      lastScannedItem.current = {
        name: "",
        count: 1,
        barcode: scannedData,
      };
      setFormVisible(true);
    }
    update();
  };

  const handleAddProduct = async (productData) => {
    console.log("Product Added:", productData);

    // dispatch({
    //   type: "ADD_PRODUCT",
    //   product: {
    //     name: productData.name,
    //     count: lastScannedItem.current.count, // Access via .current
    //     barcode: lastScannedItem.current.barcode, // Access via .current
    //   },
    addProduct({
      name: productData.name,
      count: lastScannedItem.current.count,
      barcode: lastScannedItem.current.barcode,
    });

    const response = await RestApiService.addProductWithBarcode(
      lastScannedItem.current.barcode,
      productData.name,
      productData.description,
    );
    console.log(response);
    setFormVisible(false);
    update();
  };

  const incrementCount = () => {
    lastScannedItem.current = {
      ...lastScannedItem.current,
      count: lastScannedItem.current.count + 1, // Update with .current
    };

    // dispatch({
    //   type: "UPDATE_PRODUCT",
    //   product: lastScannedItem.current, // Send the updated ref
    // });

    updateProduct(lastScannedItem.current);

    update();
  };

  const decrementCount = () => {
    lastScannedItem.current = {
      ...lastScannedItem.current,
      count: Math.max(0, lastScannedItem.current.count - 1), // Update with .current
    };

    // dispatch({
    //   type: "UPDATE_PRODUCT",
    //   product: lastScannedItem.current, // Send the updated ref
    // });
    updateProduct(lastScannedItem.current);

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
              <Button title="-" />
              <Text>{lastScannedItem.current.count}</Text>
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
