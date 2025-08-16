const XSvg = (props) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    {...props}
  >
    {/* Define Indian flag gradient */}
    <defs>
      <linearGradient id="tricolor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FF9933" /> {/* Saffron */}
        <stop offset="33.33%" stopColor="#FF9933" />
        <stop offset="33.34%" stopColor="white" />
        <stop offset="66.66%" stopColor="white" />
        <stop offset="66.67%" stopColor="#138808" /> {/* Green */}
        <stop offset="100%" stopColor="#138808" />
      </linearGradient>
    </defs>

    {/* Outer chip */}
    <circle cx="12" cy="12" r="10" fill="url(#tricolor)" stroke="currentColor" strokeWidth="2" />

    {/* Inner white circle */}
    <circle cx="12" cy="12" r="6" fill="white" stroke="currentColor" strokeWidth="1.5" />

    {/* Queen chess piece silhouette */}
    <g transform="translate(8,8) scale(0.5)">
      <path
        d="M12 2a1 1 0 1 0-2 0v1.1a3 3 0 0 0-2 .9l-1.4-1.4a1 1 0 0 0-1.4 1.4L5.1 5A3 3 0 0 0 4.2 7H3a1 1 0 1 0 0 2h1.1a3 3 0 0 0 .9 2l-1.4 1.4a1 1 0 1 0 1.4 1.4L7 12.9a3 3 0 0 0 2 .9V15H6v2h6v-2h-3v-1.2a3 3 0 0 0 2-.9l1.4 1.4a1 1 0 1 0 1.4-1.4L12.9 11a3 3 0 0 0 .9-2H15a1 1 0 1 0 0-2h-1.1a3 3 0 0 0-.9-2l1.4-1.4a1 1 0 0 0-1.4-1.4L10 3.1a3 3 0 0 0-2-.9V2z"
        fill="currentColor"
      />
    </g>

    {/* Chip markings */}
    <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5" />
    <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" />
    <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="1.5" />
    <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
    <line x1="4.2" y1="4.2" x2="6.3" y2="6.3" stroke="currentColor" strokeWidth="1.5" />
    <line x1="17.7" y1="17.7" x2="19.8" y2="19.8" stroke="currentColor" strokeWidth="1.5" />
    <line x1="4.2" y1="19.8" x2="6.3" y2="17.7" stroke="currentColor" strokeWidth="1.5" />
    <line x1="17.7" y1="6.3" x2="19.8" y2="4.2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default XSvg;
