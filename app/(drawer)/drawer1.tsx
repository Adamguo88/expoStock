import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function Drawer1() {
  const router = useRouter();
  const home = () => {
    router.push("/");
  };
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.text}>
        <TouchableOpacity onPress={home} activeOpacity={0.8}>
          <ThemedText type="link">回首頁</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    padding: 10,
    width: "100%",
    backgroundColor: "#f1f1f1",
    alignItems: "center",
  },
});
