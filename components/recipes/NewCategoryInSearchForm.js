import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Modal, Text, Button, TextInput } from "react-native-paper";
import { getFoodCategoriesSuggestion } from "../../providers/ReactQueryProvider";
import SimpleList from "../universal/SimpleList";
import { useEffect } from "react";

const NewCategoryInSearchForm = ({ visible, onSubmit, onClose }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    onSubmit(name, createFridge);
    setName("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Add category to search</Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={{ minHeight: 80 }}>
            {/* {suggestions > 0 && (
              <View style={{ zIndex: 2 }}>
                <SimpleList items={suggestions} onSelect={handleSubmit} />
              </View>
            )} */}
            <Button title="Save" onPress={handleSubmit} />
            <Button title="Cancel" color="red" onPress={onClose} />
          </View>
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
    height: 600,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    borderRadius: 10,
    minHeight: 400,
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

export default NewCategoryInSearchForm;
