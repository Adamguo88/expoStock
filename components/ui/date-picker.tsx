import React, { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// 导入 DateTimePickerComponent 和 DateTimePickerEvent 的类型
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

// 定义组件的 Props 类型
interface DateSelectorProps {
  onDateChange: (date: Date) => void;
  setIsLoadDate?: (date: Date) => void;
  initialDate?: Date;
}

const DateTimePickerComponent: React.FC<DateSelectorProps> = ({ onDateChange, setIsLoadDate, initialDate = new Date() }) => {
  // 使用 Date 类型来存储选中的日期
  const [date, setDate] = useState<Date>(initialDate);

  // 使用 boolean 类型来控制日期选择器模态框的显示状态
  const [showPicker, setShowPicker] = useState<boolean>(false);

  /**
   * 处理日期/时间选择事件
   * @param event - DateTimePickerEvent 事件对象
   * @param selectedDate - 用户选中的日期对象 (Date | undefined)
   */
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // 确保 selectedDate 有值，如果用户取消选择，则为 undefined
    const currentDate = selectedDate || date;
    console.log(currentDate);

    // 只有当 action 不是 'dismissed' (例如用户按了 Android 的取消按钮) 且日期有变化时才更新
    if (event.type === "set") {
      setDate(currentDate);
      // 将选中的日期传递给父组件
      onDateChange(currentDate);
      if (typeof setIsLoadDate === "function") {
        setIsLoadDate(currentDate);
      }
    }
    setShowPicker(false);
  };

  // 格式化日期显示（自定义显示格式）
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "numeric",
      day: "2-digit",
    });
  };

  // 触发日期选择器显示
  const showDatepicker = () => {
    setShowPicker(true);
  };
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>選擇交易日期:</Text>
        <input
          type="date"
          onChange={(v) => {
            const resultDate = new Date(v.target.value);
            onDateChange(resultDate);
            if (typeof setIsLoadDate === "function") {
              setIsLoadDate(resultDate);
            }
          }}
          defaultValue={new Date().toLocaleDateString("zh-Tw")?.replaceAll("/", "-")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>選擇交易日期:</Text>

      {/* 用于显示当前选中日期和触发选择器的按钮 */}
      <TouchableOpacity onPress={showDatepicker} style={styles.dateInput}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </TouchableOpacity>

      {/* 仅在 showPicker 为 true 时渲染 RNDateTimePicker */}
      {showPicker && (
        <RNDateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date" // 指定为日期选择模式
          // 在 iOS 上通常使用 'spinner' 或 'compact'。在 Android 上使用 'default'。
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          // 股票数据通常不能选择未来的日期
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
    color: "white",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    backgroundColor: "#fafafa",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
});

export default DateTimePickerComponent;
