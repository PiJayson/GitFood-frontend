import React from "react";
import ExpandableList from "../universal/ExpandableList";
import { useRestApi } from "../../providers/RestApiProvider";

export default function ExpandableShoppingList({ syncStore, addNewItemForm }) {
  const stores = syncStore.stores();
  const id = syncStore.currentStoreId();

  const { getShoppingProducts, getShoppingLists } = useRestApi();

  return (
    <ExpandableList
      title="Shopping List"
      items={stores}
      itemName={(item) => item.name}
      chooseItem={(item) => syncStore.setStore(item, getShoppingProducts)}
      isChosen={(item) => item.id == id}
      addNewItemForm={addNewItemForm}
      onExpand={() => syncStore.loadStores(getShoppingLists)}
    />
  );
}
