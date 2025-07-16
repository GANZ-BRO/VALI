// --- ALAPBEÁLLÍTÁSOK ---
const QUESTIONS = 5;
const DIFFICULTY_SETTINGS = {
  easy: { min: 10, max: 100 }, // Könnyű: kis ellenállások, egyszerű áram/feszültség
  medium: { min: 10, max: 500 }, // Közepes: nagyobb tartomány
  hard: { min: 10, max: 1000 } // Kihívás: komplex kapcsolások, nagyobb értékek
};

// --- MOTIVÁLÓ ÜZENETEK ---
const motivationalMessages = [
  "Szuper munka, igazi áramkör-mester vagy!",
  "Fantasztikus, tökéletesen kapcsoltad az ellenállásokat!",
  "Látom, nem lehet téged megállítani, csak így tovább!",
  "Bravó, ezt a nehéz áramkört is megoldottad!",
  "Kiváló, a villamosmérnöki tudásod lenyűgöző!",
  "Hűha, ez egy profi megoldás volt!",
  "Nagyszerű, az áramkörök királya vagy!",
  "Remekül teljesítesz, folytasd ebben a szellemben!"
];

// --- FELADATTÍPUSOK ---
const taskTypes = [
  {
    name: "Alapfogalmak",
    value: "alapfogalmak",
    generate: () => ({
      display: "Kidolgozás alatt",
      answer: null,
      answerType: "number"
    })
  },
  {
    name: "Elektronikai alkatrészek",
    value: "elektronikai_alkatreszek",
    generate: () => ({
      display: "Kidolgozás alatt",
      answer: null,
      answerType: "number"
    })
  },
  {
    name: "Soros / Párhuzamos kapcsolások",
    value: "soros_parhuzamos",
    generate: (difficulty) => {
      const { min, max } = DIFFICULTY_SETTINGS[difficulty];
      if (difficulty === "easy") {
        // Csak soros kapcsolás, 2 ellenállás
        let r1 = getRandomInt(min, max);
        let r2 = getRandomInt(min, max);
        let answer = r1 + r2;
        return {
          display: `Mennyi a teljes ellenállás, ha <b>R1 = ${r1} Ω</b> és <b>R2 = ${r2} Ω</b> sorosan vannak kapcsolva?`,
          answer: answer.toString(),
          answerType: "number"
        };
      } else if (difficulty === "medium") {
        // Soros és párhuzamos kombináció, 2-3 ellenállás
        let type = getRandomInt(0, 1);
        if (type === 0) {
          // R1 sorosan, R2 || R3
          let r1 = getRandomInt(min, max);
          let r2 = getRandomInt(min, max);
          let r3 = getRandomInt(min, max);
          let parallel = Math.round(1 / (1 / r2 + 1 / r3));
          let answer = r1 + parallel;
          return {
            display: `Mennyi a teljes ellenállás, ha <b>R1 = ${r1} Ω</b> sorosan van <b>R2 = ${r2} Ω</b> || <b>R3 = ${r3} Ω</b> párhuzamos kapcsolásával?`,
            answer: answer.toString(),
            answerType: "number"
          };
        } else {
          // R1 || R2 sorosan R3
          let r1 = getRandomInt(min, max);
          let r2 = getRandomInt(min, max);
          let r3 = getRandomInt(min, max);
          let parallel = Math.round(1 / (1 / r1 + 1 / r2));
          let answer = parallel + r3;
          return {
            display: `Mennyi a teljes ellenállás, ha <b>R1 = ${r1} Ω</b> || <b>R2 = ${r2} Ω</b> párhuzamosan van, majd sorosan <b>R3 = ${r3} Ω</b>-val?`,
            answer: answer.toString(),
            answerType: "number"
          };
        }
      } else {
        // Kihívás: komplex vegyes kapcsolások, 3-4 ellenállás
        let type = getRandomInt(0, 1);
        if (type === 0) {
          // R1 sorosan (R2 || R3) + R4
          let r1 = getRandomInt(min, max);
          let r2 = getRandomInt(min, max);
          let r3 = getRandomInt(min, max);
          let r4 = getRandomInt(min, max);
          let parallel = Math.round(1 / (1 / r2 + 1 / r3));
          let answer = r1 + parallel + r4;
          return {
            display: `Mennyi a teljes ellenállás, ha <b>R1 = ${r1} Ω</b> sorosan van (<b>R2 = ${r2} Ω</b> || <b>R3 = ${r3} Ω</b>) + <b>R4 = ${r4} Ω</b> kapcsolásával?`,
            answer: answer.toString(),
            answerType: "number"
          };
        } else {
          // (R1 || R2) sorosan (R3 || R4)
          let r1 = getRandomInt(min, max);
          let r2 = getRandomInt(min, max);
          let r3 = getRandomInt(min, max);
          let r4 = getRandomInt(min, max);
          let parallel1 = Math.round(1 / (1 / r1 + 1 / r2));
          let parallel2 = Math.round(1 / (1 / r3 + 1 / r4));
          let answer = parallel1 + parallel2;
          return {
            display: `Mennyi a teljes ellenállás, ha (<b>R1 = ${r1} Ω</b> || <b>R2 = ${r2} Ω</b>) sorosan van (<b>R3 = ${r3} Ω</b> || <b>R4 = ${r4} Ω</b>) kapcsolásával?`,
            answer: answer.toString(),
            answerType: "number"
          };
        }
      }
    }
  },
  {
    name: "Ohm-törvény",
    value: "ohm_torveny",
    generate: (difficulty) => {
      const { min, max } = DIFFICULTY_SETTINGS[difficulty];
      let maxI = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 50;
      let maxR = difficulty === "easy" ? 10 : difficulty === "medium" ? 50 : 200;
      let I = getRandomInt(1, maxI);
      let R = getRandomInt(1, maxR);
      let U = I * R;
      let type = getRandomInt(0, 2);
      if (difficulty === "hard") {
        let R2 = getRandomInt(1, maxR);
        U = I * (R + R2);
        if (type === 0) {
          return {
            display: `Mennyi a feszültség, ha <b>I = ${I} A</b> és <b>R = ${R} Ω + ${R2} Ω</b> sorosan van?`,
            answer: U.toString(),
            answerType: "number"
          };
        } else if (type === 1) {
          return {
            display: `Mennyi az áram, ha <b>U = ${U} V</b> és <b>R = ${R} Ω + ${R2} Ω</b> sorosan van?`,
            answer: I.toString(),
            answerType: "number"
          };
        } else {
          return {
            display: `Mennyi az ellenállás, ha <b>U = ${U} V</b> és <b>I = ${I} A</b>?`,
            answer: (R + R2).toString(),
            answerType: "number"
          };
        }
      }
      if (type === 0) {
        return {
          display: `Mennyi a feszültség, ha <b>I = ${I} A</b> és <b>R = ${R} Ω</b>?`,
          answer: U.toString(),
          answerType: "number"
        };
      } else if (type === 1) {
        return {
          display: `Mennyi az áram, ha <b>U = ${U} V</b> és <b>R = ${R} Ω</b>?`,
          answer: I.toString(),
          answerType: "number"
        };
      } else {
        return {
          display: `Mennyi az ellenállás, ha <b>U = ${U} V</b> és <b>I = ${I} A</b>?`,
          answer: R.toString(),
          answerType: "number"
        };
      }
    }
  },
  {
    name: "Hurok-törvény",
    value: "hurok_torveny",
    generate: () => ({
      display: "Kidolgozás alatt",
      answer: null,
      answerType: "number"
    })
  },
  {
    name: "Csomóponti törvény",
    value: "csomoponti_torveny",
    generate: () => ({
      display: "Kidolgozás alatt",
      answer: null,
      answerType: "number"
    })
  },
  {
    name: "Mind a három",
    value: "mind_a_harom",
    generate: () => ({
      display: "Kidolgozás alatt",
      answer: null,
      answerType: "number"
    })
  }
];

