import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import io from "socket.io-client";

const path = `http://localhost:3000`;

type AuthorizationProps = {
  status: string;
  uuid: string;
};
type NewUserProps = {
  uuid?: string;
  getAuthorization(uuid?: string): Promise<AuthorizationProps>;
};
export default function ChatPage() {
  const [isStatus, setIsStatus] = useState("尚未連線");
  const [isSocketData, setIsSocketData] = useState("");
  const [socketCache, setIsSocketCache] = useState<any>(null);

  const sendMessage = () => {
    const message = isSocketData === "admin" ? "給管理員的舉報案件" : "回復用戶問題";
    const user = isSocketData === "admin" ? "superAdmin" : "admin";
    socketCache.send({ user: user, message: message });
  };

  // 獲取憑證
  const getAuthorization = async (uuid?: string) => {
    try {
      const request = await fetch("http:localhost:3000/api/authorization", {
        method: "POST",
        body: JSON.stringify({ code: uuid }),
        headers: { "Content-Type": "application/json" },
      });
      const response = await request.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  const disconnectionSocket = () => {
    if (isSocketData?.length >= 1) {
      socketCache?.disconnect();
      setIsSocketData("");
      setIsStatus("尚未連線");
      setIsSocketCache(null);
    }
  };
  const connectionSocket = async (role: string = "") => {
    if (isSocketData.length <= 0) {
      const response: AuthorizationProps = await getAuthorization(role);
      if (response?.uuid) {
        setIsSocketData(response?.uuid);
      }
    }
  };

  useEffect(() => {
    if (!!socketCache) {
      socketCache.on("connect", (msg: any) => {
        setIsStatus(`1 Socket.IO 連線成功 (路徑: /socket) ${isSocketData}`);
      });
      socketCache.on("news", (msg: any) => {
        console.log(msg);
      });
      socketCache.on("status", (msg: any) => {
        console.log("2 伺服器狀態:", msg);
      });
      socketCache.on("disconnect", () => {
        setIsStatus("3 Socket.IO 已斷線");
      });
    }
  }, [socketCache]);

  useEffect(() => {
    if (!!isSocketData) {
      const cacheSocketStatus = io(path, {
        path: "/socket",
        transports: ["websocket"],
        autoConnect: true,
        auth: { token: isSocketData },
      });
      setIsSocketCache(cacheSocketStatus);
    }
  }, [isSocketData]);
  return (
    <ThemedView style={styles.container}>
      <ThemedText>{isStatus}</ThemedText>
      <TouchableOpacity style={[styles.addStyle, { backgroundColor: "darkred" }]} activeOpacity={0.8} onPress={disconnectionSocket}>
        <ThemedText style={styles.addText}>切斷連線</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.addStyle, { backgroundColor: "darkgoldenrod" }]}
        activeOpacity={0.8}
        onPress={() => connectionSocket("admin")}
      >
        <ThemedText style={styles.addText}>連線Socket - admin</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.addStyle, { backgroundColor: "blueviolet" }]}
        activeOpacity={0.8}
        onPress={() => connectionSocket("superAdmin")}
      >
        <ThemedText style={styles.addText}>連線Socket - superAdmin</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.addStyle, { backgroundColor: "cadetblue" }]}
        activeOpacity={0.8}
        onPress={() => connectionSocket("")}
      >
        <ThemedText style={styles.addText}>連線Socket</ThemedText>
      </TouchableOpacity>
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

export function CreateNewUser({ uuid, getAuthorization }: NewUserProps) {
  const [isClient, setIsClient] = useState("");
  const callGetAuthorization = async () => {
    const response: AuthorizationProps = await getAuthorization(uuid);
    if (response?.uuid) {
      console.log(response);
      setIsClient(response.uuid);
    }
  };
  return (
    <TouchableOpacity
      style={styles.addStyle}
      activeOpacity={0.8}
      onPress={isClient ? undefined : callGetAuthorization}
      disabled={!!isClient}
    >
      <ThemedText style={styles.addText}>新用戶註冊</ThemedText>
      <ThemedText style={styles.addText}>{isClient}</ThemedText>
    </TouchableOpacity>
  );
}
