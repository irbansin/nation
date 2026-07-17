export default function PrModal({ isOpen, onClose, countryCode, countryName }) {
  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
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
        <button className="btn-secondary" onClick={onClose}>
          Awesome, I got it!
        </button>
      </div>
    </div>
  );
}
