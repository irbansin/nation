export default function Footer({ ipAddress }) {
  return (
    <footer className="app-footer">
      <p>
        Built with ❤️ for global users • <span id="ip-display">IP: {ipAddress}</span>
      </p>
    </footer>
  );
}
