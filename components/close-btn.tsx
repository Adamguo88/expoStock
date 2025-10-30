import { Href, Link, useRouter } from "expo-router";
import { type ComponentProps } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: Href & string };

export function CloseBtn({ href }: Props) {
  const router = useRouter();
  const routerEvent = () => {
    if (router.canGoBack()) {
      router.dismiss();
    } else {
      router.navigate(href);
    }
  };
  return (
    <ThemedView style={styles.close}>
      <TouchableOpacity onPress={routerEvent}>
        <IconSymbol color="white" name="clear" size={24} />
      </TouchableOpacity>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  close: {
    width: 30,
    paddingLeft: 15,
  },
});
