import React, { useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import * as Notifications from "expo-notifications";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import Loading from "./screens/Loading";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import Login from "./screens/Login";
import Exercise from "./screens/Exercise";
import Survey from "./screens/Survey";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Main() {
  //Notifications
  const notificationListener = useRef();
  const responseListener = useRef();

  const handleNotification = (notification) => {
    console.log(notification.request.content.data);
  };

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) =>
        handleNotification(notification)
      );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNotification(response.notification);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={() => ({
          headerBackVisible: false,
          headerTitleAlign: "center",
        })}
      >
        <Stack.Screen
          name={"Loading"}
          component={Loading}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={"Login"}
          component={Login}
          options={() => ({
            title: "Registrace",
          })}
        />
        <Stack.Screen
          name={"Settings"}
          component={Settings}
          options={({ navigation }) => ({
            title: "Nastavení",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
                style={styles.navIcon}
              >
                <Feather name="arrow-left" size={24} color={"black"} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name={"Home"}
          component={Home}
          options={({ route, navigation }) => ({
            title: "Plán rehabilitace",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Settings")}
                activeOpacity={0.8}
                style={styles.navIcon}
              >
                <SimpleLineIcons name="settings" size={22} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name={"Exercise"}
          component={Exercise}
          options={({ route, navigation }) => ({
            title: route.params.title,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Settings")}
                activeOpacity={0.8}
                style={styles.navIcon}
              >
                <SimpleLineIcons name="settings" size={22} color="black" />
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
                style={styles.navIcon}
              >
                <Feather name="arrow-left" size={24} color={"black"} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name={"Survey"}
          component={Survey}
          options={({ route, navigation }) => ({
            title: "Dokončení cvičení",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Settings")}
                activeOpacity={0.8}
                style={styles.navIcon}
              >
                <SimpleLineIcons name="settings" size={22} color="black" />
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
                style={styles.navIcon}
              >
                <Feather name="arrow-left" size={24} color={"black"} />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  navIcon: {
    //backgroundColor: "red",
    padding: 5,
  },
});
