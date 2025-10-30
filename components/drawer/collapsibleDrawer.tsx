import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { DrawerItem } from "@react-navigation/drawer";
import { FlashList } from "@shopify/flash-list";
import { usePathname, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Pressable, StyleSheet } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { IconSymbol } from "../ui/icon-symbol";

type RouterListProps = {
  id: string;
  title: string;
};
type CollapsibleDrawerProps = {
  children?: React.ReactNode;
  title?: string;
  routerList?: RouterListProps[] | [];
};
type RenderTemplateProps = {
  item: RouterListProps;
};
type footerProps = {
  loading: boolean;
  isMax: number;
  isCount: number;
};

export default function CollapsibleDrawer({ children, title, routerList = [] }: Readonly<CollapsibleDrawerProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? "light";

  const touchBtn = () => {
    setIsOpen((status) => !status);
  };

  return (
    <ThemedView>
      {children ? (
        children
      ) : (
        <ThemedView style={{ padding: 16 }}>
          <Pressable onPress={touchBtn} style={styles.touchBtn}>
            <ThemedText style={{ fontSize: 16, fontWeight: "bold" }}>{title}</ThemedText>
            <IconSymbol
              name="chevron.left"
              size={18}
              weight="medium"
              color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
              style={{ transform: [{ rotate: isOpen ? "-90deg" : "0deg" }] }}
            />
          </Pressable>
          {isOpen && Array.isArray(routerList) && routerList.length >= 1 && <RenderDrawerItem routerList={routerList} />}
        </ThemedView>
      )}
    </ThemedView>
  );
}

export function RenderDrawerItem({ routerList }: { routerList: RouterListProps[] | [] }) {
  const initHeight = Dimensions.get("window").height - 86 - 77 - 32 - 100;

  const router = useRouter();
  const pathname = usePathname();
  const [isAllRouterList, setIsAllRouterList] = useState<RouterListProps[] | []>([]);
  const [isRenderData, setIsRenderData] = useState<RouterListProps[] | []>([]);
  const [isMax, setIsMax] = useState(0); // 總數據數量
  const [isCount, setIsCount] = useState(0); // 當前加載數量
  const [isRenderCount, setIsRenderCount] = useState(0); // 一次加載多少筆數據
  const [isLoading, setIsLoading] = useState(false);
  const memoKeyExtractor = useCallback((item: RouterListProps) => item.id, []);
  const renderTemplate = (info: RenderTemplateProps) => {
    const isActive = pathname === `/product/${info.item.id}`;
    return (
      <DrawerItem
        key={info.item.id}
        focused={isActive}
        label={info.item.title}
        onPress={() => router.push(`/product/${info.item.id}` as any)}
      />
    );
  };
  const onEndReached = async () => {
    const isMoreDate = isMax > isCount;
    console.log(isLoading, isMax, isCount, "觸發加載");
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    if (isMoreDate && !isLoading) {
      const nextRenderCount = isCount + isRenderCount >= isMax ? isMax : isCount + isRenderCount;
      const renderData = isAllRouterList.slice(isCount, nextRenderCount);
      setIsCount(nextRenderCount);
      setIsRenderData((initData) => [...initData, ...renderData]);
      console.log(nextRenderCount, renderData);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const dataLength = routerList.length;
    const dataCount = 50;
    const dataFirst = routerList.slice(0, dataCount);
    setIsMax(dataLength);
    setIsCount(dataCount);
    setIsRenderCount(dataCount);
    setIsRenderData(dataFirst);
    setIsAllRouterList(routerList);
  }, [routerList]);

  if (isMax >= 50) {
    return (
      <ThemedView style={{ maxHeight: initHeight, flexShrink: 1 }}>
        <FlashList
          data={isRenderData}
          renderItem={renderTemplate}
          keyExtractor={memoKeyExtractor}
          ListFooterComponent={() => <DrawerFlashListItemFooter loading={isLoading} isMax={isMax} isCount={isCount} />}
          onEndReachedThreshold={0.9}
          onEndReached={onEndReached}
        />
      </ThemedView>
    );
  }
  return <React.Fragment>{isAllRouterList.map((item) => renderTemplate({ item }))}</React.Fragment>;
}

export function DrawerFlashListItemFooter({ isMax, isCount, loading = false }: footerProps) {
  if (isMax === isCount) return null;
  return (
    <ThemedView style={styles.footerView}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <ThemedText style={styles.footerText}>—————　加載中...　—————</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  touchBtn: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerView: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
