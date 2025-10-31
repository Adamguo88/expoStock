import BlockTradeTable from "@/components/stock/blockTradeTable";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import DateTimePickerComponent from "@/components/ui/date-picker";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

type TransformDateTypes = (date: Date | number, type: "" | "transform") => string;

type StockDataTypes = string[];

type API_Types = {
  call_search_stock_api(date: string): Promise<StockDataTypes[] | []>;
};

export default function Drawer3() {
  const [isDate, setIsDate] = useState<Date>(new Date());

  const [isStockData, setIsStockData] = useState<StockDataTypes[] | []>([]);

  // 日期轉換 返回 YYYY/MM/DD 格式
  const transformDate: TransformDateTypes = (date, type) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" } as const;
    let returnDate = "";
    if (typeof date === "number") {
      returnDate = new Date(date).toLocaleDateString("zh-tw", options);
    } else {
      returnDate = date.toLocaleDateString("zh-tw", options);
    }
    return type === "transform" ? returnDate?.replaceAll("/", "") : returnDate;
  };

  const API: API_Types = {
    call_search_stock_api: async (date) => {
      const url = `https://www.twse.com.tw/rwd/zh/block/BFIAUU?date=${date}&selectType=S&response=json`;
      const response = await fetch(url);
      const responseData = await response.json();
      const stockData = responseData.data;
      if (response.ok && stockData.length >= 1) {
        return stockData?.slice(0, stockData?.length - 1);
      }
      return [];
    },
  };

  const stockApi = async () => {
    const transDate = transformDate(isDate, "transform");
    const stockData = await API.call_search_stock_api(transDate);
    setIsStockData(stockData);
    console.log(stockData);
  };
  return (
    <ThemedView style={styles.container}>
      <DateTimePickerComponent initialDate={isDate} onDateChange={setIsDate} />
      <TouchableOpacity style={styles.apiButtonStyle} activeOpacity={0.9} onPress={stockApi}>
        <ThemedText>查詢</ThemedText>
      </TouchableOpacity>
      <BlockTradeTable isStockData={isStockData} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  apiButtonStyle: {
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "darkgreen",
    color: "white",
  },
  text: {
    textAlign: "center",
    color: "#fff",
  },
});
