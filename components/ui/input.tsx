import { StyleSheet, TextInput } from "react-native";

type InputProps = {
  placeholder?: string;
  isKeyword: string;
  setIsKeyword(str: string): void;
};

export default function Input({ isKeyword, setIsKeyword, placeholder = "輸入關鍵字" }: InputProps) {
  return (
    <TextInput style={styles.input} placeholder={placeholder} onChangeText={(value) => setIsKeyword(value)} defaultValue={isKeyword} />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 300,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: "white",
    color: "white",
  },
});
