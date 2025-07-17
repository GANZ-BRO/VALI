// --- ALAPBEÁLLÍTÁSOK ---
const QUESTIONS = 5;
const DIFFICULTY_SETTINGS = {
  easy: { min: 10, max: 100 }, // Könnyű: kis ellenállások, egyszerű áram/feszültség
  medium: { min: 10, max: 500 }, // Közepes: nagyobb tartomány
  hard: { min: 10, max: 1000 } // Kihívás: komplex kapcsolások
};

// --- MOTIVÁLÓ ÜZENETEK ---
const motivationalMessages = [
  "Szuper munka, igazi áramkör-mester vagy!",
  "Fantasztikus, tökéletesen azonosítottad az alkatrészt!",
  "Látom, nem lehet téged megállítani, csak így tovább!",
  "Bravó, ezt a nehéz áramkört is megoldottad!",
  "Kiváló, a villamosmérnöki tudásod lenyűgöző!",
  "Hűha, ez egy profi megoldás volt!",
  "Nagyszerű, az áramkörök királya vagy!",
  "Remekül teljesítesz, folytasd ebben a szellemben!"
];

// --- SVG GENERÁLÓ FÜGGVÉNYEK ---
function generateSorosCircuitSVG(r1, r2) {
  const isLightTheme = document.body.classList.contains("light");
  const svgClass = isLightTheme ? "svg-light" : "svg-dark";
  return `
    <svg class="${svgClass}" width="200" height="100" viewBox="0 0 200 100">
      <line x1="10" y1="50" x2="50" y1="50" stroke-width="2"/>
      <rect x="50" y="40" width="40" height="20" fill="none" stroke-width="2"/>
      <text x="70" y="35" font-size="12" text-anchor="middle">R1=${r1}Ω</text>
      <line x1="90" y1="50" x2="110" y1="50" stroke-width="2"/>
      <rect x="110" y="40" width="40" height="20" fill="none" stroke-width="2"/>
      <text x="130" y="35" font-size="12" text-anchor="middle">R2=${r2}Ω</text>
      <line x1="150" y1="50" x2="190" y1="50" stroke-width="2"/>
    </svg>
  `;
}

function generateParhuzamosCircuitSVG(r1, r2) {
  const isLightTheme = document.body.classList.contains("light");
  const svgClass = isLightTheme ? "svg-light" : "svg-dark";
  return `
    <svg class="${svgClass}" width="200" height="120" viewBox="0 0 200 120">
      <line x1="10" y1="60" x2="50" y1="60" stroke-width="2"/>
      <line x1="50" y1="60" x2="50" y1="30" stroke-width="2"/>
      <line x1="50" y1="60" x2="50" y1="90" stroke-width="2"/>
      <rect x="50" y="20" width="40" height="20" fill="none" stroke-width="2"/>
      <text x="70" y="15" font-size="12" text-anchor="middle">R1=${r1}Ω</text>
      <rect x="50" y="80" width="40" height="20" fill="none" stroke-width="2"/>
      <text x="70" y="75" font-size="12" text-anchor="middle">R2=${r2}Ω</text>
      <line x1="90" y1="30" x2="90" y1="60" stroke-width="2"/>
      <line x1="90" y1="90" x2="90" y1="60" stroke-width="2"/>
      <line x1="90" y1="60" x2="190" y1="60" stroke-width="2"/>
    </svg>
  `;
}

function generateOhmCircuitSVG(I, R, type) {
  const isLightTheme = document.body.classList.contains("light");
  const svgClass = isLightTheme ? "svg-light" : "svg-dark";
  return `
    <svg class="${svgClass}" width="200" height="100" viewBox="0 0 200 100">
      <line x1="10" y1="50" x2="50" y1="50" stroke-width="2"/>
      <circle cx="50" cy="50" r="10" fill="none" stroke-width="2"/>
      <text x="50" y="45" font-size="12" text-anchor="middle">${type === 0 ? `U=?` : type === 1 ? `I=${I}A` : `U=${I*R}V`}</text>
      <line x1="60" y1="50" x2="80" y1="50" stroke-width="2"/>
      <rect x="80" y="40" width="40" height="20" fill="none" stroke-width="2"/>
      <text x="100" y="35" font-size="12" text-anchor="middle">R=${R}Ω</text>
      <line x1="120" y1="50" x2="190" y1="50" stroke-width="2"/>
    </svg>
  `;
}

