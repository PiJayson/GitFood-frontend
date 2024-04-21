import React, { useEffect, useRef } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import Quagga from 'quagga';
import { Camera } from 'expo-camera';

export default function ScannerComponent({ onBarcodeScanned, style }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    Quagga.init({
      inputStream: {
        type: "LiveStream",
        constraints: {
          facingMode: "environment"
        },
        target: scannerRef.current,
      },
      decoder: {
        readers: [
          "code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader",
          "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader"
        ],
      }
    }, function(err) {
      if (err) {
        console.log(err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((data) => {
      onBarcodeScanned(data.codeResult.code);
    });

    return () => Quagga.stop();
  }, []);

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Camera
          style={styles.preview}
          onBarCodeRead={(e) => onBarcodeScanned(e.data)}
          captureAudio={false}
        />
      </View>
    );
  } else {
    return (
      <View ref={scannerRef} style={[styles.container, style]}></View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "75%",
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
