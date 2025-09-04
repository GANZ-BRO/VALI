// --- ALAPBEÁLLÍTÁSOK ---
const QUESTIONS = 5; // Feladatok száma egy játékban
const DIFFICULTY_SETTINGS = {
  easy: { min: 0, max: 10 },
  medium: { min: -20, max: 20 },
  hard: { min: -100, max: 100 }
};

// --- MOTIVÁLÓ ÜZENETEK ---
const motivationalMessages = [
  "Szuper munka, igazi matekzseni vagy!",
  "Fantasztikus, így kell ezt csinálni!",
  "Látom, nem lehet téged megállítani, csak így tovább!",
  "Bravó, ezt a nehéz feladatot is megoldottad!",
  "Kiváló, egyre közelebb vagy a csúcshoz!",
  "Hűha, ez egy profi megoldás volt!",
  "Nagyszerű, a matek mestere vagy!",
  "Remekül teljesítesz, folytasd ebben a szellemben!"
];

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

function gcd(a, b) { 
  return b === 0 ? a : gcd(b, a % b); 
}

function simplifyFraction(num, denom) {
  let d = gcd(Math.abs(num), Math.abs(denom));
  return [num / d, denom / d];
}

function formatNumber(value, unit, difficulty, forceBaseUnit = false) {
  if (isNaN(value)) {
    console.error("Hiba: formatNumber kapott NaN értéket", { value, unit, difficulty });
    return { value: 0, unit: unit };
  }
  let absValue = Math.abs(value);
  let newValue = value;
  let newUnit = unit;
  let precision = difficulty === "hard" ? 5 : 2;

  if (difficulty === "easy" || forceBaseUnit) {
    newValue = value;
    newUnit = unit;
  } else if (difficulty === "medium") {
    if (unit === 'Ω' && absValue >= 1000) {
      newValue = value / 1000;
      newUnit = 'kΩ';
    } else if (unit === 'Ω' && absValue > 100) {
      newValue = value / 1000;
      newUnit = 'kΩ';
    } else if (unit === 'A' && absValue < 0.1) {
      newValue = value * 1000;
      newUnit = 'mA';
    } else if (unit === 'A' && absValue < 1) {
      newValue = value * 1000;
      newUnit = 'mA';
    }
  } else {
    if (unit === 'Ω' && absValue >= 1000) {
      newValue = value / 1000;
      newUnit = 'kΩ';
    } else if (unit === 'A' && absValue < 0.1) {
      newValue = value * 1000;
      newUnit = 'mA';
    }
  }

  if (Number.isInteger(newValue)) {
    newValue = Number(newValue.toFixed(0));
  } else {
    newValue = Number(newValue.toFixed(precision));
  }

  return { value: newValue, unit: newUnit };
}

function generateOptions(correctAnswerIndex, optionsArray, answerType, difficulty, unit) {
  console.log("generateOptions called", { correctAnswerIndex, optionsArray, answerType, difficulty, unit });
  if (answerType !== "number") return [];
  const options = optionsArray.map((opt, index) => ({ value: (index + 1).toString(), label: opt }));
  console.log("generateOptions result", options);
  return options;
}

