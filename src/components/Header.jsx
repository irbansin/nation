import { SUPPORTED_COUNTRIES } from "../app/constants";

export default function Header({ statusText, manualSelection, onManualSelection }) {
  return (
    <header className="app-header">
      <h1 className="app-title">Fun Facts about</h1>
      <p className="app-subtitle" id="status-text">{statusText}</p>

      {/* Selector navigation */}
      <div className="selector-container">
        {SUPPORTED_COUNTRIES.map((code) => (
          <button
            key={code}
            className={`selector-btn ${manualSelection === code ? "active" : ""}`}
            onClick={() => onManualSelection(code)}
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
          onClick={() => onManualSelection("AUTO")}
        >
          ⚡ Auto Detect
        </button>
      </div>
    </header>
  );
}
