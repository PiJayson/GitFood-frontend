import RenderSpinner from "../universal/RenderSpinner";
import RecipeCard from "./RecipeCard";
import { FlatList } from "react-native";

export default function RecipeList({ dataSource, onLikeRecipe, onViewRecipe }) {
  const { isLoading, data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    dataSource;

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