// --- FELADATTÍPUSOK ---
const components = {
  easy: [
    { name: "Vezeték", symbol: "alkatreszek/wire.svg", description: "Elektromos áram vezetésére szolgál", example: "Áramkörök összekötésére" },
    { name: "Elem", symbol: "alkatreszek/cell.svg", description: "Elektromos energiát biztosít", example: "Távirányítókban" },
    { name: "Kapcsoló", symbol: "alkatreszek/switch.svg", description: "Áramkör nyitására vagy zárására szolgál", example: "Lámpák be- és kikapcsolására" },
    { name: "Izzó", symbol: "alkatreszek/bulb.svg", description: "Fényt és hőt termel áram hatására", example: "Régi típusú lámpákban" },
    { name: "Voltmérő", symbol: "alkatreszek/voltmeter.svg", description: "Feszültség mérésére szolgáló műszer", example: "Tápegység kimenetének ellenőrzése" },
     
    
  ],
  medium: [
    { name: "Akkumulátor", symbol: "alkatreszek/battery.svg", description: "Újratölthető elektromos energiát biztosít", example: "Okostelefonokban és laptopokban" },
    { name: "Ellenállás", symbol: "alkatreszek/resistor.svg", description: "Áramot korlátozza", example: "Feszültségosztó" },
    { name: "Ampermérő", symbol: "alkatreszek/ammeter.svg", description: "Áramerősség mérésére szolgáló műszer", example: "Motor áramfelvételének vizsgálata" },
    { name: "Kondenzátor", symbol: "alkatreszek/capacitor.svg", description: "Elektromos töltést tárol", example: "Szűrőáramkör" },
    { name: "Dióda", symbol: "alkatreszek/diode.svg", description: "Egyirányú áramot enged", example: "Tápegység" },
    { name: "LED", symbol: "alkatreszek/led.svg", description: "Fényt bocsát ki áram hatására", example: "Jelzőfények" },
    { name: "Nyomógomb", symbol: "alkatreszek/pushbutton.svg", description: "Ideiglenesen zárja az áramkört", example: "Kapucsengőkben használják" }
    
  ],
  hard: [
    { name: "Hálózati áramforrás", symbol: "alkatreszek/ac_source.svg", description: "Váltakozó feszültséget biztosít az áramkör számára", example: "230V-os konnektor" },
    { name: "Tranzisztor", symbol: "alkatreszek/transistor.svg", description: "Felerősíti a jelet", example: "Erősítő áramkör" },
    { name: "Biztosíték", symbol: "alkatreszek/fuse.svg", description: "Védi az áramkört a túláramtól az olvadással", example: "Mérőmüszerek védelmére " },
    { name: "Változtatható ellenállás", symbol: "alkatreszek/potentiometer.svg", description: "Az ellenállás értéke mechanikusan vagy elektronikusan szabályozható", example: "Hangerőszabályzó" },
    { name: "Fényérzékeny ellenállás", symbol: "alkatreszek/ldr.svg", description: "Ellenállása a fény intenzitásának megfelelően változik", example: "Automatikus világításvezérléshez" },
    { name: "Transzformátor", symbol: "alkatreszek/transformer.svg", description: "Feszültség vagy áramerősség átalakítására szolgál két tekercs segítségével", example: "Tápegységek" },
    { name: "Fotódióda", symbol: "alkatreszek/photodiode.svg", description: "Fényenergiát elektromos árammá alakít át", example: "Vonalkódolvasókba,  napelemekbe" },
    { name: "Tekercs", symbol: "alkatreszek/coil.svg", description: "Mágneses mezőt hoz létre áram hatására, vagy tárolja az energiát", example: "Szűrőáramkörök" }
  ]
};

const taskTypes = [
  {
    name: "Elektronikai alkatrészek",
    value: "elektronikai_alkatreszek",
    generate: (difficulty) => {
      const selectedComponents = components[difficulty];
      const component = selectedComponents[getRandomInt(0, selectedComponents.length - 1)];
      const taskType = getRandomInt(0, 3);

      let options = [];
      let correctAnswer;
      const wrongOptions = {
        names: selectedComponents.map(c => c.name),
        symbols: selectedComponents.map(c => c.symbol),
        descriptions: selectedComponents.map(c => c.description),
        examples: selectedComponents.map(c => c.example)
      };

      if (taskType === 0) { // Mi az alkatrész neve, ha a jele: ...
        options = [component.name, ...shuffleArray(wrongOptions.names.filter(name => name !== component.name)).slice(0, 3)];
        options = shuffleArray(options); // Véletlenszerű sorrend
        correctAnswer = (options.indexOf(component.name) + 1).toString();
        return {
          display: `Mi az alkatrész neve, ha a jele: <span class="blue-percent"><img src="${component.symbol}" alt="${component.name} szimbólum" class="question-symbol" onerror="this.onerror=null; this.src='alkatreszek/fallback.svg'; console.log('Hiba: ${component.symbol} nem található');"></span>?`,
          answer: correctAnswer,
          answerType: "number",
          options: options
        };
      } else if (taskType === 1) { // Mi az alkatrész jele, ha a neve: ...
        options = [component.symbol, ...shuffleArray(wrongOptions.symbols.filter(symbol => symbol !== component.symbol)).slice(0, 3)];
        options = shuffleArray(options); // Véletlenszerű sorrend
        options = options.map(symbol => `<img src="${symbol}" alt="alkatrész szimbólum" class="question-symbol" onerror="this.onerror=null; this.src='alkatreszek/fallback.svg'; console.log('Hiba: ${symbol} nem található');">`);
        correctAnswer = (options.indexOf(`<img src="${component.symbol}" alt="alkatrész szimbólum" class="question-symbol" onerror="this.onerror=null; this.src='alkatreszek/fallback.svg'; console.log('Hiba: ${component.symbol} nem található');">`) + 1).toString();
        return {
          display: `Mi az alkatrész jele, ha a neve: <span class="blue-percent">${component.name}</span>?`,
          answer: correctAnswer,
          answerType: "number",
          options: options
        };
      } else if (taskType === 2) { // Mi az alkatrész leírása, ha a neve: ...
        options = [component.description, ...shuffleArray(wrongOptions.descriptions.filter(desc => desc !== component.description)).slice(0, 3)];
        options = shuffleArray(options); // Véletlenszerű sorrend
        correctAnswer = (options.indexOf(component.description) + 1).toString();
        return {
          display: `Mi az alkatrész leírása, ha a neve: <span class="blue-percent">${component.name}</span>?`,
          answer: correctAnswer,
          answerType: "number",
          options: options
        };
      } else { // Hol használják az alkatrészt, ha a neve: ...
        options = [component.example, ...shuffleArray(wrongOptions.examples.filter(example => example !== component.example)).slice(0, 3)];
        options = shuffleArray(options); // Véletlenszerű sorrend
        correctAnswer = (options.indexOf(component.example) + 1).toString();
        return {
          display: `Hol használhatják az alkatrészt, ha a neve: <span class="blue-percent">${component.name}</span>?`,
          answer: correctAnswer,
          answerType: "number",
          options: options
        };
      }
    }
  }
];

