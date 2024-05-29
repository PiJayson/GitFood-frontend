import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNotification } from "./NotificationProvider";
import curlirize from "axios-curlirize";
import { Platform } from "react-native";

const RestApiContext = createContext();

export const useRestApi = () => useContext(RestApiContext);

export const RestApiProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(
    async () => await AsyncStorage.getItem("AWTtoken"),
  );
  const [username, setUsername] = useState('');
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

  const register = async (login, password) => {
    const response = await apiClient.post("/login/register", {
      login,
      password,
    });
    console.log(response.data);
    await AsyncStorage.setItem("AWTtoken", response.data);
    await AsyncStorage.setItem("username", login);
    setUsername(login);
    setIsSignedIn(true);
    return response;
  };

  const signOut = async () => {
    await apiClient.delete('/login/signOut');
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

  const getFridgeProducts = async (fridgeId) => {
    const response = await apiClient.get("/fridge/get", {
      params: { fridgeId },
    });
    return response.data;
  };

  const patchFridgeAddProducts = async (products, fridgeId) => {
    const response = await apiClient.patch("/fridge/addProducts", {
      products,
      fridgeId
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
    await apiClient.patch(`/fridge/share?fridgeId=${fridgeId}&userLogin=${username}`);
  }

  const deleteFridgeUnshare = async (fridgeId, username) => {
    await apiClient.delete(`/fridge/unshare?fridgeId=${fridgeId}&userLogin=${username}`);
  }

  const deleteFridgeBeUnshared = async (fridgeId) => {
    await apiClient.delete(`/fridge/beUnshared?fridgeId=${fridgeId}`);
  }

  // Shopping

  const getShoppingProducts = async (shoppingId) => {
    const response = await apiClient.get(`/shoppingList/get?shoppingListId=${shoppingId}`);

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

  const updateShoppingListQuantity = async (shoppingId, categoryId, quantity) => {
    return await apiClient.patch(`/shoppingList/update?shoppingListId=${shoppingId}&categoryId=${categoryId}&quantity=${quantity}`);
  };

  const createShoppingList = async (name) => {
    const response = await apiClient.post(`/shoppingList/create?name=${name}`);
    
    return response.data;
  };

  const getRecipesPage = async (page, pageSize, search, ingredients) => {
    const response = await apiClient.post(
      `/recipe/getPaged?page=${page}&pageSize=${pageSize}`,
      { search, ingredients },
    );

    // console.log(response.data);
    return response.data;
  }; // this

  const addRecipePhotos = async (recipeId, photos) => {
    const formData = new FormData();

    photos.assets.forEach((image, i) => {
      formData.append("images", {
        ...image,
        uri:
          Platform.OS === "android"
            ? image.uri
            : image.uri.replace("file://", ""),
        name: `image-${i}`,
        type: "image/jpeg", // it may be necessary in Android.
      });
    });

    console.log(formData);

    const response = await apiMultipart.post(
      `/recipe/addPhotos?recipeId=${recipeId}`,
      formData,
      { curlirize: true },
    ); //
    console.log(response.status, response.statusText);
    console.log(response.data);

    return response.data;
  };

  const getMarkdown = async (path) => {
    const response = await apiClient.get(`/${path}`);

    console.log(response.data);
    return response.data;
  };

  const updateMarkdown = async (recipeId, content) => {
    console.log(recipeId, content);
    const response = await apiClient.post(`/recipe/updateMarkdown?recipeId=${recipeId}`, {
      Markdown: content
    });

    console.log(response.data);
    return response.data;
  };

  const getCategorySuggestion = async (search) => {
    // console.log(search);

    const response = await apiClient.get(
      `/Category/getSuggestions?name=${search}&resultsCount=10 `,
    );

    // console.log(response.data);
    return response.data;
  };

  const value = {
    isSignedIn,
    username,

    // Login
    login,
    signOut,
    register,

    // Category
    categoryGetAll,
    categoryGetUnits,

    // Product
    productAdd,
    getProductByBarcode,

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

    // Recipe
    getRecipesPage,
    getMarkdown,
    updateMarkdown,
    addRecipePhotos,

    getCategorySuggestion,
  };

  return (
    <RestApiContext.Provider value={value}>{children}</RestApiContext.Provider>
  );
};
