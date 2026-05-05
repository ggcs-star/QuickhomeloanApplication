importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAqaysRflwfOwE0v6DyOycOlZPULAtvC9s",
  authDomain: "quickhomeloan-abf3d.firebaseapp.com",
  projectId: "quickhomeloan-abf3d",
  storageBucket: "quickhomeloan-abf3d.firebasestorage.app",
  messagingSenderId: "638362206704",
  appId: "1:638362206704:web:71e48e1ff80496ca6bdd35",
  measurementId: "G-0RLX5RCYJV"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
  });
});