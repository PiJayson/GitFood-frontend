import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package
import { theme } from '../../assets/theme';
import { useRestApi } from '../../providers/RestApiProvider';
import Button from '../universal/Button';

const EditFridge = ({ visible, onClose, fridgeId, syncStore }) => {
  const [usernameToAdd, setUsernameToAdd] = useState('');
  const [owner, setOwner] = useState(true);

  const { removeFridge, deleteFridgeUnshare, patchFridgeShare, deleteFridgeBeUnshared, username } = useRestApi();

  const fridge = syncStore.getStore(fridgeId);

  useEffect(() => {
    if (fridge) {
      setOwner(fridge.owner);
    }
  }, [fridge]);

  const handleRemoveFridge = () => {
    syncStore.removeStore(fridge.id, removeFridge);
    onClose();
  };

  const handleRemoveUser = async (user) => {
    syncStore.unshareStore(fridge.id, user, deleteFridgeUnshare)
  };

  const handleAddUser = async () => {
    if (usernameToAdd) {
      syncStore.shareStore(fridge.id, usernameToAdd, patchFridgeShare)
      setUsernameToAdd('');
    }
  };

  const handleLeaveFridge = async () => {
    syncStore.beUnsharedStore(fridge.id, deleteFridgeBeUnshared)
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>{owner == username ? "Edit My Fridge" : "Fridge Details"}</Text>
          {owner == username ? (
            <>
              <Button title="Remove Fridge" mode="outlined" style={styles.removeButton} onPress={handleRemoveFridge}>
                Remove Fridge
              </Button>
              <Text style={styles.subHeader}>Shared With</Text>
              <ScrollView style={styles.scrollableList}>
                {fridge && fridge.sharedWith.map(user => (
                  <View key={user} style={styles.userItem}>
                    <Text style={styles.username}>{user}</Text>
                    <TouchableOpacity onPress={() => handleRemoveUser(user)}>
                      <Ionicons name="close-circle" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <TextInput
                style={styles.input}
                placeholder="Enter username to share with"
                value={usernameToAdd}
                onChangeText={setUsernameToAdd}
              />
              <Button title="Add User" mode="outlined" style={styles.addButton} textStyle={styles.buttonText} onPress={handleAddUser}>
                Add User
              </Button>
            </>
          ) : (
            <>
              <Text style={styles.ownerText}>Fridge owned by: <Text style={[styles.ownerText, {color: theme.colors.primary}]}>{owner}</Text></Text>
              <Button title="Leave Fridge" mode="outlined" onPress={handleLeaveFridge} style={styles.leaveButton} textStyle={styles.buttonText} >
                Leave Fridge
              </Button>
            </>
          )}
          <Button title="Close" mode="outlined" style={styles.closeButton} onPress={onClose}>
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    width: '90%',
    maxWidth: 800,
    borderRadius: 30,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollableList: {
    maxHeight: 150,
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  username: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  button: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    marginVertical: 5,
  },
  removeButton: {
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
  },
  leaveButton: {
    backgroundColor: theme.colors.primary,
    marginBottom: 15,
  },
  closeButton: {
    width: '100%',
  },
  ownerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default EditFridge;
