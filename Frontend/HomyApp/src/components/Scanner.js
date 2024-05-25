import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, Button, TouchableOpacity, View, Animated, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Modal from 'react-native-modal';
import { fetchProductCategory } from './api';
import CategoryModal from './modals/CategoryModal';

export default function ScannerScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
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

  const submitProduct = async () => {
    setIsModalVisible(false);

    if (!productName) {
      console.error("Product name is required");
      return;
    }

    try {
      let category;
      if(!productCategory)
      {
        category = await fetchProductCategory(scannedData.data);

        if (category && Object.keys(category).length > 0) {
          ;
        } else {
          console.warn("Category is empty or undefined");
          return;
        }
      }
      else category = productCategory;
    const product = {
      name: productName,
      category: category,
      price: 8.00,
      barcode: scannedData.data 
    };
      const response = await fetch("http://192.168.0.37:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
    } catch (error) {
      console.error("Request failed", error);
    } finally {
      setIsModalVisible(false);
    }
  };

  const cancelSubmission = () => {
    setProductName('');
    setProductCategory('');
    setIsModalVisible(false);
  };

  const handleScanButtonPress = () => {
    setScannedData(null);
  };

  const handleReturnButtonPress = () => {
    setShowScanner(true);
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
      <Modal isVisible={isModalVisible} onBackdropPress={cancelSubmission}>
        <View style={styles.modalContent}>
          <Text>Please enter the product name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            onChangeText={(text) => setProductName(text)}
            value={productName}
          />
          <TextInput
            style={styles.input}
            placeholder="Product Category"
            onChangeText={(text) => setProductCategory(text)}
            value={productCategory}
          />
          <View style={styles.modalButtonContainer}>
            <Button title="Cancel" onPress={cancelSubmission} />
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
    color: '#6200ea',
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
    backgroundColor: '#6200ea',
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
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    width: '100%',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
