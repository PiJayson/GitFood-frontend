import React, { useDeferredValue, useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import OutsidePressHandler, { EventProvider } from "react-native-outside-press";
import { Button, Searchbar, Text, TextInput } from "react-native-paper";
import { theme } from "../../assets/theme";
import { getCategorySuggestion } from "../../providers/ReactQueryProvider";
import SimpleList from "../universal/SimpleList";
import { syncShoppingStore } from "../../screens/shopping/ShoppingStore";
import ExpandableList from "../universal/ExpandableList";
import { useRestApi } from "../../providers/RestApiProvider";

const ShoppingForm = ({ visible, onClose, ingredient }) => {
  const { getShoppingProducts, updateShoppingListQuantity } = useRestApi();
  const [quantity, setQuantity] = useState(
    ingredient ? ingredient.quantity : 0,
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <EventProvider style={{ flex: 1 }}>
        <View style={styles.modalContainer}>
          {/* <KeyboardAvoidingView behavior="height" style={styles.modalContainer}> */}
          <OutsidePressHandler onOutsidePress={onClose} style={{ flex: 1 }}>
            <Text style={styles.header}>Add ingredient to shopping list</Text>
            <View style={styles.search}>
              <ExpandableList
                items={syncShoppingStore.stores()}
                onSelect={(item) =>
                  syncShoppingStore.setStore(item, getShoppingProducts)
                }
              />
              <TextInput
                style={styles.productQuantity}
                value={String(quantity)}
                keyboardType="numeric"
                onChangeText={(newQuantityText) => {
                  const newQuantity = parseInt(newQuantityText, 10);
                  setQuantity(newQuantity);
                }}
              />
              <Button
                mode="contained"
                onPress={() => {
                  syncShoppingStore.addProduct(
                    {
                      ...ingredient,
                      quantity,
                    },
                    updateShoppingListQuantity,
                  );
                  onClose();
                }}
              >
                Add to shopping list
              </Button>
            </View>
          </OutsidePressHandler>
          {/* </KeyboardAvoidingView> */}
        </View>
      </EventProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    height: "69%",
    width: "100%",
    backgroundColor: theme.colors.background,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    flexDirection: "column",
    bottom: 0,
    justifyContent: "flex-end",
    alignContent: "center",
  },
  search: {
    flex: 1,
  },
  categories: {
    flex: 1,
  },
  input: {},
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
    margin: 10,
  },
  category: {
    margin: 5,
  },
});

export default ShoppingForm;
