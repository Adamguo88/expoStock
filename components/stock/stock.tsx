import { AntDesign } from "@expo/vector-icons"; // 用于显示涨跌箭头
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type StockProps = {
  date: string; // 日期
  volume: string; // 成交股數 (張/股)
  volumeMoney: string; // 成交金額
  open: string; // 開盤價
  high: string; // 最高價
  low: string; // 最低價
  close: string; // 收盤價
  change: string; // 漲跌
  count: string; // 成交筆數 (搓合成功次數)
};

type PropsTypes = {
  stockData: StockProps;
  stockName: string;
};
type IconsType = "rise" | "fall";

// 判斷是否為數字
const isNumber = (price: string | number) => {
  const transformNumber = typeof price === "string" ? parseFloat(price) : price;
  return isFinite(transformNumber) ? transformNumber : 0;
};
// 刪除千分位 => 轉換為浮點數
const deleteThousand = (price: string) => {
  return isNumber(price.replaceAll(",", ""));
};
// 浮點數轉換 => 千分位
const thousandType = (price: number) => {
  return isNumber(price).toLocaleString(undefined, { minimumFractionDigits: 2 });
};
// 根據漲跌決定顏色/箭頭
const getChangeStyle = (change: number) => {
  if (change > 0) {
    return { color: "#D50000", icon: "caretdown" }; // RED (漲)
  } else if (change < 0) {
    return { color: "#00C853", icon: "caretup" }; // GREEN (跌)
  } else {
    return { color: "#999", icon: null }; // 灰色 (不變)
  }
};
// 獲取昨天收盤價
const yesterdayPrice = (close: string, change: string) => {
  const changeValue = deleteThousand(change) * -1;
  const closeValue = deleteThousand(close) + changeValue;
  return closeValue;
};
// 獲取當日漲幅數據
const todayStockInfo = (open: string, close: string, change: string) => {
  // 開盤價
  const openValue = deleteThousand(open);
  // 收盤價
  const closeValue = deleteThousand(close);
  // 昨收價
  const yesterdayValue = yesterdayPrice(close, change);
  // 當日漲幅
  const changeValue = closeValue - openValue;
  // 當日漲幅率
  const changeValueP = (changeValue / yesterdayValue) * 100;

  return {
    change: changeValue,
    changePresent: thousandType(changeValueP),
    yesterday: thousandType(yesterdayValue),
  };
};

export default function StockSummary({ stockData, stockName }: PropsTypes) {
  // 當日漲幅 / 增幅率 / 昨收價
  const { change, changePresent, yesterday } = todayStockInfo(stockData.open, stockData.close, stockData.change);

  const renderIcon = change > 0 ? "rise" : "fall";
  const mappingIcons = {
    rise: "rise",
    fall: "fall",
  };
  // 获取涨跌颜色和箭头图标
  const { color, icon } = getChangeStyle(change);

  // 渲染单个数据列
  const RenderDetail = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 第一部分：股票名称和实时价格 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.symbolText}>{stockName}</Text>
          <Text style={styles.nameText}>{stockData.date}</Text>
        </View>

        <View style={styles.priceSection}>
          <Text style={[styles.currentPriceText, { color }]}>{stockData.close}</Text>
          <View style={styles.changeRow}>
            {icon && <AntDesign name={mappingIcons[renderIcon] as IconsType} size={16} color={color} style={{ marginRight: 4 }} />}
            <Text style={[styles.changeText, { color }]}>
              {thousandType(change)} ({changePresent}%)
            </Text>
          </View>
        </View>
      </View>

      {/* 第二部分：当日摘要数据（最高、最低、交易量等） */}
      <View style={styles.summaryGrid}>
        <View style={styles.column}>
          <RenderDetail label="最高價" value={stockData.high} />
          <RenderDetail label="開盤價" value={stockData.open} />
          <RenderDetail label="昨收價" value={yesterday} />
        </View>

        <View style={styles.column}>
          <RenderDetail label="最低價" value={stockData.low} />
          <RenderDetail label="收盤價" value={stockData.close} />
        </View>
      </View>

      {/* 第三部分：交易量 */}
      <View style={styles.volumeSection}>
        <Text style={styles.volumeLabel}>交易量</Text>
        <Text style={styles.volumeValue}>{stockData.count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginTop: 10,
    marginBottom: 7,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 7,
  },
  symbolText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  nameText: {
    fontSize: 14,
    color: "#666",
  },
  priceSection: {
    alignItems: "flex-end",
  },
  currentPriceText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  changeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  column: {
    width: "48%", // 两栏布局
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  volumeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 7,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  volumeLabel: {
    fontSize: 14,
    color: "#666",
  },
  volumeValue: {
    fontSize: 14,
    fontWeight: "500",
  },
});
