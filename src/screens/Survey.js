import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from "react-native";
import { WIDTH, HEIGHT, currentTime } from "../Functions";
import DropDownPicker from "react-native-dropdown-picker";
import { getAnswers, updateStep } from "../Api";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

export default function Survey({ route, navigation }) {
  const [withoutDifficulties, setWithoutDifficulties] = useState(true);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [text, setText] = useState("");
  const [answers, setAnswers] = useState([]);

  const loadAnswers = async () => {
    getAnswers().then((list) => {
      if (list) {
        var new_list = [];
        list.forEach((v, i) => {
          new_list.push({
            label: v,
            value: i,
          });
        });
        new_list.push({ label: "Jiné", value: new_list.length });
        setAnswers(new_list);
      }
    });
  };

  useEffect(() => {
    loadAnswers();
  }, []);

  const handleSubmit = async () => {
    var body = { finishedTime: currentTime() };
    if (withoutDifficulties) {
      body.status = 1;
      body.message = null;
    } else {
      body.status = 2;
      if (value == answers.length - 1) {
        //custom message
        if (text == "") {
          //empty
          Alert.alert("Prosím uveďte vaše potíže při cvičení.");
          return;
        } else {
          body.message = text;
        }
      } else {
        body.message = answers[value].label;
      }
    }

    updateStep(route.params.stepId, body).then((res) => {
      if (res) {
        Alert.alert("Vaše odpověď byla odeslána.");
      } else {
        Alert.alert("Něco se nepovedlo, zkuste to znovu.");
      }
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    });
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="never"
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>Jak se vám cvičilo?</Text>
      <View style={styles.toggle}>
        <TouchableOpacity
          onPress={() => {
            setWithoutDifficulties(true);
            setValue(0);
          }}
          style={[
            styles.toggle1,
            {
              backgroundColor: withoutDifficulties
                ? "white"
                : "rgb(229,229,234)",
            },
          ]}
        >
          <Text
            style={[
              styles.toggleText,
              { color: withoutDifficulties ? "black" : "black" },
            ]}
          >
            Bez obtíží
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setWithoutDifficulties(false)}
          style={[
            styles.toggle2,
            {
              backgroundColor: !withoutDifficulties
                ? "white"
                : "rgb(229,229,234)",
            },
          ]}
        >
          <Text
            style={[
              styles.toggleText,
              { color: !withoutDifficulties ? "black" : "black" },
            ]}
          >
            S obtížemi
          </Text>
        </TouchableOpacity>
      </View>

      {!withoutDifficulties && (
        <>
          <Text style={[styles.title, { paddingTop: 15 }]}>
            Vyberte jednu z odpovědí
          </Text>

          <DropDownPicker
            items={answers}
            open={open}
            setOpen={setOpen}
            value={value}
            setValue={setValue}
            containerStyle={styles.pickerCont}
            style={styles.picker}
            dropDownContainerStyle={styles.pickerDropdown}
            textStyle={styles.pickerText}
            listMode="SCROLLVIEW"
          />

          {value == answers.length - 1 && (
            <TextInput
              style={styles.textInput}
              placeholder="Popište, jak se vám cvičilo"
              placeholderTextColor="gray"
              value={text}
              onChangeText={setText}
              multiline={true}
              textAlignVertical="top"
            />
          )}
        </>
      )}

      <TouchableOpacity onPress={handleSubmit} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Dokončit cvičení</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingLeft: 25,
    paddingRight: 25,
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 8,
    marginTop: 8,
  },
  toggle: {
    borderWidth: 2,
    borderColor: "#d1d1d6",
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  toggleText: {
    fontSize: 18,
    fontWeight: "700",
  },
  toggle1: {
    borderRightWidth: 2,
    borderColor: "#d1d1d6",
    flex: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  toggle2: {
    flex: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  infoCont: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
  row: {
    width: WIDTH - 20,
    flexDirection: "row",
    borderRadius: 10,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "white",
  },
  left: {
    flex: 1,
    alignItems: "flex-start",
  },
  date: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    color: "white",
  },
  errorCont: {
    height: HEIGHT - 60,
    width: "100%",
    paddingRight: "8%",
    paddingLeft: "8%",
    justifyContent: "center",
    alignItems: "center",
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
  errorButton: {
    flexDirection: "row",
    borderRadius: 10,
    height: 60,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    backgroundColor: "#00c7be",
  },
  errorButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
  primaryButton: {
    marginTop: 25,
    flexDirection: "row",
    borderRadius: 10,
    height: 60,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34c759",
  },
  primaryButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 18,
    paddingRight: 10,
  },

  textCont: {
    width: "100%",
    padding: 20,
  },
  errorText: {
    textAlign: "center",
    color: "gray",
    fontWeight: "600",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "white",
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 100,
  },
  buttonText: {
    fontWeight: "700",
  },

  /* picker */

  picker: {
    backgroundColor: "white",
    borderRadius: 10,
    height: 60,
    borderWidth: 2,
    borderColor: "#d1d1d6",
  },
  pickerText: {
    fontSize: 18,
    fontWeight: "500",
  },
  pickerCont: {
    marginTop: 10,
  },
  pickerDropdown: {
    borderWidth: 2,
    borderColor: "#d1d1d6",
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  textInput: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#d1d1d6",
    height: 100,
    fontSize: 18,
    width: "100%",
    padding: 15,
    paddingTop: 15,
    borderRadius: 10,
    backgroundColor: "#e5e5ea",
  },
});
