import axios from "axios";

let AWTtoken = null;
let username = null;
const API_BASE_URL = "https://gitfood.fun:5255";
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = AWTtoken;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Register user
const register = async (login, password) => {
  const response = await apiClient.post("/login/register", {
    login,
    password,
  });

  AWTtoken = response.data;
  username = login;

  return response;
};

// Login user
const login = async (login, password) => {
  const response = await apiClient.post("/login", {
    login,
    password,
  });

  AWTtoken = response.data;
  username = login;

  return response;
};

// Get barcode data
const getBarcodeData = async (barcodeNumber) => {
  const response = await apiClient.get(
    `/barcode/get?barcodeNumber=${barcodeNumber}`,
  );
  return response.data;
};

// Set barcode name
const setBarcode = async (barcode, name) => {
  barcodeNumber = barcode;
  productId = 1;
  return apiClient.post("/barcode/add", { barcodeNumber, productId });
};

// Add product
const addProductWithBarcode = async (barcode, name, description) => {
  return apiClient.post("/products/addWithBarcode", {
    description,
    name,
    barcode,
  });
}

const getProductByBarcode = async (barcode) => {
  try {
    const response = await apiClient.get(`/products/getByBarcode?barcode=${barcode}`);
    console.log("ta:", response);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
}

// Get list of products
const getProductList = async() => {
  const result = await apiClient.get(`/fridge/get?login=${username}`);
  return result.data;
}

const setToken = (token) => {
  AWTtoken = token;
};

const resetToken = () => {
  AWTtoken = null;
};

export default {
  register,
  login,
  getBarcodeData,
  setBarcode,
  addProductWithBarcode,
  getProductByBarcode,
  getProductList,

  setToken,
  resetToken,
};
