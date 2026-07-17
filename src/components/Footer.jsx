export default function Footer({ ipAddress }) {
  return (
    <footer className="app-footer">
      <p>
        Built with ❤️ by 🇮🇳 for the 🌍 • <span id="ip-display">IP: {ipAddress}</span>
      </p>
    </footer>
  );
}
