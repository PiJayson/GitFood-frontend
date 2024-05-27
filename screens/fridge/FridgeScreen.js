import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../components/universal/Button";

import { Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { theme } from "../../assets/theme";
import { useRestApi } from "../../providers/RestApiProvider";
import ExpandableFridgeList from "../../components/fridge/ExpandableFridgeList";
import { syncFridgeStore } from "./FridgeStore";
import NewListForm from "../../components/fridge/NewListForm";
import CategoryComponent from "../../components/fridge/CategoryComponent";
import CategoryList from "../../components/category_list/CategoryList";
import ProductComponent from "../../components/fridge/ProductComponent";
import Background from "../../components/universal/Background";
import ShareForm from "../../components/fridge/ShareForm";

const windowDimensions = Dimensions.get("window");

const FridgeScreen = ({ navigation }) => {
  const { updateProductQuantity, patchFridgeShare } = useRestApi();
  const [formVisible, setFormVisible] = useState(false);
  const [shareFormVisible, setShareFormVisible] = useState(false);
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
  });

  const currentStoreId = syncFridgeStore.currentStoreId();

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setDimensions({ window, screen });
      },
    );
    return () => subscription?.remove();
  });

  const renderProduct = ({ baseProduct, syncStore, updateProductQuantity }) => (
    <ProductComponent
      key={baseProduct.productId}
      baseProduct={baseProduct}
      syncStore={syncStore}
      updateProductQuantity={updateProductQuantity}
    />
  );
  
  const renderCategory = ({ item, index, syncStore, updateProductQuantity }) => (
    <CategoryComponent
      key={item.categoryId}
      item={item}
      index={index}
      renderProduct={renderProduct}
      syncStore={syncStore}
      updateProductQuantity={updateProductQuantity}
    />
  );

  const handleShare = () => {
    setShareFormVisible(true);
  };

  const handleShareSubmit = async ({ fridge, username }) => {
    await patchFridgeShare(fridge.id, username);
    setShareFormVisible(false);
  };

  return (
    <Background style={{ maxWidth: 800, padding: 0 }}>
      <View style={[{ maxHeight: dimensions.window.height }, styles.background]}>
        <ExpandableFridgeList
          syncStore={syncFridgeStore}
          addNewItemForm={() => setFormVisible(true)}
          handleShare={handleShare}
        />
        <View style={{marginTop: 45, flex: 1}}>
          <CategoryList
            syncStore={syncFridgeStore}
            renderCategory={renderCategory}
            updateProductQuantity={updateProductQuantity}
            onRefresh={async () => { console.log("refresh"); }}
          />
        </View>
        {currentStoreId != -1 ? (
          <Button
            title="Open Scanner"
            mode="outlined"
            onPress={() => navigation.navigate("FridgeScanner")}
          >
           Open Scanner
          </Button>
          ) : (
            <></>
        )}
        <NewListForm
          visible={formVisible}
          onSubmit={syncFridgeStore.createStore}
          onClose={() => setFormVisible(false)}
        />
        <ShareForm
          visible={shareFormVisible}
          onSubmit={handleShareSubmit}
          onClose={() => setShareFormVisible(false)}
          syncStore={syncFridgeStore}
        />
      </View>
    </Background>
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
