import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Button, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import Header from "../../components/universal/Header";
import BackButton from "../../components/universal/BackButton";
import AddPhotoButton from "../../components/universal/AddPhotoButton";
import * as ImagePicker from "expo-image-picker";
import { useRestApi } from "../../providers/RestApiProvider";
import Markdown from 'react-native-markdown-display';
import CommentList from "../../components/recipes/CommentList";
import AddComment from "../../components/recipes/AddComment";
import { getComments } from "../../providers/ReactQueryProvider";

export default function SingleRecipeScreen({ route, navigation }) {
  const { recipe } = route.params;
  const { name, description } = recipe;
  const { addRecipesPhotos, getMarkdown, updateMarkdown, username, postAddComment } = useRestApi();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');

  const {
    data: commentPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchComments
  } = getComments(recipe.id, 10);

  const comments = commentPages?.pages.flat() ?? [];
  console.log("comm: ", comments);

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

  const handleAddComment = async (comment) => {
    const newComment = { username, comment };
    await postAddComment(recipe.id, comment);
    refetchComments()
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <BackButton goBack={navigation.goBack} />
        <Header>{name}</Header>
        <Text>{description}</Text>
        <AddPhotoButton onPress={onAddPhoto} />
        {username == recipe.author && (
          <Button
            title={isEditing ? 'Save' : 'Edit'}
            onPress={handleEdit}
          />
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
          <Markdown>
            {content}
          </Markdown>
        )}
        <View style={styles.commentSection}>
          <AddComment onAddComment={handleAddComment} />
          <CommentList comments={comments} />
          {isFetchingNextPage && <ActivityIndicator />}
          {hasNextPage && (
            <Button onPress={fetchNextPage} mode="contained">
              Load more comments
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    width: "100%",
    maxWidth: 800,
    margin: 12,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  editorContainer: {
    flex: 1,
    width: '100%',
  },
  textInput: {
    height: 200,
    width: '100%',
    textAlignVertical: 'top',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  commentSection: {
    flex: 1,
    width: '100%',
    marginTop: 100
  }
});
