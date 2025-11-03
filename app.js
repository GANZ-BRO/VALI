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
  const options = (optionsArray || []).map((opt, index) => ({ value: (index + 1).toString(), label: opt }));
  return options;
}

// --- FELADATTÍPUSOK ---
const components = {
  easy: [
    { name: "Vezeték", symbol: "alkatreszek/wire.svg", description: "Elektromos áram vezetésére szolgál", example: "Áramkörök összekötésére" },
    { name: "Elem", symbol: "alkatreszek/cell.svg", description: "Elektromos energiát biztosít", example: "Távirányítókban" },
    { name: "Kapcsoló", symbol: "alkatreszek/switch.svg", description: "Áramkör nyitására vagy zárására szolgál", example: "Lámpák be- és kikapcsolására" },
    { name: "Nyomógomb", symbol: "alkatreszek/pushbutton.svg", description: "Ideiglenesen zárja az áramkört", example: "Kapucsengőkben használják" }, 
    { name: "Izzó", symbol: "alkatreszek/bulb.svg", description: "Fényt és hőt termel áram hatására", example: "Régi típusú lámpákban" },
    { name: "Ampermérő", symbol: "alkatreszek/ammeter.svg", description: "Áramerősség mérésére szolgáló műszer", example: "Motor áramfelvételének vizsgálata" },
    { name: "Voltmérő", symbol: "alkatreszek/voltmeter.svg", description: "Feszültség mérésére szolgáló műszer", example: "Tápegység kimenetének ellenőrzése" },
  ],
  medium: [
    { name: "Akkumulátor", symbol: "alkatreszek/battery.svg", description: "Újratölthető elektromos energiát biztosít", example: "Okostelefonokban és laptopokban" },
    { name: "Ellenállás", symbol: "alkatreszek/resistor.svg", description: "Áramot korlátozza", example: "Feszültségosztó" },
    { name: "Biztosíték", symbol: "alkatreszek/fuse.svg", description: "Védi az áramkört a túláramtól az olvadással", example: "Mérőmüszerek védelmére " },
    { name: "Kondenzátor", symbol: "alkatreszek/capacitor.svg", description: "Elektromos töltést tárol", example: "Szűrőáramkör" },
    { name: "Dióda", symbol: "alkatreszek/diode.svg", description: "Egyirányú áramot enged", example: "Tápegység" },
    { name: "LED", symbol: "alkatreszek/led.svg", description: "Fényt bocsát ki áram hatására", example: "Jelzőfények" },
    { name: "Tranzisztor", symbol: "alkatreszek/transistor.svg", description: "Felerősíti a jelet", example: "Erősítő áramkör" },
  ],
  hard: [
    { name: "Hálózati áramforrás", symbol: "alkatreszek/ac_source.svg", description: "Váltakozó feszültséget biztosít az áramkör számára", example: "230V-os konnektor" },
    { name: "Változtatható ellenállás", symbol: "alkatreszek/potentiometer.svg", description: "Az ellenállás értéke mechanikusan vagy elektronikusan szabályozható", example: "Hangerőszabályzó" },
    { name: "Fényérzékeny ellenállás", symbol: "alkatreszek/ldr.svg", description: "Ellenállása a fény intenzitásának megfelelően változik", example: "Automatikus világításvezérléshez" },
    { name: "Transzformátor", symbol: "alkatreszek/transformer.svg", description: "Feszültség vagy áramerősség átalakítására szolgál két tekercs segítségével", example: "Tápegységek" },
    { name: "Fotódióda", symbol: "alkatreszek/photodiode.svg", description: "Fényenergiát elektromos árammá alakít át", example: "Vonalkódolvasókba, napelemekbe" },
    { name: "Tekercs", symbol: "alkatreszek/coil.svg", description: "Mágneses mezőt hoz létre áram hatására, vagy tárolja az energiát", example: "Szűrőáramkörök" }
  ]
};

