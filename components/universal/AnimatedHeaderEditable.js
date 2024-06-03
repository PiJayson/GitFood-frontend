import React from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";

import Title from "./Title";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../assets/theme";

const HEADER_HEIGHT = 400;

const AnimatedHeaderEditable = ({
  animatedValue,
  imageUri,
  title,
  updateTitle,
  onAddPhoto,
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
      <Animated.View style={{ flex: 1 }}>
        <Animated.Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
        <IconButton
          icon="upload"
          size={50}
          style={{
            position: "absolute",
            alignSelf: "center",
            top: "50%",
          }}
          iconColor="green"
          onPress={onAddPhoto}
        />
      </Animated.View>
      <Animated.View style={{ height: 44 }} />
      <Animated.View style={styles.titleContainer}>
        <Animated.View style={styles.titleWrapper}>
          <TextInput
            value={title}
            onChangeText={(text) => updateTitle(text)}
            mode="outlined"
            multiline={true}
            textColor={theme.colors.primary}
            style={{
              flex: 1,
              fontSize: 36,
              fontWeight: "bold",
              alignSelf: "center",
            }}
            outlineColor="white"
            underlineColor="black"
          />
        </Animated.View>
        <IconButton icon={"check"} onPress={action} style={styles.iconButton} />
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
    alignItems: "center",
    paddingVertical: 6,
    width: "100%",
    marginLeft: 20, // Add some space between left edge
    flex: 1, // Title takes up remaining space
    flexShrink: 1, // Title can shrink if necessary
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10, // Add some space between title and button
  },
});

export default AnimatedHeaderEditable;