function generateComponentSVG(component) {
  const isLightTheme = document.body.classList.contains("light");
  const svgClass = isLightTheme ? "svg-light" : "svg-dark";
  switch (component) {
    case "LED":
      return `
        <svg class="${svgClass}" width="200" height="100" viewBox="0 0 200 100">
          <line x1="10" y1="50" x2="80" y1="50" stroke-width="2"/>
          <circle cx="100" cy="50" r="10" fill="none" stroke-width="2"/>
          <path d="M95 45 L105 55 M95 55 L105 45" stroke-width="2"/>
          <line x1="120" y1="50" x2="190" y1="50" stroke-width="2"/>
        </svg>`;
    case "Kapcsoló":
      return `
        <svg class="${svgClass}" width="200" height="100" viewBox="0 0 200 100">
          <line x1="10" y1="50" x2="80" y1="50" stroke-width="2"/>
          <circle cx="80" cy="50" r="5" fill="none" stroke-width="2"/>
          <line x1="80" y1="50" x2="100" y1="50" stroke-width="2"/>
          <circle cx="100" cy="50" r="5" fill="none" stroke-width="2"/>
          <line x1="100" y1="50" x2="190" y1="50" stroke-width="2"/>
        </svg>`;
    case "Lámpa":
      return `
        <svg class="${svgClass}" width="200" height="100" viewBox="0 0 200 100">
          <line x1="10" y1="50" x2="80" y1="50" stroke-width="2"/>
          <circle cx="100" cy="50" r="15" fill="none" stroke-width="2"/>
          <path d="M90 40 L110 60 M90 60 L110 40" stroke-width="2"/>
          <line x1="120" y1="50" x2="190" y1="50" stroke-width="2"/>
        </svg>`;
    case "Ellenállás":
      return `
        <svg class="${svgClass}" width="200" height="100" viewBox="0 0 200 100">
          <line x1="10" y1="50" x2="80" y1="50" stroke-width="2"/>
          <rect x="80" y="40" width="40" height="20" fill="none" stroke-width="2"/>
          <line x1="120" y1="50" x2="190" y1="50" stroke-width="2"/>
        </svg>`;
    default:
      return "";
  }
}