const taskTypes = [
  // --- FELADATTÍPUS: Elektronikai alkatrészek (módosítva: elfogad forcedComponent paramétert) ---
{
  name: "Elektronikai alkatrészek",
  value: "elektronikai_alkatreszek",
  generate: (difficulty, forcedComponent = null) => {
    const selectedComponents = components[difficulty] || components.easy;
    // ha forcedComponent át van adva, használjuk azt; különben válasszunk véletlent
    const component = forcedComponent || selectedComponents[getRandomInt(0, selectedComponents.length - 1)];
    const taskTypeCandidates = [0, 2, 3]; // 0: név-jele, 2: leírás, 3: hol használják
    const taskType = taskTypeCandidates[getRandomInt(0, taskTypeCandidates.length - 1)];

    let options = [];
    let correctAnswer;
    const wrongOptions = {
      names: selectedComponents.map(c => c.name),
      descriptions: selectedComponents.map(c => c.description),
      examples: selectedComponents.map(c => c.example)
    };

    if (taskType === 0) { // Mi az alkatrész neve, ha a jele: ...
      options = [component.name, ...shuffleArray(wrongOptions.names.filter(name => name !== component.name)).slice(0, 3)];
      options = shuffleArray(options);
      correctAnswer = (options.indexOf(component.name) + 1).toString();
      return {
        display: `Mi az alkatrész neve, ha a jele: <span class="blue-percent"><img src="${component.symbol}" alt="${component.name} szimbólum" class="question-symbol" onerror="this.onerror=null; this.src='alkatreszek/fallback.svg';"></span>`,
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
      display: "Áramkör rajzoló — generálj egysoros áramkört és nézd meg!",
      answer: null,
      answerType: "none",
      options: []
    })
  }
];

// --- VÁLTOZÓK (DOM elemeket DOMContentLoaded-ban töltjük) ---
let quizContainer, timerDisplay, bestStats, difficultySelect, categorySelect, startBtn, restartBtn, themeToggle;

// --- ÁLLAPOTVÁLTOZÓK ---
let score = 0;
let startTime = 0;
let timerInterval = null;
let currentQuestion = 0;
let questions = [];
let best = { score: 0, time: null, wrongAnswers: Infinity };
let gameActive = false;
let wrongAnswers = 0;
let attempts = []; // betöltött próbálkozások a jelenlegi kategória+nehézség szerint

// --- PONTOZÁSI LOGIKA ---
function calculatePoints(elapsedSeconds, wrongCount) {
  const base = 100;
  const overtime = Math.max(0, elapsedSeconds - 10);
  const penaltyWrong = (wrongCount || 0) * 20;
  const penaltyTime = overtime * 1; // 1 pont/másodperc
  const raw = base - penaltyWrong - penaltyTime;
  return Math.max(0, raw);
}

// --- SVG TÉMA ALKALMAZÁS ---
// A CSS kezeli a dark/light ikon-fehérítést; itt eltávolítjuk az inline style-okat,
// hogy a CSS (body.dark ...) érvényesüljön egyértelműen.
function applySvgThemeToAll() {
  const svg = document.getElementById("responsive-series-circuit-svg");
  if (!svg) return;
  const images = svg.querySelectorAll('image');
  images.forEach(img => {
    // távolítsuk el az esetleges inline filtereket, a CSS fog dönteni a témáról
    img.style.removeProperty('filter');
  });
}

// --- STÍLUS: csak a válasz (option) gombokra — mobilon 90%-os méret ---
function injectAnswerButtonStyle() {
  if (document.getElementById('vilma-option-btn-style')) return;
  const style = document.createElement('style');
  style.id = 'vilma-option-btn-style';
  style.textContent = `
    .option-btn {
      font-size: 0.9em !important;
      padding: 0.6em 0.9em !important;
      line-height: 1.1 !important;
      border-radius: 6px;
      box-sizing: border-box;
    }
    .option-item img.question-symbol { max-height: 1.4em; vertical-align: middle; }
  `;
  document.head.appendChild(style);
}

// --- JÁTÉK LOGIKA ---
function showQuestion(index) {
  if (!quizContainer) return;
  if (index >= QUESTIONS) {
    finishGame();
    return;
  }

  const q = questions[index];
  let div = document.createElement("div");
  div.className = "question-container";

  let html = `
    <div class="progress-bar">
      <div class="progress" style="width:${(score / QUESTIONS) * 100}%"></div>
      <div class="progress-wrong" style="width:${(wrongAnswers / QUESTIONS) * 100}%; left:${(score / QUESTIONS) * 100}%"></div>
    </div>
    <div class="question-text">${q.display}</div>
  `;

  if (q.answerType === "number" && Array.isArray(q.options) && q.options.length) {
    html += `<div class="options-container">`;
    const options = generateOptions(parseInt(q.answer) - 1, q.options || [], q.answerType, difficultySelect?.value, "");
    options.forEach((opt) => {
      html += `
        <div class="option-item">
          <button class="option-btn" data-answer="${opt.value}" type="button">${opt.label}</button>
        </div>
      `;
    });
    html += `</div>`;
    div.innerHTML = html;
    quizContainer.innerHTML = "";
    quizContainer.appendChild(div);

    const buttons = div.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (ev) => {
        if (!gameActive) return;
        const selected = parseInt(ev.currentTarget.getAttribute('data-answer'));
        const correct = parseInt(q.answer);
        if (selected === correct) {
          score++;
          currentQuestion++;
          if (currentQuestion >= QUESTIONS) {
            finishGame();
          } else {
            showQuestion(currentQuestion);
          }
        } else {
          wrongAnswers++;
          alert('Helytelen válasz! Próbáld újra.');
        }
        const p = div.querySelector('.progress');
        const pw = div.querySelector('.progress-wrong');
        if (p && pw) {
          p.style.width = `${(score / QUESTIONS) * 100}%`;
          pw.style.width = `${(wrongAnswers / QUESTIONS) * 100}%`;
          pw.style.left = `${(score / QUESTIONS) * 100}%`;
        }
      });
    });

  } else {
    html += `<div class="no-options"><button id="question-next-btn" type="button">Tovább</button></div>`;
    div.innerHTML = html;
    quizContainer.innerHTML = "";
    quizContainer.appendChild(div);

    const btn = document.getElementById('question-next-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        currentQuestion++;
        if (currentQuestion >= QUESTIONS) {
          finishGame();
        } else {
          showQuestion(currentQuestion);
        }
      });
    }
  }

  if (index > 0) window.scrollTo(0, window.scrollY);
}

