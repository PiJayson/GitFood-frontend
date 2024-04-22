import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../components/universal/Button";
import Paragraph from "../../components/universal/Paragraph";
import { AuthContext } from "../../utils/contexts/AuthContext";
// import ProductList from "../../components/product_list/ProductList";
import ProductList from "../../components/product_list/ProductList";
import { Dimensions } from "react-native";
import BackButton from "../../components/universal/BackButton";
import { useState, useEffect } from "react";
import { theme } from "../../core/theme";
import { useReducer } from "react";
import productListReducer from "../../utils/reducers/productListReducer";
import RestApiService from "../../services/RestApiService";

const windowDimensions = Dimensions.get("window");
// const screenDimensions = Dimensions.get("screen");

// TODO: plan what is supposed to be on the home screen
const FridgeScreen = ({ navigation }) => {
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
  });

  

  useEffect(() => {
    const fetchData = async () => {
      const productList = await RestApiService.getProductList();

      productList.forEach(product => {
        const { name, barcodes } = product.product;
        const barcode = barcodes[0] || ''; // Assuming you want the first barcode if available
        const count = product.fridgeUnits.reduce((total, item) => total + item.quantity, 0); // Sum quantities from all fridgeUnits

        dispatch({
          type: "ADD_PRODUCT",
          product: {
              name,
              count,
              barcode,
         }});
      });
    };

    fetchData();
  }, []);

  const products = [
    // {
    //   name: "Milk",
    //   count: 1,
    //   barcode: null,
    // },
    // {
    //   name: "Eggs",
    //   count: 12,
    //   barcode: null,
    // },
    // {
    //   name: "Bread",
    //   count: 1,
    //   barcode: null,
    // },
    // {
    //   name: "Butter",
    //   count: 1,
    //   barcode: null,
    // },
    // {
    //   name: "Cheese",
    //   count: 1,
    //   barcode: null,
    // },
    // {
    //   name: "Yogurt",
    //   count: 1,
    //   barcode: null,
    // },
    // {
    //   name: "Apples",
    //   count: 3,
    //   barcode: null,
    // },
    // {
    //   name: "Oranges",
    //   count: 2,
    //   barcode: null,
    // },
    // {
    //   name: "Bananas",
    //   count: 4,
    //   barcode: null,
    // },
    // {
    //   name: "Grapes",
    //   count: 1,
    //   barcode: null,
    // },
    // {
    //   name: "Strawberrie sssssssssssssssssssssssssssss ssssssssssssss",
    //   count: 1,
    //   barcode: null,
    // },
  ];

  const [productList, dispatch] = useReducer(productListReducer, {
    products: products,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setDimensions({ window, screen });
      },
    );
    return () => subscription?.remove();
  });

  const getProduct = (barcode) => {
    const res = productList.products.filter((product) => {
      if (product.barcode == barcode) return true;
    });

    if (res.length > 0) return res[0];
    return null;
  }

  const { signOut } = React.useContext(AuthContext);
  return (
    <View style={[{ maxHeight: dimensions.window.height }, styles.background]}>
      <BackButton goBack={() => navigation.navigate("Home")} />
      <ProductList dispatch={dispatch} products={productList.products} ListName={"kldsaj"} />
      <Button
        title="Open Scanner"
        onPress={() => navigation.navigate('FridgeScanner', {
          dispatch: dispatch,
          getProduct: getProduct
        })}
      >Open Scanner</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.surface,
  },
});

export default FridgeScreen;
