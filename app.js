// --- SEGÉDFÜGGVÉNYEK ---
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function highlight(text) {
  return `<span class="blue-percent" style="font-weight:bold;">${text}</span>`;
}

const biztositekSor = [6, 10, 13, 16, 20, 25, 32, 40];

// --- BEÁLLÍTÁSOK ---
function saveSettings() {
  localStorage.setItem("lastCategory", document.getElementById("category").value);
  localStorage.setItem("lastDifficulty", document.getElementById("difficulty").value);
}

function loadSettings() {
  const lastCat = localStorage.getItem("lastCategory");
  const lastDiff = localStorage.getItem("lastDifficulty");
  if (lastCat) document.getElementById("category").value = lastCat;
  if (lastDiff) document.getElementById("difficulty").value = lastDiff;
}

// --- ADATBÁZISOK ---
const components = {
  easy: [
    { name: "Vezeték", symbol: "alkatreszek/wire.svg" },
    { name: "Elem", symbol: "alkatreszek/cell.svg" },
    { name: "Akkumulátor", symbol: "alkatreszek/battery.svg" },
    { name: "Kapcsoló", symbol: "alkatreszek/switch.svg" },
    { name: "Izzó", symbol: "alkatreszek/bulb.svg" },
    { name: "Biztosíték", symbol: "alkatreszek/fuse.svg" }
  ],
  medium: [
    { name: "Ellenállás", symbol: "alkatreszek/resistor.svg" },
    { name: "Kondenzátor", symbol: "alkatreszek/capacitor.svg" },
    { name: "Dióda", symbol: "alkatreszek/diode.svg" },
    { name: "LED", symbol: "alkatreszek/led.svg" },
    { name: "Ampermérő", symbol: "alkatreszek/ammeter.svg" },
    { name: "Voltmérő", symbol: "alkatreszek/voltmeter.svg" }
  ],
  hard: [
    { name: "Tranzisztor", symbol: "alkatreszek/transistor.svg" },
    { name: "Potenciométer", symbol: "alkatreszek/potentiometer.svg" },
    { name: "Tekercs", symbol: "alkatreszek/coil.svg" },
    { name: "Biztosíték", symbol: "alkatreszek/fuse.svg" }
  ]
};

const theoryQuestions = [
    { q: "Mi a feszültségmentesítés első 3 lépése?", a: ["Kikapcsolás, reteszelés, ellenőrzés", "Hívás, elválasztás, mérés", "Földelés, rövidrezárás, elkerítés", "Jelentés, mérés, visszakapcsolás"], c: 0 },
    { q: "Milyen színű a védővezető (földelés)?", a: ["Zöld-sárga", "Kék", "Fekete", "Piros"], c: 0 },
    { q: "Melyik az áram vegyi hatása?", a: ["Akkumulátor töltése", "Vasaló melegedése", "Villanymotor forgása", "Izzólámpa világítása"], c: 0 },
    { q: "Melyik hatás alapján működik a kismegszakító (zárlat esetén)?", a: ["Mágneses hatás", "Vegyi hatás", "Fényhatás", "Biológiai hatás"], c: 0 },
    { q: "Szabad-e fáziskereső ceruzát használni feszültségmentesség ellenőrzésére?", a: ["Nem, csak hitelesített kétpólusú műszert", "Igen, mert egyszerű", "Igen, ha világít a lámpája", "Csak ha nincs nálunk más"], c: 0 },
    { q: "Mit jelent az IP67-es jelölés? <br><small style='color:#666;'>(Súgó: 6=teljes porvédelem, 7=vízbe merítés rövid ideig)</small>", a: ["Pormentes és ideiglenes vízbemerítés", "Fröccsenő víz és por ellen védett", "Csak beltéri használatra", "Víz alatt folyamatosan használható"], c: 0 }
];