// --- FELADATTÍPUSOK ---
const taskTypes = [
  {
    name: "Alapfogalmak",
    value: "alapfogalmak",
    generate: () => ({
      display: "Kidolgozás alatt",
      answer: null,
      options: ["N/A", "N/A", "N/A", "N/A"],
      answerType: "choice"
    })
  },
  {
    name: "Elektronikai alkatrészek",
    value: "elektronikai_alkatreszek",
    generate: (difficulty) => {
      const components = ["LED", "Kapcsoló", "Lámpa", "Ellenállás"];
      const correct = components[getRandomInt(0, components.length - 1)];
      let options = [correct];
      while (options.length < 4) {
        const randomComponent = components[getRandomInt(0, components.length - 1)];
        if (!options.includes(randomComponent)) options.push(randomComponent);
      }
      options = shuffleArray(options);
      return {
        display: `Milyen alkatrész látható az alábbi áramkörben?<br>${generateComponentSVG(correct)}`,
        answer: correct,
        options: options,
        answerType: "choice"
      };
    }
  },
  {
    name: "Soros / Párhuzamos kapcsolások",
    value: "soros_parhuzamos",
    generate: (difficulty) => {
      const { min, max } = DIFFICULTY_SETTINGS[difficulty];
      const isLightTheme = document.body.classList.contains("light");
      const svgClass = isLightTheme ? "svg-light" : "svg-dark";
      let correctAnswer, display, options;
      if (difficulty === "easy") {
        let r1 = getRandomInt(min, max);
        let r2 = getRandomInt(min, max);
        correctAnswer = r1 + r2;
        display = `Mennyi a teljes ellenállás az alábbi áramkörben?<br>${generateSorosCircuitSVG(r1, r2)}`;
        options = generateNumberOptions(correctAnswer, min, max);
      } else if (difficulty === "medium") {
        let type = getRandomInt(0, 1);
        if (type === 0) {
          let r1 = getRandomInt(min, max);
          let r2 = getRandomInt(min, max);
          let r3 = getRandomInt(min, max);
          let parallel = Math.round(1 / (1 / r2 + 1 / r3));
          correctAnswer = r1 + parallel;
          display = `Mennyi a teljes ellenállás az alábbi áramkörben?<br>
                    <svg class="${svgClass}" width="300" height="120" viewBox="0 0 300 120">
                      <line x1="10" y1="60" x2="50" y1="60" stroke-width="2"/>
                      <rect x="50" y="50" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="70" y="45" font-size="12" text-anchor="middle">R1=${r1}Ω</text>
                      <line x1="90" y1="60" x2="110" y1="60" stroke-width="2"/>
                      <line x1="110" y1="60" x2="110" y1="30" stroke-width="2"/>
                      <line x1="110" y1="60" x2="110" y1="90" stroke-width="2"/>
                      <rect x="110" y="20" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="130" y="15" font-size="12" text-anchor="middle">R2=${r2}Ω</text>
                      <rect x="110" y="80" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="130" y="75" font-size="12" text-anchor="middle">R3=${r3}Ω</text>
                      <line x1="150" y1="30" x2="150" y1="60" stroke-width="2"/>
                      <line x1="150" y1="90" x2="150" y1="60" stroke-width="2"/>
                      <line x1="150" y1="60" x2="290" y1="60" stroke-width="2"/>
                    </svg>`;
          options = generateNumberOptions(correctAnswer, min, max);
        } else {
          let r1 = getRandomInt(min, max);
          let r2 = getRandomInt(min, max);
          let r3 = getRandomInt(min, max);
          let parallel = Math.round(1 / (1 / r1 + 1 / r2));
          correctAnswer = parallel + r3;
          display = `Mennyi a teljes ellenállás az alábbi áramkörben?<br>${generateParhuzamosCircuitSVG(r1, r2)}<br>R3=${r3}Ω sorosan`;
          options = generateNumberOptions(correctAnswer, min, max);
        }
      } else {
        let type = getRandomInt(0, 1);
        if (type === 0) {
          let r1 = getRandomInt(min, max);
          let r2 = getRandomInt(min, max);
          let r3 = getRandomInt(min, max);
          let r4 = getRandomInt(min, max);
          let parallel = Math.round(1 / (1 / r2 + 1 / r3));
          correctAnswer = r1 + parallel + r4;
          display = `Mennyi a teljes ellenállás az alábbi áramkörben?<br>
                    <svg class="${svgClass}" width="300" height="120" viewBox="0 0 300 120">
                      <line x1="10" y1="60" x2="50" y1="60" stroke-width="2"/>
                      <rect x="50" y="50" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="70" y="45" font-size="12" text-anchor="middle">R1=${r1}Ω</text>
                      <line x1="90" y1="60" x2="110" y1="60" stroke-width="2"/>
                      <line x1="110" y1="60" x2="110" y1="30" stroke-width="2"/>
                      <line x1="110" y1="60" x2="110" y1="90" stroke-width="2"/>
                      <rect x="110" y="20" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="130" y="15" font-size="12" text-anchor="middle">R2=${r2}Ω</text>
                      <rect x="110" y="80" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="130" y="75" font-size="12" text-anchor="middle">R3=${r3}Ω</text>
                      <line x1="150" y1="30" x2="150" y1="60" stroke-width="2"/>
                      <line x1="150" y1="90" x2="150" y1="60" stroke-width="2"/>
                      <line x1="150" y1="60" x2="190" y1="60" stroke-width="2"/>
                      <rect x="190" y="50" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="210" y="45" font-size="12" text-anchor="middle">R4=${r4}Ω</text>
                      <line x1="230" y1="60" x2="290" y1="60" stroke-width="2"/>
                    </svg>`;
          options = generateNumberOptions(correctAnswer, min, max);
        } else {
          let r1 = getRandomInt(min, max);
          let r2 = getRandomInt(min, max);
          let r3 = getRandomInt(min, max);
          let r4 = getRandomInt(min, max);
          let parallel1 = Math.round(1 / (1 / r1 + 1 / r2));
          let parallel2 = Math.round(1 / (1 / r3 + 1 / r4));
          correctAnswer = parallel1 + parallel2;
          display = `Mennyi a teljes ellenállás az alábbi áramkörben?<br>
                    <svg class="${svgClass}" width="300" height="140" viewBox="0 0 300 140">
                      <line x1="10" y1="70" x2="50" y1="70" stroke-width="2"/>
                      <line x1="50" y1="70" x2="50" y1="40" stroke-width="2"/>
                      <line x1="50" y1="70" x2="50" y1="100" stroke-width="2"/>
                      <rect x="50" y="30" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="70" y="25" font-size="12" text-anchor="middle">R1=${r1}Ω</text>
                      <rect x="50" y="90" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="70" y="85" font-size="12" text-anchor="middle">R2=${r2}Ω</text>
                      <line x1="90" y1="40" x2="90" y1="70" stroke-width="2"/>
                      <line x1="90" y1="100" x2="90" y1="70" stroke-width="2"/>
                      <line x1="90" y1="70" x2="130" y1="70" stroke-width="2"/>
                      <line x1="130" y1="70" x2="130" y1="40" stroke-width="2"/>
                      <line x1="130" y1="70" x2="130" y1="100" stroke-width="2"/>
                      <rect x="130" y="30" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="150" y="25" font-size="12" text-anchor="middle">R3=${r3}Ω</text>
                      <rect x="130" y="90" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="150" y="85" font-size="12" text-anchor="middle">R4=${r4}Ω</text>
                      <line x1="170" y1="40" x2="170" y1="70" stroke-width="2"/>
                      <line x1="170" y1="100" x2="170" y1="70" stroke-width="2"/>
                      <line x1="170" y1="70" x2="290" y1="70" stroke-width="2"/>
                    </svg>`;
          options = generateNumberOptions(correctAnswer, min, max);
        }
      }
      return {
        display,
        answer: correctAnswer.toString(),
        options,
        answerType: "choice"
      };
    }
  },
  {
    name: "Ohm-törvény",
    value: "ohm_torveny",
    generate: (difficulty) => {
      const { min, max } = DIFFICULTY_SETTINGS[difficulty];
      const isLightTheme = document.body.classList.contains("light");
      const svgClass = isLightTheme ? "svg-light" : "svg-dark";
      let maxI = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 50;
      let maxR = difficulty === "easy" ? 10 : difficulty === "medium" ? 50 : 200;
      let I = getRandomInt(1, maxI);
      let R = getRandomInt(1, maxR);
      let U = I * R;
      let type = getRandomInt(0, 2);
      let correctAnswer, display, options;
      if (difficulty === "hard") {
        let R2 = getRandomInt(1, maxR);
        U = I * (R + R2);
        if (type === 0) {
          correctAnswer = U;
          display = `Mennyi a feszültség az alábbi áramkörben?<br>
                    <svg class="${svgClass}" width="300" height="100" viewBox="0 0 300 100">
                      <line x1="10" y1="50" x2="50" y1="50" stroke-width="2"/>
                      <circle cx="50" cy="50" r="10" fill="none" stroke-width="2"/>
                      <text x="50" y="45" font-size="12" text-anchor="middle">U=?</text>
                      <line x1="60" y1="50" x2="80" y1="50" stroke-width="2"/>
                      <rect x="80" y="40" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="100" y="35" font-size="12" text-anchor="middle">R1=${R}Ω</text>
                      <line x1="120" y1="50" x2="140" y1="50" stroke-width="2"/>
                      <rect x="140" y="40" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="160" y="35" font-size="12" text-anchor="middle">R2=${R2}Ω</text>
                      <line x1="180" y1="50" x2="290" y1="50" stroke-width="2"/>
                      <text x="230" y="45" font-size="12" text-anchor="middle">I=${I}A</text>
                    </svg>`;
          options = generateNumberOptions(correctAnswer, min, max * 2);
        } else if (type === 1) {
          correctAnswer = I;
          display = `Mennyi az áram az alábbi áramkörben?<br>
                    <svg class="${svgClass}" width="300" height="100" viewBox="0 0 300 100">
                      <line x1="10" y1="50" x2="50" y1="50" stroke-width="2"/>
                      <circle cx="50" cy="50" r="10" fill="none" stroke-width="2"/>
                      <text x="50" y="45" font-size="12" text-anchor="middle">U=${U}V</text>
                      <line x1="60" y1="50" x2="80" y1="50" stroke-width="2"/>
                      <rect x="80" y="40" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="100" y="35" font-size="12" text-anchor="middle">R1=${R}Ω</text>
                      <line x1="120" y1="50" x2="140" y1="50" stroke-width="2"/>
                      <rect x="140" y="40" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="160" y="35" font-size="12" text-anchor="middle">R2=${R2}Ω</text>
                      <line x1="180" y1="50" x2="290" y1="50" stroke-width="2"/>
                      <text x="230" y="45" font-size="12" text-anchor="middle">I=?</text>
                    </svg>`;
          options = generateNumberOptions(correctAnswer, 1, maxI);
        } else {
          correctAnswer = R + R2;
          display = `Mennyi az ellenállás az alábbi áramkörben?<br>
                    <svg class="${svgClass}" width="300" height="100" viewBox="0 0 300 100">
                      <line x1="10" y1="50" x2="50" y1="50" stroke-width="2"/>
                      <circle cx="50" cy="50" r="10" fill="none" stroke-width="2"/>
                      <text x="50" y="45" font-size="12" text-anchor="middle">U=${U}V</text>
                      <line x1="60" y1="50" x2="80" y1="50" stroke-width="2"/>
                      <rect x="80" y="40" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="100" y="35" font-size="12" text-anchor="middle">R1=?</text>
                      <line x1="120" y1="50" x2="140" y1="50" stroke-width="2"/>
                      <rect x="140" y="40" width="40" height="20" fill="none" stroke-width="2"/>
                      <text x="160" y="35" font-size="12" text-anchor="middle">R2=${R2}Ω</text>
                      <line x1="180" y1="50" x2="290" y1="50" stroke-width="2"/>
                      <text x="230" y="45" font-size="12" text-anchor="middle">I=${I}A</text>
                    </svg>`;
          options = generateNumberOptions(correctAnswer, min, max * 2);
        }
      } else {
        if (type === 0) {
          correctAnswer = U;
          display = `Mennyi a feszültség az alábbi áramkörben?<br>${generateOhmCircuitSVG(I, R, 0)}`;
          options = generateNumberOptions(correctAnswer, min, max * 2);
        } else if (type === 1) {
          correctAnswer = I;
          display = `Mennyi az áram az alábbi áramkörben?<br>${generateOhmCircuitSVG(I, R, 1)}`;
          options = generateNumberOptions(correctAnswer, 1, maxI);
        } else {
          correctAnswer = R;
          display = `Mennyi az ellenállás az alábbi áramkörben?<br>${generateOhmCircuitSVG(I, R, 2)}`;
          options = generateNumberOptions(correctAnswer, min, max);
        }
      }
      return {
        display,
        answer: correctAnswer.toString(),
        options,
        answerType: "choice"
      };
    }
  },
  {
    name: "Hurok-törvény",
    value: "hurok_torveny",
    generate: () => ({
      display: "Kidolgozás alatt",
      answer: null,
      options: ["N/A", "N/A", "N/A", "N/A"],
      answerType: "choice"
    })
  },
  {
    name: "Csomóponti törvény",
    value: "csomoponti_torveny",
    generate: () => ({
      display: "Kidolgozás alatt",
      answer: null,
      options: ["N/A", "N/A", "N/A", "N/A"],
      answerType: "choice"
    })
  },
  {
    name: "Mind a három",
    value: "mind_a_harom",
    generate: () => ({
      display: "Kidolgozás alatt",
      answer: null,
      options: ["N/A", "N/A", "N/A", "N/A"],
      answerType: "choice"
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

// --- SEGÉDFÜGGVÉNYEK ---
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateNumberOptions(correctAnswer, min, max) {
  let options = [correctAnswer];
  while (options.length < 4) {
    const randomValue = getRandomInt(min, max);
    if (!options.includes(randomValue) && randomValue !== correctAnswer) {
      options.push(randomValue);
    }
  }
  return shuffleArray(options.map(String));
}

// --- KATEGÓRIÁK BETÖLTÉSE ---
function loadCategories() {
  categorySelect.innerHTML = taskTypes.map(task => `<option value="${task.value}">${task.name}</option>`).join('');
}

// --- ÁLLAPOTVÁLTOZÓK ---
let score = 0, startTime = 0, timerInterval = null, currentQuestion = 0, questions = [];
let wrongAttempts = 0; // Helytelen próbálkozások számlálása
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
  // Frissítjük az SVG-ket a kérdésnél, ha van aktuális kérdés
  if (currentQuestion < questions.length) {
    showQuestion(currentQuestion);
  }
}

themeToggle.addEventListener("click", function () {
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("vali-theme", isLight ? "dark" : "light");
  applyTheme();
});

// --- IDŐZÍTŐ ---
function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerDisplay.textContent = `${elapsed}`;
}

// --- FELADATSOR GENERÁLÁSA ---
function generateQuestions() {
  const difficulty = difficultySelect.value;
  const category = categorySelect.value;
  questions = [];
  const taskType = taskTypes.find(t => t.value === category);
  if (!taskType) {
    questions.push({ display: "Hiba: kategória nincs implementálva", answer: null, options: ["N/A", "N/A", "N/A", "N/A"], answerType: "choice" });
    return;
  }
  for (let i = 0; i < QUESTIONS; i++) {
    const task = taskType.generate(difficulty);
    if (!task.answer) {
      task.display = "Kidolgozás alatt";
      task.options = ["N/A", "N/A", "N/A", "N/A"];
    }
    questions.push(task);
  }
}

// --- KÉRDÉS MEGJELENÍTÉSE ---
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
  
  if (q.answer) {
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options";
    q.options.forEach(option => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = option;
      btn.onclick = () => {
        if (!gameActive) return;
        const correct = option === q.answer;
        if (correct) {
          score++;
          if (difficultySelect.value === "hard") {
            alert(motivationalMessages[getRandomInt(0, motivationalMessages.length - 1)]);
          } else if (difficultySelect.value === "medium" && currentQuestion === QUESTIONS - 2) {
            alert("Gratulálok, csak így tovább, mindjárt a végére érsz!");
          }
          currentQuestion++;
          showQuestion(currentQuestion);
        } else {
          wrongAttempts++; // Helytelen válasz számlálása
          alert("Nem jó válasz, próbáld újra!");
        }
      };
      optionsDiv.appendChild(btn);
    });
    div.appendChild(optionsDiv);
  }

  questionContainer.appendChild(div);
  div.scrollIntoView({ behavior: "smooth", block: "start" });
}

// --- JÁTÉK LOGIKA ---
function startGame() {
  gameActive = true;
  score = 0;
  wrongAttempts = 0; // Számláló visszaállítása játék indításakor
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
  numpadContainer.innerHTML = "";
}

function finishGame() {
  gameActive = false;
  clearInterval(timerInterval);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerDisplay.textContent = `${elapsed} (Vége)`;
  questionContainer.innerHTML = `<p style="font-size:1.2em;"><b>Gratulálok!</b> ${elapsed} másodperc alatt végeztél. Pontszám: ${score}/${QUESTIONS}. Helytelen próbálkozások: ${wrongAttempts}</p>`;
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