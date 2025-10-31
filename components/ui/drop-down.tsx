import React, { Dispatch, SetStateAction, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { ThemedText } from "../themed-text";

type SearchIngList = {
  label: string;
  value: string;
};

type DropDownPropsType = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
};

export default function DropDown({ value, setValue }: DropDownPropsType) {
  const [open, setOpen] = useState(false);
  // const [value, setValue] = useState(""); // 預設值為 TSM
  const [items, setItems] = useState<SearchIngList[] | []>([]);

  const debounce = (callback: any, timeout = 600) => {
    let timer: number;
    return (props: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback(props);
      }, timeout);
    };
  };

  const search_tw_stock_list_api = debounce(async (item: string) => {
    const url = `https://www.twse.com.tw/rwd/zh/api/codeQuery?query=${item}`;
    const response = await fetch(url);
    const result = await response.json();
    const list: string[] | [] = result.suggestions ?? [];
    if (list.length >= 1) {
      const searchDropDownList = list?.map((item) => ({ label: item, value: item?.split("\t")?.[0] }));
      // console.log(searchDropDownList);
      setItems(searchDropDownList);
    } else {
      setItems([]);
    }
    console.log(list);
  }, 600);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>選擇股票代碼:</Text>
      <DropDownPicker
        searchable={true}
        searchPlaceholder="輸入股票代號"
        onChangeSearchText={search_tw_stock_list_api}
        searchTextInputProps={{ keyboardType: Platform.OS === "ios" ? "number-pad" : undefined }}
        translation={{ NOTHING_TO_SHOW: "查無資料" }}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="請選擇查詢股票"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={1000}
        maxHeight={400}
        renderListItem={(item) => {
          const splitStock = item.label?.split("\t");
          const stockNumber = splitStock?.[0];
          const stockName = splitStock?.[1];

          return (
            <Pressable
              style={styles.dropItemList}
              onPress={() => {
                setValue(stockNumber);
                setOpen(false);
              }}
            >
              <ThemedText style={{ color: "#000" }}>
                {stockNumber} {stockName}
              </ThemedText>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropItemList: {
    backgroundColor: "white",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  container: {
    // 必須為父元件設定一個 zIndex，以便在 dropdown 展開時顯示
    zIndex: 1000,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
    color: "white",
  },
  dropdown: {
    backgroundColor: "#fafafa",
    borderColor: "#ccc",
  },
  dropdownContainer: {
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
});
