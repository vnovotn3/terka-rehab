import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";

export const getFromStorage = async (name) => {
  try {
    const item = await AsyncStorage.getItem("@" + name);
    return item;
  } catch (e) {
    console.log(e);
  }
};

export const saveToStorage = async (name, val) => {
  AsyncStorage.setItem("@" + name, val).catch();
};

export const removeFromStorage = async (name) => {
  AsyncStorage.removeItem("@" + name).catch();
};

export const registerForPushNotificationsAsync = async () => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    //console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};

// dates
const days = ["PO", "ÚT", "ST", "ČT", "PÁ", "SO", "NE"];
export const formateTime = (time) => {
  var date = new Date(time);
  return (
    days[(date.getDay() + 6) % 7] +
    " " +
    date.getDate() +
    ". " +
    (date.getMonth() + 1) +
    ". " +
    ("0" + date.getHours()).slice(-2) +
    ":" +
    ("0" + date.getMinutes()).slice(-2)
  );
};

export const currentTime = () => {
  var currentdate = new Date();
  return (
    currentdate.getFullYear() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getDate() +
    " " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes()
  );
};

export const isInFuture = (date) => {
  var midnight = new Date(Date.now());
  midnight.setHours(23);
  return Date.parse(date) > midnight;
};

export const isToday = (date) => {
  var today = new Date(Date.now());
  date = new Date(date);
  return (
    date.getYear() == today.getYear() &&
    date.getMonth() == today.getMonth() &&
    date.getDate() == today.getDate()
  );
};

export const WIDTH = Dimensions.get("window").width;
export const HEIGHT = Dimensions.get("window").height;
