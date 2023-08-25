"use client";

import { getApps, initializeApp } from "firebase/app";
import {
	Messaging,
	getMessaging,
	getToken,
	isSupported,
} from "firebase/messaging";

const firebaseConfig = {
	apiKey: "AIzaSyC9gQif3XKG-9Yca4HWyOUSOemkJH9uh9w",
	authDomain: "poc-fcm-b41b4.firebaseapp.com",
	projectId: "poc-fcm-b41b4",
	storageBucket: "poc-fcm-b41b4.appspot.com",
	messagingSenderId: "471249123952",
	appId: "1:471249123952:web:722d77c6db99bfcaf2d2b5",
	measurementId: "G-RKEW10DEKK",
};

// Initialize Firebase
export const app = !getApps()?.length
	? initializeApp(firebaseConfig)
	: getApps()[0];

// Initialize Firebase Cloud Messaging and get a reference to the service
export const getMessagingObj = async (): Promise<Messaging | null> => {
	const supported = await isSupported();
	console.log("is supported fcm? >>", supported);
	if (!supported || typeof window === "undefined") return null;
	return getMessaging(app);
};

export const fetchToken = async () => {
	try {
		const messaging = await getMessagingObj();
		if (messaging) {
			const token = await getToken(messaging, {
				vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY ?? "",
			});
			return token;
		}
		return null;
	} catch (err) {
		console.error(err);
		return null;
	}
};
