import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA0Q3-U2HcoGpDnUgY0t_NsyNSvpyrWzx0",
    authDomain: "routine-now.firebaseapp.com",
    projectId: "routine-now",
    storageBucket: "routine-now.firebasestorage.app",
    messagingSenderId: "830396870615",
    appId: "1:830396870615:web:03c3a023de9e0f0ee52592"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Elements
const routineForm = document.getElementById("routine-form");
const routineDisplay = document.getElementById("routine-display");

// Add or update routine
routineForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const day = document.getElementById("day").value;
    const subject = document.getElementById("subject").value;
    const time = document.getElementById("time").value;

    const routineRef = ref(db, `routine/${day}`);
    get(routineRef).then((snapshot) => {
        let dayRoutine = snapshot.exists() ? snapshot.val() : [];
        dayRoutine.push({ subject, time });
        set(routineRef, dayRoutine).then(() => {
            alert("Routine updated successfully!");
            fetchRoutine(); // Refresh routine display
        });
    });
});

// Fetch and display routine
function fetchRoutine() {
    const routineRef = ref(db, "routine");
    onValue(routineRef, (snapshot) => {
        routineDisplay.innerHTML = ""; // Clear the previous routine
        const routine = snapshot.val();
        for (let day in routine) {
            const dayBlock = document.createElement("div");
            dayBlock.className = "routine-block";
            dayBlock.innerHTML = `<h2>${day.toUpperCase()}</h2>`;
            routine[day].forEach((entry) => {
                dayBlock.innerHTML += `<p><strong>${entry.subject}</strong>: ${entry.time}</p>`;
            });
            routineDisplay.appendChild(dayBlock);
        }
    });
}

// Call fetchRoutine on page load
fetchRoutine();
