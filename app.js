// --- ALAPBEÁLLÍTÁSOK ---
const QUESTIONS = 5; // Feladatok száma egy játékban
const DIFFICULTY_SETTINGS = {
  easy: { min: 0, max: 10 }, // Könnyű: kis számok a gyengébb diákok számára
  medium: { min: -20, max: 20 }, // Közepes: negatív számok, nagyobb tartomány
  hard: { min: -100, max: 100 } // Kihívás: nagy számok, egyetemi szint
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
// Véletlenszám generátor egész számokhoz
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// shuffleArray: Egy tömb elemeit véletlenszerűen megkeveri Fisher-Yates algoritmussal
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Legnagyobb közös osztó (törtek egyszerűsítéséhez)
function gcd(a, b) { 
  return b === 0 ? a : gcd(b, a % b); 
}

// Tört egyszerűsítése
function simplifyFraction(num, denom) {
  let d = gcd(Math.abs(num), Math.abs(denom));
  return [num / d, denom / d];
}

// Számformázás mértékegységekkel
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
  } else { // Nehéz szint
    if (unit === 'Ω' && absValue >= 1000) {
      newValue = value / 1000;
      newUnit = 'kΩ';
    } else if (unit === 'A' && absValue < 0.1) {
      newValue = value * 1000;
      newUnit = 'mA';
    }
  }

  // Ha az érték egész szám, ne használjunk tizedes törtet
  if (Number.isInteger(newValue)) {
    newValue = Number(newValue.toFixed(0));
  } else {
    newValue = Number(newValue.toFixed(precision));
  }

  return {
    value: newValue,
    unit: newUnit
  };
}

// Válaszlehetőségek generálása
function generateOptions(correctAnswer, answerType, difficulty, unit) {
  console.log("generateOptions called", { correctAnswer, answerType, difficulty, unit });
  if (answerType !== "decimal") return [];
  const options = [correctAnswer.toFixed(2)];
  const range = difficulty === "easy" ? 10 : 20;
  const min = Math.max(0, correctAnswer - range);
  const max = correctAnswer + range;
  
  while (options.length < 4) {
    const option = (min + Math.random() * (max - min)).toFixed(2);
    if (Math.abs(option - correctAnswer) >= 0.1 && !options.includes(option)) {
      options.push(option);
    }
  }
  
  // Véletlenszerű keverés
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  const result = options.map(opt => ({ value: opt, label: `${opt} ${unit}` }));
  console.log("generateOptions result", result);
  return result;
}


