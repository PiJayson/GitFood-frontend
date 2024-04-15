import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://gitfood.fun:5255";
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("jwtToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Register user
const register = async (email, password) => {
  twoFactorCode = "string";
  twoFactorRecoveryCode = "string";
  return apiClient.post("/login/register", {
    email,
    password,
    twoFactorCode,
    twoFactorRecoveryCode,
  });
};

// Login user
const login = async (email, password) => {
  twoFactorCode = "string";
  twoFactorRecoveryCode = "string";
  const response = await apiClient.post("/login", {
    email,
    password,
    twoFactorCode,
    twoFactorRecoveryCode,
  });
  const { token } = response.data;
  await AsyncStorage.setItem("jwtToken", token);
  return token;
};

// Get barcode name
const getBarcodeName = async (barcodeNumber) => {
  const response = await apiClient.get(`/barcode/get/${barcodeNumber}`);
  return response.data.name;
};

// Set barcode name
const setBarcode = async (barcode, name) => {
  barcodeNumber = barcode;
  productId = 1;
  return apiClient.post("/barcode/add", { barcodeNumber, productId });
};

// check if token is valid
const bootstrap = async () => {
  let userToken;

  try {
    userToken = await AsyncStorage.getItem("jwtToken");
  } catch (e) {
    return false;
  }

  // After restoring token, we may need to validate it in production apps

  // This will switch to the App screen or Auth screen and this loading
  // screen will be unmounted and thrown away.
  return userToken !== null;
};

export default {
  register,
  login,
  getBarcodeName,
  setBarcode,

  bootstrap, // not a big fan of this
};
