// converter.js - Ultimate 3-Box Engine (Compact Layout + Expanded Currency)
document.addEventListener("DOMContentLoaded", () => {

    // =========================================================================
    // BLOCK 1 DATA: ENGINEERING DICTIONARY
    // =========================================================================
    const techDatabase = {
        data: {
            labels: ["Bytes (B)", "Kilobytes (KB)", "Megabytes (MB)", "Gigabytes (GB)", "Terabytes (TB)"],
            values: ["B", "KB", "MB", "GB", "TB"],
            rates: { "B": 1, "KB": 1024, "MB": 1024 * 1024, "GB": 1024 * 1024 * 1024, "TB": 1024 * 1024 * 1024 * 1024 }
        },
        length: {
            labels: ["Millimeters (mm)", "Centimeters (cm)", "Meters (m)", "Kilometers (km)", "Inches (in)", "Feet (ft)"],
            values: ["mm", "cm", "m", "km", "in", "ft"],
            rates: { "mm": 0.001, "cm": 0.01, "m": 1, "km": 1000, "in": 0.0254, "ft": 0.3048 }
        },
        mass: {
            labels: ["Milligrams (mg)", "Grams (g)", "Kilograms (kg)", "Pounds (lb)", "Ounces (oz)"],
            values: ["mg", "g", "kg", "lb", "oz"],
            rates: { "mg": 0.001, "g": 1, "kg": 1000, "lb": 453.59237, "oz": 28.349523 }
        },
        area: {
            labels: ["Square Millimeters (mm²)", "Square Centimeters (cm²)", "Square Meters (m²)", "Square Kilometers (km²)", "Acres (ac)"],
            values: ["mm²", "cm²", "m²", "km²", "ac"],
            rates: { "mm²": 0.000001, "cm²": 0.0001, "m²": 1, "km²": 1000000, "ac": 4046.85642 }
        },
        volume: {
            labels: ["Milliliters (mL)", "Liters (L)", "Cubic Meters (m³)", "Gallons (gal)"],
            values: ["mL", "L", "m³", "gal"],
            rates: { "mL": 0.001, "L": 1, "m³": 1000, "gal": 3.785411 }
        },
        time: {
            labels: ["Milliseconds (ms)", "Seconds (s)", "Minutes (min)", "Hours (hr)"],
            values: ["ms", "s", "min", "hr"],
            rates: { "ms": 0.001, "s": 1, "min": 60, "hr": 3600 }
        },
        speed: {
            labels: ["Meters/Second (m/s)", "Kilometers/Hour (km/h)", "Miles/Hour (mph)", "Knots (kt)"],
            values: ["m/s", "km/h", "mph", "kt"],
            rates: { "m/s": 1, "km/h": 0.2777777778, "mph": 0.44704, "kt": 0.514444 }
        },
        pressure: {
            labels: ["Pascals (Pa)", "Kilopascals (kPa)", "Bar (bar)", "Psi (psi)"],
            values: ["Pa", "kPa", "bar", "psi"],
            rates: { "Pa": 1, "kPa": 1000, "bar": 100000, "psi": 6894.75729 }
        },
        energy: {
            labels: ["Joules (J)", "Kilojoules (kJ)", "Watt-Hours (Wh)", "Kilowatt-Hours (kWh)"],
            values: ["J", "kJ", "Wh", "kWh"],
            rates: { "J": 1, "kJ": 1000, "Wh": 3600, "kWh": 3600000 }
        },
        power: {
            labels: ["Watts (W)", "Kilowatts (kW)", "Megawatts (MW)", "Horsepower (hp)"],
            values: ["W", "kW", "MW", "hp"],
            rates: { "W": 1, "kW": 1000, "MW": 1000000, "hp": 745.69987 }
        },
        frequency: {
            labels: ["Hertz (Hz)", "Kilohertz (kHz)", "Megahertz (MHz)", "Gigahertz (GHz)"],
            values: ["Hz", "kHz", "MHz", "GHz"],
            rates: { "Hz": 1, "kHz": 1000, "MHz": 1000000, "GHz": 1000000000 }
        },
        angle: {
            labels: ["Degrees (°)", "Radians (rad)"],
            values: ["°", "rad"],
            rates: { "°": 1, "rad": 57.2957795 }
        }
    };

    // Offline currency rates now come from currency-dropdown.js (OFFLINE_CURRENCY_RATES, 50 currencies)
    // Fallback to a minimal local table only if that script failed to load for some reason.
    const offlineCurrencyRates = (typeof OFFLINE_CURRENCY_RATES !== "undefined")
        ? OFFLINE_CURRENCY_RATES
        : { "USD": 1.0, "MYR": 0.227, "SGD": 0.741, "EUR": 1.08, "GBP": 1.28 };

    // =========================================================================
    // BLOCK 1 PROCESSOR
    // =========================================================================
    const valCategory = document.getElementById("valCategory");
    const valInput = document.getElementById("valInput");
    const valFrom = document.getElementById("valFrom");
    const valTo = document.getElementById("valTo");
    const valBtn = document.getElementById("valBtn");
    const valResult = document.getElementById("valResult");

    function updateTechDropdowns() {
        const category = valCategory.value;
        const data = techDatabase[category];
        valFrom.innerHTML = ""; valTo.innerHTML = "";
        data.values.forEach((code, i) => {
            const optFrom = document.createElement("option"); optFrom.value = code; optFrom.textContent = data.labels[i]; valFrom.appendChild(optFrom);
            const optTo = document.createElement("option"); optTo.value = code; optTo.textContent = data.labels[i]; valTo.appendChild(optTo);
        });
        if (valTo.options.length > 1) valTo.selectedIndex = 1;
        valResult.textContent = "--";
    }

    valBtn.addEventListener("click", () => {
        const num = parseFloat(valInput.value);
        if (isNaN(num)) { valResult.textContent = "Please enter a valid number"; return; }
        const cat = valCategory.value; const from = valFrom.value; const to = valTo.value;
        const baseValue = num * techDatabase[cat].rates[from];
        const finalValue = baseValue / techDatabase[cat].rates[to];
        if (cat === "data") {
            valResult.textContent = `${finalValue.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${to}`;
        } else {
            valResult.textContent = `${finalValue.toFixed(6).replace(/\.?0+$/, "")} ${to}`;
        }
    });

    valCategory.addEventListener("change", updateTechDropdowns);
    updateTechDropdowns();

    // =========================================================================
    // BLOCK 2 PROCESSOR: LIVE CURRENCY
    // =========================================================================
    const curInput = document.getElementById("curInput");
    const curFrom = document.getElementById("curFrom");
    const curTo = document.getElementById("curTo");
    const curBtn = document.getElementById("curBtn");
    const curResult = document.getElementById("curResult");

    curBtn.addEventListener("click", () => {
        const amount = parseFloat(curInput.value);
        if (isNaN(amount)) { curResult.textContent = "Please enter a valid amount"; return; }
        const from = curFrom.value; const to = curTo.value;
        if (from === to) { curResult.textContent = `${to} ${amount.toFixed(2)}`; return; }
        curResult.textContent = "Updating live rates...";

        fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`)
            .then(res => { if (!res.ok) throw new Error("API Error"); return res.json(); })
            .then(data => { curResult.textContent = `${to} ${data.rates[to].toFixed(2)}`; })
            .catch(() => {
                if (!offlineCurrencyRates[from] || !offlineCurrencyRates[to]) {
                    curResult.textContent = "Rate unavailable offline for this pair";
                    return;
                }
                const base = amount * offlineCurrencyRates[from];
                const final = base / offlineCurrencyRates[to];
                curResult.textContent = `${to} ${final.toFixed(2)} (Offline Mode)`;
            });
    });

    // =========================================================================
    // BLOCK 3 PROCESSOR: ADVANCED BIOMEDICAL SUITE
    // =========================================================================
    const healthType = document.getElementById("healthType");
    const healthInputArea = document.getElementById("healthInputArea");
    const healthBtn = document.getElementById("healthBtn");
    const healthResult = document.getElementById("healthResult");

    // Helper to build dynamic HTML with correct classes
    function fieldGroup(labelText, inputHTML) {
        return `<div class="field-group"><label>${labelText}</label>${inputHTML}</div>`;
    }

    healthType.addEventListener("change", () => {
        const selected = healthType.value;
        healthResult.textContent = "--";

        if (selected === "glucose") {
            healthInputArea.innerHTML = `
                ${fieldGroup("Glucose Value", `<input type="number" id="glucoseInput" class="styled-input" step="0.1" placeholder="e.g., 5.6" value="5.5">`)}
                <div class="field-row">
                    ${fieldGroup("Unit From", `<select id="glucoseFrom" class="styled-select"><option value="mmol">mmol/L (MY)</option><option value="mg">mg/dL (US)</option></select>`)}
                    ${fieldGroup("Unit To", `<select id="glucoseTo" class="styled-select"><option value="mg" selected>mg/dL (US)</option><option value="mmol">mmol/L (MY)</option></select>`)}
                </div>`;

        } else if (selected === "bp") {
            healthInputArea.innerHTML = `
                <div class="field-row">
                    ${fieldGroup("Systolic (Upper)", `<input type="number" id="systolicInput" class="styled-input" placeholder="e.g., 120" value="120">`)}
                    ${fieldGroup("Diastolic (Lower)", `<input type="number" id="diastolicInput" class="styled-input" placeholder="e.g., 80" value="80">`)}
                </div>`;

        } else if (selected === "bmi") {
            healthInputArea.innerHTML = `
                <div class="field-row">
                    ${fieldGroup("Weight (kg)", `<input type="number" id="weightInput" class="styled-input" step="0.1" placeholder="e.g., 65" value="65">`)}
                    ${fieldGroup("Height (cm)", `<input type="number" id="heightInput" class="styled-input" placeholder="e.g., 170" value="170">`)}
                </div>`;

        } else if (selected === "temp") {
            healthInputArea.innerHTML = `
                ${fieldGroup("Temperature Value", `<input type="number" id="tempInput" class="styled-input" step="0.1" placeholder="e.g., 36.8" value="36.8">`)}
                <div class="field-row">
                    ${fieldGroup("From Unit", `<select id="tempFrom" class="styled-select"><option value="C">Celsius (°C)</option><option value="F">Fahrenheit (°F)</option></select>`)}
                    ${fieldGroup("To Unit", `<select id="tempTo" class="styled-select"><option value="F" selected>Fahrenheit (°F)</option><option value="C">Celsius (°C)</option></select>`)}
                </div>`;
        }
    });

    healthBtn.addEventListener("click", () => {
        const mode = healthType.value;

        if (mode === "glucose") {
            const val = parseFloat(document.getElementById("glucoseInput").value);
            const from = document.getElementById("glucoseFrom").value;
            const to = document.getElementById("glucoseTo").value;
            if (isNaN(val)) { healthResult.textContent = "Invalid value"; return; }
            let converted = (from === to) ? val : (from === "mmol" ? val * 18.0182 : val / 18.0182);
            let refMmol = (from === "mmol") ? val : val / 18.0182;
            let diagnosis = "⚡ Normal (Fasting)";
            if (refMmol < 4.0) diagnosis = "⚠️ Low (Hypoglycemia)";
            else if (refMmol > 7.0) diagnosis = "🚨 High (Hyperglycemia)";
            healthResult.textContent = `${converted.toFixed(2)} ${to}/L | ${diagnosis}`;

        } else if (mode === "bp") {
            const sys = parseInt(document.getElementById("systolicInput").value);
            const dia = parseInt(document.getElementById("diastolicInput").value);
            if (isNaN(sys) || isNaN(dia)) { healthResult.textContent = "Fill both readings"; return; }
            let diagnosis = "🟢 Normal Range";
            if (sys < 90 || dia < 60) diagnosis = "🔵 Low Blood Pressure";
            else if (sys >= 140 || dia >= 90) diagnosis = "🔴 Hypertension (Stage 2)";
            else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) diagnosis = "🟠 Hypertension (Stage 1)";
            else if (sys >= 120 && sys <= 129 && dia < 80) diagnosis = "🟡 Elevated Blood Pressure";
            healthResult.textContent = `${sys}/${dia} mmHg | ${diagnosis}`;

        } else if (mode === "bmi") {
            const w = parseFloat(document.getElementById("weightInput").value);
            const hCm = parseFloat(document.getElementById("heightInput").value);
            if (isNaN(w) || isNaN(hCm) || hCm <= 0) { healthResult.textContent = "Enter valid metrics"; return; }
            let hM = hCm / 100;
            let bmi = w / (hM * hM);
            let status = "🟢 Normal Weight";
            if (bmi < 18.5) status = "🔵 Underweight";
            else if (bmi >= 25 && bmi < 30) status = "🟡 Overweight";
            else if (bmi >= 30) status = "🔴 Obese Range";
            healthResult.textContent = `BMI: ${bmi.toFixed(1)} | ${status}`;

        } else if (mode === "temp") {
            const t = parseFloat(document.getElementById("tempInput").value);
            const from = document.getElementById("tempFrom").value;
            const to = document.getElementById("tempTo").value;
            if (isNaN(t)) { healthResult.textContent = "Enter valid temperature"; return; }
            let converted = t;
            if (from === "C" && to === "F") converted = (t * 9 / 5) + 32;
            if (from === "F" && to === "C") converted = (t - 32) * 5 / 9;
            let refC = (from === "C") ? t : (t - 32) * 5 / 9;
            let condition = "🟢 Normal Temp";
            if (refC < 35.0) condition = "🔵 Hypothermia";
            else if (refC >= 37.5 && refC <= 38.4) condition = "🟡 Low Grade Fever";
            else if (refC > 38.4) condition = "🔴 High Fever";
            healthResult.textContent = `${converted.toFixed(1)}°${to} | ${condition}`;
        }
    });
});