// --- FELADATTÍPUSOK ---
const taskTypes = [

{
    name: "Elektronikai alkatrészek",
    value: "elektronikai_alkatreszek",
    generate: (difficulty) => {
      const components = {
        easy: [
          { 
            name: "Vezeték", 
            symbol: "wire.svg", 
            description: "Elektromos áram vezetésére szolgál", 
            example: "Áramkörök összekötésére" 
          },
          { 
            name: "Elem", 
            symbol: "battery.svg", 
            description: "Elektromos energiát biztosít", 
            example: "Távirányítókban használják" 
          },
          { 
            name: "Kapcsoló", 
            symbol: "switch.svg", 
            description: "Áramkör nyitására vagy zárására szolgál", 
            example: "Lámpák be- és kikapcsolására" 
          },
          { 
            name: "Izzó", 
            symbol: "bulb.svg", 
            description: "Fényt és hőt termel áram hatására", 
            example: "Régi típusú lámpákban" 
          },
          { 
            name: "Nyomógomb", 
            symbol: "pushbutton.svg", 
            description: "Ideiglenesen zárja az áramkört", 
            example: "Kapucsengőkben használják" 
          }
        ],
        medium: [],
        hard: []
      };

      const selectedComponents = components[difficulty];
      const component = selectedComponents[getRandomInt(0, selectedComponents.length - 1)];
      const taskType = getRandomInt(0, 3);

      let options = [];
      let correctAnswer;
      const wrongOptions = {
        names: components[difficulty].map(c => c.name),
        symbols: components[difficulty].map(c => c.symbol),
        descriptions: components[difficulty].map(c => c.description),
        examples: components[difficulty].map(c => c.example)
      };

      if (taskType === 0) { // Mi az alkatrész neve, ha a jele: ...
        options = [component.name];
        const wrongNames = wrongOptions.names.filter(name => name !== component.name);
        while (options.length < 3) {
          const wrongName = wrongNames[getRandomInt(0, wrongNames.length - 1)];
          if (!options.includes(wrongName)) options.push(wrongName);
        }
        options = shuffleArray(options);
        correctAnswer = (options.indexOf(component.name) + 1).toString();
        return {
          display: `Mi az alkatrész neve, ha a jele: <span class="blue-percent"><img src="${component.symbol}" alt="${component.name} szimbólum" style="width: 120px; height: auto; vertical-align: middle;" onerror="this.onerror=null; this.src='fallback.svg'; console.log('Hiba: ${component.symbol} nem található');"></span> ?<br>1.&nbsp;&nbsp;&nbsp;${options[0]}<br>2.&nbsp;&nbsp;&nbsp;${options[1]}<br>3.&nbsp;&nbsp;&nbsp;${options[2]}`,
          answer: correctAnswer,
          answerType: "number"
        };
      } else if (taskType === 1) { // Mi az alkatrész jele, ha a neve: ...
        options = [component.symbol];
        const wrongSymbols = wrongOptions.symbols.filter(symbol => symbol !== component.symbol);
        while (options.length < 3) {
          const wrongSymbol = wrongSymbols[getRandomInt(0, wrongSymbols.length - 1)];
          if (!options.includes(wrongSymbol)) options.push(wrongSymbol);
        }
        options = shuffleArray(options);
        correctAnswer = (options.indexOf(component.symbol) + 1).toString();
        return {
          display: `Mi az alkatrész jele, ha a neve: <span class="blue-percent">${component.name}</span> ?<br>1.&nbsp;&nbsp;&nbsp;<img src="${options[0]}" alt="Opció 1 szimbólum" style="width: 120px; height: auto; vertical-align: middle;" onerror="this.onerror=null; this.src='fallback.svg'; console.log('Hiba: ${options[0]} nem található');"><br>2.&nbsp;&nbsp;&nbsp;<img src="${options[1]}" alt="Opció 2 szimbólum" style="width: 120px; height: auto; vertical-align: middle;" onerror="this.onerror=null; this.src='fallback.svg'; console.log('Hiba: ${options[1]} nem található');"><br>3.&nbsp;&nbsp;&nbsp;<img src="${options[2]}" alt="Opció 3 szimbólum" style="width: 120px; height: auto; vertical-align: middle;" onerror="this.onerror=null; this.src='fallback.svg'; console.log('Hiba: ${options[2]} nem található');">`,
          answer: correctAnswer,
          answerType: "number"
        };
      } else if (taskType === 2) { // Mi az alkatrész leírása, ha a neve: ...
        options = [component.description];
        const wrongDescriptions = wrongOptions.descriptions.filter(desc => desc !== component.description);
        while (options.length < 3) {
          const wrongDesc = wrongDescriptions[getRandomInt(0, wrongDescriptions.length - 1)];
          if (!options.includes(wrongDesc)) options.push(wrongDesc);
        }
        options = shuffleArray(options);
        correctAnswer = (options.indexOf(component.description) + 1).toString();
        return {
          display: `Mi az alkatrész leírása, ha a neve: <span class="blue-percent">${component.name}</span> ?<br>1.&nbsp;&nbsp;&nbsp;${options[0]}<br>2.&nbsp;&nbsp;&nbsp;${options[1]}<br>3.&nbsp;&nbsp;&nbsp;${options[2]}`,
          answer: correctAnswer,
          answerType: "number"
        };
      } else { // Hol használják az alkatrészt, ha a neve: ...
        options = [component.example];
        const wrongExamples = wrongOptions.examples.filter(example => example !== component.example);
        while (options.length < 3) {
          const wrongExample = wrongExamples[getRandomInt(0, wrongExamples.length - 1)];
          if (!options.includes(wrongExample)) options.push(wrongExample);
        }
        options = shuffleArray(options);
        correctAnswer = (options.indexOf(component.example) + 1).toString();
        return {
          display: `Hol használják az alkatrészt, ha a neve: <span class="blue-percent">${component.name}</span> ?<br>1.&nbsp;&nbsp;&nbsp;${options[0]}<br>2.&nbsp;&nbsp;&nbsp;${options[1]}<br>3.&nbsp;&nbsp;&nbsp;${options[2]}`,
          answer: correctAnswer,
          answerType: "number"
        };
      }
    }
  },


	{
  name: "Mértékegység előtagok",
  value: "mertekegyseg_elotagok",
  generate: (difficulty) => {
    // Mértékegység előtagok és adataik normál alakkal
    const prefixes = {
      easy: [
        { name: "deci", symbol: "d", multiplier: "10^-1", fullName: "tized rész" },
        { name: "centi", symbol: "c", multiplier: "10^-2", fullName: "század rész" },
        { name: "milli", symbol: "m", multiplier: "10^-3", fullName: "ezredik rész" },
        { name: "kilo", symbol: "k", multiplier: "10^3", fullName: "ezerszeres" },
        { name: "alapegység", symbol: "", multiplier: "10^0", fullName: "alapegység" }
      ],
      medium: [
        { name: "deci", symbol: "d", multiplier: "10^-1", fullName: "tized rész" },
        { name: "mikro", symbol: "µ", multiplier: "10^-6", fullName: "milliomod rész" },
        { name: "milli", symbol: "m", multiplier: "10^-3", fullName: "ezredik rész" },
        { name: "kilo", symbol: "k", multiplier: "10^3", fullName: "ezerszeres" },
        { name: "mega", symbol: "M", multiplier: "10^6", fullName: "milliószoros" },
        { name: "alapegység", symbol: "", multiplier: "10^0", fullName: "alapegység" }
      ],
      hard: [
        { name: "nano", symbol: "n", multiplier: "10^-9", fullName: "milliárdod rész" },
        { name: "mikro", symbol: "µ", multiplier: "10^-6", fullName: "milliomod rész" },
        { name: "milli", symbol: "m", multiplier: "10^-3", fullName: "ezredik rész" },
        { name: "kilo", symbol: "k", multiplier: "10^3", fullName: "ezerszeres" },
        { name: "mega", symbol: "M", multiplier: "10^6", fullName: "milliószoros" },
        { name: "giga", symbol: "G", multiplier: "10^9", fullName: "milliárdszoros" },
        { name: "tera", symbol: "T", multiplier: "10^12", fullName: "billiomodszoros" },
        { name: "alapegység", symbol: "", multiplier: "10^0", fullName: "alapegység" }
      ]
    };

    const selectedPrefixes = prefixes[difficulty];
    const prefix = selectedPrefixes[getRandomInt(0, selectedPrefixes.length - 1)];
    const taskType = getRandomInt(0, 4); // 0-4, hogy mind az 5 kérdéstípus előforduljon

    let options = [];
    let correctAnswer;
    const wrongOptions = {
      names: ["nano", "mikro", "milli", "centi", "deci", "alapegység", "kilo", "mega", "giga", "tera"],
      symbols: ["n", "µ", "m", "c", "d", "", "k", "M", "G", "T"],
      multipliers: ["10^-9", "10^-6", "10^-3", "10^-2", "10^-1", "10^0", "10^3", "10^6", "10^9", "10^12"],
      fullNames: ["milliárdod rész", "milliomod rész", "ezredik rész", "század rész", "tized rész", "alapegység", "ezerszeres", "milliószoros", "milliárdszoros", "billiomodszoros"]
    };

    // Segédfüggvény a szorzó formázására HTML felső indexszel
    const formatMultiplier = (multiplier) => {
      return multiplier.replace(/10\^(-?\d+)/, "10<sup>$1</sup>");
    };

    if (taskType === 0) { // Mi a neve, ha a jele: ...
      options = [prefix.name];
      const wrongNames = wrongOptions.names.filter(name => name !== prefix.name && selectedPrefixes.some(p => p.name === name));
      while (options.length < 3) {
        const wrongName = wrongNames[getRandomInt(0, wrongNames.length - 1)];
        if (!options.includes(wrongName)) options.push(wrongName);
      }
      options = shuffleArray(options);
      correctAnswer = (options.indexOf(prefix.name) + 1).toString();
      const displaySymbol = prefix.symbol || "(nincs előtag)";
      return {
        display: `Mi a neve, ha a jele: <span class="blue-percent">${displaySymbol}</span> ?<br>1.&nbsp;&nbsp;&nbsp;${options[0]}<br>2.&nbsp;&nbsp;&nbsp;${options[1]}<br>3.&nbsp;&nbsp;&nbsp;${options[2]}`,
        answer: correctAnswer,
        answerType: "number"
      };
    } else if (taskType === 1) { // Mi a jele az előtagnak, ha a neve: ...
      options = [prefix.symbol || "(nincs előtag)"];
      const wrongSymbols = wrongOptions.symbols.filter(symbol => symbol !== prefix.symbol && selectedPrefixes.some(p => p.symbol === symbol));
      while (options.length < 3) {
        const wrongSymbol = wrongSymbols[getRandomInt(0, wrongSymbols.length - 1)];
        const displaySymbol = wrongSymbol || "(nincs előtag)";
        if (!options.includes(displaySymbol)) options.push(displaySymbol);
      }
      options = shuffleArray(options);
      correctAnswer = (options.indexOf(prefix.symbol || "(nincs előtag)") + 1).toString();
      return {
        display: `Mi a jele az előtagnak, ha a neve: <span class="blue-percent">${prefix.name}</span> ?<br>1.&nbsp;&nbsp;&nbsp;${options[0]}<br>2.&nbsp;&nbsp;&nbsp;${options[1]}<br>3.&nbsp;&nbsp;&nbsp;${options[2]}`,
        answer: correctAnswer,
        answerType: "number"
      };
    } else if (taskType === 2) { // Mi a szorzó értéke, ha a neve: ...
      options = [prefix.multiplier];
      const wrongMultipliers = wrongOptions.multipliers.filter(multiplier => multiplier !== prefix.multiplier && selectedPrefixes.some(p => p.multiplier === multiplier));
      while (options.length < 3) {
        const wrongMultiplier = wrongMultipliers[getRandomInt(0, wrongMultipliers.length - 1)];
        if (!options.includes(wrongMultiplier)) options.push(wrongMultiplier);
      }
      options = shuffleArray(options);
      correctAnswer = (options.indexOf(prefix.multiplier) + 1).toString();
      // Formázott válaszlehetőségek felső indexszel
      const formattedOptions = options.map(opt => formatMultiplier(opt));
      return {
        display: `Mi a szorzó értéke, ha a neve: <span class="blue-percent">${prefix.name}</span> ?<br>1.&nbsp;&nbsp;&nbsp;${formattedOptions[0]}<br>2.&nbsp;&nbsp;&nbsp;${formattedOptions[1]}<br>3.&nbsp;&nbsp;&nbsp;${formattedOptions[2]}`,
        answer: correctAnswer,
        answerType: "number"
      };
    } else if (taskType === 3) { // Mi a jelentése, ha a neve: ...
      options = [prefix.fullName];
      const wrongFullNames = wrongOptions.fullNames.filter(fullName => fullName !== prefix.fullName && selectedPrefixes.some(p => p.fullName === fullName));
      while (options.length < 3) {
        const wrongFullName = wrongFullNames[getRandomInt(0, wrongFullNames.length - 1)];
        if (!options.includes(wrongFullName)) options.push(wrongFullName);
      }
      options = shuffleArray(options);
      correctAnswer = (options.indexOf(prefix.fullName) + 1).toString();
      return {
        display: `Mi a jelentése, ha a neve: <span class="blue-percent">${prefix.name}</span> ?<br>1.&nbsp;&nbsp;&nbsp;${options[0]}<br>2.&nbsp;&nbsp;&nbsp;${options[1]}<br>3.&nbsp;&nbsp;&nbsp;${options[2]}`,
        answer: correctAnswer,
        answerType: "number"
      };
    } else { // Mi a neve, ha a szorzó értéke: ...
      options = [prefix.name];
      const wrongNames = wrongOptions.names.filter(name => name !== prefix.name && selectedPrefixes.some(p => p.name === name));
      while (options.length < 3) {
        const wrongName = wrongNames[getRandomInt(0, wrongNames.length - 1)];
        if (!options.includes(wrongName)) options.push(wrongName);
      }
      options = shuffleArray(options);
      correctAnswer = (options.indexOf(prefix.name) + 1).toString();
      return {
        display: `Mi a neve, ha a szorzó értéke: <span class="blue-percent">${formatMultiplier(prefix.multiplier)}</span> ?<br>1.&nbsp;&nbsp;&nbsp;${options[0]}<br>2.&nbsp;&nbsp;&nbsp;${options[1]}<br>3.&nbsp;&nbsp;&nbsp;${options[2]}`,
        answer: correctAnswer,
        answerType: "number"
      };
    }
  }
},


{
  name: "Mértékegység átváltás",
  value: "mertekegyseg_atvaltas",
  generate: (difficulty) => {
    const ranges = {
      easy: { 
        mAMin: 100, mAMax: 1000, 
        ohmMin: 100, ohmMax: 1000, 
        kOhmMin: 1, kOhmMax: 10, 
        ampMin: 1, ampMax: 10, 
        mVMin: 100, mVMax: 1000, 
        vMin: 1, vMax: 100, 
        wMin: 100, wMax: 1000, 
        kWMin: 1, kWMax: 10 
      },
      medium: { 
        mAMin: 100, mAMax: 3000, 
        ohmMin: 100, ohmMax: 3000, 
        kOhmMin: 1, kOhmMax: 15, 
        mOhmMin: 1, mOhmMax: 15, 
        ampMin: 1, ampMax: 15, 
        microAMin: 100, microAMax: 3000, 
        mVMin: 100, mVMax: 3000, 
        vMin: 100, vMax: 3000, 
        kVMin: 1, kVMax: 15, 
        mWMin: 100, mWMax: 3000, 
        wMin: 100, wMax: 3000, 
        hzMin: 100, hzMax: 3000, 
        kHzMin: 1, kHzMax: 15 
      },
      hard: { 
        mAMin: 100, mAMax: 10000, 
        ohmMin: 100, ohmMax: 10000, 
        kOhmMin: 1, kOhmMax: 50, 
        mOhmMin: 1, mOhmMax: 50, 
        ampMin: 1, ampMax: 50, 
        microAMin: 100, microAMax: 10000, 
        microVMin: 100, microVMax: 10000, 
        mVMin: 100, mVMax: 10000, 
        vMin: 100, vMax: 10000, 
        kVMin: 1, kVMax: 50, 
        mWMin: 100, mWMax: 10000, 
        wMin: 100, wMax: 10000, 
        pFMin: 100, pFMax: 1000, 
        nFMin: 100, nFMax: 10000, 
        microFMin: 1, microFMax: 50, 
        kHzMin: 1, kHzMax: 1000, 
        mHzMin: 1, mHzMax: 50 
      }
    };
    const { mAMin, mAMax, ohmMin, ohmMax, kOhmMin, kOhmMax, mOhmMin, mOhmMax, ampMin, ampMax, microAMin, microAMax, mVMin, mVMax, vMin, vMax, kVMin, kVMax, microVMin, microVMax, mWMin, mWMax, wMin, wMax, kWMin, kWMax, pFMin, pFMax, nFMin, nFMax, microFMin, microFMax, hzMin, hzMax, kHzMin, kHzMax, mHzMin, mHzMax } = ranges[difficulty];

    const types = {
      easy: [
        () => {
          let mA = getRandomInt(mAMin, mAMax);
          let answer = mA / 1000;
          const formatted = formatNumber(answer, 'A', difficulty);
          return {
            display: `<b>${mA} mA</b> = ? <span class="blue-percent">${formatted.unit}</span>`,
            answer: answer.toString(), // Pontos érték, pl. 0.236
            answerType: "decimal" // Tizedes, mert átváltás történhet
          };
        },
        () => {
          let ohm = getRandomInt(ohmMin, ohmMax);
          let answer = ohm / 1000;
          const formatted = formatNumber(answer, 'kΩ', difficulty);
          return {
            display: `<b>${ohm} Ω</b> = ? <span class="blue-percent">${formatted.unit}</span>`,
            answer: answer.toString(), // Pontos érték
            answerType: "decimal"
          };
        },
        () => {
          let kOhm = getRandomInt(kOhmMin, kOhmMax);
          let answer = kOhm * 1000;
          return {
            display: `<b>${kOhm} kΩ</b> = ? <span class="blue-percent">Ω</span>`,
            answer: answer.toString(),
            answerType: "number" // Egész szám, mert szorzás
          };
        },
        () => {
          let amp = getRandomInt(ampMin, ampMax);
          let answer = amp * 1000;
          return {
            display: `<b>${amp} A</b> = ? <span class="blue-percent">mA</span>`,
            answer: answer.toString(),
            answerType: "number" // Egész szám
          };
        },
        () => {
          let mV = getRandomInt(mVMin, mVMax);
          let answer = mV / 1000;
          const formatted = formatNumber(answer, 'V', difficulty);
          return {
            display: `<b>${mV} mV</b> = ? <span class="blue-percent">${formatted.unit}</span>`,
            answer: answer.toString(), // Pontos érték
            answerType: "decimal"
          };
        },
        () => {
          let v = getRandomInt(vMin, vMax);
          let answer = v * 1000;
          return {
            display: `<b>${v} V</b> = ? <span class="blue-percent">mV</span>`,
            answer: answer.toString(),
            answerType: "number" // Egész szám
          };
        },
        () => {
          let w = getRandomInt(wMin, wMax);
          let answer = w / 1000; // kW-ra váltás
          const formatted = formatNumber(answer, 'kW', difficulty);
          return {
            display: `<b>${w} W</b> = ? <span class="blue-percent">${formatted.unit}</span>`,
            answer: answer.toString(), // Pontos érték, pl. 0.236
            answerType: "decimal" // Tizedes, mert kW átváltás tizedes törtet ad
          };
        },
        () => {
          let kW = getRandomInt(kWMin, kWMax);
          let answer = kW * 1000;
          return {
            display: `<b>${kW} kW</b> = ? <span class="blue-percent">W</span>`,
            answer: answer.toString(),
            answerType: "number" // Egész szám
          };
        }
      ],
      medium: [
        () => {
          let v = getRandomInt(vMin, vMax);
          let answer = v / 1000;
          const formatted = formatNumber(answer, 'kV', difficulty);
          return {
            display: `<b>${v} V</b> = ? <span class="blue-percent">${formatted.unit}</span>`,
            answer: answer.toString(),
            answerType: "decimal"
          };
        },
        () => {
          let kV = getRandomInt(kVMin, kVMax);
          let answer = kV * 1000;
          return {
            display: `<b>${kV} kV</b> = ? <span class="blue-percent">V</span>`,
            answer: answer.toString(),
            answerType: "number"
          };
        },
        () => {
          let microA = getRandomInt(microAMin, microAMax);
          let answer = microA / 1000;
          const formatted = formatNumber(answer, 'mA', difficulty);
          return {
            display: `<b>${microA} µA</b> = ? <span class="blue-percent">${formatted.unit}</span>`,
            answer: answer.toString(),
            answerType: "decimal"
          };
        },
        () => {
          let kOhm = getRandomInt(kOhmMin, kOhmMax);
          let answer = kOhm / 1000;
          const formatted = formatNumber(answer, 'MΩ', difficulty);
          return {
            display: `<b>${kOhm} kΩ</b> = ? <span class="blue-percent">${formatted.unit}</span>`,
            answer: answer.toString(),
            answerType: "decimal"
          };
        },
        () => {
          let mOhm = getRandomInt(mOhmMin, mOhmMax);
          let answer = mOhm * 1000;
          return {
            display: `<b>${mOhm} MΩ</b> = ? <span class="blue-percent">kΩ</span>`,
            answer: answer.toString(),
            answerType: "number"
          };
        },
        () => {
          let mW = getRandomInt(mWMin, mWMax);
          let answer = mW / 1000;
          const formatted = formatNumber(answer, 'W', difficulty);
          return {
            display: `<b>${mW} mW</b> = ? <span class="blue-percent">${formatted.unit}</span>`,
            answer: answer.toString(),
            answerType: "decimal"
          };
        },
        () => {
          let w = getRandomInt(wMin, wMax);
          let answer = w * 1000;
          return {
            display: `<b>${w} W</b> = ? <span class="blue-percent">mW</span>`,
            answer: answer.toString(),
            answerType: "number"
          };
        },
        () => {
          let hz = getRandomInt(hzMin, hzMax);
          let answer = hz / 1000;
          const formatted = formatNumber(answer, 'kHz', difficulty);
          return {
            display: `<b>${hz} Hz</b> = ? <span class="blue-percent">${formatted.unit}</span>`,
            answer: answer.toString(),
            answerType: "decimal"
          };
        },
        () => {
          let kHz = getRandomInt(kHzMin, kHzMax);
          let answer = kHz * 1000;
          return {
            display: `<b>${kHz} kHz</b> = ? <span class="blue-percent">Hz</span>`,
            answer: answer.toString(),
            answerType: "number"
          };
        }
      ],
      hard: [
        () => {
          let microV = getRandomInt(microVMin, microVMax);
          let answer = microV / 1000;
          const formatted = formatNumber(answer, 'mV', difficulty);
          return {
            display: `<b>${microV} µV</b> = ? <span class="blue-percent">${formatted.unit}</span>`,
            answer: answer.toString(),
            answerType: "decimal"
          };
        },
        () => {
          let pF = getRandomInt(pFMin, pFMax);
          let answer = pF / 1000;
          const formatted = formatNumber(answer, 'nF', difficulty);
          return {
            display: `<b>${pF} pF</b> = ? <span class="blue-percent">${formatted.unit}</span>`,
            answer: answer.toString(),
            answerType: "decimal"
          };
        },
        () => {
          let nF = getRandomInt(nFMin, nFMax);
          let answer = nF / 1000;
          const formatted = formatNumber(answer, 'µF', difficulty);
          return {
            display: `<b>${nF} nF</b> = ? <span class="blue-percent">${formatted.unit}</span>`,
            answer: answer.toString(),
            answerType: "decimal"
          };
        },
        () => {
          let microF = getRandomInt(microFMin, microFMax);
          let answer = microF * 1000;
          return {
            display: `<b>${microF} µF</b> = ? <span class="blue-percent">nF</span>`,
            answer: answer.toString(),
            answerType: "number"
          };
        },
        () => {
          let kHz = getRandomInt(kHzMin, kHzMax);
          let answer = kHz / 1000;
          const formatted = formatNumber(answer, 'MHz', difficulty);
          return {
            display: `<b>${kHz} kHz</b> = ? <span class="blue-percent">${formatted.unit}</span>`,
            answer: answer.toString(),
            answerType: "decimal"
          };
        },
        () => {
          let mHz = getRandomInt(mHzMin, mHzMax);
          let answer = mHz * 1000;
          return {
            display: `<b>${mHz} MHz</b> = ? <span class="blue-percent">kHz</span>`,
            answer: answer.toString(),
            answerType: "number"
          };
        }
      ]
    };

    return types[difficulty][getRandomInt(0, types[difficulty].length - 1)]();
  }
}
];

