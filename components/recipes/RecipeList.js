import React from "react";
import RenderSpinner from "../universal/RenderSpinner";
import RecipeCard from "./RecipeCard";
import { FlatList, StyleSheet } from "react-native";
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

  // if (!isLoading) {
  //   console.log(data);
  //   console.log(data.pages.flat());
  // }

  return isLoading ? (
    <RenderSpinner />
  ) : (
    <FlatList
      data={data.pages.flat()}
      contentContainerStyle={{ flexGrow: 1 }}
      renderItem={({ item }) => (
        <RecipeCard
          recipe={item}
          onLikeRecipe={onLikeRecipe}
          onViewRecipe={onViewRecipe}
        />
      )}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <RenderSpinner /> : null}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
