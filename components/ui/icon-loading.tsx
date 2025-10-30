import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

type LoadingProps = {
  loading: boolean;
  size: number;
  color: string;
};

export default function IconLoading({ size, color }: Readonly<LoadingProps>) {
  return (
    <ThemedView style={styles.loadingContainer}>
      <ThemedText>
        <AntDesign name="loading" size={size} color={color} />
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
