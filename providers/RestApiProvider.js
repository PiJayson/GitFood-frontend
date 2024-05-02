import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNotification } from "./NotificationProvider";

const RestApiContext = createContext();

export const useRestApi = () => useContext(RestApiContext);

export const RestApiProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(
    async () => await AsyncStorage.getItem("AWTtoken"),
  );
  const triggerNotification = useNotification();

  const apiClient = axios.create({
    baseURL: "https://gitfood.fun:5255",
    headers: {
      "Content-Type": "application/json",
    },
  });

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

  const login = async (login, password) => {
    const response = await apiClient.post("/login", { login, password });
    console.log(response.data);
    await AsyncStorage.setItem("AWTtoken", response.data);
    setIsSignedIn(true);
    return response;
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("AWTtoken");
    setIsSignedIn(false);
  };

  const getRecipesPage = async (pageParam, pageSize, search, ingredients) => {
    return apiClient
      .get("/recipes", {
        params: {
          page: pageParam,
          size: pageSize,
          search,
          ingredients,
        },
      })
      .then((response) => {
        return response.data;
      });
  };

  const value = {
    isSignedIn,
    login,
    signOut,

    getRecipesPage,
  };

  return (
    <RestApiContext.Provider value={value}>{children}</RestApiContext.Provider>
  );
};
