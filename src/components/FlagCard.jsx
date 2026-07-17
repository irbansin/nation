import { useEffect } from "react";

export default function FlagCard({ activeState, flagHtml, countryName, countryCode, onOpenPr }) {
  useEffect(() => {
    if (activeState === "flag-presenter" && countryCode === "US") {
      const canton = document.getElementById("usa-canton");
      if (canton && canton.children.length === 0) {
        canton.innerHTML = "";
        for (let r = 0; r < 9; r++) {
          const isEvenRow = r % 2 === 0;
          const starCount = isEvenRow ? 6 : 5;
          const rowDiv = document.createElement("div");
          rowDiv.className = "star-row" + (isEvenRow ? '' : ' five-stars');

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
  });

  return (
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
              Add code to render your flag. It's open-source at <a href="https://github.com/irbansin/nation" target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', textDecoration: 'underline' }}>github.com/irbansin/nation</a> and easy to contribute.
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
            <button className="btn-primary" id="btn-pr" onClick={onOpenPr}>
              <span>Create a Pull Request</span>
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v5.256a2.251 2.251 0 1 0 1.5 0V5.372Zm8 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v5.256a2.251 2.251 0 1 0 1.5 0V7.494ZM11 6c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1Zm-5.25 4.75a.75.75 0 1 0 0 1.5.75 0 0 0 0-1.5Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
