import * as React from "react";
import { ActivityIndicator } from "react-native-paper";
import { theme } from "../../assets/theme";

export default function RenderSpinner() {
  return <ActivityIndicator animating={true} color={theme.colors.primary} />;
}
