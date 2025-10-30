// 假設這個文件是 components/CustomDrawerContent.tsx (放在 app/ 之外或任何方便的地方)
import { StyleSheet, Text, View } from "react-native";
// 引入 DrawerContentScrollView 和 DrawerItemList，用於保留預設的選單列表功能
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CollapsibleDrawer from "./collapsibleDrawer";

const initialState = [
  { id: "1", title: "商品_1" },
  { id: "2", title: "商品_2" },
  { id: "3", title: "商品_3" },
  { id: "4", title: "商品_4" },
  { id: "5", title: "商品_5" },
  { id: "6", title: "商品_6" },
  { id: "7", title: "商品_7" },
  { id: "8", title: "商品_8" },
  { id: "9", title: "商品_9" },
  { id: "10", title: "商品_10" },
];
const initialState2 = Array.from({ length: 2000 }).map((_, index) => {
  const newIndex = String(index + 11);
  return { id: newIndex, title: `商品_${newIndex}` };
});
const initialState3 = Array.from({ length: 80 }).map((_, index) => {
  const newIndex = String(index + Date.now());
  return { id: newIndex, title: `商品_${newIndex}` };
});

// 這是您的自定義 Header 組件
const DrawerHeader = () => (
  <View style={styles.headerContainer}>
    {/* <Image style={styles.profileImage} contentFit="contain" source={require("@/assets/images/logo.png")} /> */}
    <Text style={styles.appName}>Expo App</Text>
    <Text style={styles.userEmail}>user@example.com</Text>
  </View>
);

// 這是您的自定義 Footer 組件
const DrawerFooter = () => (
  <View style={styles.footerContainer}>
    <Text style={styles.appName}>Expo Footer</Text>
  </View>
);

// 這是完整的自定義 Drawer Content 組件
export function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {/* 1. 放置自定義 Header */}
        <DrawerHeader />
        {/* DrawerContentScrollView 確保內容可滾動 */}
        <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 16 }}>
          {/* 2. 預設的選單項目列表 (由 Expo Router 自動生成) */}

          <DrawerItemList {...props} />

          {/* <CollapsibleDrawer>
            <ThemedView style={{ padding: 16 }}>
              <ThemedText style={{ fontSize: 16, fontWeight: "bold" }}>測試</ThemedText>
            </ThemedView>
          </CollapsibleDrawer> */}
          <CollapsibleDrawer title="分類1" routerList={initialState} />
          <CollapsibleDrawer title="分類2" routerList={initialState2} />
          <CollapsibleDrawer title="分類3" routerList={initialState3} />
        </DrawerContentScrollView>
        <DrawerFooter />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    height: "100%",
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  headerContainer: {
    padding: 20,
    backgroundColor: "#3f51b5", // Header 區域背景色
    // marginBottom: 10,
  },
  profileImage: {
    width: 130,
    height: 60,
    marginBottom: 10,
    // borderRadius: 40,
    // borderWidth: 2,
    // borderColor: "#fff",
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  userEmail: {
    fontSize: 14,
    color: "#ccc",
  },
  footerContainer: {
    padding: 20,
    backgroundColor: "#3f51b5", // footer 區域背景色
    marginTop: 10,
  },
});
