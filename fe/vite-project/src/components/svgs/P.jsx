const Psvg = (props) => (
  <svg viewBox="0 0 64 64" fill="none" {...props}>
    {/* Chat bubble */}
    <rect x="8" y="16" width="48" height="32" rx="12" fill="#2563eb" />
    <polygon points="24,48 32,56 40,48" fill="#2563eb" />
    {/* Coin */}
    <circle cx="44" cy="28" r="8" fill="#facc15" stroke="#eab308" strokeWidth="2" />
    <text x="44" y="32" textAnchor="middle" fontSize="10" fill="#eab308" fontWeight="bold" fontFamily="Arial">₹</text>
    {/* Chat lines */}
    <rect x="16" y="26" width="16" height="3" rx="1.5" fill="#fff" opacity="0.7" />
    <rect x="16" y="33" width="10" height="3" rx="1.5" fill="#fff" opacity="0.7" />
  </svg>
);
export default Psvg;