import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import Quagga from 'quagga';

const ScannerScreen = () => {
  const [scanned, setScanned] = useState(false);
  const [barcodeResult, setBarcodeResult] = useState('');

  function initQuagga() {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#scanner-container'),
        constraints: {
          facingMode: "environment",
        },
      },
      decoder: {
        readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader"],
      },
      locate: true,
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      Quagga.start();
    });
  
    Quagga.onDetected((data) => {
      setBarcodeResult(data.codeResult.code);
      setScanned(true);
      Quagga.stop();
    });
  }
  

  useEffect(() => {
    initQuagga();
  
    return () => {
      Quagga.offDetected();
      Quagga.stop();
    };
  }, []);
  

  return (
    <View id="scanner-container" style={styles.container}>
      {scanned && (
        <Text style={styles.text}>Result: {barcodeResult}</Text>
      )}
      <Button title={'Scan Again'} onPress={() => {
        setScanned(false);
        Quagga.stop();
        Quagga.offDetected();
        initQuagga();
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
