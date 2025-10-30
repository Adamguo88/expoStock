import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<Image source={require("@/assets/images/partial-react-logo.png")} style={styles.reactLogo} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Expo 測試!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Modal</ThemedText>
          </Link.Trigger>

          {/* <Link.Preview /> */}
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert("Action pressed")} />
            <Link.MenuAction title="Share" icon="square.and.arrow.up" onPress={() => alert("Share pressed")} />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction title="Delete" icon="trash" destructive onPress={() => alert("Delete pressed")} />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>{`Tap the Explore tab to learn more about what's included in this starter app.`}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Link href="/profile">
          <Link.Trigger>
            <ThemedText type="subtitle">個人資料</ThemedText>
          </Link.Trigger>
        </Link>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/drawer1">
          <Link.Trigger>
            <ThemedText type="subtitle">股票</ThemedText>
          </Link.Trigger>
        </Link>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
