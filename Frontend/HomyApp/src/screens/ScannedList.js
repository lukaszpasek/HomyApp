import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const ScannedList = ({ data, onReturnButtonPress }) => {
  if (!data) {
    return null; // Zwracamy null, jeśli data ma wartość null
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanned QR Codes:</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Type: {item.type}</Text>
            <Text>Data: {item.data}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity style={styles.toggleButton} onPress={onReturnButtonPress}>
        <Text style={styles.toggleButtonText}>Return to Scanner</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Dodaj flex: 1, aby zajmować całą dostępną przestrzeń na ekranie
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  toggleButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScannedList;
