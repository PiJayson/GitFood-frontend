import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, Text, FlatList, TouchableOpacity, Picker } from 'react-native';

const ProductForm = ({ visible, onSubmit, onClose, categories = [], units = [], initialData = {} }) => {
  const [productName, setProductName] = useState(initialData.productName || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [barcode, setBarcode] = useState(initialData.barcode || '');
  const [quantity, setQuantity] = useState(initialData.quantity || '');
  const [categoryName, setCategoryName] = useState(initialData.categoryName || '');
  const [unit, setUnit] = useState(initialData.unit || units[0] || '');
  const [filteredOptions, setFilteredOptions] = useState(categories);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setProductName(initialData.productName || '');
    setDescription(initialData.description || '');
    setBarcode(initialData.barcode || '');
    setQuantity(initialData.quantity || '');
    setCategoryName(initialData.categoryName || '');
    setUnit(initialData.unit || units[0] || '');
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit({ productName, description, barcode, quantity, categoryName, unit });
    setProductName('');
    setDescription('');
    setBarcode('');
    setQuantity('');
    setCategoryName('');
    setUnit(units[0] || '');
  };

  const handleCategoryInput = (text) => {
    setCategoryName(text);
    setFilteredOptions(
      categories.filter(option => 
        option.toLowerCase().includes(text.toLowerCase())
      )
    );
    setShowDropdown(true);
  };

  const selectCategory = (option) => {
    setCategoryName(option);
    setShowDropdown(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>{initialData.productId == -1 ? 'Add New Product' : 'Edit Product'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={productName}
            onChangeText={setProductName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Barcode"
            value={barcode}
            onChangeText={setBarcode}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={quantity}
            onChangeText={(text) => setQuantity(Number(text))}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={categoryName}
            onChangeText={handleCategoryInput}
          />
          {showDropdown && (
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectCategory(item)}>
                  <Text style={styles.dropdownItem}>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.dropdown}
            />
          )}
          <Picker
            selectedValue={unit}
            style={styles.input}
            onValueChange={(itemValue) => setUnit(itemValue)}
          >
            {units.map((unit) => (
              <Picker.Item label={unit} value={unit} key={unit} />
            ))}
          </Picker>
          <Button title="Save" onPress={handleSubmit} />
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
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  dropdown: {
    backgroundColor: 'white',
    maxHeight: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
  },
  dropdownItem: {
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ProductForm;
