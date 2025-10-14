const questions = {
  cell: [
    { q: "Name an organelle found in plant cells but not animal cells", a: ["Chloroplast", "Cell wall", "Large central vacuole"] },
    { q: "Name the part of the cell that produces energy", a: ["Mitochondria"] },
    { q: "What organelle makes proteins?", a: ["Ribosomes", "Rough ER"] },
    { q: "Which organelle contains genetic material?", a: ["Nucleus"] },
    { q: "What structure controls what enters and leaves the cell?", a: ["Cell membrane"] },
  ],
  genetics: [
    { q: "What is the basic unit of heredity?", a: ["Gene"] },
    { q: "What shape is the DNA molecule?", a: ["Double helix"] },
    { q: "Name the four DNA bases", a: ["Adenine", "Thymine", "Cytosine", "Guanine"] },
    { q: "Where in the cell is DNA found?", a: ["Nucleus"] },
  ],
  ecology: [
    { q: "Name a level of ecological organization", a: ["Organism", "Population", "Community", "Ecosystem", "Biosphere"] },
    { q: "What process releases CO₂ into the atmosphere?", a: ["Respiration", "Decomposition", "Combustion"] },
  ],
  systems: [
    { q: "Name a system in the human body", a: ["Circulatory", "Respiratory", "Nervous", "Digestive", "Muscular"] },
    { q: "Which system transports oxygen and nutrients?", a: ["Circulatory system"] },
  ],
  photosynthesis: [
    { q: "What are products of photosynthesis?", a: ["Glucose", "Oxygen"] },
    { q: "Where does photosynthesis occur?", a: ["Chloroplast"] },
    { q: "What gas do plants take in for photosynthesis?", a: ["Carbon dioxide"] },
  ]
};

let scoreA = parseInt(localStorage.getItem("scoreA")) || 0;
let scoreB = parseInt(localStorage.getItem("scoreB")) || 0;
let teacherMode = false;
let timerInterval = null;
let timeLeft = 20;

document.getElementById("scoreA").textContent = scoreA;
document.getElementById("scoreB").textContent = scoreB;

function nextQuestion() {
  stopTimer();
  timeLeft = 20;
  startTimer();

  const category = document.getElementById("category").value;
  let questionPool = category === "all"
    ? Object.values(questions).flat()
    : questions[category];
  const q = questionPool[Math.floor(Math.random() * questionPool.length)];

  document.getElementById("question").textContent = q.q;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";
  q.a.forEach(ans => {
    const div = document.createElement("div");
    div.className = "answer";
    div.textContent = "???";
    div.onclick = () => revealAnswer(div, ans);
    answersDiv.appendChild(div);
  });
}

function revealAnswer(div, ans) {
  div.textContent = ans;
  div.classList.add("revealed");
  playSound("correctSound");
}

function addPoints(team) {
  if (team === "A") scoreA += 10;
  else scoreB += 10;
  localStorage.setItem("scoreA", scoreA);
  localStorage.setItem("scoreB", scoreB);
  document.getElementById("scoreA").textContent = scoreA;
  document.getElementById("scoreB").textContent = scoreB;
}

function toggleTeacherMode() {
  teacherMode = !teacherMode;
  alert(`Teacher Mode: ${teacherMode ? "ON" : "OFF"}`);
  if (teacherMode) autoReveal();
}

function autoReveal() {
  document.querySelectorAll(".answer").forEach((div, i) => {
    setTimeout(() => {
      div.textContent = div.dataset?.answer || div.textContent === "???" ? div.textContent : div.textContent;
      div.classList.add("revealed");
    }, i * 700);
  });
}

function resetGame() {
  if (confirm("Reset all scores and questions?")) {
    scoreA = scoreB = 0;
    localStorage.clear();
    document.getElementById("scoreA").textContent = 0;
    document.getElementById("scoreB").textContent = 0;
    document.getElementById("question").textContent = "Press “Next Question” to start!";
    document.getElementById("answers").innerHTML = "";
    stopTimer();
    document.getElementById("timer").textContent = "⏱️ 20";
  }
}

function startTimer() {
  const timerEl = document.getElementById("timer");
  timerEl.textContent = `⏱️ ${timeLeft}`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏱️ ${timeLeft}`;
    if (timeLeft <= 0) {
      stopTimer();
      timerEl.textContent = "⏱️ Time's up!";
      playSound("buzzerSound");
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function playSound(id) {
  const sound = document.getElementById(id);
  sound.currentTime = 0;
  sound.play();
}
