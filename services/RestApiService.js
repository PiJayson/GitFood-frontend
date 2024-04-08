import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://gitfood.fun:5255';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('jwtToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Register user
const register = async (username, password) => {
  twoFactorCode = "string";
  email = username
  twoFactorRecoveryCode = "string";
  return apiClient.post('/login/register', { email, password, twoFactorCode, twoFactorRecoveryCode });
};

// Login user
const login = async (username, password) => {
  twoFactorCode = "string";
  twoFactorRecoveryCode = "string";
  email = username
  const response = await apiClient.post('/login', { email, password, twoFactorCode, twoFactorRecoveryCode });
  const { token } = response.data;
  await AsyncStorage.setItem('jwtToken', token);
  return token;
};

// Get barcode name
const getBarcodeName = async (barcode) => {
  const response = await apiClient.get(`/barcodes/${barcode}`);
  return response.data.name;
};

// Set barcode name
const setBarcode = async (barcode, name) => {
  return apiClient.post('/barcodes', { barcode, name });
};

export default {
  register,
  login,
  getBarcodeName,
  setBarcode,
};
