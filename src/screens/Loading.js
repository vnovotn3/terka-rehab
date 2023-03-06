import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { getFromStorage, removeFromStorage } from "../Functions";

export default function Loading({ navigation }) {
  useEffect(() => {
    //removeFromStorage("id");
    getFromStorage("id").then((id) => {
      if (id) {
        navigation.replace("Home");
      } else {
        navigation.replace("Login");
      }
    });
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
