import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { theme } from '../../assets/theme';
import Button from '../universal/Button';

const AddStore = ({ visible, onSubmit, onClose }) => {
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    if (visible) {
      setStoreName('');
    }
  }, [visible]);

  const handleSubmit = () => {
    if (storeName.trim()) {
      onSubmit({ name: storeName.trim() });
      setStoreName('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Add New Store</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter store name"
            value={storeName}
            onChangeText={setStoreName}
          />
          <View style={styles.buttonContainer}>
            <Button title="Add" mode="outlined" style={styles.button} textStyle={styles.buttonText} onPress={handleSubmit}>
              Add
            </Button>
            <Button title="Close" mode="outlined" style={styles.cancelButton} onPress={onClose}>
              Close
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    width: '90%',
    maxWidth: 800,
    borderRadius: 30,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    width: '40%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    width: '40%',
  },
  cancelButtonText: {
    color: 'white',
  },
});

export default AddStore;
