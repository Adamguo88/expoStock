import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function ProductDrawer() {
  const params = useLocalSearchParams();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: `商品_${params?.id}` }} />
      <ThemedText style={{ textAlign: "center" }} type="subtitle">
        product - {params?.id}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
