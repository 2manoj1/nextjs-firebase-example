"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchToken, getMessagingObj } from "./firebase";
import { Unsubscribe, onMessage } from "firebase/messaging";

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

	const loadToken = async () => {
		const token = await notifyMe();
		console.log("loadToken", { token });
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

			const notification = new Notification(
				notificationTitle,
				notificationOptions
			);
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
