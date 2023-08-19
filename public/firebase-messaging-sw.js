importScripts(
	"https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
	"https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object

const firebaseConfig = {
	apiKey: "AIzaSyC9gQif3XKG-9Yca4HWyOUSOemkJH9uh9w",
	authDomain: "poc-fcm-b41b4.firebaseapp.com",
	projectId: "poc-fcm-b41b4",
	storageBucket: "poc-fcm-b41b4.appspot.com",
	messagingSenderId: "471249123952",
	appId: "1:471249123952:web:722d77c6db99bfcaf2d2b5",
	measurementId: "G-RKEW10DEKK",
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log(
		"[firebase-messaging-sw.js] Received background message ",
		payload
	);
	// const data = payload?.notification ?? {};
	// // Customize notification here
	// const notificationTitle = data.title ?? "";
	// const notificationOptions = {
	// 	body: data.body,
	// 	icon: data.icon,
	// };

	// self.registration.showNotification(notificationTitle, notificationOptions);
});
