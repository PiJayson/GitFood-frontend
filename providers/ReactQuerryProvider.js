import { useInfiniteQuery } from "@tanstack/react-query";
import { useRestApi } from "./RestApiProvider";

const getRecipes = (query) => {
  const { getRecipesPage } = useRestApi();
  return useInfiniteQuery({
    queryKey: ["recipes", query],
    queryFn: ({ pageParam = 1 }) =>
      getRecipesPage(
        pageParam,
        query.pageSize,
        query.search,
        query.ingredients,
      ), // this
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < query.pageSize) {
        return undefined;
      }
      return pages.length + 1;
    },
  });
};

export { getRecipes };
