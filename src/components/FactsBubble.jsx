export default function FactsBubble({
  activeState,
  countryName,
  isBubbleOpen,
  setIsBubbleOpen,
  factLoading,
  factText,
  factStats,
  factSource,
  bubbleStyle,
  toggleFactsBubble,
  handleAnimationEnd,
  isAiReady,
  isAiLoading,
  aiProgress,
}) {
  if (activeState !== "flag-presenter") return null;

  return (
    <>
      <div className="facts-fab-container">
        {isAiLoading && (
          <div className="ai-loading-badge">
            <div className="mini-pulse"></div>
            <span>Loading intelligence... {aiProgress}%</span>
          </div>
        )}
        {isAiReady && (
          <button
            className={`facts-fab ${isBubbleOpen ? "active" : ""} ${factLoading ? "generating" : ""}`}
            onClick={toggleFactsBubble}
            title="Reveal Country Facts"
            disabled={factLoading}
          >
            {factLoading ? (
              <span className="generating-text">Generating...</span>
            ) : (
              <span className="fab-icon">💡</span>
            )}
          </button>
        )}
      </div>

      <div
        className={`facts-bubble-card ${isBubbleOpen ? "active" : ""}`}
        style={bubbleStyle}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="bubble-header">
          <h3 className="bubble-title">Quick Facts: {countryName}</h3>
          <button className="bubble-close" onClick={() => setIsBubbleOpen(false)}>
            &times;
          </button>
        </div>

        <div className="bubble-body">
          {factLoading ? (
            <div className="bubble-loader">
              <div className="mini-pulse"></div>
              <p>Searching facts...</p>
            </div>
          ) : (
            <>
              {factStats && (
                <div className="bubble-stats">
                  <div className="stat-item">
                    <strong>Capital:</strong> {factStats.capital}
                  </div>
                  <div className="stat-item">
                    <strong>Population:</strong> {factStats.population}
                  </div>
                  <div className="stat-item">
                    <strong>Languages:</strong> {factStats.languages}
                  </div>
                  <div className="stat-item">
                    <strong>Currency:</strong> {factStats.currencies}
                  </div>
                </div>
              )}
              <p className="bubble-desc">
                {factText || "Click the lightbulb icon to load facts!"}
              </p>

              <p className="bubble-source">
                Source: {factSource}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
