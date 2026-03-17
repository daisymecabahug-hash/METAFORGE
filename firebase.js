<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyADMA-luLhqHQCNNAsKZlvuPXRlY8_Dicw",
    authDomain: "metaforge-71c49.firebaseapp.com",
    projectId: "metaforge-71c49",
    storageBucket: "metaforge-71c49.firebasestorage.app",
    messagingSenderId: "459212032201",
    appId: "1:459212032201:web:15e06c515f4aaf8fb1e518",
    measurementId: "G-RR4SHEL0BR"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