// --- HTML ELEMEK ---
const questionContainer = document.getElementById("question");
const timerDisplay = document.getElementById("time");
const difficultySelect = document.getElementById("difficulty");
const categorySelect = document.getElementById("category");
const startBtn = document.querySelector("button[onclick='startGame()']");
const replayBtn = document.getElementById("replay");
const themeToggle = document.getElementById("theme-toggle");
const numpadContainer = document.getElementById("numpad");

// --- KATEGÓRIÁK BETÖLTÉSE ---
function loadCategories() {
  categorySelect.innerHTML = taskTypes.map(task => `<option value="${task.value}">${task.name}</option>`).join('');
}

// --- ÁLLAPOTVÁLTOZÓK ---
let score = 0, startTime = 0, timerInterval = null, currentQuestion = 0, questions = [];
let best = { score: 0, time: null };
let gameActive = false;

// --- UTOLSÓ VÁLASZTÁS MENTÉSE/BETÖLTÉSE ---
function saveLastSelection() {
  localStorage.setItem("vali-last-category", categorySelect.value);
  localStorage.setItem("vali-last-difficulty", difficultySelect.value);
}

function loadLastSelection() {
  const lastCat = localStorage.getItem("vali-last-category");
  const lastDiff = localStorage.getItem("vali-last-difficulty");
  if (lastCat) categorySelect.value = lastCat;
  if (lastDiff) difficultySelect.value = lastDiff;
}