// --- HTML ELEMEK ---
const quizContainer = document.getElementById("quiz");
const timerDisplay = document.getElementById("time");
const bestStats = document.getElementById("best-stats");
const difficultySelect = document.getElementById("difficulty");
const categorySelect = document.getElementById("category");
const startBtn = document.querySelector("button[onclick='startGame()']");
const restartBtn = document.getElementById("restart-btn");
const themeToggle = document.getElementById("theme-toggle");
const numpadContainer = document.getElementById("numpad-container");

// --- KATEGÓRIÁK BETÖLTÉSE ---
function loadCategories() {
  categorySelect.innerHTML = taskTypes.map(task => `<option value="${task.value}">${task.name}</option>`).join('');
}

// --- ÁLLAPOTVÁLTOZÓK ---
let score = 0, startTime = 0, timerInterval = null, currentQuestion = 0, questions = [];
let best = { score: 0, time: null, wrongAnswers: Infinity };
let gameActive = false;
let answerState = { value: "" }; // Válasz állapota a numpadhoz
let wrongAnswers = 0; // Helytelen válaszok száma

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

categorySelect.addEventListener("change", function () {
  saveLastSelection();
  loadBest();
});
difficultySelect.addEventListener("change", function () {
  saveLastSelection();
  loadBest();
});

