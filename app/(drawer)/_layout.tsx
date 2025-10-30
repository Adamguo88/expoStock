import { CustomDrawerContent } from "@/components/drawer/drawerContent";
import { ThemedView } from "@/components/themed-view";
import { Drawer } from "expo-router/drawer";
import React from "react";

export default function DrawerLayout() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          title: "",
          headerTitleAlign: "center",
          // 最外層樣式
          // drawerStyle: {
          //   backgroundColor: "#f0f0f0",
          //   width: "80%",
          // },
          // Drawer.Screen 樣式
          drawerItemStyle: {
            marginVertical: 0,
            borderRadius: 4,
          },
          // 文字樣式
          drawerLabelStyle: {},
          // 選中的背景顏色
          drawerActiveBackgroundColor: "#fff",
          // 選中的文字、圖標顏色
          drawerActiveTintColor: "black",
          // 未選中的文字和圖標色
          drawerInactiveTintColor: "#fff",
        }}
      >
        <Drawer.Screen name="drawer1" options={{ title: "Drawer_1" }} />
        <Drawer.Screen name="drawer2" options={{ title: "當月行情查詢" }} />
        <Drawer.Screen name="drawer3" options={{ title: "Drawer_3" }} />
        <Drawer.Screen name="product/[id]" options={{ drawerItemStyle: { display: "none" } }} />
      </Drawer>
    </ThemedView>
  );
}
