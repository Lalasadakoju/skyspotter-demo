const aircrafts = [
{
flight:"AI243",
airline:"Air India",
aircraft:"Airbus A320",
route:"Delhi → Chennai",
direction:"North-East",
altitude:"35,000 ft",
distance:"18 km"
},
{
flight:"6E512",
airline:"IndiGo",
aircraft:"Airbus A321",
route:"Hyderabad → Bengaluru",
direction:"South",
altitude:"33,000 ft",
distance:"25 km"
},
{
flight:"UK808",
airline:"Vistara",
aircraft:"Boeing 737-800",
route:"Mumbai → Kolkata",
direction:"North-West",
altitude:"37,000 ft",
distance:"14 km"
},
{
flight:"SG442",
airline:"SpiceJet",
aircraft:"Boeing 737 MAX",
route:"Chennai → Visakhapatnam",
direction:"East",
altitude:"31,000 ft",
distance:"22 km"
}
];

let countdownTimer;
let detectedCount = 0;
let passedCount = 0;
let trackingCount = 0;
let lastAircraftIndex = -1;

const alertSound = { play: () => {} };

function getLocation(){

    if(!navigator.geolocation){
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude.toFixed(4);
        const lon = pos.coords.longitude.toFixed(4);

        document.getElementById("location").value =
        `Lat: ${lat}, Lon: ${lon}`;
    });

}

function startMonitoring(){

    const name = document.getElementById("name").value.trim();
    const location = document.getElementById("location").value.trim();

    if(!name || !location){
        alert("Please enter name and location");
        return;
    }

    document.getElementById("welcome").innerHTML =
    `👋 Welcome ${name}!<br>📡 Monitoring aircraft...`;

    if(Notification.permission !== "granted"){
        Notification.requestPermission();
    }

    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * aircrafts.length);
    } while(randomIndex === lastAircraftIndex);

    lastAircraftIndex = randomIndex;

    const aircraft = aircrafts[randomIndex];

    setTimeout(() => {

        document.getElementById("aircraftCard").classList.remove("hidden");

        document.getElementById("flight").textContent = aircraft.flight;
        document.getElementById("airline").textContent = aircraft.airline;
        document.getElementById("aircraft").textContent = aircraft.aircraft;
        document.getElementById("route").textContent = aircraft.route;
        document.getElementById("direction").textContent = aircraft.direction;
        document.getElementById("altitude").textContent = aircraft.altitude;
        document.getElementById("distance").textContent = aircraft.distance;

        detectedCount++;
        trackingCount = 1;

        document.getElementById("detectedCount").textContent = detectedCount;
        document.getElementById("trackingCount").textContent = trackingCount;

        const li = document.createElement("li");
        li.textContent = `${aircraft.flight} • ${aircraft.airline}`;
        document.getElementById("historyList").prepend(li);

        startCountdown();

        alertSound.play();

        if(Notification.permission === "granted"){
            new Notification("SkySpotter Alert", {
                body: `${aircraft.flight} approaching`
            });
        }

    }, 2000);
}

function startCountdown(){

    clearInterval(countdownTimer);

    let timeLeft = 240;
    const totalTime = 240;

    const eta = document.getElementById("eta");
    const progress = document.getElementById("progressBar");
    const status = document.getElementById("status");

    countdownTimer = setInterval(() => {

        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;

        eta.textContent = `${m}:${s.toString().padStart(2,"0")}`;

        progress.style.width = (timeLeft / totalTime) * 100 + "%";

        if(timeLeft > 120){
            status.textContent = "🟢 Approaching";
            status.style.background = "#22c55e";
        }
        else if(timeLeft > 30){
            status.textContent = "🟡 Overhead";
            status.style.background = "#eab308";
        }
        else{
            status.textContent = "🔴 Leaving";
            status.style.background = "#ef4444";
        }

        if(timeLeft <= 0){
            clearInterval(countdownTimer);
            status.textContent = "🔴 Passed";
            trackingCount = 0;
            passedCount++;

            document.getElementById("passedCount").textContent = passedCount;
            document.getElementById("trackingCount").textContent = trackingCount;
        }

        timeLeft--;

    }, 1000);
}

function toggleTheme(){
    document.body.classList.toggle("light-mode");

    const btn = document.getElementById("themeToggle");

    btn.textContent =
        document.body.classList.contains("light-mode")
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
}