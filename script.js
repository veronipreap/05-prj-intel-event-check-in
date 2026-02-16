//get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountSpan = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const celebrationOverlay = document.getElementById("celebrationOverlay");
const celebrationMessage = document.getElementById("celebrationMessage");
const attendeeList = document.getElementById("attendeeList");
const attendeeEmpty = document.getElementById("attendeeEmpty");
let celebrationTimeout = null;
const storageKey = "attendanceCounts";

function saveCounts() {
  const data = {
    total: count,
    water: parseInt(document.getElementById("waterCount").textContent, 10),
    zero: parseInt(document.getElementById("zeroCount").textContent, 10),
    power: parseInt(document.getElementById("powerCount").textContent, 10),
    attendees: attendees
  };

  localStorage.setItem(storageKey, JSON.stringify(data));
}

function loadCounts() {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    return;
  }

  const data = JSON.parse(saved);

  if (!data || typeof data.total !== "number") {
    return;
  }

  count = data.total;
  attendeeCountSpan.textContent = count;
  document.getElementById("waterCount").textContent = data.water || 0;
  document.getElementById("zeroCount").textContent = data.zero || 0;
  document.getElementById("powerCount").textContent = data.power || 0;
  attendees = Array.isArray(data.attendees) ? data.attendees : [];
  renderAttendeeList();
  progressBar.style.width = Math.round((count / maxCount) * 100) + "%";
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    attendeeEmpty.style.display = "block";
    return;
  }

  attendeeEmpty.style.display = "none";

  for (let i = 0; i < attendees.length; i++) {
    const teamId = attendees[i].teamId || getTeamIdFromName(attendees[i].team);
    const item = document.createElement("li");
    const nameSpan = document.createElement("span");
    const teamSpan = document.createElement("span");

    item.className = "attendee-item";
    nameSpan.className = "attendee-name";
    teamSpan.className = `attendee-team ${teamId}`;

    nameSpan.textContent = attendees[i].name;
    teamSpan.textContent = attendees[i].team;

    item.appendChild(nameSpan);
    item.appendChild(teamSpan);
    attendeeList.appendChild(item);
  }
}

function getTeamIdFromName(teamName) {
  if (teamName === "Team Water Wise") {
    return "water";
  }

  if (teamName === "Team Net Zero") {
    return "zero";
  }

  return "power";
}

function getWinningTeamName() {
  const teams = [
    { id: "water", label: "Team Water Wise" },
    { id: "zero", label: "Team Net Zero" },
    { id: "power", label: "Team Renewables" }
  ];
  let topCount = -1;
  let winners = [];

  for (let i = 0; i < teams.length; i++) {
    const teamCount = parseInt(
      document.getElementById(`${teams[i].id}Count`).textContent,
      10
    );

    if (teamCount > topCount) {
      topCount = teamCount;
      winners = [teams[i].label];
    } else if (teamCount === topCount) {
      winners.push(teams[i].label);
    }
  }

  if (winners.length === 1) {
    return `Winner: ${winners[0]}`;
  }

  return `Tie between ${winners.join(" and ")}`;
}

function createConfetti(container) {
  const colors = ["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff", "#9b5de5"];
  const existing = container.querySelectorAll(".confetti");

  for (let i = 0; i < existing.length; i++) {
    existing[i].remove();
  }

  for (let i = 0; i < 46; i++) {
    const piece = document.createElement("span");
    const delay = Math.random() * 0.12;
    const duration = 0.9 + Math.random() * 0.6;
    const size = 8 + Math.floor(Math.random() * 8);
    const angle = Math.random() * Math.PI * 2;
    const distance = 90 + Math.random() * 110;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const color = colors[i % colors.length];

    piece.className = "confetti";
    piece.style.backgroundColor = color;
    piece.style.animationDelay = `${delay}s`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size + 6}px`;
    piece.style.setProperty("--x", `${x}px`);
    piece.style.setProperty("--y", `${y}px`);

    container.appendChild(piece);
  }
}

function showCelebrationOverlay(message) {
  celebrationMessage.textContent = message;
  celebrationOverlay.classList.add("show");
  createConfetti(celebrationOverlay);

  if (celebrationTimeout) {
    clearTimeout(celebrationTimeout);
  }

  celebrationTimeout = setTimeout(function () {
    celebrationOverlay.classList.remove("show");
  }, 3000);
}

//track attendance
let count = 0;
const maxCount = 50;
let attendees = [];

loadCounts();

//handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  //get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  //increment count
  count++;
  console.log("Total check-ins: ", count);
  attendeeCountSpan.textContent = count;

  //update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Progress: ${percentage}`);
  progressBar.style.width = percentage;

  //update team counter
  const teamCounter = document.getElementById(`${team}Count`);
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  attendees.push({ name: name, team: teamName, teamId: team });
  renderAttendeeList();
  saveCounts();

  //show welcome message
  const message = `Welcome, ${name} from ${teamName}!`;
  greeting.textContent = message;
  greeting.classList.add("success-message");
  greeting.classList.remove("celebration-message");
  greeting.style.display = "block";
  createConfetti(greeting);

  if (count === maxCount) {
    const winningTeam = getWinningTeamName();
    const celebrationText = `Goal reached! ${winningTeam}`;
    greeting.textContent = celebrationText;
    greeting.classList.remove("success-message");
    greeting.classList.add("celebration-message");
    createConfetti(greeting);
    showCelebrationOverlay(celebrationText);
  }

  console.log(message);

  form.reset();
});
