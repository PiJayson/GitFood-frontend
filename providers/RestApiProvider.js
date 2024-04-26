import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNotification } from './NotificationProvider';

const RestApiContext = createContext();

export const useRestApi = () => useContext(RestApiContext);

export const RestApiProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(localStorage.getItem('AWTtoken') != null);
  const triggerNotification = useNotification();

  const apiClient = axios.create({
    baseURL: "https://gitfood.fun:5255",
    headers: {
      "Content-Type": "application/json",
    },
  });

  apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('AWTtoken');
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    response => response,
    error => {
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
            console.log("here!");
            triggerNotification(error.response.data);
            break;
        }
      }
      return Promise.reject(error);
    }
  );

  const login = async (login, password) => {
    const response = await apiClient.post("/login", { login, password });
    localStorage.setItem('AWTtoken', response.data.token);
    setIsSignedIn(true);
    return response;
  };

  const signOut = () => {
    localStorage.removeItem('AWTtoken');
    setIsSignedIn(false);
  };

  const value = {
    isSignedIn,
    login,
    signOut
  };

  return (
    <RestApiContext.Provider value={value}>
      {children}
    </RestApiContext.Provider>
  );
};
