import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  BrowserMultiFormatReader,
  NotFoundException,
  ChecksumException,
  FormatException,
} from "@zxing/library";

export default function ScannerComponent({ onBarcodeScanned, style }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isFocused, setIsFocused] = useState(true);
  const [facing, setFacing] = useState("back");
  const [cameraDevices, setCameraDevices] = useState([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const codeReader = new BrowserMultiFormatReader();

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, []),
  );

  const toggleFacingZxing = () => {
    setCurrentDeviceIndex(
      (prevIndex) => (prevIndex + 1) % cameraDevices.length,
    );
  };

  const toggleFacingExpo = () => {
    setFacing((prevFacing) => (prevFacing === "back" ? "front" : "back"));
  };

  useEffect(() => {
    if (Platform.OS === "web") {
      const startScanning = async () => {
        try {
          const videoInputDevices = await codeReader.listVideoInputDevices();
          setCameraDevices(videoInputDevices);

          if (videoInputDevices.length > 0) {
            const selectedDeviceId =
              videoInputDevices[currentDeviceIndex].deviceId;
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

        // setHasPermission(status === "granted");
      })();
    }
  }, [currentDeviceIndex]);

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
        <TouchableOpacity
          style={styles.switchButton}
          onPress={toggleFacingZxing}
        >
          <Ionicons name="camera-reverse" size={30} color="white" />
        </TouchableOpacity>
        <video ref={videoRef} style={styles.video} />
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.switchButton} onPress={toggleFacingExpo}>
        <Ionicons name="camera-reverse" size={30} color="white" />
      </TouchableOpacity>
      {isFocused && (
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={(event) => onBarcodeScanned(event.data)}
        />
      )}
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
  switchButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 10,
    zIndex: 1,
  },
});
