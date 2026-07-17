export default function Footer({ ipAddress }) {
  return (
    <footer className="app-footer">
      <p>
        Built with ❤️ in India 🇮🇳 for the world 🌍 • <span id="ip-display">IP: {ipAddress}</span>
      </p>
    </footer>
  );
}
