import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import ScannerComponent from "../../components/scanner/ScannerComponent";
import ProductForm from "../../components/scanner/NewProductForm";
import { useRestApi } from "../../providers/RestApiProvider";
import { syncFridgeStore } from "../../screens/fridge/FridgeStore";
import Button from "../../components/universal/Button";
import IncrementDecrement from "../../components/universal/IncrementDecrement";
import { theme } from "../../assets/theme";

export default function FridgeScannerScreen({ navigation }) {
  const { getProductByBarcode, updateProductQuantity, categoryGetAll, productAdd, categoryGetUnits, getProductSuggestion } = useRestApi();
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
      // Get suggestion about product data.
      const productSuggestion = await getProductSuggestion(scannedData);
      
      let newScannedItem = {
        description: "",
        productName: "",
        categoryName: "",
        productId: -1,
        categoryId: -1,
        barcode: scannedData,
        unit: "amount",
        quantity: 1,
      };

      if (productSuggestion) {
        newScannedItem.description = productSuggestion.product.innerInformation.description;
        newScannedItem.productName = productSuggestion.product.innerInformation.name;
        newScannedItem.categoryName = productSuggestion.category.innerInformation.name;
        newScannedItem.categoryId = productSuggestion.category.id;
        newScannedItem.unit = productSuggestion.category.innerInformation.unit;
      }

      setLastScannedItem(newScannedItem);
      setFormVisible(true);
    }
  };

  const handleAddProduct = async (productData) => {
    const category = categories.find(
      (category) => category.name == productData.categoryName,
    );

    const productId = await productAdd(productData.productName, productData.description, productData.barcode, category.id, productData.quantity);

    const newScannedItem = {
      ...lastScannedItem,
      description: productData.description,
      productName: productData.productName,
      categoryName: productData.categoryName,
      productId: productId,
      categoryId: category.id,
      quantity: productData.quantity,
      unit: category.unit,
    };

    setLastScannedItem(newScannedItem);
    
    syncFridgeStore.addProduct(
      newScannedItem,
      updateProductQuantity,
    );

    setFormVisible(false);
  };

  const updateCount = (change) => {
    if (change == 1) incrementCount();
    if (change == -1) decrementCount();
  }

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
          <View style={styles.productCard}>
            <View style={styles.titleContainer}>
              <Text style={styles.productName}>{lastScannedItem.productName}</Text>
              <IncrementDecrement update={updateCount} />
            </View>
            <Text style={styles.productDescription}>{lastScannedItem.description}</Text>
            <Text style={styles.quantity}>{lastScannedItem.quantity}</Text>
            <ProductForm
              visible={formVisible}
              initialData={lastScannedItem}
              categories={categories}
              units={units}
              onSubmit={handleAddProduct}
              onClose={() => {
                setFormVisible(false);
                setLastScannedItem(null);
              }}
            />
          </View>
        ) : (
          <Text style={styles.noProductText}>No Product Scanned</Text>
        )}
      </View>
      <Button title="Stop Scanning" style={{ maxWidth: 800 }} mode="outlined" onPress={navigation.goBack} >Stop Scanning</Button>
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
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 800,
    width: '90%',
  },
  productCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    minHeight: 150,
    alignItems: 'flex-start',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: '100%',
  },
  productName: {
    fontSize: 32,
    fontWeight: 'bold',
    flex: 1,
  },
  productDescription: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  quantity: {
    position: "absolute",
    top: 70,
    right: 53,
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  noProductText: {
    fontSize: 16,
    color: '#888',
  },
});