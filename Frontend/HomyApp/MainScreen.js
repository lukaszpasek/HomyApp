import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import ScannedList from './src/screens/ScannedList'; // Import komponentu ScannedList

export default function MainScreen() {
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

  const handleBarCodeScanned = ({ type, data }) => {
    setScannedData({ type, data });
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  const handleOKButtonPress = () => {
    setScannedData(null);
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

  const handleReturnButtonPress = () => {
    setShowScanner(true); // Ustawiamy showScanner na true, aby powrócić do widoku skanowania
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
      <Text style={styles.title}>Welcome to the Barcode Scanner App!</Text>
      <Text style={styles.paragraph}>Scan a barcode to start your job.</Text>
      {showScanner ? renderCamera() : <ScannedList data={[scannedData]} onReturnButtonPress={handleReturnButtonPress} />}
      <TouchableOpacity
        style={[styles.button, { transform: [{ scale: buttonPressAnimation }] }]}
        onPress={handleButtonPress}
        disabled={scannedData}
      >
        <Pressable style={styles.button} onPress={handleOKButtonPress}>
          <Text style={styles.text}>Scan QR to Start your job</Text>
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
