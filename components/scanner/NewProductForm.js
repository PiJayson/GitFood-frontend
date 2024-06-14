import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { theme } from '../../assets/theme';
import Button from "../universal/Button";
import TextInput from "../universal/TextInput";

const ProductForm = ({
  visible,
  onSubmit,
  onClose,
  categories = [],
  initialData = {},
}) => {
  const [productName, setProductName] = useState(initialData.productName || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [barcode, setBarcode] = useState(initialData.barcode || "");
  const [quantity, setQuantity] = useState(initialData.quantity || "");
  const [categoryName, setCategoryName] = useState(initialData.categoryName || "");
  const [filteredOptions, setFilteredOptions] = useState(categories);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setProductName(initialData.productName || "");
    setDescription(initialData.description || "");
    setBarcode(initialData.barcode || "");
    setQuantity(initialData.quantity || "");
    setCategoryName(initialData.categoryName || "");
  }, [initialData]);

  const validateFields = () => {
    const newErrors = {};
    if (!productName) newErrors.productName = "Product name is required";
    if (!description) newErrors.description = "Description is required";
    if (!barcode) newErrors.barcode = "Barcode is required";
    if (!quantity) newErrors.quantity = "Quantity is required";
    if (!categoryName) newErrors.categoryName = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      onSubmit({
        productName,
        description,
        barcode,
        quantity,
        categoryName,
      });
      setProductName("");
      setDescription("");
      setBarcode("");
      setQuantity("");
      setCategoryName("");
    }
  };

  const handleCategoryInput = (text) => {
    setCategoryName(text);
    setFilteredOptions(
      categories.filter((option) =>
        option.name.toLowerCase().includes(text.toLowerCase()),
      ),
    );
    setShowDropdown(true);
  };

  const selectCategory = (option) => {
    setCategoryName(option.name);
    setShowDropdown(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>
            {initialData.productId === -1 ? "Add New Product" : "Edit Product"}
          </Text>
          <TextInput
            label="Name"
            value={productName}
            onChangeText={setProductName}
            errorText={errors.productName}
          />
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            errorText={errors.description}
          />
          <TextInput
            label="Barcode"
            value={barcode}
            onChangeText={setBarcode}
            errorText={errors.barcode}
          />
          <TextInput
            label="Quantity"
            value={quantity}
            onChangeText={(text) => setQuantity(Number(text))}
            keyboardType="numeric"
            errorText={errors.quantity}
          />
          <TextInput
            label="Category"
            value={categoryName}
            onChangeText={handleCategoryInput}
            errorText={errors.categoryName}
          />
          {showDropdown && (
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectCategory(item)}>
                  <Text style={styles.dropdownItem}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={styles.dropdown}
            />
          )}
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdown: {
    backgroundColor: "white",
    maxHeight: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
  },
  dropdownItem: {
    padding: 10,
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

export default ProductForm;
