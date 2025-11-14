import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const path = `http://localhost:3000`;
export default function ChatPage() {
  const socket = useRef<any>(null);
  const [isStatus, setIsStatus] = useState("尚未連線");
  const [isSocketData, setIsSocketData] = useState({ socketID: "", uuid: "" });

  const sendMessage = () => {
    console.log("hello");
  };

  // 獲取憑證
  const getAuthorization = async (uuid?: string) => {
    const request = await fetch("http:localhost:3000/api/authorization", {
      method: "POST",
      body: JSON.stringify({ code: uuid }),
      headers: { "Content-Type": "application/json" },
    });
    const response = await request.json();
    return response;
  };

  useEffect(() => {
    async function socketConnection() {
      const getUUID = await getAuthorization("admin");
      if (getUUID.uuid) {
        console.log(getUUID.uuid);
      }

      // return getUUID;
    }
    socketConnection();

    // const uuid = self.crypto.randomUUID();
    // socket.current = io(path, {
    //   path: "/socket",
    //   transports: ["websocket"],
    //   autoConnect: true,
    //   auth: {
    //     token: uuid,
    //   },
    // });

    // socket.current.on("connect", () => {
    //   const socketData = { socketID: socket.current.id, uuid };
    //   setIsSocketData(socketData);
    //   setIsStatus("Socket.IO 連線成功 (路徑: /socket)");
    // });

    // socket.current.on("status", (msg: any) => {
    //   console.log("伺服器狀態:", msg);
    // });

    // socket.current.on("disconnect", () => {
    //   setIsStatus("Socket.IO 已斷線");
    // });

    // return () => {
    //   socket.current.disconnect();
    // };
  }, []);
  return (
    <ThemedView style={styles.container}>
      <ThemedText>{isStatus}</ThemedText>
      <TouchableOpacity style={styles.addStyle} activeOpacity={0.8} onPress={sendMessage}>
        <ThemedText style={styles.addText}>插入一筆數據</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#666",
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
});
