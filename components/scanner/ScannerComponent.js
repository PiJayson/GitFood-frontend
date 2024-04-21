import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { BrowserMultiFormatReader, NotFoundException, ChecksumException, FormatException } from '@zxing/library';

export default function ScannerComponent({ onBarcodeScanned, style }) {
  const videoRef = useRef(null);
  const codeReader = new BrowserMultiFormatReader();

  useEffect(() => {
    if (Platform.OS === 'web') {
      const startScanning = async () => {
        try {
          const videoInputDevices = await codeReader.listVideoInputDevices();
          if (videoInputDevices.length > 0) {
            const selectedDeviceId = videoInputDevices[0].deviceId;
            await codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, error) => {
              if (result) {
                onBarcodeScanned(result.text);
              }
              if (error) {
                if (error instanceof NotFoundException ||
                    error instanceof ChecksumException ||
                    error instanceof FormatException) {
                  
                    console.log('No barcode detected.');
                } else {
                  console.error(error);
                }
              }
            });
          }
        } catch (error) {
          console.error(error);
        }
      };

      startScanning();

      return () => {
        codeReader.reset();
      };
    }
  }, []);

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text>Barcode scanning is not available on native platforms.</Text>
      </View>
    );
  } else {
    return (
      <View style={[styles.container, style]}>
        <video ref={videoRef} style={styles.video} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
