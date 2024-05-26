// components/CustomDrawerContent.js
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRestApi } from '../../providers/RestApiProvider';
import Button from '../../components/universal/Button';

const UserScreen = (props) => {
  const { username, signOut } = useRestApi();

  return (
    <>
      <DrawerContentScrollView {...props}>
        <View style={styles.userInfoSection}>
          <Image
            source={{ uri: 'https://img.freepik.com/free-photo/cute-ai-generated-cartoon-bunny_23-2150288870.jpg?t=st=1716447330~exp=1716450930~hmac=dfc730c516527ee1e49c3fd4a6661b81710252c2c61c0aafe64e7b71e8baa07e&w=740' }} // Replace with your user's image URL
            style={styles.userImage}
          />
          <Text style={styles.username}>{username}</Text>
        </View>
        <View style={styles.logoutButton}>
          <Button title="Logout" mode="outlined" onPress={signOut} >
            Logout
          </Button>
        </View>
      </DrawerContentScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  userInfoSection: {
    padding: 20,
    alignItems: 'center',
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default UserScreen;
