import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package
import { theme } from '../../assets/theme';
import { useRestApi } from '../../providers/RestApiProvider';
import Button from '../universal/Button';

const FinishTransactionForm = ({ visible, onSubmit, onClose, syncStore }) => {
  const [selectedFridge, setSelectedFridge] = useState(null);

  const fridges = syncStore.stores();

  const { getFridges } = useRestApi();

  useEffect(() => {
    syncStore.loadStores(getFridges);
    setSelectedFridge(null);
  }, [visible]);

  const handleSelectFridge = (fridge) => {
    setSelectedFridge(fridge);
  };

  const handleSubmit = () => {
    onSubmit(selectedFridge);
    setSelectedFridge(null);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Select a Fridge</Text>
          <FlatList
            data={fridges}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.fridgeItem,
                  selectedFridge && selectedFridge.id === item.id && styles.selectedFridge,
                ]}
                onPress={() => handleSelectFridge(item)}
              >
                <Text style={styles.fridgeName}>{item.name}</Text>
                {selectedFridge && selectedFridge.id === item.id && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} style={styles.icon} />
                )}
              </TouchableOpacity>
            )}
          />
          <View style={styles.buttonContainer}>
            <Button title="Finish" mode="outlined" style={styles.button} textStyle={styles.buttonText} onPress={handleSubmit}>
              Finish
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
  fridgeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
  },
  selectedFridge: {
    backgroundColor: theme.colors.accentLight,
  },
  fridgeName: {
    fontSize: 16,
    color: theme.colors.text,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  icon: {
    marginLeft: 10,
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

export default FinishTransactionForm;
