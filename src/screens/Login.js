import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { register } from "../Api";
import { registerForPushNotificationsAsync } from "../Functions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { saveToStorage } from "../Functions";

const width = Dimensions.get("window").width;

export default function Login({ navigation }) {
  const [code, setCode] = useState();
  const [rehabCode, setRehabCode] = useState();
  const [connectExistingRehab, setConnectExistingRehab] = useState(false);

  const input2 = React.createRef();

  const handleSubmit = async () => {
    if (!code) {
      Alert.alert("Chyba", "Zadejte prosím registrační kód.");
    } else if (connectExistingRehab && !rehabCode) {
      Alert.alert("Chyba", "Zadejte prosím kód existující rehabilitace.");
    } else {
      //request notif token
      registerForPushNotificationsAsync().then((notifToken) =>
        register(code, rehabCode, notifToken).then((json) => {
          if (json) {
            if (json.success) {
              //successful login
              saveToStorage("id", json.id.toString()).then(() =>
                navigation.replace("Loading")
              );
              saveToStorage("code", json.code);
            } else {
              Alert.alert(
                "Chyba",
                "Registrace se nezdařila. Zkontrolujte prosím zadané údaje."
              );
            }
          } else {
            Alert.alert(
              "Chyba",
              "Registrace se nezdařila. Zkontrolujte připojení k internetu."
            );
          }
        })
      );
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.formContainer}
        keyboardShouldPersistTaps="never"
        contentContainerStyle={styles.inside}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Text style={styles.title}>Vítejte v Aplikaci TERKA</Text>
        <Text style={styles.subtitle}>
          Zadejte 4-místný kód, který vám sdělí váš lékař
        </Text>

        <TextInput
          style={styles.textInput}
          placeholder="Registrační kód"
          placeholderTextColor="gray"
          value={code}
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
          returnKeyType="next"
          onSubmitEditing={() => {
            if (connectExistingRehab) {
              input2.current.focus();
            }
          }}
          blurOnSubmit={false}
        />

        <TextInput
          style={[
            styles.textInput,
            {
              display: connectExistingRehab ? "flex" : "none",
            },
          ]}
          placeholder="Kód rehabilitace"
          ref={input2}
          placeholderTextColor="gray"
          value={rehabCode}
          onChangeText={(rehabCode) => setRehabCode(rehabCode)}
          keyboardType="numeric"
          blurOnSubmit={false}
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>
            {connectExistingRehab
              ? "Načíst rehabilitaci"
              : "Začít rehabilitaci"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.lightButton}
          onPress={() => setConnectExistingRehab(!connectExistingRehab)}
        >
          <Text style={styles.lightButtonText}>
            {connectExistingRehab
              ? "Založit novou rehabilitaci"
              : "Načíst existující rehabilitaci"}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
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
  formContainer: {
    width: "100%",
    height: "100%",
  },
  inside: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: "8%",
    paddingLeft: "8%",
    height: "100%",
  },

  //forms
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
  },
  primaryButton: {
    flexDirection: "row",
    borderRadius: 10,
    height: 60,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    backgroundColor: "#34c759",
  },
  primaryButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
  lightButton: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
  },
  lightButtonText: {
    color: "#34c759",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 30,
  },
});
