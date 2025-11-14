import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { FlashList } from "@shopify/flash-list";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, StyleSheet, TouchableOpacity } from "react-native";

type RenderItemPropsTypes = {
  item: MockDataTypes;
  index: number;
};

type MockDataTypes = {
  key: number;
  time: string;
};

type CreateData = (type: "refreshing" | "", count?: number) => Promise<MockDataTypes[] | []>;

const time_format = (time: number) => {
  const transformResult = new Date(time);
  return transformResult.toLocaleString("zh");
};

export default function Drawer1() {
  const [isFocusPage, setIsFocusPage] = useState(true);
  const [isDataLength, setIsDataLength] = useState({ count: 200, now: 0, add: 25 });
  const [isRenderData, setIsRenderData] = useState<MockDataTypes[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFooterLoading, setIsFooterLoading] = useState(false);
  const router = useRouter();

  const createMockData: CreateData = async (type: string = "", count) => {
    const addCount = count ?? isDataLength.add;
    const mockData = Array.from({ length: addCount })
      ?.map((_) => {
        const getRandom = Math.ceil(Math.random() * 10000000000);
        const time = new Date().getTime();
        const showTime = time_format(time + getRandom);
        return { time: showTime };
      })
      ?.sort((prev, next) => prev.time.localeCompare(next.time))
      ?.map((init, index) => ({ ...init, key: isDataLength.now + index }));
    if (type === "refreshing") {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
    }
    const nowCount = isDataLength.now + addCount;
    setIsDataLength((init) => ({ ...init, now: nowCount }));
    return mockData;
  };
  const pushData = () => {
    const mockData: MockDataTypes = { key: isRenderData.length, time: new Date().toLocaleString("zh") };
    setIsRenderData((data) => [...data, mockData]);
  };
  const itemDivider = () => <ThemedView style={styles.divider} />;
  const renderItem = ({ item, index }: RenderItemPropsTypes) => {
    return (
      <ThemedView style={styles.content}>
        <ThemedText style={styles.timeStyle}>{`第${index + 1}筆＿${item.time}`}</ThemedText>
      </ThemedView>
    );
  };
  const onEndReached = async () => {
    if (isDataLength.now >= isDataLength.count || !isFocusPage) return;
    setIsFooterLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const loadMoreData = await createMockData("", isDataLength.add);
    setIsRenderData((init) => [...init, ...loadMoreData]);
    setIsFooterLoading(false);
    console.log("加載更多");
  };
  const listFooterComponents = () => {
    if (isFooterLoading) {
      return (
        <ThemedView style={styles.footerComponent}>
          <ActivityIndicator size="large" color="#fff" />
        </ThemedView>
      );
    }
    return null;
  };

  useEffect(() => {
    const responseData = async () => {
      const result = await createMockData("");
      setIsRenderData(result);
    };
    responseData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsFocusPage(false);
        console.log("此頁面不再觸發");
      };
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={[styles.addStyle, { backgroundColor: "darkblue" }]} activeOpacity={0.8} onPress={() => router.push("/")}>
        <ThemedText style={styles.addText}>回首頁</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addStyle} activeOpacity={0.8} onPress={pushData}>
        <ThemedText style={styles.addText}>插入一筆數據</ThemedText>
      </TouchableOpacity>
      <FlashList
        data={isRenderData}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => createMockData("refreshing", 5)} tintColor={"#fff"} />}
        keyExtractor={(item) => String(item.key)}
        ItemSeparatorComponent={itemDivider}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={listFooterComponents}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addStyle: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: "darkgreen",
    paddingVertical: 10,
  },
  addText: {
    textAlign: "center",
    fontSize: 18,
  },
  content: {
    paddingVertical: 10,
  },
  timeStyle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: 700,
  },
  divider: {
    height: 1.2,
    backgroundColor: "#666",
  },
  footerComponent: {
    paddingVertical: 10,
  },
});
