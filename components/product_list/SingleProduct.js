import React, { useState } from "react";
import OutsidePressHandler from "react-native-outside-press";
import Animated, {
  SlideInLeft,
  SlideOutRight,
  Layout,
  Transition,
  LinearTransition,
  combineTransition,
  ExitingAnimation,
  EnteringAnimation,
  FadeIn,
  FadeOut,
  StretchOutY,
  StretchInY,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";

export default function SingleProduct({
  index,
  productName,
  syncStore,
  normalView,
  editView,
  updateProductQuantity,
}) {
  const baseProduct = syncStore.getProductCopy(productName); // gets the copy, reference may be needed
  const [product, setProduct] = useState(baseProduct);
  const [isEdited, setIsEdited] = useState(false);

  const updateProduct = () => {
    if (product.quantity <= 0) {
      syncStore.removeProduct(product);
      return;
    }
    if (product !== baseProduct) {
      syncStore.updateProduct(baseProduct, product, updateProductQuantity);
    }
  };
  const outsidePressHandler = () => {
    if (!isEdited) {
      return;
    }
    updateProduct();
    setIsEdited(false);
  }; // well this one will be a little bit of a perfomance killer

  handleExpand = () => {
    if (isEdited) {
      updateProduct();
      setIsEdited(false);
    } else {
      setIsEdited(true);
    }
  };

  const updateCount = (change) => {
    if (product.quantity + change < 0 || product.quantity + change >= 100) {
      return;
    }
    setProduct({ ...product, quantity: product.quantity + change });
    // syncStore.updateProduct(product, newProduct);
  };

  let body = isEdited
    ? editView(product, updateCount, handleExpand)
    : normalView(product, handleExpand);

  return (
    <OutsidePressHandler onOutsidePress={() => outsidePressHandler()}>
      {body}
    </OutsidePressHandler>
  );
}
