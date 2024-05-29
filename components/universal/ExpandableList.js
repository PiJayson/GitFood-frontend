// components/ExpandableList.js
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { List, IconButton, Button } from 'react-native-paper';

const ExpandableList = ({ items, onSelect, onAddNew, onEdit }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handlePress = () => setExpanded(!expanded);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setExpanded(false);
    onSelect(item);
  };

  const containerStyle = Platform.OS === 'web' ? { zIndex: 1 } : {};

  return (
    <View style={containerStyle}>
      <TouchableOpacity style={styles.header} onPress={handlePress}>
        <List.Icon icon="folder" />
        <List.Item title={selectedItem ? selectedItem.name : "Select an item"} />
        <IconButton style={styles.iconButton} icon={expanded ? "chevron-up" : "chevron-down"} />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.expandedContainer}>
          <ScrollView style={styles.scrollContainer}>
            {items.map((item, index) => (
              <View key={item.id} style={styles.itemContainer}>
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item)}
                >
                  <List.Icon icon="magnify" />
                  <List.Item title={item.name} />
                </TouchableOpacity>
                <IconButton
                  icon="dots-vertical"
                  onPress={() => onEdit(item)}
                />
              </View>
            ))}
          </ScrollView>
          <Button mode="contained" onPress={onAddNew} style={styles.addButton}>
            Add New
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
  },
  expandedContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  scrollContainer: {
    maxHeight: 300,
  },
  iconButton: {
    marginLeft: 'auto',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 5,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#6200ee',
  },
});

export default ExpandableList;
