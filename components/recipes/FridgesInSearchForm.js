import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  View,
} from "react-native";
import OutsidePressHandler, { EventProvider } from "react-native-outside-press";
import { Button, Searchbar, Text } from "react-native-paper";
import { theme } from "../../assets/theme";
import { syncFridgeStore } from "../../screens/fridge/FridgeStore"; // Import syncFridgeStore

const FridgesInSearchForm = ({
  visible,
  onSubmit,
  onClose,
  selected,
}) => {
  const [search, setSearch] = useState("");
  const [fridges, setFridges] = useState([]);

  const allFridges = syncFridgeStore.stores();

  useEffect(() => {
    // Filter fridges based on search query
    const filteredFridges = allFridges.filter(fridge => 
      fridge.name.toLowerCase().includes(search.toLowerCase())
    );
    setFridges(filteredFridges);
  }, [search, allFridges]);

  const dataArr = fridges
    .filter((item) => !selected.includes(item.id))
    .map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
    }))
    .slice(0, 10);

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
            <Text style={styles.header}>Add fridge to search</Text>
            <View style={styles.search}>
              <Searchbar
                placeholder="Fridge name"
                value={search}
                onChangeText={setSearch}
                style={styles.input}
              />
              {fridges && (
                <FlatList
                  style={styles.categories}
                  data={dataArr}
                  ListFooterComponent={<View style={{ height: 50 }} />}
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

export default FridgesInSearchForm;
