"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [statusText, setStatusText] = useState("Detecting your location...");
  const [ipAddress, setIpAddress] = useState("Checking...");
  const [activeState, setActiveState] = useState("loading"); // loading, flag-presenter, fallback
  const [countryCode, setCountryCode] = useState("UNKNOWN");
  const [countryName, setCountryName] = useState("Unknown Country");
  const [flagHtml, setFlagHtml] = useState("");
  const [isPrModalOpen, setIsPrModalOpen] = useState(false);
  const [manualSelection, setManualSelection] = useState("AUTO");

  const SUPPORTED_COUNTRIES = ['IN', 'US', 'FR', 'DE', 'JP', 'IT', 'BE', 'IE', 'AT', 'NL', 'UA', 'YE'];

  const LOCAL_TEMPLATES = {
    IN: `
      <div class="flag-wrapper flag-in-wrapper">
        <div class="flag-india">
          <div class="band saffron"></div>
          <div class="band white">
            <div class="chakra-container">
              <img src="assets/ashok-Chakra.svg" alt="Ashok Chakra" class="ashok-chakra" id="in-chakra"/>
            </div>
          </div>
          <div class="band green"></div>
        </div>
      </div>
      <div class="country-info">
        <h2 class="country-name">Namaste! You are in India 🇮🇳</h2>
        <p class="country-details">Welcome to the land of diversity, culture, and heritage.</p>
      </div>
    `,
    US: `
      <div class="flag-wrapper flag-us-wrapper">
        <div class="flag-usa" id="usa-flag-container">
          <div class="canton" id="usa-canton"></div>
          <div class="stripes-container">
            <div class="stripe red"></div>
            <div class="stripe white"></div>
            <div class="stripe red"></div>
            <div class="stripe white"></div>
            <div class="stripe red"></div>
            <div class="stripe white"></div>
            <div class="stripe red"></div>
            <div class="stripe white"></div>
            <div class="stripe red"></div>
            <div class="stripe white"></div>
            <div class="stripe red"></div>
            <div class="stripe white"></div>
            <div class="stripe red"></div>
          </div>
        </div>
      </div>
      <div class="country-info">
        <h2 class="country-name">Hello! You are in the USA 🇺🇸</h2>
        <p class="country-details">Welcome to the land of opportunity and freedom.</p>
      </div>
    `,
    FR: `
      <div class="flag-wrapper">
        <div class="flag-vertical-tricolor french-flag">
          <div class="stripe blue"></div>
          <div class="stripe white"></div>
          <div class="stripe red"></div>
        </div>
      </div>
      <div class="country-info">
        <h2 class="country-name">Bonjour! You are in France 🇫🇷</h2>
        <p class="country-details">Welcome to the land of art, gastronomy, and romance.</p>
      </div>
    `,
    DE: `
      <div class="flag-wrapper">
        <div class="flag-horizontal-tricolor german-flag">
          <div class="stripe black"></div>
          <div class="stripe red"></div>
          <div class="stripe gold"></div>
        </div>
      </div>
      <div class="country-info">
        <h2 class="country-name">Hallo! You are in Germany 🇩🇪</h2>
        <p class="country-details">Welcome to the heart of Europe, known for its rich history and engineering.</p>
      </div>
    `,
    JP: `
      <div class="flag-wrapper">
        <div class="flag-japan">
          <div class="red-disk"></div>
        </div>
      </div>
      <div class="country-info">
        <h2 class="country-name">Konnichiwa! You are in Japan 🇯🇵</h2>
        <p class="country-details">Welcome to the land of the rising sun, blending ancient traditions with futuristic technology.</p>
      </div>
    `,
    IT: `
      <div class="flag-wrapper">
        <div class="flag-vertical-tricolor italian-flag">
          <div class="stripe green"></div>
          <div class="stripe white"></div>
          <div class="stripe red"></div>
        </div>
      </div>
      <div class="country-info">
        <h2 class="country-name">Ciao! You are in Italy 🇮🇹</h2>
        <p class="country-details">Welcome to the cradle of the Roman Empire and the Renaissance, famous for food and fashion.</p>
      </div>
    `,
    BE: `
      <div class="flag-wrapper">
        <div class="flag-vertical-tricolor belgian-flag">
          <div class="stripe black"></div>
          <div class="stripe yellow"></div>
          <div class="stripe red"></div>
        </div>
      </div>
      <div class="country-info">
        <h2 class="country-name">Bonjour / Hallo! You are in Belgium 🇧🇪</h2>
        <p class="country-details">Welcome to the home of fine chocolates, waffles, and the European Union headquarters.</p>
      </div>
    `,
    IE: `
      <div class="flag-wrapper">
        <div class="flag-vertical-tricolor irish-flag">
          <div class="stripe green"></div>
          <div class="stripe white"></div>
          <div class="stripe orange"></div>
        </div>
      </div>
      <div class="country-info">
        <h2 class="country-name">Fáilte! You are in Ireland 🇮🇪</h2>
        <p class="country-details">Welcome to the Emerald Isle, famous for its folklore, music, and beautiful green landscapes.</p>
      </div>
    `,
    AT: `
      <div class="flag-wrapper">
        <div class="flag-horizontal-tricolor austrian-flag">
          <div class="stripe red"></div>
          <div class="stripe white"></div>
          <div class="stripe red"></div>
        </div>
      </div>
      <div class="country-info">
        <h2 class="country-name">Hallo! You are in Austria 🇦🇹</h2>
        <p class="country-details">Welcome to the capital of classical music, alpine landscapes, and historic imperial palaces.</p>
      </div>
    `,
    NL: `
      <div class="flag-wrapper">
        <div class="flag-horizontal-tricolor dutch-flag">
          <div class="stripe red"></div>
          <div class="stripe white"></div>
          <div class="stripe blue"></div>
        </div>
      </div>
      <div class="country-info">
        <h2 class="country-name">Hallo! You are in the Netherlands 🇳🇱</h2>
        <p class="country-details">Welcome to the land of tulips, windmills, and beautiful canal networks.</p>
      </div>
    `,
    UA: `
      <div class="flag-wrapper">
        <div class="flag-horizontal-bicolor ukrainian-flag">
          <div class="stripe blue"></div>
          <div class="stripe yellow"></div>
        </div>
      </div>
      <div class="country-info">
        <h2 class="country-name">Vitayu! You are in Ukraine 🇺🇦</h2>
        <p class="country-details">Welcome to the land of golden wheat fields under clear blue skies.</p>
      </div>
    `,
    YE: `
      <div class="flag-wrapper">
        <div class="flag-horizontal-tricolor yemeni-flag">
          <div class="stripe red"></div>
          <div class="stripe white"></div>
          <div class="stripe black"></div>
        </div>
      </div>
      <div class="country-info">
        <h2 class="country-name">Marhaban! You are in Yemen 🇾🇪</h2>
        <p class="country-details">Welcome to the land of ancient mud-brick skyscrapers and rich trade history.</p>
      </div>
    `
  };

  const getMockCountryName = (code) => {
    const names = {
      'IN': 'India',
      'US': 'United States',
      'FR': 'France',
      'DE': 'Germany',
      'JP': 'Japan',
      'IT': 'Italy',
      'BE': 'Belgium',
      'IE': 'Ireland',
      'AT': 'Austria',
      'NL': 'Netherlands',
      'UA': 'Ukraine',
      'YE': 'Yemen',
      'GB': 'United Kingdom'
    };
    return names[code] || `Country (${code})`;
  };

  // Star generation for USA flag
  useEffect(() => {
    if (activeState === "flag-presenter" && countryCode === "US") {
      const canton = document.getElementById("usa-canton");
      if (canton) {
        canton.innerHTML = "";
        for (let r = 0; r < 9; r++) {
          const isEvenRow = r % 2 === 0;
          const starCount = isEvenRow ? 6 : 5;
          const rowDiv = document.createElement("div");
          rowDiv.className = "star-row" + (isEvenRow ? "" : " five-stars");

          for (let s = 0; s < starCount; s++) {
            rowDiv.innerHTML += `
              <svg class="star-svg" viewBox="0 0 24 24">
                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z"/>
              </svg>
            `;
          }
          canton.appendChild(rowDiv);
        }
      }
    }
  }, [flagHtml, activeState, countryCode]);

  const loadFlagTemplate = async (code) => {
    try {
      const response = await fetch(`/flags/${code.toUpperCase()}.html`);
      if (!response.ok) throw new Error("Template not found");
      const html = await response.text();
      setFlagHtml(html);
      return true;
    } catch (e) {
      console.warn("Could not fetch flag template dynamically. Falling back to inline templates...", e);
      if (LOCAL_TEMPLATES[code]) {
        setFlagHtml(LOCAL_TEMPLATES[code]);
        return true;
      }
      return false;
    }
  };

  const handleCountryDetected = async (code, name, ip) => {
    setIpAddress(ip);
    setCountryCode(code);
    setCountryName(name);

    if (SUPPORTED_COUNTRIES.includes(code)) {
      setStatusText("Welcome to Flag Explorer!");
      const success = await loadFlagTemplate(code);
      if (success) {
        setActiveState("flag-presenter");
      } else {
        handleFallback(name, code, ip);
      }
    } else {
      handleFallback(name, code, ip);
    }
  };

  const handleFallback = (name, code, ip) => {
    setStatusText("Flag not supported yet");
    setCountryName(name);
    setCountryCode(code);
    setIpAddress(ip);
    setActiveState("fallback");
  };

  const initDetection = async () => {
    setActiveState("loading");
    setStatusText("Detecting your location...");

    const urlParams = new URLSearchParams(window.location.search);
    const mockCountry = urlParams.get("country");

    if (mockCountry) {
      const code = mockCountry.toUpperCase();
      setTimeout(() => {
        handleCountryDetected(code, getMockCountryName(code), "127.0.0.1 (Mocked)");
      }, 1200);
      return;
    }

    try {
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) throw new Error("Primary API failed");
      const data = await response.json();
      const code = data.country_code ? data.country_code.toUpperCase() : "UNKNOWN";
      const name = data.country_name || "your local region";
      const ip = data.ip || "Unknown IP";
      handleCountryDetected(code, name, ip);
    } catch (error) {
      console.warn("Primary API failed, trying backup API...", error);
      try {
        const response = await fetch("https://ip-api.com/json/");
        if (!response.ok) throw new Error("Backup API failed");
        const data = await response.json();
        const code = data.countryCode ? data.countryCode.toUpperCase() : "UNKNOWN";
        const name = data.country || "your local region";
        const ip = data.query || "Unknown IP";
        handleCountryDetected(code, name, ip);
      } catch (backupError) {
        console.error("All geolocation APIs failed", backupError);
        handleFallback("an undetected country", "UNKNOWN", "Unavailable");
      }
    }
  };

  // Initial load
  useEffect(() => {
    initDetection();
  }, []);

  const handleManualSelection = (code) => {
    setManualSelection(code);
    setActiveState("loading");
    setTimeout(async () => {
      if (code === "AUTO") {
        initDetection();
      } else {
        setStatusText(`Viewing ${getMockCountryName(code)} Flag`);
        handleCountryDetected(code, getMockCountryName(code), "Local Override");
      }
    }, 400);
  };

  return (
    <>
      {/* Background decoration */}
      <div className="bg-gradient"></div>
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <main className="app-container">
        <header className="app-header">
          <h1 className="app-title">Flag Explorer</h1>
          <p className="app-subtitle" id="status-text">{statusText}</p>

          {/* Selector navigation */}
          <div className="selector-container">
            {SUPPORTED_COUNTRIES.map((code) => (
              <button
                key={code}
                className={`selector-btn ${manualSelection === code ? "active" : ""}`}
                onClick={() => handleManualSelection(code)}
              >
                {code === "IN" && "🇮🇳 India"}
                {code === "US" && "🇺🇸 USA"}
                {code === "FR" && "🇫🇷 France"}
                {code === "DE" && "🇩🇪 Germany"}
                {code === "JP" && "🇯🇵 Japan"}
                {code === "IT" && "🇮🇹 Italy"}
                {code === "BE" && "🇧🇪 Belgium"}
                {code === "IE" && "🇮🇪 Ireland"}
                {code === "AT" && "🇦🇹 Austria"}
                {code === "NL" && "🇳🇱 Netherlands"}
                {code === "UA" && "🇺🇦 Ukraine"}
                {code === "YE" && "🇾🇪 Yemen"}
              </button>
            ))}
            <button
              className={`selector-btn ${manualSelection === "AUTO" ? "active" : ""}`}
              onClick={() => handleManualSelection("AUTO")}
            >
              ⚡ Auto Detect
            </button>
          </div>
        </header>

        {/* Card */}
        <div className="card-glass" id="main-card">
          {/* Loading */}
          <div id="state-loading" className={`state-view ${activeState === "loading" ? "active" : ""}`}>
            <div className="loader-container">
              <div className="pulse-ring"></div>
              <div className="pulse-dot"></div>
            </div>
            <p className="loading-label">Locating server...</p>
          </div>

          {/* Dynamic Template Container */}
          <div
            id="state-flag-presenter"
            className={`state-view ${activeState === "flag-presenter" ? "active" : ""}`}
            dangerouslySetInnerHTML={{ __html: flagHtml }}
          />

          {/* Fallback */}
          <div id="state-fallback" className={`state-view ${activeState === "fallback" ? "active" : ""}`}>
            <div className="fallback-icon-container">
              <span className="fallback-globe">🌍</span>
            </div>
            <div className="country-info">
              <h2 className="country-name" id="detected-country-title">
                Greetings from {countryName}!
              </h2>
              <p className="country-details">
                We detected your location as <strong>{countryName}</strong>, but we don't support rendering its flag yet.
              </p>

              <div className="pr-box">
                <h3 className="pr-box-title">Help us support your country!</h3>
                <p className="pr-box-desc">
                  Add code to render your flag. It's open-source and easy to contribute.
                </p>
                <div className="code-snippet-container">
                  <pre>
                    <code>
                      {`// 1. Create a file public/flags/${countryCode}.html with your flag structure
// 2. Add your country code to page.js:
const supportedCountries = ['IN', 'US', ... , '`}
                      <span id="detected-country-code-highlight">{countryCode}</span>
                      {"'];"}
                    </code>
                  </pre>
                </div>
                <button className="btn-primary" id="btn-pr" onClick={() => setIsPrModalOpen(true)}>
                  <span>Create a Pull Request</span>
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                    <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v5.256a2.251 2.251 0 1 0 1.5 0V5.372Zm8 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v5.256a2.251 2.251 0 1 0 1.5 0V7.494ZM11 6c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1Zm-5.25 4.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="app-footer">
          <p>
            Built with ❤️ for global users • <span id="ip-display">IP: {ipAddress}</span>
          </p>
        </footer>
      </main>

      {/* Modal */}
      <div className={`modal-overlay ${isPrModalOpen ? "active" : ""}`} onClick={() => setIsPrModalOpen(false)}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setIsPrModalOpen(false)}>
            &times;
          </button>
          <h3 className="modal-title">How to Contribute</h3>
          <ol className="contribution-steps">
            <li>Fork this repository on GitHub.</li>
            <li>
              Create a new file: <code>public/flags/{countryCode}.html</code> and design your flag layout inside it.
            </li>
            <li>Add your country's ISO code to the list of supported countries in <code>page.js</code>.</li>
            <li>Style your flag components in <code>globals.css</code>.</li>
            <li>
              Open a Pull Request with the title: <code>feat: Add {countryName} Flag</code>.
            </li>
          </ol>
          <button className="btn-secondary" onClick={() => setIsPrModalOpen(false)}>
            Awesome, I got it!
          </button>
        </div>
      </div>
    </>
  );
}
