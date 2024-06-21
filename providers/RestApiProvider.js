import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNotification } from "./NotificationProvider";
import curlirize from "axios-curlirize";

const RestApiContext = createContext();

export const useRestApi = () => useContext(RestApiContext);

export const RestApiProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(
    async () => await AsyncStorage.getItem("AWTtoken"),
  );

  const [username, setUsername] = useState("");
  const triggerNotification = useNotification();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        setUsername(storedUsername);
      } catch (error) {
        console.error("Error fetching username: ", error);
      }
    };

    fetchUsername();
  }, []);

  const apiClient = axios.create({
    baseURL: "https://gitfood.fun:5255",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const apiMultipart = axios.create({
    baseURL: "https://gitfood.fun:5255",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  curlirize(apiMultipart);

  apiClient.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("AWTtoken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setIsSignedIn(false);
            triggerNotification("Unauthorized action!");
            break;
          case 403:
            triggerNotification("Forbidden action!");
            break;
          case 404:
            triggerNotification("Resource not found!");
            break;
          case 405:
            triggerNotification("Method not allowed!");
          default:
            triggerNotification(error.response.data);
            break;
        }
      }
      return Promise.reject(error);
    },
  );

  apiMultipart.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("AWTtoken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    console.log(config.data);
    return config;
  });

  apiMultipart.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            break;
          case 401:
            break;
          case 403:
            triggerNotification("Forbidden action!");
            break;
          case 404:
            triggerNotification("Resource not found!");
            break;
          default:
            triggerNotification(error.response.data);
            break;
        }
      }
      return Promise.reject(error);
    },
  );

  /**
   * ENDPOINTS
   */

  // Login

  const login = async (login, password) => {
    const response = await apiClient.post("/login", { login, password });
    console.log(response.data);
    await AsyncStorage.setItem("AWTtoken", response.data);
    await AsyncStorage.setItem("username", login);
    setUsername(login);
    setIsSignedIn(true);
    return response;
  };

  const register = async (email, login, password) => {
    const response = await apiClient.post("/login/register", {
      email,
      login,
      password,
    });
    return response;
  };

  const verify = async (token, login) => {
    const response = await apiClient.post(
      `/login/verify?token=${token}&login=${login}`,
    );
    return response;
  };

  const resendVerification = async (login) => {
    const response = await apiClient.post(
      `/login/resendVerification?login=${login}`,
    );
    return response;
  };

  const signOut = async () => {
    await apiClient.delete("/login/signOut");
    await AsyncStorage.removeItem("AWTtoken");
    await AsyncStorage.removeItem("username");
    setIsSignedIn(false);
    setUsername(null);
  };

  // Category

  const categoryGetAll = async () => {
    const response = await apiClient.get(`/category/getAll`);
    return response.data;
  };

  const categoryGetUnits = async () => {
    const response = await apiClient.get(`/category/getUnits`);
    return response.data;
  };

  // Product

  const productAdd = async (
    name,
    description,
    barcode,
    categoryId,
    quantity,
  ) => {
    const response = await apiClient.post("/product/add", {
      description,
      name,
      barcode,
      categoryId,
      quantity,
    });
    return response.data;
  };

  const getProductByBarcode = async (barcode) => {
    try {
      const response = await apiClient.get(
        `/product/getByBarcode?barcode=${barcode}`,
      );
      return response.data;
    } catch (error) {
      if (error.response.status === 404) {
        return null;
      }
      throw error;
    }
  };

  const getProductSuggestion = async (barcode) => {
    const response = await apiClient.get(`/product/suggest?barcode=${barcode}`,);
    
    return response.data;
  };

  const getFridgeProducts = async (fridgeId) => {
    const response = await apiClient.get("/fridge/get", {
      params: { fridgeId },
    });
    return response.data;
  };

  const patchFridgeAddProducts = async (products, fridgeId) => {
    const response = await apiClient.patch("/fridge/addProducts", {
      products,
      fridgeId,
    });
    return response.data;
  };

  const updateProductQuantity = async (fridgeId, productId, quantity) => {
    return await apiClient.patch(
      `/fridge/updateProductQuantity?fridgeId=${fridgeId}&productId=${productId}&quantity=${quantity}`,
    );
  };

  const createFridge = async (name) => {
    console.log("Creating fridge");
    const response = await apiClient.post(`/fridge/create?name=${name}`);
    console.log(response);

    return response.data;
  };

  const removeFridge = async (fridgeID) => {
    await apiClient.delete(`/fridge/remove?fridgeId=${fridgeID}`);
  };

  const getFridges = async () => {
    const response = await apiClient.get("/fridge/getMap");

    // realy backend can do better

    return response.data;
  };

  const patchFridgeShare = async (fridgeId, username) => {
    await apiClient.patch(
      `/fridge/share?fridgeId=${fridgeId}&userLogin=${username}`,
    );
  };

  const deleteFridgeUnshare = async (fridgeId, username) => {
    await apiClient.delete(
      `/fridge/unshare?fridgeId=${fridgeId}&userLogin=${username}`,
    );
  };

  const deleteFridgeBeUnshared = async (fridgeId) => {
    await apiClient.delete(`/fridge/beUnshared?fridgeId=${fridgeId}`);
  };

  // Shopping

  const getShoppingProducts = async (shoppingId) => {
    const response = await apiClient.get(
      `/shoppingList/get?shoppingListId=${shoppingId}`,
    );

    console.log("data: ", response.data, shoppingId);
    return response.data;
  };

  const getShoppingLists = async () => {
    const response = await apiClient.get("/shoppingList/getMap");

    return response.data.map((fridge) => ({
      id: fridge.item1,
      name: fridge.item2,
    }));
  };

  const updateShoppingListQuantity = async (
    shoppingId,
    categoryId,
    quantity,
  ) => {
    return await apiClient.patch(
      `/shoppingList/update?shoppingListId=${shoppingId}&categoryId=${categoryId}&quantity=${quantity}`,
    );
  };

  const createShoppingList = async (name) => {
    const response = await apiClient.post(`/shoppingList/create?name=${name}`);

    return response.data;
  };

  const patchAddCategory = async (shoppingListId, categoryId, quantity) => {
    const response = await apiClient.patch(`/shoppingList/update?shoppingListId=${shoppingListId}&categoryId=${categoryId}&quantity=${quantity}`);

    return response.data;
  };

  // Recipe

  const createRecipe = async (name, description, markdown, ingredients, categories) => {
    const response = await apiClient.post(`/recipe/create`, {
      name,
      description,
      markdown,
      ingredients,
      categories
    });

    return response.data;
  };


  const getRecipesPage = async (page, pageSize, search, ingredientsIds, fridgeIds) => {
    console.log("sending", search, ingredientsIds, fridgeIds);

    const response = await apiClient.post(
      `/recipe/getPaged?page=${page}&pageSize=${pageSize}`,
      { searchName: search,
        ingredientsIds: ingredientsIds,
        fridgeIds: fridgeIds },
    );

    console.log(response.data);
    return response.data;
  }; // this

  const getRecipeDetails = async (recipeId) => {
    const response = await apiClient.get(
      `/recipe/getRecipeDetails?recipeId=${recipeId}`,
    );

    return response.data;
  };

  const addRecipePhotos = async (recipeId, photos) => {
    let body = new FormData();
    const files = photos.assets.map((photo) => {
      const uri = photo.uri;
      const name = photo.fileName;
      const type = photo.mimeType;

      body.append("images", {
        uri,
        name,
        type,
      });
      return {
        uri,
        name,
        type,
      };
    });

    console.log(body);

    await fetch(
      `https://gitfood.fun:5255/recipe/addPhotos?recipeId=${recipeId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("AWTtoken")}`,
          "Content-Type": "multipart/form-data",
        },
        body: body,
      },
    )
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      // .then((res) => res.json())
      .then((res) => {
        console.log("response" + JSON.stringify(res));
      })
      .catch((e) => console.log(e));
  };

  const addRecipeMainPhoto = async (recipeId, photo) => {
    let body = new FormData();

    // photo = photo.assets[0];
    console.log(photo);
    photo = photo.assets;
    console.log(photo);
    photo = photo[0];
    console.log(photo);

    const uri = photo.uri;
    const name = photo.fileName;
    const type = photo.mimeType;

    try {
      console.log(photo);
      body.append("image", {
        uri,
        name,
        type,
      });
    } catch (e) {
      console.log(e);
    }

    await fetch(
      `https://gitfood.fun:5255/recipe/addOrUpdateMainPhoto?recipeId=${recipeId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("AWTtoken")}`,
          "Content-Type": "multipart/form-data",
        },
        body: body,
      },
    )
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      // .then((res) => res.json())
      .then((res) => {
        console.log("response" + JSON.stringify(res));
      })
      .catch((e) => console.log(e));
  };

  const getMarkdown = async (path) => {
    const response = await apiClient.get(`/${path}?t=${new Date().getTime()}`);
    // console.log(response.data);
    return response.data;
  };

  const updateMarkdown = async (recipeId, content) => {
    console.log(recipeId, content);

    try {
      const response = await apiClient.post(
        `/recipe/updateMarkdown?recipeId=${recipeId}`,
        {
          Markdown: content,
        },
      );
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  const getCategorySuggestion = async (query) => {
    const response = await apiClient.get(
      `/Category/getSuggestions?name=${query.search}&resultsCount=${query.count} `,
    );

    return response.data;
  };

  const getFoodCategorySuggestion = async (query) => {
    const response = await apiClient.get(
      `/FoodCategory/getSuggestions?name=${query.search}&resultsCount=${query.count} `,
    );

    return response.data;
  };

  const recipeLike = async (recipeId) => {
    const response = await apiClient.post(`/recipe/like?recipeId=${recipeId}`);

    return response.data;
  };

  const recipeUnlike = async (recipeId) => {
    const response = await apiClient.post(
      `/recipe/unlike?recipeId=${recipeId}`,
    );

    return response.data;
  };

  const updateRecipeName = async (recipeId, name) => {
    const response = await apiClient.post(
      `/recipe/updateName?recipeId=${recipeId}&name=${name}`,
    );

    return response.data;
  };

  const updateRecipeDescription = async (recipeId, description) => {
    // send description, as data will be string not json
    const response = await apiClient.post(
      `/recipe/updateDescription?recipeId=${recipeId}`,
      {
        description: description,
      },
    );

    return response.data;
  };

  const updateRecipeIngredients = async (recipeId, newIngredients) => {
    console.log(recipeId);
    console.log(newIngredients);
    const response = await apiClient.post(
      `/recipe/replaceIngredients?recipeId=${recipeId}`,
      newIngredients,
    );

    return response.data;
  };

  const postAddComment = async (recipeId, comment) => {
    const response = await apiClient.post(`/recipe/addComment?recipeId=${recipeId}&comment=${comment}`);

    return response.data;
  };

  const getCommentsPage = async (recipeId, page, pageSize) => {
    const response = await apiClient.get(`/recipe/getCommentsPaged?recipeId=${recipeId}&page=${page}&pageSize=${pageSize}`);

    return response.data;
  };

  const postForkRecipe = async (recipeId) => {
    const response = await apiClient.post(`/recipe/forkRecipe?recipeId=${recipeId}`);

    return response.data;
  };

  const likeRecipe = async (recipeId) => {
    const response = await apiClient.post(`/recipe/like?recipeId=${recipeId}`,);

    return response.data;
  }

  const unlikeRecipe = async (recipeId) => {
    const response = await apiClient.post(`/recipe/unlike?recipeId=${recipeId}`,);

    return response.data;
  }

  const value = {
    isSignedIn,
    username,

    // Login
    login,
    signOut,
    register,
    verify,
    resendVerification,

    // Category
    categoryGetAll,
    categoryGetUnits,

    // Product
    productAdd,
    getProductByBarcode,
    getProductSuggestion,

    // Fridge
    getFridgeProducts,
    patchFridgeAddProducts,
    updateProductQuantity,
    createFridge,
    removeFridge,
    getFridges,
    patchFridgeShare,
    deleteFridgeUnshare,
    deleteFridgeBeUnshared,

    // Shopping List
    getShoppingProducts,
    getShoppingLists,
    updateShoppingListQuantity,
    createShoppingList,
    patchAddCategory,

    // Recipe
    createRecipe,
    getRecipesPage,
    getRecipeDetails,
    getMarkdown,
    getFoodCategorySuggestion,
    recipeLike,
    updateRecipeName,
    updateRecipeDescription,
    updateRecipeIngredients,
    updateMarkdown,

    addRecipePhotos,
    addRecipeMainPhoto,

    getCategorySuggestion,
    postAddComment,
    getCommentsPage,
    postForkRecipe,
    likeRecipe,
    unlikeRecipe,
  };

  return (
    <RestApiContext.Provider value={value}>{children}</RestApiContext.Provider>
  );
};
