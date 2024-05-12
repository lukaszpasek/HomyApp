import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import db from './db_config';

const App = () => {
  const [productName, setProductName] = useState('');
  const [shoppingList, setShoppingList] = useState([]);

  const handleAddProduct = async () => {
    if (productName.trim() !== '') {
      try {
        await db.none('INSERT INTO products (name) VALUES ($1)', [productName]);
        setShoppingList([...shoppingList, productName]);
        setProductName('');
      } catch (error) {
        console.error('Błąd podczas zapisywania produktu:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grocy</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={productName}
        onChangeText={setProductName}
      />
      <Button title="Add" onPress={handleAddProduct} />
      <Text style={styles.subtitle}>Shopping List:</Text>
      {shoppingList.map((product, index) => (
        <Text key={index} style={styles.product}>
          {product}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  product: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default App;