// --- HTML ELEMEK ---
const quizContainer = document.getElementById("quiz");
const timerDisplay = document.getElementById("time");
const bestStats = document.getElementById("best-stats");
const difficultySelect = document.getElementById("difficulty");
const categorySelect = document.getElementById("category");
const startBtn = document.querySelector(".big-btn[onclick='startGame()']");
const restartBtn = document.getElementById("restart-btn");
const themeToggle = document.getElementById("theme-toggle");

// --- JÁTÉK LOGIKA ---
function showQuestion(index) {
  if (index >= QUESTIONS) {
    finishGame();
    return;
  }

  const q = questions[index];
  let div;

  if (index === 0 || quizContainer.children.length === 0) {
    div = document.createElement("div");
    div.className = "question-container";
    quizContainer.innerHTML = "";
    quizContainer.appendChild(div);
  } else {
    div = quizContainer.children[0];
    div.className = "question-container";
  }

  // Válaszok generálása ponttal (•) jelölőkkel
  let optionsHtml = "";
  const options = generateOptions(parseInt(q.answer) - 1, q.options || [], q.answerType, difficultySelect.value, "");
  options.forEach((opt, i) => {
    optionsHtml += `
      <div class="option-item">
        <span class="option-marker" data-answer="${opt.value}">•</span>
        <span class="option-text" data-answer="${opt.value}">${opt.label}</span>
      </div>
    `;
  });

  div.innerHTML = `
    <div class="progress-bar">
      <div class="progress"></div>
      <div class="progress-wrong"></div>
    </div>
    <div class="question-text">${q.display}</div>
    <div class="options-container">${optionsHtml}</div>
  `;

  // Eseménykezelő az option-marker és option-text elemekre
  const markers = div.querySelectorAll('.option-marker');
  const texts = div.querySelectorAll('.option-text');
  
  const handleClick = (event) => {
    if (!gameActive) return;

    const selectedAnswer = parseInt(event.currentTarget.getAttribute('data-answer'));
    const correctAnswer = parseInt(q.answer);
    let pauseStart = Date.now();
    if (timerInterval) clearInterval(timerInterval);

    markers.forEach(m => m.classList.remove('checked'));
    texts.forEach(t => t.classList.remove('checked')); // Töröljük a checked állapotot a szövegről is
    event.currentTarget.classList.add('checked');

    if (selectedAnswer === correctAnswer) {
      score++;
      currentQuestion++;
      markers.forEach(m => m.classList.remove('checked'));
      texts.forEach(t => t.classList.remove('checked'));
      showQuestion(currentQuestion);
      if (currentQuestion >= QUESTIONS) {
        finishGame();
      } else {
        startTime += (Date.now() - pauseStart);
        timerInterval = setInterval(updateTimer, 1000);
      }
    } else {
      wrongAnswers++;
      startTime += (Date.now() - pauseStart);
      timerInterval = setInterval(updateTimer, 1000);
      alert('Helytelen válasz! Próbáld újra.');
    }
  };

  markers.forEach(marker => {
    marker.addEventListener('click', handleClick);
  });

  texts.forEach(text => {
    text.addEventListener('click', handleClick);
  });

  const progress = div.querySelector('.progress');
  const progressWrong = div.querySelector('.progress-wrong');
  if (progress && progressWrong) {
    progress.style.width = `${(score / QUESTIONS) * 100}%`;
    progressWrong.style.width = `${(wrongAnswers / QUESTIONS) * 100}%`;
    progressWrong.style.left = `${(score / QUESTIONS) * 100}%`;
  }

  if (index > 0) {
    window.scrollTo(0, window.scrollY);
  }
}

