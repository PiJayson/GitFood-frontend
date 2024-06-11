import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../assets/theme';
import { useRestApi } from '../../providers/RestApiProvider';
import Button from '../universal/Button';

const AddCategoryToShoppingList = ({ visible, onSubmit, onClose, syncStore }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const [categories, setCategories] = useState([]);

  const { categoryGetAll } = useRestApi();

  useEffect(() => {
    setSelectedCategory(null);
    setQuantity(1);
  }, [visible]);

  useEffect(() => {
    if (!categories) return;

    setFilteredCategories(
        categories.filter(category =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
  }, [searchTerm]);

  useEffect(() => {
    const fetchCategories = async () => {
      const resCategories = await categoryGetAll();
      
      setCategories(resCategories);
    };

    fetchCategories();
  }, [categoryGetAll]);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleSubmit = () => {
    if (selectedCategory && quantity > 0) {
      onSubmit(selectedCategory, quantity);
      setSelectedCategory(null);
      setQuantity(1);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Select a Category</Text>
          <TextInput
            style={styles.searchBar}
            placeholder="Search by name"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <FlatList
            data={filteredCategories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  selectedCategory && selectedCategory.id === item.id && styles.selectedCategory,
                ]}
                onPress={() => handleSelectCategory(item)}
              >
                <Text style={styles.categoryName}>{item.name}</Text>
                {selectedCategory && selectedCategory.id === item.id && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} style={styles.icon} />
                )}
              </TouchableOpacity>
            )}
          />
          {selectedCategory && (
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantity:</Text>
              <TextInput
                style={styles.quantityInput}
                keyboardType="numeric"
                value={quantity.toString()}
                onChangeText={(text) => setQuantity(Number(text))}
              />
              <Text style={styles.unitText}>{selectedCategory.unit}</Text>
            </View>
          )}
          <View style={styles.buttonContainer}>
            <Button title="Add New Category" mode="outlined" style={styles.button} textStyle={styles.buttonText} onPress={handleSubmit}>
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
  searchBar: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
    fontSize: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
  },
  selectedCategory: {
    backgroundColor: theme.colors.accentLight,
  },
  categoryName: {
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  quantityInput: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
    width: 80,
    textAlign: 'center',
    marginRight: 10,
  },
  unitText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    width: '30%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    width: '30%',
  },
  cancelButtonText: {
    color: 'white',
  },
});

export default AddCategoryToShoppingList;
