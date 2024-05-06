import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ScannerComponent from "../../components/scanner/ScannerComponent";
import BackButton from "../../components/universal/BackButton";
import ProductForm from "../../components/scanner/ProductForm";
import { useRestApi } from "../../providers/RestApiProvider";
import { syncShoppingStore } from "../../screens/shopping/ShoppingStore";

export default function FridgeScannerScreen({ navigation }) {
  const { getProductByBarcode, updateShoppingListQuantity, categoryGetAll, productAdd } = useRestApi();
  const [formVisible, setFormVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const lastScannedItem = useRef(null);
  const [initialData, setInitialData] = useState({});
  const [, forceUpdate] = useState();
  const update = () => forceUpdate({});
  
  const products = syncShoppingStore.products();

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

    if (productInDatabase) {
      const productFromFridge = products.find(
        (product) => product.categoryId == productInDatabase.category.id,
      );

      console.log("productFromFridge", products, productFromFridge);

      if (productFromFridge) {
        lastScannedItem.current = productFromFridge; // Set with .current
      } else {
        lastScannedItem.current = {
          name: productInDatabase.category.innerInformation.name,
          description: "",
          productId: productInDatabase.product.id,
          categoryId: productInDatabase.category.id,
          quantity: 1,
          barcode: scannedData,
          unit: "amount",
          quantity: 1,
        };

        syncShoppingStore.addProduct(
          lastScannedItem.current,
          updateShoppingListQuantity,
        );
      }
    } else {
      lastScannedItem.current = {
        name: "",
        description: "",
        barcode: scannedData,
        productId: -1,
        categoryId: 1,
        unit: "amount",
        quantity: 1,
      };
      setInitialData(lastScannedItem.current);
      setFormVisible(true);
    }
    update();
  };

  const handleAddProduct = async (productData) => {
    console.log("Product Added:", productData);

    const productId = await productAdd(productData.name, productData.description, productData.barcode, 1, productData.quantity);
    
    lastScannedItem.current = {
      ...lastScannedItem.current,
      name: productData.category,
      productId: productId
    };

    const productFromFridge = products.find(
      (product) => product.categoryId == 1,
    );
    
    if (productFromFridge) {
      const prevItem = lastScannedItem.current;

      lastScannedItem.current = {
      ...lastScannedItem.current,
      quantity: lastScannedItem.current.quantity + productData.quantity, // Update with .current
    };

    syncShoppingStore.updateProduct(
      prevItem,
      lastScannedItem.current,
      updateShoppingListQuantity,
    );
    }
    else {
      syncShoppingStore.addProduct(
        lastScannedItem.current,
        updateShoppingListQuantity,
      );
    }

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
    syncShoppingStore.updateProduct(
      prevItem,
      lastScannedItem.current,
      updateShoppingListQuantity,
    );

    update();
  };

  const decrementCount = () => {
    prevItem = lastScannedItem.current;
    lastScannedItem.current = {
      ...lastScannedItem.current,
      quantity: Math.max(0, lastScannedItem.current.quantity - 1), // Update with .current
    };

    syncShoppingStore.updateProduct(
      prevItem,
      lastScannedItem.current,
      updateShoppingListQuantity,
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
              <ProductForm
                visible={formVisible}
                initialData={initialData}
                categories={categories.map(category => category.name)}
                units={["ml", "l", "dl", "mg", "g", "kg", "amount"]}
                onSubmit={handleAddProduct}
                onClose={() => {setFormVisible(false), lastScannedItem.current = null;}}
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
