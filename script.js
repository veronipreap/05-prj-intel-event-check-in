//get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountSpan = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

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

//track attendance
let count = 0;
const maxCount = 50;


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

  //show welcome message
  const message = `Welcome, ${name} from ${teamName}!`;
  greeting.textContent = message;
  greeting.classList.add("success-message");
  greeting.style.display = "block";
  createConfetti(greeting);

  console.log(message);

  form.reset();


});