function startGame() {
  if (!difficultySelect.value || !categorySelect.value) {
    alert("Kérlek, válassz nehézséget és kategóriát!");
    return;
  }

  gameActive = true;
  score = 0;
  currentQuestion = 0;
  wrongAnswers = 0;
  generateQuestions();
  showQuestion(0);
  startTime = Date.now();
  updateTimer();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);

  categorySelect.disabled = true;
  difficultySelect.disabled = true;
  restartBtn.style.display = "none";
  startBtn.style.display = "none";
  bestStats.style.opacity = "0.55";
}

function finishGame() {
  gameActive = false;
  clearInterval(timerInterval);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerDisplay.textContent = `${elapsed} (Vége)`;
  quizContainer.innerHTML = `<p style="font-size:1.2em;"><b>Gratulálok!</b> ${elapsed} másodperc alatt végeztél.<br>Helytelen válaszok száma: ${wrongAnswers}</p>`;
  saveBest(score, elapsed);

  restartBtn.style.display = "";
  startBtn.style.display = "";
  bestStats.style.opacity = "1";
  categorySelect.disabled = false;
  difficultySelect.disabled = false;
}

function generateQuestions() {
  const difficulty = difficultySelect.value;
  const category = categorySelect.value;
  questions = [];
  const taskType = taskTypes.find(t => t.value === category);
  if (!taskType) {
    questions.push({ display: "Hiba: kategória nincs implementálva", answer: null, answerType: "number" });
    return;
  }
  let lastTaskType = -1; // -1 kezdeti érték, hogy az első kérdésnél ne legyen korlátozás
  for (let i = 0; i < QUESTIONS; i++) {
    let task;
    let attempts = 0;
    const maxAttempts = 10; // Elkerüljük a végtelen ciklust, ha kevés típus van
    do {
      task = taskType.generate(difficulty);
      attempts++;
      if (attempts > maxAttempts) {
        console.warn("Túl sok próbálkozás az új feladat típus generálásához, a ciklus megszakítva.");
        break;
      }
    } while (getTaskTypeIndex(task.display) === lastTaskType); // Addig generálunk, amíg különbözik
    lastTaskType = getTaskTypeIndex(task.display); // Frissítjük az előző típust

    if (!task.answer || task.answer === "?") {
      task.display = "Hiba: érvénytelen feladat generálódott";
      task.answer = null;
    }
    if (!['number'].includes(task.answerType)) {
      console.warn(`Ismeretlen answerType: ${task.answerType} a ${taskType.name} feladattípusban`);
      task.answerType = 'number';
    }
    questions.push(task);
  }
}

// Segédfüggvény a feladat típus azonosítására a display alapján
function getTaskTypeIndex(display) {
  if (display.includes("Mi az alkatrész neve, ha a jele:")) return 0;
  if (display.includes("Mi az alkatrész jele, ha a neve:")) return 1;
  if (display.includes("Mi az alkatrész leírása, ha a neve:")) return 2;
  if (display.includes("Hol használják az alkatrészt, ha a neve:")) return 3;
  return -1; // Ismeretlen típus esetén
}

// --- UTOLSÓ VÁLASZTÁS MENTÉSE/BETÖLTÉSE ---
function saveLastSelection() {
  localStorage.setItem("vilma-last-category", categorySelect.value);
  localStorage.setItem("vilma-last-difficulty", difficultySelect.value);
}

