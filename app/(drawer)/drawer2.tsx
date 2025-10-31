import StockSummary, { StockProps } from "@/components/stock/stock";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import DateTimePickerComponent from "@/components/ui/date-picker";
import DropDown from "@/components/ui/drop-down";
import { FlashList } from "@shopify/flash-list";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type RenderItemProps = {
  item: StockProps;
};

type TransformDateTypes = (date: Date | number, type: "" | "transform") => string;
type GetPrevMonthStockDataTypes = (date: Date) => Date;

type API_types = {
  searchStock(date: string, name: string): Promise<StockProps[] | []>;
};

export default function Drawer2() {
  const [stockName, setStockName] = useState("");
  const [stock, setStock] = useState<StockProps[] | []>([]);

  const [isDate, setIsDate] = useState<Date>(new Date());
  const [isLoadDate, setIsLoadDate] = useState<Date>(new Date());

  const [isLoading, setIsLoading] = useState(false);

  const API: API_types = {
    searchStock: async (date, name) => {
      if (!date || !name) {
        if (Platform.OS === "web") {
          alert("請輸入代碼 / 日期後重新嘗試");
          return [];
        } else {
          showAlert("請輸入代碼 / 日期後重新嘗試");
          return [];
        }
      }

      const url = `https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=${date}&stockNo=${name}`;
      const response = await fetch(url);
      const result = await response.json();
      if (result.stat === "OK") {
        const stockData: StockProps[] = result?.data?.map((item: string[]) => {
          return {
            date: item?.[0],
            volume: item?.[1],
            volumeMoney: item?.[2],
            open: item?.[3],
            high: item?.[4],
            low: item?.[5],
            close: item?.[6],
            change: item?.[7],
            count: item?.[8],
          };
        });
        const sortStockData = stockData?.sort((a, b) => b?.date?.localeCompare(a?.date));
        // console.log(sortStockData);
        return sortStockData;
      } else {
        return [];
      }
    },
  };

  // 渲染FlashList 套件 函數
  const renderItemFunc = ({ item }: RenderItemProps) => {
    return <StockSummary key={item.date} stockData={item} stockName={stockName} />;
  };
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
  // 獲取上一個月份/年份
  const getPrevMonthStockData: GetPrevMonthStockDataTypes = (date) => {
    const getMonth = date.getMonth(); // 如果 月份 = 0 表示 1 月 要往前一年開始找
    const getYear = date.getFullYear();
    if (getMonth === 0) return new Date(`${getYear - 1}/12/31`);
    return new Date(date.setMonth(getMonth - 1));
  };
  // 查詢 alert
  const showAlert = (msg: string) => {
    Alert.alert("查詢失敗", msg, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };

  // 首次查詢股票 API
  const stockApi = async () => {
    const searchDate = transformDate(isDate, "transform");
    const result = await API.searchStock(searchDate, stockName);
    setStock(result);
  };
  // 觸底 加載更多 API
  const onEndReached = async () => {
    if (!isLoading && stock?.length >= 1) {
      console.log("觸碰到底部，加載更多");
      setIsLoading(true);
      const prevMonth = transformDate(getPrevMonthStockData(isLoadDate), "transform");
      const result = await API.searchStock(prevMonth, stockName);
      setTimeout(() => {
        setStock((initData) => [...initData, ...result]);
        setIsLoading(false);
      }, 5000);
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.searchContainer}>
          <DropDown value={stockName} setValue={setStockName} />
          <DateTimePickerComponent initialDate={isDate} onDateChange={setIsDate} setIsLoadDate={setIsLoadDate} />
          <TouchableOpacity style={styles.apiButtonStyle} activeOpacity={0.9} onPress={stockApi}>
            <ThemedText>查詢</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={[styles.container, { padding: 10 }]}>
          <FlashList
            data={stock}
            keyExtractor={(item) => item.date}
            renderItem={renderItemFunc}
            onEndReachedThreshold={0.2}
            onEndReached={onEndReached}
            ListFooterComponent={() => <FlashListItemFooter loading={isLoading} />}
          />
        </ThemedView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
type footerProps = {
  loading: boolean;
};

export function FlashListItemFooter({ loading = false }: footerProps) {
  if (loading) {
    return (
      <ThemedView style={styles.footerView}>
        <ActivityIndicator size="large" color="#fff" />
      </ThemedView>
    );
  }
  return null;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: "relative",
    zIndex: 1000,
    padding: 10,
  },
  apiButtonStyle: {
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "darkgreen",
    color: "white",
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
