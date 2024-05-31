import React from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import Title from "./Title";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_HEIGHT = 400;

const AnimatedHeaderWithImage = ({
  animatedValue,
  imageUri,
  title,
  state,
  action,
}) => {
  const insets = useSafeAreaInsets();

  const headerHeight = animatedValue.interpolate({
    inputRange: [0, HEADER_HEIGHT + insets.top],
    outputRange: [HEADER_HEIGHT + insets.top, insets.top + 44],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: headerHeight,
          paddingTop: insets.top,
        },
      ]}
    >
      <Animated.Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
      <Animated.View style={{ height: 44 }} />
      <Animated.View style={styles.titleContainer}>
        <Animated.View style={styles.titleWrapper}>
          <Title>{title}</Title>
        </Animated.View>
        <IconButton
          icon={state.isAuthor ? "pencil" : "heart"}
          onPress={action}
          style={styles.iconButton}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  titleContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: -44,
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  titleWrapper: {
    marginLeft: 20, // Add some space between left edge
    flex: 1, // Title takes up remaining space
    flexShrink: 1, // Title can shrink if necessary
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10, // Add some space between title and button
  },
});

export default AnimatedHeaderWithImage;
