import React from "react";
import RenderSpinner from "../universal/RenderSpinner";
import RecipeCard from "./RecipeCard";
import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function RecipeList({ dataSource, onLikeRecipe, onViewRecipe }) {
  const {
    isLoading,
    isError,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = dataSource;

  if (isError) {
    return <Text>Error</Text>;
  }

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return isLoading ? (
    <RenderSpinner />
  ) : (
    <View style={styles.listContainer}>
      <FlatList
        data={data.pages.flat()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <RecipeCard
            index={index}
            recipe={item}
            onLikeRecipe={onLikeRecipe}
            onViewRecipe={onViewRecipe}
          />
        )}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <RenderSpinner /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    paddingHorizontal: 10,
  },
});