categorySelect.addEventListener("change", saveLastSelection);
difficultySelect.addEventListener("change", saveLastSelection);

// --- LEGJOBB EREDMÉNY MENTÉSE/BETÖLTÉSE ---
function loadBest() {
  const diff = difficultySelect.value;
  const cat = categorySelect.value;
  try {
    const bestRaw = localStorage.getItem("vali-best-" + cat + "-" + diff);
    best = bestRaw ? JSON.parse(bestRaw) : { score: 0, time: null };
  } catch { best = { score: 0, time: null }; }
}

function saveBest(newScore, time) {
  const diff = difficultySelect.value;
  const cat = categorySelect.value;
  if (newScore > best.score || (newScore === best.score && (best.time === null || time < best.time))) {
    best = { score: newScore, time: time };
    localStorage.setItem("vali-best-" + cat + "-" + diff, JSON.stringify(best));
  }
}

// --- TÉMA VÁLTÁS ---
function applyTheme() {
  const theme = localStorage.getItem("vali-theme") || "dark";
  const isLight = theme === "light";
  document.body.classList.toggle("light", isLight);
}

themeToggle.addEventListener("click", function () {
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("vali-theme", isLight ? "dark" : "light");
  applyTheme();
});

// --- NEHÉZSÉG ÉS KATEGÓRIA KEZELÉSE ---
difficultySelect.addEventListener("change", loadBest);
categorySelect.addEventListener("change", loadBest);

// --- IDŐZÍTŐ ---
function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerDisplay.textContent = `${elapsed}`;
}

// --- SEGÉDFÜGGVÉNYEK ---
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- FELADATSOR GENERÁLÁSA ---
function generateQuestions() {
  const difficulty = difficultySelect.value;
  const category = categorySelect.value;
  questions = [];
  const taskType = taskTypes.find(t => t.value === category);
  if (!taskType) {
    questions.push({ display: "Hiba: kategória nincs implementálva", answer: null, answerType: "number" });
    return;
  }
  for (let i = 0; i < QUESTIONS; i++) {
    const task = taskType.generate(difficulty);
    if (!task.answer || task.answer === "?") {
      task.display = "Kidolgozás alatt";
      task.answer = null;
    }
    questions.push(task);
  }
}

