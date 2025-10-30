import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { FlashList } from "@shopify/flash-list";

type PropsType = {
  id: string;
  name: string;
};
type StatusProps = {
  max: number;
  loading: boolean;
  count: number;
};
type InfoProps = {
  item: PropsType;
};

export default function Profile() {
  const [status, setStatus] = useState({ max: 200, loading: false, count: 0 });
  const [mockData, setMockData] = useState<PropsType[]>([]);

  const createTemplate = async (count: number) => {
    if (count <= 0) return [];
    setStatus((init) => ({ ...init, loading: true }));
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const template: PropsType[] = [];
    for (let i = 1; i <= count; i++) {
      const index = status.count + i;
      template.push({
        id: String(index),
        name: String(index),
      });
    }
    setStatus((init) => {
      return {
        ...init,
        count: init.count + count,
        loading: false,
      };
    });
    setMockData((init) => [...init, ...template]);
  };

  const renderTemplate = (info: InfoProps) => {
    return <RenderMyItem id={info.item.id} name={info.item.name} />;
  };
  const memoKeyExtractor = useCallback((item: PropsType) => item.name, []);

  const loadMore = () => {
    if (status.count >= status.max) return;
    createTemplate(20);
  };

  useEffect(() => {
    const mockAPI = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      createTemplate(40);
    };
    mockAPI();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ThemedView style={[styles.flex, { backgroundColor: "#fff" }]}>
          <FlashList
            data={mockData}
            renderItem={renderTemplate}
            keyExtractor={memoKeyExtractor}
            ListFooterComponent={() => <FlashFooter {...status} />}
            onEndReachedThreshold={0.2}
            onEndReached={loadMore}
          />
        </ThemedView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export function RenderMyItem({ id, name }: PropsType) {
  return (
    <ThemedView style={styles.card}>
      <ThemedText type="subtitle" style={{ color: "white" }}>
        {name}
      </ThemedText>
    </ThemedView>
  );
}

export function FlashFooter({ max, loading, count }: StatusProps) {
  if (count >= max) {
    return (
      <ThemedView style={styles.footer}>
        <ThemedText type="default" style={{ textAlign: "center", color: "gray" }}>
          ---------- 到底部 ----------
        </ThemedText>
      </ThemedView>
    );
  }
  if (loading) {
    return (
      <ThemedView style={styles.footer}>
        <ThemedText type="default" style={{ textAlign: "center", color: "gray" }}>
          ---------- 加載中 ----------
        </ThemedText>
      </ThemedView>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  flex: {
    flex: 1,
  },
  headerTitle: {
    padding: 10,
    color: "#fff",
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#fff",
  },
  card: {
    flex: 1,
    padding: 10,
    margin: 10,
    backgroundColor: "darkgray",
  },
});
