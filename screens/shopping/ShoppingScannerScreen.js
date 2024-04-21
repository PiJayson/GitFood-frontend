import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import ScannerComponent from '../../components/scanner/ScannerComponent';
import BackButton from "../../components/universal/BackButton";

export default function ShoppingScannerScreen({ navigation }) {
  const [lastScannedItem, setLastScannedItem] = useState(null);
  const [itemCount, setItemCount] = useState(0);

  const handleBarcodeDetected = (scannedData) => {
    console.log("scanned")
    setLastScannedItem(scannedData);
    setItemCount(1);
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
              <Button title="+" onPress={() => setItemCount(itemCount + 1)} />
              <Text>{itemCount}</Text>
              <Button title="-" onPress={() => setItemCount(Math.max(0, itemCount - 1))} />
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