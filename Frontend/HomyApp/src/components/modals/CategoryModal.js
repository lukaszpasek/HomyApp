import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { StyleSheet, Text, TextInput, Button, TouchableOpacity, View, Animated, Pressable } from 'react-native';

const CategoryModal = ({ isVisible, onSubmit, onCancel }) => {
    const [inputCategory, setInputCategory] = useState('');

    const handleInputChange = (e) => {
        setInputCategory(e.target.value);
    };

    const handleSubmit = () => {
        onSubmit(inputCategory);
    };

    return (
        <View style={styles.modalContent}>
          <Text>Please enter the product name:</Text>
        </View>
    );
};

export default CategoryModal;


const styles = StyleSheet.create({
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
  });
  