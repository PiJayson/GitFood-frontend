import React from "react";
import ExpandableList from "../universal/ExpandableList";
import { useRestApi } from "../../providers/RestApiProvider";

export default function ExpandableFridgeList({ syncStore, addNewItemForm }) {
  const fridges = syncStore.fridges();
  const id = syncStore.currentFridgeId();

  const { getFridgeProducts, getFridges } = useRestApi();

  // console.log("expandable", fridges, id);

  return (
    <ExpandableList
      title="Fridges"
      items={fridges}
      itemName={(item) => item.name}
      chooseItem={(item) => syncStore.setFridge(item.id, getFridgeProducts)}
      isChosen={(item) => item.id == id}
      addNewItemForm={addNewItemForm}
      onExpand={() => syncStore.loadFridges(getFridges)}
    />
  );
}