// --- LEGJOBB EREDMÉNY MENTÉSE/BETÖLTÉSE ---
function loadBest() {
  const diff = difficultySelect.value;
  const cat = categorySelect.value;
  try {
    const bestRaw = localStorage.getItem("vilma-best-" + cat + "-" + diff);
    best = bestRaw ? JSON.parse(bestRaw) : { score: 0, time: null, wrongAnswers: Infinity };
    // Biztosítjuk, hogy a best objektum tartalmazza a wrongAnswers mezőt
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
  
  // Biztosítjuk, hogy wrongAnswers érvényes legyen
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

function difficultyLabel() {
  switch (difficultySelect.value) {
    case "easy": return "Könnyű";
    case "medium": return "Közepes";
    case "hard": return "Kihívás";
    default: return "";
  }
}

function categoryLabel() {
  return categorySelect.options[categorySelect.selectedIndex].textContent;
}

// --- TÉMA VÁLTÁS ---
function applyTheme() {
  const theme = localStorage.getItem("vilma-theme") || "light"; // Alapértelmezett: világos téma
  const isLight = theme === "light";
  document.body.classList.toggle("dark", !isLight); // .dark osztály használata
}

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
    themeToggle.addEventListener("touchstart", toggleTheme); // iPhone-kompatibilitás
  } else {
    console.error("A #theme-toggle elem nem található.");
  }
  applyTheme(); // Téma alkalmazása betöltéskor
});

