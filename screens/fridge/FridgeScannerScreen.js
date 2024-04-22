import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import ScannerComponent from '../../components/scanner/ScannerComponent';
import BackButton from "../../components/universal/BackButton";
import ProductForm from '../../components/scanner/ProductForm';
import RestApiService from '../../services/RestApiService';

export default function FridgeScannerScreen({ navigation, route }) {
  const [formVisible, setFormVisible] = useState(false);
  const [lastScannedItem, setLastScannedItem] = useState(null);

  const { dispatch, getProduct } = route.params;

  const handleBarcodeDetected = async (scannedData) => {
    console.log(lastScannedItem)
    if (lastScannedItem && lastScannedItem.barcode == scannedData)
    {
      console.log("SCNANNED")
      return;
    }
    const productInDatabase = await RestApiService.getProductByBarcode(scannedData);
    const productFromFridge = getProduct(scannedData);

    console.log(scannedData);
    console.log(productInDatabase);
    console.log(productFromFridge);
    
    if (productInDatabase)
    {
      if (productFromFridge)
      {
        setLastScannedItem(product);
      }
      else
      {
        setLastScannedItem({
          name: productInDatabase.product.innerInformation.name,
          count: 1,
          barcode: scannedData
        })
        
        dispatch({
          type: "ADD_PRODUCT",
          product: {
              name: productInDatabase.product.innerInformation.name,
              count: 1,
              barcode: scannedData,
        }});
      }
    }
    else
    {
        setLastScannedItem({
            name: "",
            count: 1,
            barcode: scannedData
        })
        setFormVisible(true);
    }
  };

  const handleAddProduct = async (productData) => {
    console.log('Product Added:', productData);

    dispatch({
        type: "ADD_PRODUCT",
        product: {
            name: productData.name,
            count: lastScannedItem.count,
            barcode: lastScannedItem.barcode,
    }});

    const response = await RestApiService.addProductWithBarcode(lastScannedItem.barcode, productData.name, productData.description);
    
    console.log(response);
    
    setFormVisible(false);
  };

  const incrementCount = () => {
    setLastScannedItem(prevItem => ({
      ...prevItem,
      count: prevItem.count + 1
    }));

    dispatch({
      type: "UPDATE_PRODUCT",
      product: lastScannedItem,
    });
  };

  const decrementCount = () => {
    setLastScannedItem(prevItem => ({
      ...prevItem,
      count: Math.max(0, prevItem.count - 1)
    }));

    dispatch({
      type: "UPDATE_PRODUCT",
      product: lastScannedItem,
    });
  };

  return (
    <View style={styles.container}>
      <BackButton goBack={navigation.goBack} />
      <ScannerComponent onBarcodeScanned={handleBarcodeDetected} />
      <View style={styles.productDetails}>
        {lastScannedItem ? (
          <View>
            <Text>{lastScannedItem.name}</Text>
            <View style={styles.buttonContainer}>
              <Button title="-" onPress={decrementCount} />
              <Text>{lastScannedItem.count}</Text>
              <Button title="+" onPress={incrementCount} />
            </View>
            <View>
              <Button title="Edit Product" onPress={() => setFormVisible(true)} />
              <ProductForm
                visible={formVisible}
                initialData={lastScannedItem}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 100,
  },
});