function startGame() {
  if (!difficultySelect?.value || !categorySelect?.value) {
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
  if (bestStats) bestStats.style.opacity = "0.55";
}

function finishGame() {
  gameActive = false;
  clearInterval(timerInterval);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  if (timerDisplay) timerDisplay.textContent = `${elapsed} (Vége)`;

  const points = calculatePoints(elapsed, wrongAnswers);

  if (quizContainer) {
    quizContainer.innerHTML = `<p style="font-size:1.2em;"><b>Gratulálok!</b> ${elapsed} másodperc alatt végeztél.<br>Helytelen válaszok száma: ${wrongAnswers}<br><b>Pontok:</b> ${points}</p>`;
  }

  saveBest(points, elapsed);
  saveAttempt(points, elapsed);
  loadAttempts();
  if (quizContainer) {
    const attemptsHtml = renderAttemptsHtml();
    quizContainer.innerHTML += attemptsHtml;
    bindAttemptsButtons();
  }

  if (restartBtn) restartBtn.style.display = "";
  if (startBtn) startBtn.style.display = "";
  if (bestStats) bestStats.style.opacity = "1";
  if (categorySelect) categorySelect.disabled = false;
  if (difficultySelect) difficultySelect.disabled = false;
}

function generateQuestions() {
  const difficulty = difficultySelect?.value || 'easy';
  const category = categorySelect?.value || 'elektronikai_alkatreszek';
  questions = [];
  const taskType = taskTypes.find(t => t.value === category);
  if (!taskType) {
    for (let i = 0; i < QUESTIONS; i++) {
      questions.push({ display: "Hiba: kategória nincs implementálva", answer: null, answerType: "number", options: [] });
    }
    return;
  }

  const availableComponents = components[difficulty] || components.easy;
  const usedComponents = new Set(); // ide gyűjtjük azokat az alkatrészeket, amikről már volt kérdés

  let lastTaskType = -1;
  for (let i = 0; i < QUESTIONS; i++) {
    let task;
    let attemptsLocal = 0;
    const maxAttempts = 50;

    // Válasszunk egy alkatrészt, ami még nincs usedComponents-ben, ha lehetséges
    let candidateComponent = null;
    const pool = availableComponents.filter(c => !usedComponents.has(c.name));

    if (pool.length > 0) {
      candidateComponent = pool[getRandomInt(0, pool.length - 1)];
      // foglaljuk le az alkatrészt az adott játékra
      usedComponents.add(candidateComponent.name);
    } else {
      // nincs több egyedi alkatrész: engedünk ismétlést (vagy ha szeretnéd, itt resetelhetjük a usedComponents-et)
      candidateComponent = availableComponents[getRandomInt(0, availableComponents.length - 1)];
    }

    do {
      // passzoljuk be a kiválasztott komponens-t a generate-nek (ha a generate nem használja, semmi baj)
      task = taskType.generate(difficulty, candidateComponent);
      attemptsLocal++;
      if (attemptsLocal > maxAttempts) break;
    } while (getTaskTypeIndex(task.display) === lastTaskType);

    lastTaskType = getTaskTypeIndex(task.display);

    // Validációk (ahogy korábban is)
    if (!task.answer && task.answerType === 'number') {
      task.display = "Hiba: érvénytelen feladat generálódott";
      task.answer = null;
      task.options = [];
    }
    if (!['number', 'none'].includes(task.answerType)) {
      task.answerType = 'number';
    }
    task.options = task.options || [];
    questions.push(task);
  }
}

function getTaskTypeIndex(display) {
  if (!display) return -1;
  if (display.includes("Mi az alkatrész neve, ha a jele:")) return 0;
  if (display.includes("Mi az alkatrész jele, ha a neve:")) return 1;
  if (display.includes("Mi az alkatrész leírása, ha a neve:")) return 2;
  if (display.includes("Hol használják az alkatrészt, ha a neve:")) return 3;
  return -1;
}

// --- UTOLSÓ VÁLASZTÁS MENTÉSE/BETÖLTÉSE ---
function saveLastSelection() {
  try {
    if (categorySelect) localStorage.setItem("vilma-last-category", categorySelect.value);
    if (difficultySelect) localStorage.setItem("vilma-last-difficulty", difficultySelect.value);
  } catch (e) { /* ignore storage errors */ }
}

function loadLastSelection() {
  try {
    const lastCat = localStorage.getItem("vilma-last-category");
    const lastDiff = localStorage.getItem("vilma-last-difficulty");
    if (lastCat && categorySelect) categorySelect.value = lastCat;
    if (lastDiff && difficultySelect) difficultySelect.value = lastDiff;
  } catch (e) { /* ignore */ }
}

function loadCategories() {
  if (!categorySelect) return;
  categorySelect.innerHTML = taskTypes.map(task => `<option value="${task.value}">${task.name}</option>`).join('');
}

// --- LEGJOBB EREDMÉNY MENTÉSE/BETÖLTÉSE ---
function loadBest() {
  const diff = difficultySelect?.value || 'easy';
  const cat = categorySelect?.value || taskTypes[0].value;
  try {
    const bestRaw = localStorage.getItem("vilma-best-" + cat + "-" + diff);
    best = bestRaw ? JSON.parse(bestRaw) : { score: 0, time: null, wrongAnswers: Infinity };
    best.wrongAnswers = best.wrongAnswers !== undefined ? best.wrongAnswers : Infinity;
  } catch {
    best = { score: 0, time: null, wrongAnswers: Infinity };
  }
  showBest();
  loadAttempts();
}

function saveBest(newScore, time) {
  const diff = difficultySelect?.value || 'easy';
  const cat = categorySelect?.value || taskTypes[0].value;
  let currentBest = {};
  try {
    currentBest = JSON.parse(localStorage.getItem("vilma-best-" + cat + "-" + diff)) || { score: 0, time: null, wrongAnswers: Infinity };
  } catch {
    currentBest = { score: 0, time: null, wrongAnswers: Infinity };
  }

  const newWrongAnswers = wrongAnswers !== undefined ? wrongAnswers : 0;

  // Megtartjuk a meglévő szabályt: legjobb idő csak hibátlan válaszoknál érvényes
  if (newWrongAnswers < (currentBest.wrongAnswers || Infinity) ||
    (newWrongAnswers === (currentBest.wrongAnswers || Infinity) &&
      (currentBest.time === null || time < currentBest.time))) {
    best = { score: newScore, time: time, wrongAnswers: newWrongAnswers };
    try {
      localStorage.setItem("vilma-best-" + cat + "-" + diff, JSON.stringify(best));
    } catch (e) { /* ignore */ }
    showBest();
  }
}

function showBest() {
  if (!bestStats) return;
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

/* --- PRÓBÁLKOZÁSOK MENTÉSE/BETÖLTÉSE/MEGJELENÍTÉSE --- */
function loadAttempts() {
  const diff = difficultySelect?.value || 'easy';
  const cat = categorySelect?.value || taskTypes[0].value;
  const key = "vilma-attempts-" + cat + "-" + diff;
  try {
    const raw = localStorage.getItem(key);
    attempts = raw ? JSON.parse(raw) : [];
  } catch {
    attempts = [];
  }
}

function saveAttempt(newScore, time) {
  const diff = difficultySelect?.value || 'easy';
  const cat = categorySelect?.value || taskTypes[0].value;
  const key = "vilma-attempts-" + cat + "-" + diff;
  let arr = [];
  try {
    arr = JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    arr = [];
  }
  const attempt = {
    number: arr.length + 1,
    score: newScore, // itt a pontok kerülnek mentésre
    time: time,
    wrongAnswers: wrongAnswers !== undefined ? wrongAnswers : 0,
    date: new Date().toISOString()
  };
  arr.push(attempt);
  try {
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (e) { /* ignore */ }
  attempts = arr;
}

function renderAttemptsHtml() {
  if (!attempts || attempts.length === 0) {
    return `<div style="margin-top:12px;"><b>Korábbi próbálkozások:</b> Nincsenek még próbálkozások ebben a kategóriában/nehézségben.</div>`;
  }
  let html = `<div style="margin-top:12px;"><b>Korábbi próbálkozások:</b><table style="width:100%;border-collapse:collapse;margin-top:6px;">`;
  html += `<thead><tr style="text-align:left;border-bottom:1px solid #ccc"><th style="padding:6px">#</th><th style="padding:6px">Pont</th><th style="padding:6px">Idő (s)</th><th style="padding:6px">Hibák</th><th style="padding:6px">Dátum</th></tr></thead><tbody>`;
  attempts.forEach(a => {
    const dateStr = new Date(a.date).toLocaleString();
    html += `<tr style="border-bottom:1px solid #eee"><td style="padding:6px">${a.number}</td><td style="padding:6px">${a.score}</td><td style="padding:6px">${a.time}</td><td style="padding:6px">${a.wrongAnswers}</td><td style="padding:6px">${dateStr}</td></tr>`;
  });
  html += `</tbody></table>`;
  html += `<div style="margin-top:8px;"><button id="clear-attempts-btn" style="margin-top:6px">Próbálkozások törlése (csak ez a kategória)</button></div>`;
  html += `</div>`;
  return `<div class="attempts-list-block">${html}</div>`;
}

function bindAttemptsButtons() {
  const btn = document.getElementById("clear-attempts-btn");
  if (!btn) return;
  btn.onclick = () => {
    const diff = difficultySelect?.value || 'easy';
    const cat = categorySelect?.value || taskTypes[0].value;
    const key = "vilma-attempts-" + cat + "-" + diff;
    try {
      localStorage.removeItem(key);
    } catch (e) { /* ignore */ }
    attempts = [];
    const elapsedText = timerDisplay?.textContent || "";
    if (quizContainer) {
      quizContainer.innerHTML = `<p style="font-size:1.2em;"><b>Gratulálok!</b> ${elapsedText} másodperc alatt végeztél.<br>Helytelen válaszok száma: ${wrongAnswers}</p>`;
      quizContainer.innerHTML += renderAttemptsHtml();
      bindAttemptsButtons();
    }
  };
}

/* --- TÉMA VÁLTÁS --- */
function applyTheme() {
  const theme = localStorage.getItem("vilma-theme") || "light";
  const isLight = theme === "light";
  document.body.classList.toggle("dark", !isLight);
  // CSS kezeli az ikonok színét (body.dark szabályok). Töröljük inline stílusokat, ha lennének.
  applySvgThemeToAll();
}

function toggleTheme(event) {
  event && event.preventDefault();
  const body = document.body;
  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    localStorage.setItem("vilma-theme", "light");
  } else {
    body.classList.add("dark");
    localStorage.setItem("vilma-theme", "dark");
  }
  applySvgThemeToAll();
}

/* --- IDŐZÍTŐ --- */
function updateTimer() {
  if (!timerDisplay) return;
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerDisplay.textContent = elapsed;
}

/* --- EGYSOROS ÁRAMKÖR RAJZOLÓ (opcionális) --- */
function generateFixedSeriesCircuit() {
  return [
    { type: "cell", symbol: "alkatreszek/cell0.svg", label: "9V" },
    { type: "resistor", symbol: "alkatreszek/resistor0.svg", label: "R1", value: getRandomResistorValue() },
    { type: "led", symbol: "alkatreszek/led0.svg", label: "LED1", color: "piros" },
    { type: "resistor", symbol: "alkatreszek/resistor0.svg", label: "R2", value: getRandomResistorValue() },
    { type: "led", symbol: "alkatreszek/led0.svg", label: "LED2", color: "zöld" },
    { type: "resistor", symbol: "alkatreszek/resistor0.svg", label: "R3", value: getRandomResistorValue() }
  ];
}

function drawResponsiveSeriesCircuitSVG(circuit, svgId = "responsive-series-circuit-svg") {
  const maxW = Math.min(window.innerWidth, 500);
  const iconCount = circuit.length;
  const margin = 0;
  const iconW = Math.floor((maxW - (iconCount + 1) * margin) / iconCount);
  const iconH = iconW;

  let svg = document.getElementById(svgId);
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = svgId;
    document.body.appendChild(svg);
  }
  svg.setAttribute("width", maxW);
  svg.setAttribute("height", iconH + 80);
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
      // Ne állítsunk inline filtert itt: a CSS body.dark szabály fogja kezelni.
      svg.appendChild(img);
    }
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x + iconW / 5);
    label.setAttribute("y", y + iconH + 22);
    label.setAttribute("font-size", Math.floor(iconW / 4));
    label.textContent = comp.label;
    svg.appendChild(label);

    if (comp.type === "resistor" && comp.value) {
      const val = document.createElementNS("http://www.w3.org/2000/svg", "text");
      val.setAttribute("x", x + iconW / 8);
      val.setAttribute("y", y + iconH + 48);
      val.setAttribute("font-size", Math.floor(iconW / 5));
      val.textContent = `${comp.value} Ω`;
      svg.appendChild(val);
    }
    if (comp.type === "led" && comp.color) {
      const ledColor = document.createElementNS("http://www.w3.org/2000/svg", "text");
      ledColor.setAttribute("x", x + iconW / 8);
      ledColor.setAttribute("y", y + iconH + 48);
      ledColor.setAttribute("font-size", Math.floor(iconW / 5));
      ledColor.textContent = comp.color;
      svg.appendChild(ledColor);
    }
  }

  // biztosítjuk, hogy a CSS által beállított téma-irányelvek alkalmazódjanak (ha korábban inline volt)
  applySvgThemeToAll();
}

