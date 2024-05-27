import React from "react";
import { StyleSheet } from "react-native";
import ExpandableList from "../universal/ExpandableList";
import { useRestApi } from "../../providers/RestApiProvider";
import Button from "../universal/Button";

export default function ExpandableFridgeList({ syncStore, addNewItemForm, handleShare }) {
  const stores = syncStore.stores();
  const id = syncStore.currentStoreId();
  const currentStore = stores.find(store => store.id === id);
  const title = currentStore ? currentStore.name : "No Fridge Selected";

  const { getFridgeProducts, getFridges } = useRestApi();
  
  return (
    <ExpandableList
      title={title}
      items={stores}
      itemName={(item) => item.name}
      chooseItem={(item) => syncStore.setStore(item, getFridgeProducts)}
      isChosen={(item) => item.id == id}
      addNewItemForm={addNewItemForm}
      onExpand={() => syncStore.loadStores(getFridges)}
      customComponent={
        <Button
          mode="contained"
          onPress={handleShare}
          style={styles.customButton}
        >
          Share Fridge
        </Button>
      }
    />
  );
}

const styles = StyleSheet.create({
  customButton: {
    marginVertical: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  }
});
