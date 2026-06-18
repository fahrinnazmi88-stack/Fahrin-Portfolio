// currency-dropdown.js — Custom searchable currency dropdown with flags
// Builds a custom UI on top of hidden native <select id="curFrom"/"curTo">
// so existing converter.js logic (curFrom.value / curTo.value) keeps working untouched.

const CURRENCY_LIST = [
    // ASIA
    { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
    { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
    { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩" },
    { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
    { code: "PHP", name: "Philippine Peso", flag: "🇵🇭" },
    { code: "VND", name: "Vietnamese Dong", flag: "🇻🇳" },
    { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
    { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
    { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
    { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
    { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰" },
    { code: "BDT", name: "Bangladeshi Taka", flag: "🇧🇩" },
    { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
    { code: "TWD", name: "Taiwan Dollar", flag: "🇹🇼" },

    // EUROPE
    { code: "EUR", name: "Euro", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", flag: "🇬🇧" },
    { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
    { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
    { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴" },
    { code: "DKK", name: "Danish Krone", flag: "🇩🇰" },
    { code: "PLN", name: "Polish Zloty", flag: "🇵🇱" },
    { code: "CZK", name: "Czech Koruna", flag: "🇨🇿" },
    { code: "HUF", name: "Hungarian Forint", flag: "🇭🇺" },
    { code: "RON", name: "Romanian Leu", flag: "🇷🇴" },
    { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },
    { code: "RUB", name: "Russian Ruble", flag: "🇷🇺" },
    { code: "UAH", name: "Ukrainian Hryvnia", flag: "🇺🇦" },

    // MIDDLE EAST
    { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
    { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
    { code: "QAR", name: "Qatari Riyal", flag: "🇶🇦" },
    { code: "KWD", name: "Kuwaiti Dinar", flag: "🇰🇼" },
    { code: "BHD", name: "Bahraini Dinar", flag: "🇧🇭" },
    { code: "OMR", name: "Omani Rial", flag: "🇴🇲" },
    { code: "JOD", name: "Jordanian Dinar", flag: "🇯🇴" },
        { code: "EGP", name: "Egyptian Pound", flag: "🇪🇬" },

    // OCEANIA
    { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
    { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
    { code: "FJD", name: "Fijian Dollar", flag: "🇫🇯" },
    { code: "PGK", name: "Papua New Guinean Kina", flag: "🇵🇬" },

    // AMERICAS
    { code: "USD", name: "US Dollar", flag: "🇺🇸" },
    { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
    { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
    { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
    { code: "ARS", name: "Argentine Peso", flag: "🇦🇷" },
    { code: "CLP", name: "Chilean Peso", flag: "🇨🇱" },
    { code: "COP", name: "Colombian Peso", flag: "🇨🇴" },
    { code: "PEN", name: "Peruvian Sol", flag: "🇵🇪" },

    // AFRICA
    { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
    { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬" }
];

// Offline fallback rates (relative to USD = 1.0) — exposed globally so converter.js can use it
const OFFLINE_CURRENCY_RATES = {
    MYR: 0.227, SGD: 0.741, IDR: 0.000064, THB: 0.028, PHP: 0.017, VND: 0.0000394,
    JPY: 0.0067, CNY: 0.138, KRW: 0.00075, INR: 0.012, PKR: 0.0036, BDT: 0.0084,
    HKD: 0.128, TWD: 0.0312,
    EUR: 1.08, GBP: 1.28, CHF: 1.12, SEK: 0.095, NOK: 0.093, DKK: 0.145,
    PLN: 0.25, CZK: 0.043, HUF: 0.0028, RON: 0.217, TRY: 0.029, RUB: 0.011, UAH: 0.024,
    SAR: 0.267, AED: 0.272, QAR: 0.275, KWD: 3.25, BHD: 2.65, OMR: 2.60, JOD: 1.41,
    ILS: 0.268, EGP: 0.0204,
    AUD: 0.658, NZD: 0.604, FJD: 0.448, PGK: 0.263,
    USD: 1.0, CAD: 0.733, MXN: 0.0539, BRL: 0.182, ARS: 0.00102, CLP: 0.00105,
    COP: 0.00024, PEN: 0.268,
    ZAR: 0.055, NGN: 0.00067
};

function buildCustomCurrencyDropdown(nativeSelectId, defaultCode) {
    const nativeSelect = document.getElementById(nativeSelectId);
    if (!nativeSelect) return;

    // Populate hidden native select (kept for converter.js compatibility)
    nativeSelect.innerHTML = "";
    CURRENCY_LIST.forEach(cur => {
        const opt = document.createElement("option");
        opt.value = cur.code;
        opt.textContent = `${cur.name} (${cur.code})`;
        if (cur.code === defaultCode) opt.selected = true;
        nativeSelect.appendChild(opt);
    });
    nativeSelect.style.display = "none";

    // Build custom UI wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "custom-currency-select";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "currency-trigger";

    const defaultCur = CURRENCY_LIST.find(c => c.code === defaultCode) || CURRENCY_LIST[0];
    trigger.innerHTML = `<span class="currency-flag">${defaultCur.flag}</span><span class="currency-label">${defaultCur.name} (${defaultCur.code})</span><span class="currency-caret">▾</span>`;

    const panel = document.createElement("div");
    panel.className = "currency-panel";

    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.className = "currency-search";
    searchBox.placeholder = "Search currency or country...";

    const list = document.createElement("div");
    list.className = "currency-options";

    function renderOptions(filter = "") {
        const f = filter.trim().toLowerCase();
        const filtered = CURRENCY_LIST.filter(cur =>
            cur.name.toLowerCase().includes(f) || cur.code.toLowerCase().includes(f)
        );

        // Build the new list content off-screen first, then swap in one go.
        // This avoids the visible "flash"/jump some browsers show when
        // clearing innerHTML and re-appending many nodes one by one.
        const fragment = document.createDocumentFragment();

        if (filtered.length === 0) {
            const empty = document.createElement("div");
            empty.className = "currency-empty";
            empty.textContent = "No currency found";
            fragment.appendChild(empty);
        } else {
            filtered.forEach(cur => {
                const item = document.createElement("div");
                item.className = "currency-option";
                if (cur.code === nativeSelect.value) item.classList.add("selected");
                item.innerHTML = `<span class="currency-flag">${cur.flag}</span><span class="currency-label">${cur.name} (${cur.code})</span>`;
                item.addEventListener("mousedown", (e) => {
                    // mousedown (not click) so it fires before the input's blur/close logic
                    e.preventDefault();
                    nativeSelect.value = cur.code;
                    nativeSelect.dispatchEvent(new Event("change"));
                    trigger.innerHTML = `<span class="currency-flag">${cur.flag}</span><span class="currency-label">${cur.name} (${cur.code})</span><span class="currency-caret">▾</span>`;
                    closePanel();
                });
                fragment.appendChild(item);
            });
        }

        list.innerHTML = "";
        list.appendChild(fragment);
        list.scrollTop = 0;
    }

    panel.appendChild(searchBox);
    panel.appendChild(list);
    wrapper.appendChild(trigger);
    wrapper.appendChild(panel);
    nativeSelect.insertAdjacentElement("afterend", wrapper);

    function positionPanel() {
        panel.classList.remove("drop-up");
        const triggerRect = trigger.getBoundingClientRect();
        const panelHeight = 320; // approx max-height from CSS
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        // Prefer opening downward; only flip up if not enough space below AND more space above
        if (spaceBelow < panelHeight && spaceAbove > spaceBelow) {
            panel.classList.add("drop-up");
        }
    }

    function openPanel() {
        document.querySelectorAll(".currency-panel.open").forEach(p => {
            if (p !== panel) p.classList.remove("open", "drop-up");
        });
        positionPanel();
        panel.classList.add("open");
        trigger.classList.add("active");
        searchBox.value = "";
        renderOptions();
        setTimeout(() => searchBox.focus(), 0);
    }

    function closePanel() {
        panel.classList.remove("open", "drop-up");
        trigger.classList.remove("active");
    }

    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        if (panel.classList.contains("open")) {
            closePanel();
        } else {
            openPanel();
        }
    });

    searchBox.addEventListener("input", () => renderOptions(searchBox.value));
    searchBox.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) closePanel();
    });

    window.addEventListener("resize", () => {
        if (panel.classList.contains("open")) positionPanel();
    });

    // Close on page-level scroll only (e.g. user scrolls the whole page),
    // but ignore scroll events that originate from inside the dropdown itself
    // (the options list, or the panel scrolling internally).
    document.addEventListener("scroll", (e) => {
        if (!panel.classList.contains("open")) return;
        if (wrapper.contains(e.target)) return; // scroll happened inside our own dropdown — ignore
        closePanel();
    }, true);
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("curFrom")) {
        buildCustomCurrencyDropdown("curFrom", "MYR");
        buildCustomCurrencyDropdown("curTo", "USD");
    }
});