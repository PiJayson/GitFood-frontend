import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal } from 'react-native';
import { theme } from '../../assets/theme';
import Button from '../universal/Button';

const AddRecipeForm = ({ visible, onSubmit, onClose }) => {
  const [recipeName, setRecipeName] = useState('');

  const handleSubmit = () => {
    if (recipeName.trim()) {
      onSubmit(recipeName.trim());
      setRecipeName('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Add a New Recipe</Text>
          <TextInput
            style={styles.input}
            placeholder="Recipe Name"
            value={recipeName}
            onChangeText={setRecipeName}
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
  input: {
    height: 40,
    borderColor: theme.colors.accent,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    color: theme.colors.text,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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

export default AddRecipeForm;
