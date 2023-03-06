import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  getFromStorage,
  isInFuture,
  isToday,
  formateTime,
  WIDTH,
  HEIGHT,
} from "../Functions";
import { getRehab } from "../Api";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

export default function Home({ navigation }) {
  const [isConnected, setConnected] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [rehab, setRehab] = useState(null);
  const isFocused = useIsFocused();

  const loadRehab = async () => {
    getFromStorage("id").then((id) =>
      getRehab(id)
        .then((res) => {
          if (res == null) {
            setConnected(false);
          } else {
            setRehab(res);
            //console.log(rehab);
          }
        })
        .finally(() => setLoading(false))
    );
  };

  const isFinished = (status) => {
    return (
      status == "FINISHED_WITH_EASE" || status == "FINISHED_WITH_DIFFICULTY"
    );
  };

  const statusColor = (status, date) => {
    if (isInFuture(date)) {
      return "white";
    } else if (isFinished(status)) {
      return "#34c759";
    } else if (isToday(date)) {
      return "#ff9500";
    }
    return "#ff2d55";
  };

  const statusIcon = (status, date) => {
    if (isInFuture(date)) {
      return "md-time-outline";
    } else {
      switch (status) {
        case "SKIPPED":
          return "close-circle-sharp";
        case "FINISHED_WITH_EASE":
          return "checkmark-circle";
        case "FINISHED_WITH_DIFFICULTY":
          return "checkmark-circle";
      }
    }
  };

  const statusTextColor = (date) => {
    if (isInFuture(date)) {
      return "gray";
    } else {
      return "white";
    }
  };

  const todayExercise = () => {
    var res = null;
    rehab.steps.forEach((s, i) => {
      if (isToday(s.startTime) && !res) {
        res = s;
      }
    });
    return res;
  };

  useEffect(() => {
    if (isFocused) {
      loadRehab();
    }
  }, [isFocused]);

  const onRefresh = useCallback(async () => {
    setLoading(true);
    loadRehab();
  }, [isLoading]);

  return (
    <View style={styles.container}>
      {/* connection error */}
      {!isConnected && (
        <View style={styles.errorCont}>
          <MaterialIcons name="wifi-off" size={100} color="gray" />
          <Text style={styles.errorText}>
            Vypadá to, že nemáte připojení k internetu
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={onRefresh}
            activeOpacity={0.8}
          >
            <Text style={styles.errorButtonText}>Načíst znovu</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* no rehab */}
      {rehab != null && rehab.id == null && (
        <View style={styles.errorCont}>
          <MaterialIcons name="info-outline" size={100} color="gray" />
          <Text style={styles.errorText}>
            Vypadá to, že nemáte přidělenou žádnou rehabilitaci
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={onRefresh}
            activeOpacity={0.8}
          >
            <Text style={styles.errorButtonText}>Načíst znovu</Text>
          </TouchableOpacity>
        </View>
      )}

      {rehab != null && rehab.id != null && (
        <View>
          {todayExercise() != null &&
            todayExercise().status == "NOT_FINISHED" && (
              <View style={styles.bottomPanel}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() =>
                    navigation.navigate("Exercise", {
                      title: formateTime(todayExercise().startTime),
                      step: todayExercise(),
                    })
                  }
                >
                  <Text style={styles.primaryButtonText}>
                    ZAČÍT DNEŠNÍ CVIČENÍ
                  </Text>
                </TouchableOpacity>
              </View>
            )}

          <FlatList
            onRefresh={onRefresh}
            refreshing={isLoading}
            contentContainerStyle={styles.exercises}
            data={rehab.steps}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index, separators }) => (
              <TouchableOpacity
                disabled={isInFuture(item.startTime)}
                onPress={() =>
                  navigation.navigate("Exercise", {
                    title: formateTime(item.startTime),
                    step: item,
                  })
                }
                style={[
                  styles.row,
                  {
                    backgroundColor: statusColor(item.status, item.startTime),
                  },
                ]}
              >
                <View style={styles.left}>
                  <Text
                    style={[
                      styles.date,
                      {
                        color: statusTextColor(item.startTime),
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {formateTime(item.startTime)}
                  </Text>
                  <Text
                    style={[
                      styles.name,
                      {
                        color: statusTextColor(item.startTime),
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.exercise.name}
                  </Text>
                </View>
                <View style={styles.right}>
                  {isToday(item.startTime) && !isFinished(item.status) && (
                    <View style={styles.button}>
                      <Text
                        style={[
                          styles.buttonText,
                          { color: statusColor(item.status, item.startTime) },
                        ]}
                      >
                        ZAČÍT CVIČIT
                      </Text>
                    </View>
                  )}
                  {!isToday(item.startTime) &&
                    !isInFuture(item.startTime) &&
                    item.status == "NOT_FINISHED" && (
                      <View style={styles.button}>
                        <Text
                          style={[
                            styles.buttonText,
                            { color: statusColor(item.status, item.startTime) },
                          ]}
                        >
                          OZNAČIT
                        </Text>
                      </View>
                    )}
                  {(item.status != "NOT_FINISHED" ||
                    isInFuture(item.startTime)) && (
                    <Ionicons
                      name={statusIcon(item.status, item.startTime)}
                      size={32}
                      color={statusTextColor(item.startTime)}
                    />
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  exercises: {
    alignItems: "center",
    justifyContent: "top",
    minHeight: "100%",
    paddingTop: 10,
    paddingBottom: 100,
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
  },
  primaryButton: {
    flexDirection: "row",
    borderRadius: 10,
    height: 60,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff9500",
  },
  primaryButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 18,
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
