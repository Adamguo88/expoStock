import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { StyleSheet } from "react-native";

export default function Drawer3() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>這是Drawer_3</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    textAlign: "center",
    color: "#fff",
  },
});
