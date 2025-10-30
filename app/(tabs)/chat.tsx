import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";

const markdownText = `# 標題一\n\n**這是粗體文字** 和 *斜體文字*。\n\n- 列表項目 1\n- 列表項目 2\n\n\`\`\`javascript\nconsole.log("Hello, Gemini!");\n\`\`\``;

type chatRecord = {
  role: string;
  content: string;
};

export default function GeminiChat() {
  const [isChatList, setIsChatList] = useState<chatRecord[] | []>([]);
  const callChartRecord = async () => {
    const historyApiUrl = process.env.EXPO_PUBLIC_API_URL + `/api/history`;
    try {
      const sessionId = "user-1759808269118";
      const response = await fetch(historyApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (response.status === 444) {
        console.log("新的對話，沒有歷史紀錄。");
        return [];
      }

      if (!response.ok) {
        throw new Error(`HTTP 錯誤! 狀態: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.history);
      setIsChatList(data.history);

      // 返回格式化後的歷史訊息陣列，您可以用它來顯示在聊天介面上
      return data.history;
    } catch (error) {
      console.error("獲取歷史紀錄失敗:", error);
      return [];
    }
  };
  useEffect(() => {
    callChartRecord();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {isChatList?.map((item, index) => {
          return (
            <Markdown key={index} style={markdownStyles}>
              {item.content as string}
            </Markdown>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  content: { padding: 10 },
});

// 客製化樣式（可選）
const markdownStyles = {
  heading1: { color: "navy", fontSize: 24 },
  strong: { color: "red" },
  // 更多樣式...
};
