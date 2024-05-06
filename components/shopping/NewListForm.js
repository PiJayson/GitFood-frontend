import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Modal, Text } from "react-native";
import { useRestApi } from "../../providers/RestApiProvider";

const NewListForm = ({ visible, onSubmit, onClose }) => {
  const [name, setName] = useState("");

  const { createShoppingList } = useRestApi();

  const handleSubmit = () => {
    onSubmit(name, createShoppingList);
    setName("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Add New List</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    borderRadius: 10,
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default NewListForm;