function toggleTheme(event) {
  event.preventDefault(); // Megakadályozza az iOS dupla érintési problémákat
  const body = document.body;
  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    localStorage.setItem("vilma-theme", "light");
  } else {
    body.classList.add("dark");
    localStorage.setItem("vilma-theme", "dark");
  }
}

// --- NEHÉZSÉG ÉS KATEGÓRIA KEZELÉSE ---
difficultySelect.addEventListener("change", loadBest);
categorySelect.addEventListener("change", loadBest);

// --- IDŐZÍTŐ ---
function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerDisplay.textContent = `${elapsed}`;
}

// --- ZÁRÓJELES KIFEJEZÉSEK GENERÁLÁSA ---
function generateBracketedExpression(opCount, min, max) {
  const opList = ["+", "-", "•", ":"];
  let elements, exprParts, displayExpr, answer;
  let maxTries = 100;
  let tryCount = 0;
  let minDivisor = opCount === 2 ? 1 : opCount === 4 ? 2 : 5;
  let maxDivisor = opCount === 2 ? 10 : opCount === 4 ? 20 : 100;
  do {
    elements = [];
    for (let i = 0; i < opCount + opCount + 1; i++) {
      if (i % 2 === 0) {
        elements.push(getRandomInt(min, max));
      } else {
        let op = opList[getRandomInt(0, opList.length - 1)];
        if (op === ":") {
          elements.push(op);
          elements[i - 1] = elements[i - 1] * getRandomInt(minDivisor, maxDivisor);
        } else {
          elements.push(op);
        }
      }
    }
    let possibleParenRanges = [];
    for (let i = 0; i < elements.length - 2; i += 2) {
      possibleParenRanges.push([i, i + 2]);
    }
    let parenRanges = [];
    let used = Array(elements.length).fill(false);
    let numParens = getRandomInt(1, Math.max(1, Math.floor(opCount / 2)));
    let tries = 0;
    while (parenRanges.length < numParens && tries < 50) {
      let idx = getRandomInt(0, possibleParenRanges.length - 1);
      let [start, end] = possibleParenRanges[idx];
      let overlap = false;
      for (let j = start; j <= end; j++) {
        if (used[j]) { overlap = true; break; }
      }
      if (!overlap) {
        parenRanges.push([start, end]);
        for (let j = start; j <= end; j++) used[j] = true;
      }
      tries++;
    }
    parenRanges.sort((a, b) => a[0] - b[0]);
    exprParts = elements.slice();
    let offset = 0;
    for (let [start, end] of parenRanges) {
      exprParts.splice(start + offset, 0, "(");
      offset++;
      exprParts.splice(end + 1 + offset, 0, ")");
      offset++;
    }
    displayExpr = "";
    for (let i = 0; i < exprParts.length; i++) {
      if (exprParts[i] === "(" || exprParts[i] === ")") {
        displayExpr += exprParts[i] + " ";
      } else if (["+", "-", "•", ":"].includes(exprParts[i])) {
        displayExpr += " " + exprParts[i] + " ";
      } else {
        displayExpr += exprParts[i];
      }
    }
    displayExpr = displayExpr.trim();
    let evalExpr = displayExpr.replace(/×/g, '•').replace(/÷/g, ':').replace(/\s/g, '');
    try {
      answer = eval(evalExpr);
    } catch {
      answer = null;
    }
    tryCount++;
  } while (
    (typeof answer !== "number" || !isFinite(answer) || isNaN(answer) || answer !== Math.round(answer)) 
    && tryCount < maxTries
  );
  return {
    display: displayExpr + " =",
    answer: Math.round(answer).toString(),
    answerType: "number"
  };
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
      task.display = "Hiba: érvénytelen feladat generálódott";
      task.answer = null;
    }
    if (!['number', 'decimal', 'fraction', 'power'].includes(task.answerType)) {
      console.warn(`Ismeretlen answerType: ${task.answerType} a ${taskType.name} feladattípusban`);
      task.answerType = 'number'; // Alapértelmezett típus
    }
    questions.push(task);
  }
}

