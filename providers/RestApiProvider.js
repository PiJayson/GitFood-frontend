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

  const getProductByBarcode = async (barcode) => {
    try {
      const response = await apiClient.get(`/product/get/${barcode}`);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 404) {
        return null;
      }
      throw error;
    }
  };

  const getFridgeProducts = async () => {
    const response = await apiClient.get("/fridge/get", { login });
    return response.data;
  };

  const addProductToFridge = async (product) => {
    return await apiClient.post("/fridge/add", {
      productId: product.id,
      login: login,
      quantity: product.quantity,
      unit: null,
    });
  };

  const updateProductInFridge = async (product) => {
    return await apiClient.patch("/fridge/update", {
      productId: product.id,
      login: login,
      quantity: product.quantity,
      unit: product.unit,
    });
  };

  const removeProductFromFridge = async (product) => {
    return await apiClient.delete("/fridge/delete", {
      productId: product.id,
    });
  };

  const value = {
    isSignedIn,
    login,
    signOut,

    getProductByBarcode,
    getFridgeProducts,
    addProductToFridge,
    updateProductInFridge,
    removeProductFromFridge,
  };

  return (
    <RestApiContext.Provider value={value}>{children}</RestApiContext.Provider>
  );
};