function addResponsiveSeriesCircuitGeneratorButton() {
  if (document.getElementById("responsive-series-circuit-btn")) return;
  const btn = document.createElement('button');
  btn.id = "responsive-series-circuit-btn";
  btn.textContent = "Egysoros áramkör generálása (mindig kifér!)";
  btn.style.margin = "20px 0";
  btn.style.fontSize = "1.2em";
  btn.onclick = () => {
    window.currentCircuit = generateFixedSeriesCircuit();
    drawResponsiveSeriesCircuitSVG(window.currentCircuit);
  };
  document.body.appendChild(btn);
}

// --- INICIALIZÁCIÓ ---
document.addEventListener("DOMContentLoaded", () => {
  quizContainer = document.getElementById("quiz");
  timerDisplay = document.getElementById("time");
  bestStats = document.getElementById("best-stats");
  difficultySelect = document.getElementById("difficulty");
  categorySelect = document.getElementById("category");
  startBtn = document.querySelector(".big-btn[onclick='startGame()']") || document.querySelector("button[onclick='startGame()']");
  restartBtn = document.getElementById("restart-btn") || document.querySelector("button[onclick='restartGame()']");
  themeToggle = document.getElementById("theme-toggle");

  if (!categorySelect) {
    if (quizContainer) {
      quizContainer.innerHTML = '<p style="color:#c00;"><b>Hiba:</b> A kategória választó nem található. Ellenőrizd, hogy létezik-e egy &lt;select id="category"&gt; elem az oldalon.</p>';
    }
    console.error("categorySelect nincs jelen a DOM-ban. Kérlek ellenőrizd az index.html-t.");
    return;
  }

  injectAnswerButtonStyle();

  loadCategories();
  loadLastSelection();
  applyTheme();

  themeToggle && themeToggle.addEventListener("click", toggleTheme);
  themeToggle && themeToggle.addEventListener("touchstart", toggleTheme);

  categorySelect.addEventListener("change", () => {
    saveLastSelection();
    loadBest();
    if (categorySelect.value === "aramkor_rajzolo") {
      addResponsiveSeriesCircuitGeneratorButton();
    } else {
      const btn = document.getElementById("responsive-series-circuit-btn");
      if (btn) btn.remove();
      const svg = document.getElementById("responsive-series-circuit-svg");
      if (svg) svg.remove();
    }
  });

  window.addEventListener("resize", () => {
    if (window.currentCircuit) {
      drawResponsiveSeriesCircuitSVG(window.currentCircuit);
    }
  });

  difficultySelect && difficultySelect.addEventListener("change", () => { saveLastSelection(); loadBest(); });
  if (startBtn) startBtn.onclick = startGame;
  if (restartBtn) restartBtn.onclick = startGame;
  loadBest();

  if (!quizContainer || !timerDisplay || !bestStats || !difficultySelect || !categorySelect || !startBtn || !restartBtn || !themeToggle) {
    console.warn("Hiányzó HTML elem(ek). Ellenőrizd az ID-ket és a script elhelyezését:", {
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
