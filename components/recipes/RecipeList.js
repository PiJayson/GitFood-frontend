import React from "react";
import RenderSpinner from "../universal/RenderSpinner";
import RecipeCard from "./RecipeCard";
import { FlatList } from "react-native";
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

  if (!isLoading) {
    console.log(data);
    console.log(data.pages.flat());
  }

  return isLoading ? (
    <RenderSpinner />
  ) : (
    <FlatList
      data={data.pages.flat()}
      renderItem={({ item }) => (
        <RecipeCard
          recipe={item}
          onLikeRecipe={onLikeRecipe}
          onViewRecipe={onViewRecipe}
        />
      )}
      keyExtractor={(item) => item.id}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <RenderSpinner /> : null}
    />
  );
}
