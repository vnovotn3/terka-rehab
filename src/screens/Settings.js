import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { getFromStorage, removeFromStorage } from "../Functions";
import Constants from "expo-constants";

export default function Settings({ navigation }) {
  const [code, setCode] = useState("");

  useEffect(() => {
    getFromStorage("code").then((c) => setCode(c));
  }, []);

  const handleSubmit = async () => {
    removeFromStorage("code");
    removeFromStorage("id").then(() => navigation.replace("Loading"));
  };

  return (
    <View style={styles.inside}>
      <Text style={styles.text}>Kód uživatele</Text>
      <TextInput
        style={styles.textInput}
        value={code}
        showSoftInputOnFocus={false}
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Odhlásit se</Text>
      </TouchableOpacity>
      <Text style={styles.text2}>
        Verze aplikace: {Constants.manifest.version}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inside: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: "8%",
    paddingLeft: "8%",
    height: "100%",
  },
  primaryButton: {
    flexDirection: "row",
    borderRadius: 10,
    height: 60,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    backgroundColor: "#ff2d55",
  },
  textInput: {
    textAlign: "center",
    height: 60,
    fontSize: 18,
    width: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#e5e5ea",
    fontWeight: "600",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 15,
  },
  text2: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    color: "gray",
  },
  primaryButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
});
