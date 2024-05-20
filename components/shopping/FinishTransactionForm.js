import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Modal } from 'react-native';
import { theme } from '../../assets/theme';
import { useRestApi } from '../../providers/RestApiProvider';

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
    if (selectedFridge) {
      onSubmit(selectedFridge);
      setSelectedFridge(null);
    }
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
              </TouchableOpacity>
            )}
          />
          <Button title="Finish" onPress={handleSubmit} />
          <Button title="Cancel" color="red" onPress={onClose} />
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
    borderRadius: 10,
  },
  fridgeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
  },
  selectedFridge: {
    backgroundColor: theme.colors.accent,
  },
  fridgeName: {
    fontSize: 16,
    color: theme.colors.text,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default FinishTransactionForm;
