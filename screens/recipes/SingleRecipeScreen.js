import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Text } from "react-native-paper";
import Header from "../../components/universal/Header";
import BackButton from "../../components/universal/BackButton";
import AddPhotoButton from "../../components/universal/AddPhotoButton";
import * as ImagePicker from "expo-image-picker";
import { useRestApi } from "../../providers/RestApiProvider";
import Markdown from "react-native-markdown-display";

export default function SingleRecipeScreen({ route, navigation }) {
  const { recipe } = route.params;
  const { name, description } = recipe;
  const { addRecipePhotos, getMarkdown, updateMarkdown, username } =
    useRestApi();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const markdown = await getMarkdown(recipe.markdownPath);
        setContent(markdown);
      } catch (error) {
        console.error("Error fetching markdown: ", error);
      }
    };

    fetchMarkdown();
  }, [recipe.id, getMarkdown]);

  const onAddPhoto = async () => {
    console.log("Add photo");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.canceled) {
      // photos preprocessing
      addRecipePhotos(recipe.id, result);
    }
  };

  const handleSave = async () => {
    console.log(recipe, username);
    await updateMarkdown(recipe.id, content);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <BackButton goBack={navigation.goBack} />
        <Header>{name}</Header>
        <Text>{description}</Text>
        {/* <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      <Text>Ingredients</Text>
      <Text>{ingredients.join(", ")}</Text> */}
        {/* <Text>Instructions</Text>
      <Text>{instructions}</Text> */}
        <AddPhotoButton onPress={onAddPhoto} />
        {username == recipe.author && (
          <Button title={isEditing ? "Save" : "Edit"} onPress={handleEdit} />
        )}
        {isEditing ? (
          <View style={styles.editorContainer}>
            <TextInput
              style={styles.textInput}
              multiline
              value={content}
              onChangeText={setContent}
            />
          </View>
        ) : (
          <Markdown>{content}</Markdown>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    width: "100%",
    margin: 12,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  editorContainer: {
    flex: 1,
    width: "100%",
  },
  textInput: {
    height: 200,
    width: "100%",
    textAlignVertical: "top",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
