import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [getBarcodeVar, setBarcode] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    if (getBarcodeVar) {
      getBarcodeFromDatabase(data);
    }
    else {
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);

      sendBarcodeToBackend(data);
    }
    
  };

  const getBarcode = async () => {
    setBarcode(true);
    setScanned(false);
  }

  const getBarcodeFromDatabase = async (barcodeData) => {
    try {
      let response = await fetch(`https://gitfood.fun/barcode/get?barcodeNumber=${barcodeData}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      let responseJson = await response.json();
      
      alert('data: ' + JSON.stringify(responseJson));
    } catch (error) {      
      alert('server is not working')
    }
}

  // Function to send barcode data to the backend
  const sendBarcodeToBackend = async (barcodeData) => {
    try {
		console.log(barcodeData);
      let response = await fetch('https://52.169.1.1:5250/barcode/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          barcodeNumber: barcodeData,
          productId: 1,
        }),
      });
      // let responseJson = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting for camera permission</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}>
      </Camera>
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => {setScanned(false); setBarcode(false);}} />}
      {scanned && <Button title={'Tap to Get Barcode Info'} onPress={() => getBarcode()} />}
      <Button title={'Flip Camera'} onPress={() => {
        setType(
          type === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back
        );
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  camera: {
    flex: 1,
  }
});
