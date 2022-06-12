import React from "react";

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
export default async function sendNotification(expoPushToken, title, body) {
  if (expoPushToken == undefined) {
    console.log("User has not allowed for push notifications");
    return;
  }
  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