// --- GENERÁTOROK ---
const generators = {
  alkatresz_felismeres: (diff, count) => {
    let pool = [...components.easy];
    if (diff !== 'easy') pool = [...pool, ...components.medium];
    if (diff === 'hard') pool = [...pool, ...components.hard];
    const selected = shuffleArray(pool).slice(0, Math.min(count, pool.length));
    return selected.map(comp => {
      let wrong = shuffleArray(["Motor", "Relé", "Transzformátor", "Dióda", "Műszer"]).filter(n => n !== comp.name).slice(0, 3);
      wrong.push(comp.name);
      const final = shuffleArray(wrong);
      return { display: `Mi a neve?<br><img src="${comp.symbol}" style="width:100px;display:block;margin:15px auto;">`, options: final, answer: (final.indexOf(comp.name) + 1).toString() };
    });
  },

  szamitas: (diff, count) => {
    const tasks = [];
    for (let i = 0; i < count; i++) {
      let q, ans, subtype = getRandomInt(1, 5);
      
      if (diff === 'easy') {
          // KÖNNYŰ FELADATOK - MINDIG GENERÁL VALAMIT
          if (subtype === 1) { 
              let r = getRandomInt(2, 20), iv = getRandomInt(1, 10);
              q = `U = ? <br><small style='color:#666;'>(U = I · R)</small><br>(I = ${highlight(iv+' A')}, R = ${highlight(r+' Ω')})`; ans = (r * iv) + " V";
          } else if (subtype === 2) { 
              let r = getRandomInt(2, 10), u = r * getRandomInt(1, 5);
              q = `I = ? <br><small style='color:#666;'>(I = U / R)</small><br>(U = ${highlight(u+' V')}, R = ${highlight(r+' Ω')})`; ans = (u / r) + " A";
          } else if (subtype === 3) { 
              let iv = getRandomInt(1, 5), u = iv * getRandomInt(2, 10);
              q = `R = ? <br><small style='color:#666;'>(R = U / I)</small><br>(U = ${highlight(u+' V')}, I = ${highlight(iv+' A')})`; ans = (u / iv) + " Ω";
          } else if (subtype === 4) { 
              let r1 = getRandomInt(5, 50), r2 = getRandomInt(5, 50);
              q = `SOROS Re = ? <br><small style='color:#666;'>(Re = R1 + R2)</small><br>(R1=${highlight(r1+' Ω')}, R2=${highlight(r2+' Ω')})`; ans = (r1 + r2) + " Ω";
          } else { 
              let u = 230, iv = getRandomInt(1, 5);
              q = `P = ? <br><small style='color:#666;'>(P = U · I)</small><br>(U = ${highlight(u+' V')}, I = ${highlight(iv+' A')})`; ans = (u * iv) + " W";
          }
      } else {
          // KÖZEPES/NEHÉZ FELADATOK
          if (subtype === 1) { 
              let p = getRandomInt(2, 6) * 800;
              let u = 230;
              let javasolt = biztositekSor.find(b => b > (p/u)) || 40;
              q = `Gép: ${highlight(p+' W')} (${highlight(u+' V')}). Biztosíték (A)? <br><small style="color:#666;">(I = P/U, válassz nagyobbat!)</small>`;
              ans = javasolt + " A";
          } else if (subtype === 2) { 
              let i_ertek = [10, 16, 25, 32][getRandomInt(0,3)];
              let kereszt = i_ertek <= 16 ? "1.5" : i_ertek <= 25 ? "2.5" : "4";
              q = `Vezeték: ${highlight(i_ertek+' A')}-re hányas rézvezeték kell? <br><small style="color:#666;">(1.5mm²=${highlight('16A-ig')}, 2.5mm²=${highlight('25A-ig')}, 4mm²=${highlight('32A-ig')})</small>`;
              ans = kereszt + " mm²";
          } else if (subtype === 3) { 
              let r1 = getRandomInt(1, 5)*10, r2 = getRandomInt(1, 5)*10;
              let re = parseFloat(((r1 * r2) / (r1 + r2)).toFixed(1));
              q = `PÁRHUZAMOS Re = ? <br><small style='color:#666;'>( (R1·R2) / (R1+R2) )</small><br>(R1=${highlight(r1+' Ω')}, R2=${highlight(r2+' Ω')})`;
              ans = re + " Ω";
          } else if (subtype === 4) { 
              let val = getRandomInt(1, 9);
              q = `Hány ${highlight('A')} az értéke: ${highlight(val*100+' mA')}-nak? <br><small style='color:#666;'>(1000 mA = 1 A)</small>`; 
              ans = (val / 10) + " A";
          } else { 
              let utap = [9, 12, 24][getRandomInt(0,2)], uled = 2;
              let r = (utap - uled) / (0.02);
              q = `LED előtét: Utáp=${highlight(utap+' V')}, Uled=${highlight(uled+' V')}, I=${highlight('20 mA')}. R? <br><small style='color:#666;'>( (Utáp-Uled) / I )</small>`;
              ans = r.toFixed(0) + " Ω";
          }
      }

      let opts = [ans];
      while(opts.length < 4) {
        let val = parseFloat(ans);
        let w = (val * (0.4 + Math.random() * 1.2)).toFixed(ans.includes('.') ? 1 : 0) + " " + ans.split(' ')[1];
        if(!opts.includes(w) && w.split(' ')[0] != val) opts.push(w);
      }
      const final = shuffleArray(opts);
      tasks.push({ display: q, options: final, answer: (final.indexOf(ans) + 1).toString() });
    }
    return tasks;
  },

  elmelet: (diff, count) => {
    return shuffleArray(theoryQuestions).slice(0, count).map(t => {
      const opts = shuffleArray(t.a);
      return { display: `<b>Elmélet:</b><br>${t.q}`, options: opts, answer: (opts.indexOf(t.a[t.c]) + 1).toString() };
    });
  }
};

// --- JÁTÉKVEZÉRLÉS ---
let questions = [], currentQuestion = 0, score = 0, totalErrors = 0, timerInterval, startTime, isExamMode = false;
let isFirstAttempt = true;

