import React, { useState } from "react";
import { View, StyleSheet, FlatList, Modal } from "react-native";
import { Text, Button, TextInput, Searchbar } from "react-native-paper";
import { getCategorySuggestion } from "../../providers/ReactQueryProvider";
import SimpleList from "../universal/SimpleList";
import { useEffect } from "react";
import { useDeferredValue } from "react";
import { theme } from "../../assets/theme";
import OutsidePressHandler, { EventProvider } from "react-native-outside-press";

const NewIngredientInSearchForm = ({
  visible,
  onSubmit,
  onClose,
  selected,
}) => {
  const [search, setSearch] = useState("");

  const searchValue = useDeferredValue(search, { timeoutMs: 3000 });
  const { data } = getCategorySuggestion({
    search: searchValue,
    count: 10 + selected.length,
  });
  // console.log("data@!:", data);

  // if (data) {
  //   data.map((item) => {
  //     console.log(item);
  //     console.log(typeof item.id);
  //   });
  // }

  const dataArr = data
    ? data
        .filter((item) => !selected.includes(item.id))
        .map((item) => {
          return {
            id: item.id,
            name: item.innerInformation.name,
            description: item.innerInformation.description,
          };
        })
        .slice(0, 10)
    : [];

  // console.log("dataArr@!:", dataArr);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <EventProvider style={{ flex: 1 }}>
        <View style={styles.modalContainer}>
          <OutsidePressHandler onOutsidePress={onClose} style={{ flex: 1 }}>
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
                  style={styles.categories}
                  data={dataArr}
                  ListFooterComponent={<View style={{ height: 100 }} />}
                  renderItem={({ item }) => (
                    <Button
                      mode="text"
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
          </OutsidePressHandler>
        </View>
      </EventProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    height: "50%",
    width: "100%",
    backgroundColor: theme.colors.background,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
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

export default NewIngredientInSearchForm;
