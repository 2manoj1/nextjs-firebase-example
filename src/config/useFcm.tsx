"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchToken, getMessagingObj } from "./firebase";
import { Unsubscribe, onMessage } from "firebase/messaging";
import { db } from "./db";

async function notifyMe() {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    console.info("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const token = await fetchToken();
    console.log("Notification permission granted.");
    if (!token) {
      return null;
    }
    return token;
  } else if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await fetchToken();
      console.log("Notification permission granted.");
      if (!token) {
        return null;
      }
      return token;
    } else {
      console.log("Notification permission not granted.");
    }
  }
  return null;
}

export const useFCM = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const retryLoadToken = useRef(0);

  const loadToken = async () => {
    if (Notification.permission === "denied") {
      alert("Please Enable Push notfications via browser settings.");
      console.info(
        `%cPlease enable notfications via browser settings.`,
        "color: red; background: #c7c7c7; padding: 8px; font-size: 20px"
      );
      return null;
    }

    if (retryLoadToken.current >= 3) {
      alert("unable to load token, refresh the browser");
      console.info(
        `%cPush Notifications issue - unable to load token after 3 retry`,
        "color: green; background: #c7c7c7; padding: 8px; font-size: 20px"
      );
      return null;
    }
    const token = await notifyMe();

    if (!token) {
      await db.fcmTokens.clear();
      retryLoadToken.current += 1;
      loadToken();
      return;
    }

    // Geting token from indexDB
    const savedToken = await db.fcmTokens.where({ token: token }).first();

    // if token not in db or its outdated send to backend
    if (!savedToken) {
      await db.fcmTokens.clear();
      console.info(
        `%cFCM Token: ${token} --> send to backend`,
        "color: green; background: #c7c7c7; padding: 8px; font-size: 20px"
      );
      // Todo call to backend
    }

    // Evrytime update token in indexdb

    await db.fcmTokens.put(savedToken ? savedToken : { token });

    setFcmToken(token);
  };

  const listenerMessage = useCallback(async () => {
    if (!fcmToken) return null;
    console.log(`onMessage Reg withFcmToken ${fcmToken}`);
    const messaging = await getMessagingObj();
    if (!messaging) return null;
    return onMessage(messaging, (payload) => {
      if (Notification.permission !== "granted") return;

      console.log("Foreground message loaded >>> payload", payload);
      const data = payload?.notification ?? {};
      // Customize notification here
      const notificationTitle = data.title ?? "";
      const notificationOptions = {
        body: data.body,
        icon: data.icon,
      };

      new Notification(notificationTitle, notificationOptions);
    });
  }, [fcmToken]);

  useEffect(() => {
    if ("Notification in window" && Notification.permission === "granted")
      loadToken();
  }, []);

  useEffect(() => {
    let instanceOnMessage: Unsubscribe | null;
    listenerMessage().then((r) => (instanceOnMessage = r));

    return () => instanceOnMessage?.();
  }, [listenerMessage]);

  return { loadToken };
};
