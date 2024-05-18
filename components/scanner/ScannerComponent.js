import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, StyleSheet, Platform, Text } from "react-native";
import { Camera } from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";
import {
  BrowserMultiFormatReader,
  NotFoundException,
  ChecksumException,
  FormatException,
} from "@zxing/library";

export default function ScannerComponent({ onBarcodeScanned, style }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [isFocused, setIsFocused] = useState(true);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const codeReader = new BrowserMultiFormatReader();

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, []),
  );

  useEffect(() => {
    if (Platform.OS === "web") {
      const startScanning = async () => {
        try {
          const videoInputDevices = await codeReader.listVideoInputDevices();
          if (videoInputDevices.length > 0) {
            const selectedDeviceId = videoInputDevices[0].deviceId;
            await codeReader.decodeFromVideoDevice(
              selectedDeviceId,
              videoRef.current,
              (result, error) => {
                if (result) {
                  onBarcodeScanned(result.text);
                }
                if (error) {
                  if (
                    error instanceof NotFoundException ||
                    error instanceof ChecksumException ||
                    error instanceof FormatException
                  ) {
                    console.log("No barcode detected.");
                  } else {
                    console.error(error);
                  }
                }
              },
            );
          }
        } catch (error) {
          console.error(error);
        }
      };

      startScanning();

      return () => {
        codeReader.reset();
      };
    } else {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      })();
    }
  }, []);

  useEffect(() => {
    if (!isFocused && cameraRef.current) {
      cameraRef.current.pausePreview();
    } else if (isFocused && cameraRef.current) {
      cameraRef.current.resumePreview();
    }
  }, [isFocused]);

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, style]}>
        <video ref={videoRef} style={styles.video} />
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* {isFocused && (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          ref={cameraRef}
          onBarCodeScanned={(event) => onBarcodeScanned(event.data)}
        />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
