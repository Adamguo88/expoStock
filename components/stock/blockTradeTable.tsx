import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TraderTypes = {
  isStockData: stockType[] | [];
};
type stockType = string[];

type TransactionCardTypes = {
  item: stockType;
};
type InfoRowTypes = {
  label: string;
  value: string;
  isNumeric?: boolean;
};

const InfoRow = ({ label, value, isNumeric = false }: InfoRowTypes) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, isNumeric && styles.numericValue]} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

/**
 * 單筆交易資訊的卡片組件
 */
const TransactionCard = ({ item }: TransactionCardTypes) => {
  return (
    <View style={styles.card}>
      {/* 主要標題區塊：證券代號與名稱 */}
      <View style={styles.headerBlock}>
        <Text style={styles.stockCode}>{item[0]}</Text>
        <Text style={styles.stockName}>{item[1]}</Text>
        <View style={styles.tradeTypeTag}>
          <Text style={styles.tradeTypeTagText}>{item[2]}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* 資訊區塊：成交價、股數、金額 */}
      <View style={styles.detailsBlock}>
        {/* 左側：成交價/成交股數 */}
        <View style={styles.detailColumn}>
          <InfoRow label="成交價" value={item[3]} isNumeric={true} />
        </View>

        {/* 右側：成交金額 */}
        <View style={styles.detailColumn}>
          {/* 留白或放其他資訊 */}
          <InfoRow label="成交股數" value={item[4]} isNumeric={true} />
        </View>
      </View>
      <View style={[styles.divider, { marginBottom: 0, marginTop: 10 }]} />
      <View style={styles.footerBlock}>
        <Text style={styles.stockCode}>成交金額</Text>
        <Text style={[styles.stockName, { textAlign: "right" }]}>{item[5]}</Text>
      </View>
    </View>
  );
};

export default function BlockTradeCardList({ isStockData }: TraderTypes) {
  const flatListRef = useRef<any>(null);
  const [isRenderData, setIsRenderData] = useState<stockType[] | []>([]);

  useEffect(() => {
    setIsRenderData((initData) => {
      if (initData?.length >= 1) {
        flatListRef.current?.scrollToIndex({ index: 0, viewOffset: 0, viewPosition: 0 });
      }
      return isStockData;
    });
  }, [isStockData]);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>鉅額交易日成交資訊</Text>
      <FlatList
        ref={flatListRef}
        data={isRenderData}
        renderItem={({ item }) => <TransactionCard item={item} />}
        keyExtractor={(item, index) => item[1] + index}
        contentContainerStyle={styles.listContent}
        // 列表為空時的提示
        ListEmptyComponent={() => <Text style={styles.emptyText}>無鉅額交易資料</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    padding: 15,
    textAlign: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  listContent: {
    padding: 10,
  },
  // 卡片樣式
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10, // 卡片間距
    // 陰影效果 (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // 陰影效果 (Android)
    elevation: 2,
  },
  // 標題區塊：代號、名稱、交易別
  headerBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  footerBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  stockCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF", // 藍色強調
    marginRight: 10,
  },
  stockName: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  tradeTypeTag: {
    backgroundColor: "#e0e0e0", // 淺灰色背景
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  tradeTypeTagText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 10,
  },
  // 詳細資訊區塊
  detailsBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailColumn: {
    flex: 1, // 讓兩欄佔據相等寬度
    paddingHorizontal: 5,
  },
  detailColumn2: {
    width: "100%",
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#666", // 灰色標籤
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
    flexShrink: 1, // 允許數值收縮
  },
  numericValue: {
    color: "#D9534F", // 數字使用紅色/綠色 (這裡用紅色作為範例)
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
});
