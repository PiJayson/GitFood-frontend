import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRestApi } from "./RestApiProvider";

const getRecipes = (query) => {
  const { getRecipesPage } = useRestApi();

  const ingredientIds = query.ingredients.map(ingredient => ingredient.id);
  const fridgesIds = query.fridges.map(fridge => fridge.id);

  return useInfiniteQuery({
    queryKey: ["recipes", query],
    queryFn: ({ pageParam = 1 }) =>
      getRecipesPage(
        pageParam,
        query.pageSize,
        query.search,
        ingredientIds,
        fridgesIds
      ), // this
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < query.pageSize) {
        return undefined;
      }
      return pages.length + 1;
    },
  });
};

const getCategorySuggestion = (query) => {
  const { getCategorySuggestion } = useRestApi();
  return useQuery({
    queryKey: ["CategorySuggestions", query],
    queryFn: () => getCategorySuggestion(query),
  });
};

const getSearchSuggestion = (query) => {
  const { getFoodCategorySuggestion } = useRestApi();
  return useQuery({
    queryKey: ["SearchSuggestions", query],
    queryFn: () => getFoodCategorySuggestion(query),
  });
};

const getComments = (recipeId, pageSize) => {
  const { getCommentsPage } = useRestApi();
  return useInfiniteQuery({
    queryKey: ["comments", recipeId],
    queryFn: ({ pageParam = 1 }) =>
      getCommentsPage(recipeId, pageParam, pageSize),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < pageSize) {
        return undefined;
      }
      return pages.length + 1;
    },
  });
};

export { getRecipes, getCategorySuggestion, getSearchSuggestion, getComments };