// Kifejezések kiértékelésére szolgáló függvény, amely ellenőrzi, hogy a felhasználó válasza helyes-e
function evaluateExpression(input, correctAnswer, answerType, taskData) {
  if (!input || !correctAnswer) {
    console.warn("Érvénytelen bemenet vagy helyes válasz hiányzik", { input, correctAnswer });
    return false;
  }

  let normalizedInput = input.replace(',', '.').trim();
  console.log("Normalizált bemenet:", normalizedInput);

  // Normál alakú számok kezelése segédfüggvény
  function parseScientificNumber(str) {
    str = str.trim();
    const scientificMatch = str.match(/^([\d\.]+)\*10\^([\-]?\d+)$/);
    if (scientificMatch) {
      const mantissa = parseFloat(scientificMatch[1]);
      const exponent = parseInt(scientificMatch[2]);
      return mantissa * Math.pow(10, exponent);
    }
    return parseFloat(str);
  }

  try {
    // Képlet kiértékelése, ha tartalmaz műveleti jeleket
    if (normalizedInput.match(/[\*\/\+-]/)) {
      let expression = normalizedInput.replace(/\s/g, ''); // Szóközök eltávolítása

      // Normál alakú számok átalakítása a kifejezésben
      expression = expression.replace(/(\d+\.\d+)\*10\^([\-]?\d+)/g, (match, mantissa, exponent) => {
        return parseScientificNumber(`${mantissa}*10^${exponent}`);
      });

      // Ellenőrizzük, hogy a kifejezés csak számokat és műveleti jeleket tartalmaz
      if (!expression.match(/^[\d\.\+\-\*\/\(\)]+$/)) {
        console.warn("Érvénytelen kifejezés formátum", { expression });
        return false;
      }

      // Kifejezés kiértékelése
      let computedResult;
      try {
        computedResult = eval(expression);
        if (isNaN(computedResult) || !isFinite(computedResult)) {
          console.warn("Érvénytelen kifejezés kiértékelés", { expression, computedResult });
          return false;
        }
      } catch (error) {
        console.warn("Hiba a kifejezés kiértékelése során", { expression, error });
        return false;
      }

      // Precizitás: minden szinten két tizedesjegy
      const precision = 2;
      const parsedCorrectAnswer = parseFloat(correctAnswer);

      // Összehasonlítás a helyes válasszal
      const difference = Math.abs(computedResult - parsedCorrectAnswer);
      console.log("Képlet kiértékelés:", {
        expression,
        computedResult,
        correctAnswer: parsedCorrectAnswer,
        difference,
        precision,
        unit: taskData ? taskData.unit : 'N/A'
      });
      return difference < Math.pow(10, -precision);
    }

    // Normál alakú szám kezelése
    if (answerType === 'power') {
      const powerMatch = normalizedInput.match(/^([\d\.]+)\*10\^([\-]?\d+)$/);
      if (!powerMatch) {
        console.warn("Érvénytelen normál alak", { normalizedInput });
        return false;
      }
      const [_, userCoef, userExp] = powerMatch;
      const [__, ansCoef, ansExp] = correctAnswer.match(/^([\d\.]+)\*10\^([\-]?\d+)$/) || [];
      if (!ansCoef || !ansExp) {
        console.warn("Érvénytelen helyes válasz normál alakban", { correctAnswer });
        return false;
      }
      const userValue = parseFloat(userCoef) * Math.pow(10, parseInt(userExp));
      const correctValue = parseFloat(ansCoef) * Math.pow(10, parseInt(ansExp));
      const precision = 2; // Két tizedesjegy pontosság
      console.log("Normál alak ellenőrzés:", { userValue, correctValue, userCoef, userExp, ansCoef, ansExp, precision });
      return Math.abs(userValue - correctValue) < Math.pow(10, -precision);
    }

    // Tizedes tört kezelése
    if (answerType === 'decimal') {
      const precision = 2; // Két tizedesjegy pontosság
      const tolerance = 0.2;
      const userAnswer = parseFloat(normalizedInput);
      const parsedCorrectAnswer = parseFloat(correctAnswer);
      if (isNaN(userAnswer) || isNaN(parsedCorrectAnswer)) {
        console.warn("Érvénytelen számformátum", { userAnswer, parsedCorrectAnswer });
        return false;
      }
      const difference = Math.abs(userAnswer - parsedCorrectAnswer);
      console.log("Tizedes tört ellenőrzés:", { userAnswer, parsedCorrectAnswer, difference, tolerance, precision });
      return difference <= tolerance;
    }

    // Egész szám kezelése
    if (answerType === 'number') {
      const userAnswer = parseFloat(normalizedInput);
      const parsedCorrectAnswer = parseFloat(correctAnswer);
      if (isNaN(userAnswer) || isNaN(parsedCorrectAnswer)) {
        console.warn("Érvénytelen számformátum", { userAnswer, parsedCorrectAnswer });
        return false;
      }
      const difference = Math.abs(userAnswer - parsedCorrectAnswer);
      console.log("Egész szám ellenőrzés:", { userAnswer, parsedCorrectAnswer, difference, tolerance: 0.01 });
      return difference < 0.01; // Egész számoknál szigorúbb tolerancia
    }

    // Tört kezelése
    if (answerType === 'fraction') {
      if (normalizedInput.includes('/')) {
        const [userNum, userDen] = normalizedInput.split('/').map(Number);
        if (isNaN(userNum) || isNaN(userDen) || userDen === 0) {
          console.warn("Érvénytelen tört formátum", { normalizedInput });
          return false;
        }
        const [ansNum, ansDen] = correctAnswer.split('/').map(Number);
        const [simpUserNum, simpUserDen] = simplifyFraction(userNum, userDen);
        console.log("Tört ellenőrzés:", { simpUserNum, simpUserDen, ansNum, ansDen });
        return simpUserNum === ansNum && simpUserDen === ansDen;
      } else {
        const [ansNum, ansDen] = correctAnswer.split('/').map(Number);
        const correctValue = ansNum / ansDen;
        const userAnswer = parseFloat(normalizedInput);
        if (isNaN(userAnswer)) {
          console.warn("Érvénytelen számformátum tört esetén", { normalizedInput });
          return false;
        }
        console.log("Tört decimális ellenőrzés:", { userAnswer, correctValue });
        return Math.abs(userAnswer - correctValue) < 0.01;
      }
    }

    console.warn("Ismeretlen válasz típus", { answerType });
    return false;
  } catch (error) {
    console.error("Hiba a válasz kiértékelése során:", { error, input, correctAnswer, answerType });
    return false;
  }
}
// Segédfüggvény normál alakhoz
function formatScientific(value) {
  if (value === 0) return "0";
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const mantissa = (value / Math.pow(10, exponent)).toFixed(2);
  return `${mantissa} × 10^${exponent}`;
}

