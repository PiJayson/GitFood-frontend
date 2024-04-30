import * as React from "react";
import { List } from "react-native-paper";

export default function ExpandableList({
  title,
  items,
  chooseItem,
  choosenIndex,
}) {
  const [expanded, setExpanded] = React.useState(false);

  console.log(items);
  return (
    <List.Accordion
      title={title}
      left={(props) => <List.Icon {...props} icon="folder" />}
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
    >
      {items.map((item, index) =>
        index === choosenIndex ? (
          <List.Item
            key={index}
            title={item}
            onPress={() => chooseItem(item)}
            icon="check"
            style={{ backgroundColor: "lightblue" }}
          />
        ) : (
          <List.Item
            key={index}
            title={item}
            onPress={() => {
              chooseItem(item);
              setExpanded(false);
            }}
          />
        ),
      )}
    </List.Accordion>
  );
}
