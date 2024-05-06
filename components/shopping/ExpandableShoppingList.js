import React from "react";
import ExpandableList from "../universal/ExpandableList";
import { useRestApi } from "../../providers/RestApiProvider";

export default function ExpandableShoppingList({ syncStore, addNewItemForm }) {
  const fridges = syncStore.fridges();
  const id = syncStore.currentFridgeId();

  const { getShoppingProducts, getShoppingLists } = useRestApi();

  return (
    <ExpandableList
      title="Shopping List"
      items={fridges}
      itemName={(item) => item.name}
      chooseItem={(item) => syncStore.setShoppingList(item, getShoppingProducts)}
      isChosen={(item) => item.id == id}
      addNewItemForm={addNewItemForm}
      onExpand={() => syncStore.loadShoppingLists(getShoppingLists)}
    />
  );
}
