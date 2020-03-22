importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');

 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyA3JTKkQ-hjdjMH7EGrfq6M6TGxVmydrvQ",
    authDomain: "revyoursoul-android-fd263.firebaseapp.com",
    databaseURL: "https://revyoursoul-android-fd263.firebaseio.com",
    projectId: "revyoursoul-android-fd263",
    storageBucket: "revyoursoul-android-fd263.appspot.com",
    messagingSenderId: "101494813814",
    appId: "1:101494813814:web:f0234d738561a5f1331b57",
    measurementId: "G-SYT71P6T8L"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();