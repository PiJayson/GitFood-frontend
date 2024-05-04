import * as React from "react";
import { List } from "react-native-paper";

export default function ExpandableList({
  title,
  items,
  itemName,
  chooseItem,
  isChosen,
  addNewItemForm,
  onExpand,
}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <List.Accordion
      title={title}
      left={(props) => <List.Icon {...props} icon="folder" />}
      expanded={expanded}
      onPress={() => {
        setExpanded(!expanded);
        onExpand();
      }}
    >
      {items.map((item) =>
        isChosen(item) ? (
          <List.Item
            title={itemName(item) + " (chosen)"}
            key={item.id}
            onPress={() => {
              chooseItem(item);
              setExpanded(false);
            }}
            icon="check"
            style={{ backgroundColor: "lightblue" }}
          />
        ) : (
          <List.Item
            title={itemName(item)}
            key={item.id}
            onPress={() => {
              chooseItem(item);
              setExpanded(false);
            }}
          />
        ),
      )}
      <List.Item
        title="Add new"
        onPress={addNewItemForm}
        left={(props) => <List.Icon {...props} icon="plus" />}
      />
    </List.Accordion>
  );
}
