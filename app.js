// --- ALAPBEÁLLÍTÁSOK ---
const QUESTIONS = 5; // Feladatok száma egy játékban
const DIFFICULTY_SETTINGS = {
  easy: { min: 0, max: 10 },
  medium: { min: -20, max: 20 },
  hard: { min: -100, max: 100 }
};

// --- SEGÉDFÜGGVÉNYEK ---
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomResistorValue() {
  // Csak a megadott értékekből választ!
  const values = [330, 470, 1000, 1200];
  return values[getRandomInt(0, values.length - 1)];
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
  if (answerType !== "number") return [];
  const options = optionsArray.map((opt, index) => ({ value: (index + 1).toString(), label: opt }));
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
    { name: "Fotódióda", symbol: "alkatreszek/photodiode.svg", description: "Fényenergiát elektromos árammá alakít át", example: "Vonalkódolvasókba, napelemekbe" },
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
        options = shuffleArray(options);
        correctAnswer = (options.indexOf(component.name) + 1).toString();
        return {
          display: `Mi az alkatrész neve, ha a jele: <span class="blue-percent"><img src="${component.symbol}" alt="${component.name} szimbólum" class="question-symbol" onerror="this.onerror=null; this.src='alkatreszek/fallback.svg';"></span>?`,
          answer: correctAnswer,
          answerType: "number",
          options: options
        };
      } else if (taskType === 1) { // Mi az alkatrész jele, ha a neve: ...
        options = [component.symbol, ...shuffleArray(wrongOptions.symbols.filter(symbol => symbol !== component.symbol)).slice(0, 3)];
        options = shuffleArray(options);
        options = options.map(symbol => `<img src="${symbol}" alt="alkatrész szimbólum" class="question-symbol" onerror="this.onerror=null; this.src='alkatreszek/fallback.svg';">`);
        correctAnswer = (options.indexOf(`<img src="${component.symbol}" alt="alkatrész szimbólum" class="question-symbol" onerror="this.onerror=null; this.src='alkatreszek/fallback.svg';">`) + 1).toString();
        return {
          display: `Mi az alkatrész jele, ha a neve: <span class="blue-percent">${component.name}</span>?`,
          answer: correctAnswer,
          answerType: "number",
          options: options
        };
      } else if (taskType === 2) { // Mi az alkatrész leírása, ha a neve: ...
        options = [component.description, ...shuffleArray(wrongOptions.descriptions.filter(desc => desc !== component.description)).slice(0, 3)];
        options = shuffleArray(options);
        correctAnswer = (options.indexOf(component.description) + 1).toString();
        return {
          display: `Mi az alkatrész leírása, ha a neve: <span class="blue-percent">${component.name}</span>?`,
          answer: correctAnswer,
          answerType: "number",
          options: options
        };
      } else { // Hol használják az alkatrészt, ha a neve: ...
        options = [component.example, ...shuffleArray(wrongOptions.examples.filter(example => example !== component.example)).slice(0, 3)];
        options = shuffleArray(options);
        correctAnswer = (options.indexOf(component.example) + 1).toString();
        return {
          display: `Hol használhatják az alkatrészt, ha a neve: <span class="blue-percent">${component.name}</span>?`,
          answer: correctAnswer,
          answerType: "number",
          options: options
        };
      }
    }
  },
  {
    name: "Áramkör rajzoló",
    value: "aramkor_rajzolo",
    generate: (difficulty) => ({
      display: "Áramkör rajzoló",
      answer: null,
      answerType: "none",
      options: []
    })
  }
];

// --- HTML ELEMEK ---
const quizContainer = document.getElementById("quiz");
const timerDisplay = document.getElementById("time");
const bestStats = document.getElementById("best-stats");
const difficultySelect = document.getElementById("difficulty");
const categorySelect = document.getElementById("category");
const startBtn = document.querySelector(".big-btn[onclick='startGame()']") || document.querySelector("button[onclick='startGame()']");
const restartBtn = document.getElementById("restart-btn") || document.querySelector("button[onclick='restartGame()']");
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

  const markers = div.querySelectorAll('.option-marker');
  const texts = div.querySelectorAll('.option-text');
  
  const handleClick = (event) => {
    if (!gameActive) return;
    const selectedAnswer = parseInt(event.currentTarget.getAttribute('data-answer'));
    const correctAnswer = parseInt(q.answer);
    let pauseStart = Date.now();
    if (timerInterval) clearInterval(timerInterval);

    markers.forEach(m => m.classList.remove('checked'));
    texts.forEach(t => t.classList.remove('checked'));
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
  if (restartBtn) restartBtn.style.display = "none";
  if (startBtn) startBtn.style.display = "none";
  bestStats.style.opacity = "0.55";
}

function finishGame() {
  gameActive = false;
  clearInterval(timerInterval);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerDisplay.textContent = `${elapsed} (Vége)`;
  quizContainer.innerHTML = `<p style="font-size:1.2em;"><b>Gratulálok!</b> ${elapsed} másodperc alatt végeztél.<br>Helytelen válaszok száma: ${wrongAnswers}</p>`;
  saveBest(score, elapsed);

  if (restartBtn) restartBtn.style.display = "";
  if (startBtn) startBtn.style.display = "";
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
  let lastTaskType = -1;
  for (let i = 0; i < QUESTIONS; i++) {
    let task;
    let attempts = 0;
    const maxAttempts = 10;
    do {
      task = taskType.generate(difficulty);
      attempts++;
      if (attempts > maxAttempts) {
        break;
      }
    } while (getTaskTypeIndex(task.display) === lastTaskType);
    lastTaskType = getTaskTypeIndex(task.display);

    if (!task.answer || task.answer === "?") {
      task.display = "Hiba: érvénytelen feladat generálódott";
      task.answer = null;
    }
    if (!['number'].includes(task.answerType)) {
      task.answerType = 'number';
    }
    questions.push(task);
  }
}

