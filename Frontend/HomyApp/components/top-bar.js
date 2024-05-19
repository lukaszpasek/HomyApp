import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TopBar = ({onScannerPress, onListPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftIcons}>
        <TouchableOpacity onPress={onScannerPress}>
          <TopBarIcon name="scan-outline" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onListPress}>
          <TopBarIcon name="list-outline" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TopBarIcon = ({ name }) => (
  <Icon name={name} size={30} color="#fff" style={styles.icon} />
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3498db',
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 10,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TopBar;