function loadLastSelection() {
  const lastCat = localStorage.getItem("vilma-last-category");
  const lastDiff = localStorage.getItem("vilma-last-difficulty");
  if (lastCat) categorySelect.value = lastCat;
  if (lastDiff) difficultySelect.value = lastDiff;
}

function loadCategories() {
  categorySelect.innerHTML = taskTypes.map(task => `<option value="${task.value}">${task.name}</option>`).join('');
}

// --- LEGJOBB EREDMÉNY MENTÉSE/BETÖLTÉSE ---
function loadBest() {
  const diff = difficultySelect.value;
  const cat = categorySelect.value;
  try {
    const bestRaw = localStorage.getItem("vilma-best-" + cat + "-" + diff);
    best = bestRaw ? JSON.parse(bestRaw) : { score: 0, time: null, wrongAnswers: Infinity };
    best.wrongAnswers = best.wrongAnswers !== undefined ? best.wrongAnswers : Infinity;
  } catch {
    best = { score: 0, time: null, wrongAnswers: Infinity };
  }
  showBest();
}

function saveBest(newScore, time) {
  const diff = difficultySelect.value;
  const cat = categorySelect.value;
  let currentBest = JSON.parse(localStorage.getItem("vilma-best-" + cat + "-" + diff)) || { score: 0, time: null, wrongAnswers: Infinity };
  
  const newWrongAnswers = wrongAnswers !== undefined ? wrongAnswers : 0;
  
  if (newWrongAnswers < (currentBest.wrongAnswers || Infinity) || 
      (newWrongAnswers === (currentBest.wrongAnswers || Infinity) && 
       (currentBest.time === null || time < currentBest.time))) {
    best = { score: newScore, time: time, wrongAnswers: newWrongAnswers };
    localStorage.setItem("vilma-best-" + cat + "-" + diff, JSON.stringify(best));
    showBest();
  }
}

function showBest() {
  if (best.time !== null && best.wrongAnswers !== Infinity) {
    let resultText = `🏆 <b>Legjobb eredmény:</b> ${best.time} mp`;
    if (best.wrongAnswers > 0) {
      resultText += `, ${best.wrongAnswers} hiba`;
    }
    bestStats.innerHTML = resultText;
  } else {
    bestStats.innerHTML = `🏆 <b>Még nincs megjeleníthető legjobb eredmény.</b>`;
  }
  bestStats.style.display = "";
}

// --- TÉMA VÁLTÁS ---
function applyTheme() {
  const theme = localStorage.getItem("vilma-theme") || "light";
  const isLight = theme === "light";
  document.body.classList.toggle("dark", !isLight);
}

function toggleTheme(event) {
  event.preventDefault();
  const body = document.body;
  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    localStorage.setItem("vilma-theme", "light");
  } else {
    body.classList.add("dark");
    localStorage.setItem("vilma-theme", "dark");
  }
}

// --- IDŐZÍTŐ ---
function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerDisplay.textContent = elapsed;
}

// --- ÁLLAPOTVÁLTOZÓK ---
let score = 0, startTime = 0, timerInterval = null, currentQuestion = 0, questions = [];
let best = { score: 0, time: null, wrongAnswers: Infinity };
let gameActive = false;
let wrongAnswers = 0;

// --- INICIALIZÁCIÓ ---
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadLastSelection();
  applyTheme();
  themeToggle.addEventListener("click", toggleTheme);
  themeToggle.addEventListener("touchstart", toggleTheme);
  categorySelect.addEventListener("change", () => { saveLastSelection(); loadBest(); });
  difficultySelect.addEventListener("change", () => { saveLastSelection(); loadBest(); });
  startBtn.onclick = startGame;
  restartBtn.onclick = startGame;
  loadBest();

  if (!quizContainer || !timerDisplay || !bestStats || !difficultySelect || !categorySelect || !startBtn || !restartBtn || !themeToggle) {
    console.error("Hiányzó HTML elem:", {
      quizContainer: !!quizContainer,
      timerDisplay: !!timerDisplay,
      bestStats: !!bestStats,
      difficultySelect: !!difficultySelect,
      categorySelect: !!categorySelect,
      startBtn: !!startBtn,
      restartBtn: !!restartBtn,
      themeToggle: !!themeToggle
    });
  }
});