function getTaskTypeIndex(display) {
  if (display.includes("Mi az alkatrész neve, ha a jele:")) return 0;
  if (display.includes("Mi az alkatrész jele, ha a neve:")) return 1;
  if (display.includes("Mi az alkatrész leírása, ha a neve:")) return 2;
  if (display.includes("Hol használják az alkatrészt, ha a neve:")) return 3;
  return -1;
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

// --- EGYSOROS ÁRAMKÖR RAJZOLÓ, vezetéket NEM rajzol! ---
// (illeszd be az app.js végére vagy az "Áramkör rajzoló" funkciókhoz)

function getRandomResistorValue() {
  const values = [330, 470, 1000, 1200];
  return values[getRandomInt(0, values.length - 1)];
}

function generateSimpleSeriesCircuit() {
  // Random 2 vagy 3 ellenállás, random 1 vagy 2 LED
  const resistorCount = 2 + getRandomInt(0, 1); // 2 vagy 3
  const ledCount = 1 + getRandomInt(0, 1);      // 1 vagy 2

  // Alkatrészek listája, első elem az elem (cell)
  const circuit = [
    { type: "cell", symbol: "alkatreszek/cell.svg", label: "Elem" }
  ];

  for (let i = 0; i < resistorCount; i++) {
    circuit.push({
      type: "resistor",
      symbol: "alkatreszek/resistor.svg",
      label: `R${i + 1}`,
      value: getRandomResistorValue()
    });
  }
  for (let i = 0; i < ledCount; i++) {
    circuit.push({
      type: "led",
      symbol: "alkatreszek/led.svg",
      label: `LED${i + 1}`,
      color: (i === 0 ? "piros" : "zöld")
    });
  }

  return circuit;
}

function drawSimpleSeriesCircuitSVG(circuit, svgId = "simple-series-circuit-svg") {
  const iconW = 48, iconH = 48, margin = 10;

  let svg = document.getElementById(svgId);
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = svgId;
    document.body.appendChild(svg);
  }
  svg.setAttribute("width", circuit.length * (iconW + margin) + margin);
  svg.setAttribute("height", iconH + 60);
  svg.style.display = "block";
  svg.style.margin = "18px auto";
  svg.innerHTML = '';

  for (let i = 0; i < circuit.length; i++) {
    const comp = circuit[i];
    const x = margin + i * (iconW + margin);
    const y = margin;
    if (comp.symbol && comp.symbol.endsWith('.svg')) {
      const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
      img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', comp.symbol);
      img.setAttribute("x", x);
      img.setAttribute("y", y);
      img.setAttribute("width", iconW);
      img.setAttribute("height", iconH);
      svg.appendChild(img);
    }
    // Felirat
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x + 8);
    label.setAttribute("y", y + iconH + 18);
    label.setAttribute("font-size", "15");
    label.textContent = comp.label;
    svg.appendChild(label);

    // Ellenállás érték
    if (comp.type === "resistor" && comp.value) {
      const val = document.createElementNS("http://www.w3.org/2000/svg", "text");
      val.setAttribute("x", x + 5);
      val.setAttribute("y", y + iconH + 38);
      val.setAttribute("font-size", "13");
      val.textContent = `${comp.value} Ω`;
      svg.appendChild(val);
    }
    // LED szín
    if (comp.type === "led" && comp.color) {
      const ledColor = document.createElementNS("http://www.w3.org/2000/svg", "text");
      ledColor.setAttribute("x", x + 5);
      ledColor.setAttribute("y", y + iconH + 38);
      ledColor.setAttribute("font-size", "13");
      ledColor.textContent = comp.color;
      svg.appendChild(ledColor);
    }
  }
}

function addSimpleSeriesCircuitGeneratorButton() {
  if (document.getElementById("simple-series-circuit-btn")) return;
  const btn = document.createElement('button');
  btn.id = "simple-series-circuit-btn";
  btn.textContent = "Egysoros áramkör generálása";
  btn.style.margin = "20px 0";
  btn.style.fontSize = "1.1em";
  btn.onclick = () => {
    const circuit = generateSimpleSeriesCircuit();
    drawSimpleSeriesCircuitSVG(circuit);
  };
  document.body.appendChild(btn);
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
  themeToggle && themeToggle.addEventListener("click", toggleTheme);
  themeToggle && themeToggle.addEventListener("touchstart", toggleTheme);

  categorySelect.addEventListener("change", () => {
    saveLastSelection();
    loadBest();
    // Ha áramkör rajzoló van kiválasztva, mutasd a gombot
    if (categorySelect.value === "aramkor_rajzolo") {
      addSimpleSeriesCircuitGeneratorButton();
    } else {
      const btn = document.getElementById("simple-series-circuit-btn");
      if (btn) btn.remove();
      const svg = document.getElementById("simple-series-circuit-svg");
      if (svg) svg.remove();
    }
  });

  difficultySelect.addEventListener("change", () => { saveLastSelection(); loadBest(); });
  if (startBtn) startBtn.onclick = startGame;
  if (restartBtn) restartBtn.onclick = startGame;
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
