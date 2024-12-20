import { ThemeProvider } from "@shopify/restyle";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthContextProvider, TenantContextProvider } from "../context";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import * as Notifications from "expo-notifications";
import { AppEntry } from "./navigation";
import { theme } from "@/utils";
import { Alert, Button, Platform } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { getCall } from "@/api";

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Yeni Bildiriş! 🔔",
      body: "Sizin yeni statuslu çağırışınız var",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
}
const TASK_NAME = "myTaskName";

// TaskManager.defineTask(TASK_NAME, () => {
//   try {
//     getCall([
//       {
//         limit: 8,
//         page: 1,
//         statuses: ["awaiting_ambulance", "processing_by_ambulance"],
//       },
//     ]).then((productData) => {
//       if (
//         productData.filter(
//           ({ status }: any) =>
//             status === "awaiting_dispatcher" || status === "awaiting_ambulance"
//         ).length > 0
//       ) {
//         console.log("test");
//         schedulePushNotification();
//       }

//       return productData
//         ? BackgroundFetch.BackgroundFetchResult.NewData
//         : BackgroundFetch.BackgroundFetchResult.NoData;
//     });
//   } catch (err) {
//     return BackgroundFetch.BackgroundFetchResult.Failed;
//   }
// });

// const RegisterBackgroundTask = async () => {
//   try {
//     await BackgroundFetch.registerTaskAsync(TASK_NAME, {
//       minimumInterval: 5,
//     });
//     console.log("Task registered");
//   } catch (err) {
//     console.log("Task Register failed:", err);
//   }
// };

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

export default function RootLayout() {
  useEffect(() => {
    // async function configurePushNotifications() {
    //   const { status } = await Notifications.getPermissionsAsync();
    //   let finalStatus = status;
    //   if (finalStatus !== "granted") {
    //     const { status } = await Notifications.requestPermissionsAsync();
    //     finalStatus = status;
    //   }
    //   if (finalStatus !== "granted") {
    //     Alert.alert("Permission required");
    //     return;
    //   }

    //   const pushTokenData = await Notifications.getExpoPushTokenAsync();
    //   console.log(pushTokenData);

    //   if (Platform.OS === "android") {
    //     Notifications.setNotificationChannelAsync("default", {
    //       name: "default",
    //       importance: Notifications.AndroidImportance.DEFAULT,
    //     });
    //   }
    // }

    // RegisterBackgroundTask();
    // configurePushNotifications();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <TenantContextProvider>
          <AuthContextProvider>
            <ActionSheetProvider>
              <AppEntry />
            </ActionSheetProvider>
            <Toast />
          </AuthContextProvider>
        </TenantContextProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
