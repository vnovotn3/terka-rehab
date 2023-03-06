import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import { currentTime, WIDTH, HEIGHT, isToday } from "../Functions";
import { Ionicons } from "@expo/vector-icons";
import { Video, AVPlaybackStatus } from "expo-av";
import { updateStep, VIDEO } from "../Api";
import RenderHtml from "react-native-render-html";

export default function Exercise({ route, navigation }) {
  const [step, setStep] = useState(route.params.step);

  const isFinished = () => {
    return (
      step.status == "FINISHED_WITH_EASE" ||
      step.status == "FINISHED_WITH_DIFFICULTY"
    );
  };

  const infoColor = () => {
    if (isToday(step.startTime) && !isFinished()) {
      return "#ff9500";
    } else if (isFinished()) {
      return "#34c759";
    }
    return "#ff2d55";
  };

  const infoText = () => {
    if (isFinished()) {
      return "CVIČENÍ DOKONČENO";
    } else if (step.status == "SKIPPED") {
      return "CVIČENÍ PŘESKOČENO";
    } else if (step.status == "NOT_FINISHED") {
      return "CVIČENÍ NEDOKONČENO";
    }
    return "";
  };

  const handleSkip = async () => {
    var body = { finishedTime: currentTime(), status: 0, message: null };
    updateStep(step.id, body).then((res) => {
      if (res) {
        Alert.alert("Cvičení přeskočeno.");
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
    <View style={styles.container}>
      {step.status == "NOT_FINISHED" && (
        <View style={styles.bottomPanel}>
          {isToday(step.startTime) && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("Survey", { stepId: step.id })}
            >
              <Text style={styles.primaryButtonText}>DOKONČIT</Text>
              <Ionicons
                name={"checkmark-circle-outline"}
                size={30}
                color="white"
              />
            </TouchableOpacity>
          )}
          {!isToday(step.startTime) && (
            <>
              <TouchableOpacity
                style={[styles.primaryButton, { width: "48%" }]}
                onPress={() =>
                  navigation.navigate("Survey", { stepId: step.id })
                }
              >
                <Text style={styles.primaryButtonText}>DOKONČIT</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: "#ff2d55", width: "48%" },
                ]}
                onPress={handleSkip}
              >
                <Text style={styles.primaryButtonText}>PŘESKOČIT</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollViewCont}>
        {((isToday(step.startTime) && isFinished()) ||
          !isToday(step.startTime)) && (
          <View style={[styles.infoCont, { backgroundColor: infoColor() }]}>
            <Text style={styles.info}>{infoText()}</Text>
          </View>
        )}
        <Video
          style={styles.video}
          source={{
            uri: VIDEO + step.exercise.video,
          }}
          useNativeControls
          resizeMode="cover"
        />
        <View style={styles.textCont}>
          <Text style={styles.title}>{step.exercise.name}</Text>
          <RenderHtml
            contentWidth={WIDTH}
            source={{ html: step.exercise.note }}
            tagsStyles={{
              body: {
                fontSize: 16,
              },
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewCont: {
    alignItems: "center",
    justifyContent: "top",
    minHeight: "100%",
    paddingBottom: 100,
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
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
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
  bottomPanel: {
    borderColor: "#c7c7cc",
    borderTopWidth: 1,
    position: "absolute",
    bottom: 0,
    zIndex: 2,
    elevation: 2,
    width: "100%",
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "white",
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryButton: {
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
  title: {
    fontWeight: "600",
    fontSize: 20,
    marginBottom: 5,
    marginTop: 5,
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
});
