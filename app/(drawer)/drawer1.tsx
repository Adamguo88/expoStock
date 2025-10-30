import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function Drawer1() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>測試1111111111111111111</ThemedText>
      <ThemedView style={{ marginTop: 10 }}>
        <Link href="/">
          <ThemedText type="link">回首頁</ThemedText>
        </Link>
      </ThemedView>
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
