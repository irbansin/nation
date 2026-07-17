export default function ModelStatus({ isAiReady, modelLabel }) {
  return (
    <div className="model-status-container">
      <div className={`model-status-badge ${isAiReady ? "ready" : "offline"}`}>
        <span className="status-dot"></span>
        <span className="status-text">
          {isAiReady ? `AI Ready: ${modelLabel}` : "AI Offline"}
        </span>
      </div>
    </div>
  );
}
