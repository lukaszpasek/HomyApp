import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, Button, TouchableOpacity, View, Animated, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Modal from 'react-native-modal';
import ScannedList from '../screens/ScannedList'; 


export default function ScannerScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [buttonPressAnimation] = useState(new Animated.Value(1));
  const [showScanner, setShowScanner] = useState(true); // Stan określający, czy wyświetlać skaner

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setIsModalVisible(true);
    setScannedData({ type, data });
};

  const submitProduct = () => {
    if (!productName) {
        console.error("Product name is required");
        return;
    }

    const product = {
        name: productName,
        price: 8.00,
        barcode: scannedData.data // Assuming you want to include the scanned barcode
    };

    const request = new Request("http://192.168.0.37:5000/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product),
    });

    fetch(request)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.text().then(text => {
                    throw new Error(`Error ${response.status}: ${text}`);
                });
            }
        })
        .then((response) => {
            console.debug(response);
            // …
        })
        .catch((error) => {
            console.error("Request failed", error);
        });

    setIsModalVisible(false);
};



  const handleScanButtonPress = () => {
    setScannedData(null);
  };
  const handleReturnButtonPress = () => {
    setShowScanner(true); // Ustawiamy showScanner na true, aby powrócić do widoku skanowania
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scannedData ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      </View>
    );
  };

  const handleButtonPress = () => {
    setScannedData(null);
    Animated.sequence([
      Animated.timing(buttonPressAnimation, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonPressAnimation, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleView = () => {
    setShowScanner(prevState => !prevState); // Przełączamy stan showScanner
  };



  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <Modal visible={isModalVisible} transparent animationType="slide">
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 20, width: '80%', alignItems: 'center' }}>
                    <Text>Please enter the product name:</Text>
                    <TextInput
                        style={{ marginTop: 10, marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 10, borderColor: '#ccc', width: '100%' }}
                        placeholder="Product Name"
                        onChangeText={(text) => setProductName(text)}
                        value={productName}
                    />
                    <Button title="Submit" onPress={submitProduct} />
                </View>
            </View>
        </Modal>
      <Text style={styles.title}>Welcome to the HomyApp!</Text>
      <Text style={styles.paragraph}>Scan a barcode to add new product.</Text>
      {showScanner ? renderCamera() : <ScannedList data={[scannedData]} onReturnButtonPress={handleReturnButtonPress} />}
      <TouchableOpacity
        style={[styles.button, { transform: [{ scale: buttonPressAnimation }] }]}
        onPress={handleButtonPress}
        disabled={scannedData}
      >
        <Pressable style={styles.button} onPress={handleScanButtonPress}>
          <Text style={styles.text}>Scan QR</Text>
        </Pressable>
      </TouchableOpacity>
      {showScanner ? (
        <TouchableOpacity style={styles.toggleButton} onPress={toggleView}>
          <Text style={styles.toggleButtonText}>Show List</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.toggleButton} onPress={handleReturnButtonPress}>
          <Text style={styles.toggleButtonText}>Return to Scanner</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'blue',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 40,
  },
  cameraContainer: {
    width: '80%',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  toggleButton: {
    marginTop: 20,
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