function startGame(mode) {
  saveSettings();
  isExamMode = (mode === 'exam');
  const diff = isExamMode ? 'medium' : document.getElementById("difficulty").value;
  const count = isExamMode ? 12 : 5;
  const cat = document.getElementById("category").value;

  questions = isExamMode ? shuffleArray([...generators.alkatresz_felismeres('medium', 4), ...generators.szamitas('medium', 4), ...generators.elmelet('medium', 4)]) : generators[cat](diff, count);

  score = 0; totalErrors = 0; currentQuestion = 0;
  document.querySelector(".settings").style.display = "none";
  document.querySelectorAll(".big-btn").forEach(b => b.style.display = "none");
  if(document.getElementById("exam-btn")) document.getElementById("exam-btn").style.display = "none";
  
  startTime = Date.now();
  if(timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => document.getElementById("time").textContent = Math.floor((Date.now() - startTime) / 1000), 1000);
  showQuestion();
}

function showQuestion() {
  isFirstAttempt = true;
  const q = questions[currentQuestion];
  document.getElementById("quiz").innerHTML = `
    <div class="question-container">
      <div class="progress-bar"><div class="progress" style="width:${(currentQuestion/questions.length)*100}%"></div></div>
      <p style="text-align:center; color:gray; font-size:0.8em; margin-top:5px;">${currentQuestion + 1} / ${questions.length}</p>
      <div class="question-text" style="margin-bottom:20px; text-align:center; font-size:1.1em;">${q.display}</div>
      <div class="options-grid" style="display:grid; gap:10px;">
        ${q.options.map((opt, i) => `<button class="option-btn" onclick="checkAnswer(event, ${i+1})">${opt}</button>`).join("")}
      </div>
    </div>`;
}

function checkAnswer(event, idx) {
  const q = questions[currentQuestion];
  const btn = event.target;
  
  if (idx.toString() === q.answer) {
    btn.style.background = "#00CC00"; btn.style.color = "white";
    if (isFirstAttempt) score++;
    setTimeout(() => { 
        currentQuestion++; 
        if (currentQuestion < questions.length) showQuestion(); 
        else finishGame(); 
    }, 500);
  } else {
    totalErrors++;
    isFirstAttempt = false;
    btn.style.background = "#D32F2F"; btn.style.color = "white";
    if (isExamMode) {
        setTimeout(() => { 
            currentQuestion++; 
            if (currentQuestion < questions.length) showQuestion(); 
            else finishGame(); 
        }, 500);
    } else {
        setTimeout(() => { 
            btn.style.opacity = "0.4"; 
            btn.disabled = true; 
            btn.style.background = ""; 
            btn.style.color = ""; 
        }, 400);
    }
  }
}

function finishGame() {
  clearInterval(timerInterval);
  let feedback = "";
  let percent = (score / questions.length) * 100;
  
  if (percent === 100 && totalErrors === 0) feedback = "Tökéletes! Elsőre tudtál mindent!";
  else if (percent === 100) feedback = "Kiváló, de volt néhány hibás kattintásod.";
  else if (percent >= 75) feedback = "Jó eredmény, de figyelj jobban az első választásra!";
  else if (percent >= 50) feedback = "Gyakorolj még, sokat bizonytalankodtál.";
  else feedback = "Ez sajnos gyenge lett, nézd át az alapokat!";

  document.getElementById("quiz").innerHTML = `
    <div style="text-align:center; padding:20px;">
      <h2>Vége</h2>
      <p style="font-size:1.1em; font-weight:bold; color:#333;">${feedback}</p>
      <p style="font-size:1.4em; color:#00CC00; font-weight:bold;">Pontszám (csak elsőre): ${score} / ${questions.length}</p>
      <p style="color:#D32F2F;">Összes rontott kattintás: <b>${totalErrors}</b></p>
      <p>Idő: ${document.getElementById("time").textContent} mp</p>
      <button class="big-btn" style="margin-top:20px;" onclick="location.reload()">Vissza a menübe</button>
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const cat = document.getElementById("category");
  if(cat && cat.options.length === 0) {
    [{n:"Alkatrészek", v:"alkatresz_felismeres"}, {n:"Számítások", v:"szamitas"}, {n:"Elmélet", v:"elmelet"}].forEach(t => {
      let o = document.createElement("option"); o.value = t.v; o.textContent = t.n; cat.appendChild(o);
    });
  }
  loadSettings();
  const startBtn = document.querySelector(".big-btn");
  if(startBtn) startBtn.onclick = () => startGame('normal');
  
  if (!document.getElementById("exam-btn")) {
    const main = document.querySelector("main");
    if(main) {
        const ex = document.createElement("button"); 
        ex.id = "exam-btn"; ex.className = "big-btn"; 
        ex.style.background = "#2E7D32"; ex.style.color = "white"; ex.style.marginTop = "10px";
        ex.textContent = "12 Kérdéses Vizsga"; 
        ex.onclick = () => startGame('exam');
        main.appendChild(ex);
    }
  }
});
