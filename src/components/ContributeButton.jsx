export default function ContributeButton({ onOpenPr }) {
  return (
    <button className="contribute-btn" onClick={onOpenPr} title="Contribute Flag">
      <svg className="git-icon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v5.256a2.251 2.251 0 1 0 1.5 0V5.372Zm8 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v5.256a2.251 2.251 0 1 0 1.5 0V7.494ZM11 6c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1Zm-5.25 4.75a.75.75 0 1 0 0 1.5.75 0 0 0 0-1.5Z" />
      </svg>
      <span>Please Contribute! Add your Nation to this list...</span>
    </button>
  );
}
