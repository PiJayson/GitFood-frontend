import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Modal, Text, Button, TextInput, Searchbar } from "react-native-paper";
import { getCategorySuggestion } from "../../providers/ReactQueryProvider";
import SimpleList from "../universal/SimpleList";
import { useEffect } from "react";
import { useDeferredValue } from "react";

const NewIngredientInSearchForm = ({ visible, onSubmit, onClose }) => {
  const [search, setSearch] = useState("");

  const searchValue = useDeferredValue(search, { timeoutMs: 3000 });
  const { data } = getCategorySuggestion(searchValue);
  // console.log("data@!:", data);

  // if (data) {
  //   data.map((item) => {
  //     console.log(item);
  //     console.log(typeof item.id);
  //   });
  // }

  const dataArr = data
    ? data.map((item) => {
        return {
          id: item.id,
          name: item.innerInformation.name,
          description: item.innerInformation.description,
        };
      })
    : [];

  // console.log("dataArr@!:", dataArr);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => {
        onClose();
        console.log("close request");
      }}
      onBackdropPress={() => {
        onClose();
        console.log("backdrop pressed");
      }}
      onDismiss={() => {
        onClose();
        console.log("dismissed");
      }}
      style={styles.modal}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.header}>Add ingredient to search</Text>
        <View style={styles.search}>
          {/* <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          /> */}
          <Searchbar
            placeholder="Ingredient name"
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          ></Searchbar>
          {data && (
            <FlatList
              data={dataArr}
              renderItem={({ item }) => (
                <Button
                  color="green"
                  mode="outlined"
                  onPress={() => onSubmit(item)}
                  style={styles.category}
                >
                  {item.name}
                </Button>
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flexDirection: "column",
    position: "absolute",
    flex: 0,
    marginTop: 10,
    minWidth: 400,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  modalContainer: {
    minWidth: 400,
    flex: 0,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "90%",
    borderRadius: 10,
    padding: 20,
    // minHeight: 400,
  },
  search: {
    maxHeight: 300,
    minHeight: "60%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    minWidth: "90%",
    maxWidth: "90%",
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  category: {
    margin: 5,
    maxWidth: "90%",
    minWidth: "90%",
  },
});

export default NewIngredientInSearchForm;
