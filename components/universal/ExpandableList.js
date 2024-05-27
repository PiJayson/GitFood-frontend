import * as React from "react";
import { ScrollView } from "react-native";
import { View, StyleSheet } from "react-native";
import { List } from "react-native-paper";

export default function ExpandableList({
  title,
  items,
  itemName,
  chooseItem,
  isChosen,
  addNewItemForm,
  onExpand,
  customComponent,
}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <View style={styles.container}>
      <List.Accordion
        title={title}
        left={(props) => <List.Icon {...props} icon="folder" />}
        expanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
          onExpand();
        }}
        // style={{ position: "absolute" }}
      >
        <ScrollView style={styles.scrollView}>
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
        </ScrollView>
        {customComponent}
      </List.Accordion>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 10,
    position: "absolute",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    maxHeight: 300,
  },
  scrollView: {
    maxHeight: 300,
    backgroundColor: "white",
  },
});
