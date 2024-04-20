// ScannerScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { initScannerService, stopScannerService } from '../services/ScannerService';
import RestApiService from '../services/RestApiService';
import ProductForm from './ProductForm';
import { AuthContext } from "../utils/contexts/AuthContext";

const ScannerScreen = () => {
  const [scanned, setScanned] = useState(false);
  const [barcodeResult, setBarcodeResult] = useState('');
  const [isBarcodeFound, setIsBarcodeFound] = useState(true);
  const scannerRef = useRef(null);
  const { call } = React.useContext(AuthContext);

  const onDetected = async (data) => {
    const barcode = data.codeResult.code;
    const barcodeData = await RestApiService.getBarcodeData(barcode);
    setScanned(true);
    if (barcodeData) {
      setBarcodeResult(JSON.stringify(barcodeData));
      setIsBarcodeFound(true);
    } else {
      setBarcodeResult(barcode);
      setIsBarcodeFound(false);
    }
    stopScannerService();
  };

  useEffect(() => {
    if (scannerRef.current) {
      initScannerService(scannerRef.current, onDetected);
    }
    return () => stopScannerService();
  }, [scannerRef.current]);

  const handleSaveProduct = async (barcode, productName) => {
    await RestApiService.setBarcode(barcode, productName);
    setIsBarcodeFound(true);
    setBarcodeResult(JSON.stringify({ barcode, productName }));
  };

  return (
    <View ref={scannerRef} style={styles.container}>
      {scanned && isBarcodeFound && (
        <Text style={styles.text}>Result: {barcodeResult}</Text>
      )}
      {scanned && !isBarcodeFound && (
        <ProductForm barcode={barcodeResult} onSave={handleSaveProduct} />
      )}
      <Button title={'Scan Again'} onPress={() => {
        setScanned(false);
        stopScannerService();
        if (scannerRef.current) {
          initScannerService(scannerRef.current, onDetected);
        }
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanner: {
    width: '100%',
    height: '50%',
    backgroundColor: 'gray',
  },
  text: {
    margin: 20,
  },
});

export default ScannerScreen;