function renderNumpad(answerState, onChange) {
  const currentTask = questions[currentQuestion] || {};

  // **ÚJ**: Globális állapot mentése a speciális gombokhoz
  if (!window.numpadState) {
    window.numpadState = {
      lightningActivated: false,
      lightningCurrentSymbol: '/',
      lightningCount: 0
    };
  }

  // Számláló a villám gomb egymást követő lenyomásainak követésére
  let lightningCount = window.numpadState.lightningCount;

  const rows = [
    ['1', '2', '3', '±', '←'],
    ['4', '5', '6', '.', 'submit'],
    ['7', '8', '9', '0', '⚡️']
  ];
  const numpadDiv = document.createElement('div');
  numpadDiv.className = 'numpad active';

  // Referencia a villám gombra a számláló kezeléséhez
  let lightningButton = null;

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
          const currentTask = questions[currentQuestion];

          if (!currentTask.answer) {
            alert("Hiba: nincs válasz definiálva!");
            return;
          }

          // Időzítő szüneteltetése
          let pauseStart = Date.now();
          if (timerInterval) {
            clearInterval(timerInterval);
          }

          // Válasz ellenőrzése
          if (currentTask.answerType === 'fraction') {
            if (val.includes('/')) {
              const [ansNum, ansDen] = currentTask.answer.split('/').map(Number);
              const [userNum, userDen] = val.split('/').map(Number);
              if (isNaN(userNum) || isNaN(userDen) || userDen === 0) {
                alert("Érvénytelen tört formátum! Ellenőrizd, hogy helyes törtet írtál-e, pl. '3/4'.");
                return;
              }
              const [simpUserNum, simpUserDen] = simplifyFraction(userNum, userDen);
              correct = simpUserNum === ansNum && simpUserDen === ansDen;
            } else {
              const [ansNum, ansDen] = currentTask.answer.split('/').map(Number);
              const correctValue = ansNum / ansDen;
              const userValue = parseFloat(val.replace(',', '.'));
              correct = !isNaN(userValue) && Math.abs(userValue - correctValue) < 0.01;
            }
            if (!correct) {
              const [ansNum, ansDen] = currentTask.answer.split('/').map(Number);
              alert(`Nem jó a válasz! A helyes válaszhoz hasonló érték: ${ansNum}/${ansDen} vagy ${(ansNum / ansDen).toFixed(2)}.`);
            }
          } else if (currentTask.answerType === 'power') {
            const powerMatch = val.match(/^([\d\.]+)×10\^([\d\-]+)$/);
            if (!powerMatch) {
              alert("Érvénytelen normál alak! Használj 'a×10^b' formát, pl. '3,5×10^3'.");
              return;
            }
            const [_, userCoef, userExp] = powerMatch;
            const [__, ansCoef, ansExp] = currentTask.answer.match(/^([\d\.]+)×10\^([\d\-]+)$/) || [];
            correct = Math.abs(parseFloat(userCoef.replace(',', '.')) - parseFloat(ansCoef)) < 0.01 && parseInt(userExp) === parseInt(ansExp);
            if (!correct) {
              alert(`Nem jó a normál alak! A helyes válaszhoz hasonló érték: ${ansCoef}×10^${ansExp}. Ellenőrizd a kitevő és az együttható értékét!`);
            }
          } else {
            correct = evaluateExpression(val, currentTask.answer, currentTask.answerType, currentTask);
            if (!correct) {
              let hint = '';
              const userAnswer = parseFloat(val.replace(',', '.'));
              const correctAnswer = parseFloat(currentTask.answer);
              if (!isNaN(userAnswer)) {
                if (currentTask.value === 'ohm_torveny') {
                  if (currentTask.U && currentTask.R) { // I = U / R
                    hint = userAnswer < correctAnswer
                      ? `Túl kicsi a válasz! Az áramot ${currentTask.unit}-ban számold: I = U / R, ahol U = ${currentTask.U} V, R = ${currentTask.R} ${currentTask.unit === 'mA' ? 'MΩ' : 'kΩ'}.`
                      : `Túl nagy a válasz! Az áramot ${currentTask.unit}-ban számold: I = U / R, ahol U = ${currentTask.U} V, R = ${currentTask.R} ${currentTask.unit === 'mA' ? 'MΩ' : 'kΩ'}.`;
                  } else if (currentTask.I && currentTask.R) { // U = I * R
                    hint = userAnswer < correctAnswer
                      ? `Túl kicsi a válasz! A feszültséget V-ban számold: U = I * R, ahol I = ${currentTask.I} ${currentTask.unit === 'V' ? 'mA' : 'A'}, R = ${currentTask.R} ${currentTask.unit === 'V' ? 'MΩ' : 'kΩ'}.`
                      : `Túl nagy a válasz! A feszültséget V-ban számold: U = I * R, ahol I = ${currentTask.I} ${currentTask.unit === 'V' ? 'mA' : 'A'}, R = ${currentTask.R} ${currentTask.unit === 'V' ? 'MΩ' : 'kΩ'}.`;
                  } else if (currentTask.U && currentTask.I) { // R = U / I
                    hint = userAnswer < correctAnswer
                      ? `Túl kicsi a válasz! Az ellenállást ${currentTask.unit}-ban számold: R = U / I, ahol U = ${currentTask.U} V, I = ${currentTask.I} ${currentTask.unit === 'kΩ' || currentTask.unit === 'MΩ' ? 'mA' : 'A'}.`
                      : `Túl nagy a válasz! Az ellenállást ${currentTask.unit}-ban számold: R = U / I, ahol U = ${currentTask.U} V, I = ${currentTask.I} ${currentTask.unit === 'kΩ' || currentTask.unit === 'MΩ' ? 'mA' : 'A'}.`;
                  }
                } else {
                  hint = userAnswer < correctAnswer
                    ? `Túl kicsi a válasz! Próbálj nagyobb értéket, közel ${correctAnswer.toFixed(2)} ${currentTask.unit || ''}-hoz.`
                    : `Túl nagy a válasz! Próbálj kisebb értéket, közel ${correctAnswer.toFixed(2)} ${currentTask.unit || ''}-hoz.`;
                }
              } else {
                hint = `Érvénytelen válasz! Ellenőrizd a formátumot, pl. '123', '0,93', vagy '${currentTask.answerType === 'fraction' ? '3/4' : '320/460'}'.`;
              }
              alert(hint);
            }
          }

          // Szüneteltetés időtartamának kiszámítása
          const pauseEnd = Date.now();
          const pauseDuration = pauseEnd - pauseStart;

          if (correct) {
            score++;
            currentQuestion++;
            showQuestion(currentQuestion);
            if (currentQuestion >= QUESTIONS) {
              finishGame();
            } else {
              // Időzítő folytatása a szüneteltetés figyelembevételével
              startTime += pauseDuration; // startTime korrigálása
              timerInterval = setInterval(updateTimer, 1000);
            }
          } else {
            wrongAnswers++;
            // Időzítő folytatása a szüneteltetés figyelembevételével
            startTime += pauseDuration; // startTime korrigálása
            timerInterval = setInterval(updateTimer, 1000);
          }
        };
        rowDiv.appendChild(submitBtn);
      } else {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.className = 'numpad-btn';
        btn.textContent = key;
        btn.tabIndex = -1;

        // Speciális gomb inicializálása
        if (key === '⚡️') {
          // **MÓDOSÍTOTT**: Állapot visszaállítása a mentett értékekből
          if (window.numpadState.lightningActivated) {
            btn.dataset.state = window.numpadState.lightningCurrentSymbol;
            btn.textContent = window.numpadState.lightningCurrentSymbol;
          } else {
            btn.dataset.state = '⚡️'; // Kezdeti állapot: villám
          }
          btn.dataset.lightningCount = window.numpadState.lightningCount.toString();
          lightningButton = btn; // Referencia tárolása a villám gombra
        } else if (key === '/') {
          btn.dataset.state = '/'; // Kezdeti állapot: /
        }

        btn.onclick = () => {
          btn.classList.add('flash');
          setTimeout(() => btn.classList.remove('flash'), 200);

          // Ha nem a villám gombot nyomták meg, és a villám gomb még villám állapotban van, visszaállítjuk a számlálót
          if (key !== '⚡️' && lightningButton && lightningButton.dataset.state === '⚡️') {
            lightningCount = 0;
            window.numpadState.lightningCount = 0; // **ÚJ**: Globális állapot frissítése
            lightningButton.dataset.lightningCount = '0';
            console.log('Más gomb lenyomva, villám számláló visszaállítva:', { lightningCount, currentValue: answerState.value });
          }

          if (key === '←') {
            answerState.value = answerState.value.slice(0, -1);
          } else if (key === '±') {
            if (!answerState.value.startsWith('-')) {
              answerState.value = '-' + answerState.value;
            } else {
              answerState.value = answerState.value.substring(1);
            }
          } else if (key === '⚡️') {
            // Villám gomb kezelése
            lightningCount = parseInt(btn.dataset.lightningCount || '0') + 1;
            btn.dataset.lightningCount = lightningCount.toString();
            window.numpadState.lightningCount = lightningCount; // **ÚJ**: Globális állapot frissítése
            console.log('Villám gomb lenyomva:', { lightningCount, currentValue: answerState.value });

            if (lightningCount >= 9 && !window.numpadState.lightningActivated) {
              // **MÓDOSÍTOTT**: Kilenc egymást követő lenyomás után váltás / jelre
              btn.dataset.state = '/';
              btn.textContent = '/';
              window.numpadState.lightningActivated = true; // **ÚJ**: Aktiválás jelzése
              window.numpadState.lightningCurrentSymbol = '/'; // **ÚJ**: Aktuális szimbólum mentése
              lightningCount = 0; // Számláló visszaállítása
              window.numpadState.lightningCount = 0; // **ÚJ**: Globális állapot frissítése
              btn.dataset.lightningCount = '0';
              console.log('Villám gomb átváltva / jelre:', { newState: '/', newText: btn.textContent });
            }

            // Ha még villám állapotban van, nem adunk hozzá semmit
            if (btn.dataset.state === '⚡️') {
              console.log('Villám gomb még nem váltott, nincs bevitel.');
              return;
            }

            // Ha már / vagy * jelre váltott, a speciális viselkedését követi
            const currentState = btn.dataset.state;
            const lastChar = answerState.value.slice(-1);
            console.log('Speciális gomb kezelése:', { currentState, lastChar, currentValue: answerState.value });

            // Ha az utolsó karakter '/' vagy '*', eltávolítjuk
            if (lastChar === '/' || lastChar === '*') {
              answerState.value = answerState.value.slice(0, -1);
            }

            // Aktuális jel hozzáadása
            answerState.value += currentState;

            // Váltás a másik jelre
            const newState = currentState === '/' ? '*' : '/';
            btn.dataset.state = newState;
            btn.textContent = newState;
            window.numpadState.lightningCurrentSymbol = newState; // **ÚJ**: Új szimbólum mentése
            console.log('Speciális gomb frissítve:', { newState, buttonText: btn.textContent, newValue: answerState.value });
          } else if (key === '.') {
            if (answerState.value !== "" && !answerState.value.includes('.')) {
              answerState.value += ','; // Vessző a magyar billentyűzethez
            }
          } else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key)) {
            answerState.value += key;
          }
          console.log('Új beviteli mező tartalom:', answerState.value);
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
  quizContainer.innerHTML = "";
  if (index >= QUESTIONS) {
    finishGame();
    return;
  }

  const q = questions[index];
  const div = document.createElement("div");
  div.className = "question-container";
  div.innerHTML = `
    <div class="progress-bar">
      <div class="progress"></div>
      <div class="progress-wrong"></div>
    </div>
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
  quizContainer.appendChild(div);

  const progress = div.querySelector('.progress');
  const progressWrong = div.querySelector('.progress-wrong');
  if (progress && progressWrong) {
    progress.style.width = `${(score / QUESTIONS) * 100}%`;
    progressWrong.style.width = `${(wrongAnswers / QUESTIONS) * 100}%`;
    progressWrong.style.left = `${(score / QUESTIONS) * 100}%`; // Hibás sáv a helyes sáv után
  }

  div.scrollIntoView({ behavior: "smooth", block: "start" });
}

// --- JÁTÉK INDITÁS ---
function startGame() {
  // **ÚJ**: Numpad állapot visszaállítása új játéknál
  window.numpadState = {
    lightningActivated: false,
    lightningCurrentSymbol: '/',
    lightningCount: 0
  };
  
  gameActive = true;
  score = 0;
  currentQuestion = 0;
  wrongAnswers = 0; // Helytelen válaszok inicializálása
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
  numpadContainer.innerHTML = "";
  numpadContainer.classList.remove("active");
  saveBest(score, elapsed);

  restartBtn.style.display = "";
  startBtn.style.display = "";
  bestStats.style.opacity = "1";
  categorySelect.disabled = false;
  difficultySelect.disabled = false;
}

restartBtn.onclick = startGame;
startBtn.onclick = startGame;

// --- INDÍTÁS ---
loadCategories();
loadLastSelection();
loadBest();