// --- SZÁMBILLENTYŰZET ---
function renderNumpad(answerState, onChange) {
  const rows = [
    ['1', '2', '3', '←'],
    ['4', '5', '6', 'submit'],
    ['7', '8', '9', '0']
  ];
  const numpadDiv = document.createElement('div');
  numpadDiv.className = 'numpad active';

  rows.forEach((row) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'numpad-row';
    row.forEach((key) => {
      if (key === 'submit') {
        const enterIcon = `<svg viewBox="0 0 48 48" width="1.2em" height="1.2em" style="display:block;margin:auto;" aria-hidden="true" focusable="false"><path d="M40 6v23H14.83l6.58-6.59L19 20l-10 10 10 10 2.41-2.41L14.83 31H44V6z" fill="currentColor"/></svg>`;
        const submitBtn = document.createElement("button");
        submitBtn.type = "button";
        submitBtn.className = "numpad-btn numpad-submit-btn";
        submitBtn.setAttribute("aria-label", "Küldés (Enter)");
        submitBtn.innerHTML = `<span>${enterIcon}</span>`;
        submitBtn.onclick = () => {
          if (!gameActive) return;
          let val = answerState.value.trim();
          if (val === "") {
            alert("Írj be egy választ!");
            return;
          }
          let correct = false;
          const currentTask = questions[currentQuestion] || {};
          if (!currentTask.answer) {
            alert("Ez a feladat még kidolgozás alatt áll!");
            currentQuestion++;
            showQuestion(currentQuestion);
            return;
          }

          // Normalizáljuk az inputot: vesszőt tizedes törtet jelző pontra cseréljük
          val = val.replace(',', '.');

          if (currentTask.answerType === "number") {
            const correctAnswer = parseInt(currentTask.answer);
            const userAnswer = parseFloat(val);
            if (isNaN(userAnswer)) {
              alert("Érvénytelen szám! Írj be egy egész számot.");
              return;
            }
            if (Math.round(userAnswer) === correctAnswer) {
              correct = true;
            }
          }

          if (correct) {
            score++;
            // Motiváló üzenetek
            if (difficultySelect.value === "hard") {
              const message = motivationalMessages[getRandomInt(0, motivationalMessages.length - 1)];
              alert(message);
            } else if (difficultySelect.value === "medium" && currentQuestion === QUESTIONS - 2) {
              alert("Gratulálok, csak így tovább, mindjárt a végére érsz!");
            }
            currentQuestion++;
            showQuestion(currentQuestion);
          } else {
            alert("Nem jó válasz, próbáld újra!");
          }
        };
        rowDiv.appendChild(submitBtn);
      } else {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'numpad-btn';
        btn.textContent = key;
        btn.tabIndex = -1;
        btn.onclick = () => {
          if (key === '←') {
            answerState.value = answerState.value.slice(0, -1);
          } else {
            answerState.value += key;
          }
          onChange(answerState.value);
        };
        rowDiv.appendChild(btn);
      }
    });
    numpadDiv.appendChild(rowDiv);
  });
  return numpadDiv;
}

// --- JÁTÉK LOGIKA ---
function showQuestion(index) {
  questionContainer.innerHTML = "";
  if (index >= QUESTIONS) {
    finishGame();
    return;
  }

  const q = questions[index];
  const div = document.createElement("div");
  div.className = "question-container";
  div.innerHTML =
    `<div class="question-number">${QUESTIONS} / ${index + 1}. feladat:</div>
     <div class="question-text">${q.display}</div>`;
  let answerState = { value: "" };
  const answerView = document.createElement("div");
  answerView.className = "answer-view";
  answerView.textContent = "";
  div.appendChild(answerView);

  const numpad = renderNumpad(answerState, function (val) {
    answerView.textContent = val;
  });

  numpadContainer.innerHTML = "";
  numpadContainer.appendChild(numpad);
  numpadContainer.classList.add("active");
  questionContainer.appendChild(div);

  div.scrollIntoView({ behavior: "smooth", block: "start" });
}

function startGame() {
  gameActive = true;
  score = 0;
  currentQuestion = 0;
  generateQuestions();
  showQuestion(0);
  startTime = Date.now();
  updateTimer();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);

  categorySelect.disabled = true;
  difficultySelect.disabled = true;

  replayBtn.style.display = "none";
  startBtn.style.display = "none";
}

function finishGame() {
  gameActive = false;
  clearInterval(timerInterval);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerDisplay.textContent = `${elapsed} (Vége)`;
  questionContainer.innerHTML = `<p style="font-size:1.2em;"><b>Gratulálok!</b> ${elapsed} másodperc alatt végeztél.</p>`;
  numpadContainer.innerHTML = "";
  numpadContainer.classList.remove("active");
  saveBest(score, elapsed);

  replayBtn.style.display = "";
  startBtn.style.display = "";
  categorySelect.disabled = false;
  difficultySelect.disabled = false;
}

replayBtn.onclick = startGame;
startBtn.onclick = startGame;

// --- INDÍTÁS ---
loadCategories();
loadLastSelection();
loadBest();
applyTheme();