import React from 'react';

const VillageBackdrop: React.FC = () => (
  <div className="village-backdrop" aria-hidden="true">
    <svg
      className="village-backdrop-scene"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="village-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9f1e8" stopOpacity=".4" />
          <stop offset=".62" stopColor="#f9f8f4" stopOpacity=".05" />
          <stop offset="1" stopColor="#f3ead5" stopOpacity=".22" />
        </linearGradient>
        <radialGradient id="village-sun-glow">
          <stop stopColor="#f4d58c" stopOpacity=".36" />
          <stop offset="1" stopColor="#f4d58c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="village-hill-back" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#b6cbb0" stopOpacity=".24" />
          <stop offset="1" stopColor="#8eae8d" stopOpacity=".2" />
        </linearGradient>
        <linearGradient id="village-hill-front" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#91ad8e" stopOpacity=".2" />
          <stop offset="1" stopColor="#6d936e" stopOpacity=".18" />
        </linearGradient>
        <linearGradient id="village-water" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#88ab8e" stopOpacity="0" />
          <stop offset=".5" stopColor="#88ab8e" stopOpacity=".22" />
          <stop offset="1" stopColor="#88ab8e" stopOpacity="0" />
        </linearGradient>
        <g id="village-house">
          <path d="M0 35 48 0l48 35v61H0z" fill="#c47a4d" fillOpacity=".34" />
          <path d="M-8 38 48-5l56 43" fill="none" stroke="#8f6046" strokeOpacity=".52" strokeWidth="7" strokeLinejoin="round" />
          <path d="M38 96V57h21v39" fill="#fff5da" fillOpacity=".7" stroke="#8f6046" strokeOpacity=".34" strokeWidth="2" />
          <path d="M12 52h15v16H12zM69 52h15v16H69z" fill="#eaf0dc" fillOpacity=".7" stroke="#8f6046" strokeOpacity=".3" strokeWidth="2" />
          <path d="M-2 96h100" stroke="#557b5d" strokeOpacity=".4" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g id="village-tree">
          <path d="M29 94V42" stroke="#81664b" strokeOpacity=".48" strokeWidth="8" strokeLinecap="round" />
          <circle cx="29" cy="31" r="25" fill="#789d73" fillOpacity=".3" />
          <circle cx="12" cy="43" r="17" fill="#88ab8e" fillOpacity=".32" />
          <circle cx="47" cy="43" r="17" fill="#88ab8e" fillOpacity=".32" />
          <circle cx="29" cy="16" r="16" fill="#a5bd91" fillOpacity=".32" />
          <path d="M29 52v40" stroke="#f6eddb" strokeOpacity=".32" strokeWidth="2" strokeLinecap="round" />
        </g>
      </defs>

      <path fill="url(#village-sky)" d="M0 0h1440v900H0z" />
      <circle cx="1110" cy="250" r="190" fill="url(#village-sun-glow)" className="village-sun-glow" />
      <circle cx="1110" cy="250" r="48" fill="#e5bd69" fillOpacity=".2" />

      <g className="village-cloud village-cloud-one" fill="#fff" fillOpacity=".46">
        <ellipse cx="290" cy="205" rx="72" ry="20" />
        <ellipse cx="270" cy="194" rx="30" ry="20" />
        <ellipse cx="305" cy="188" rx="37" ry="26" />
        <ellipse cx="333" cy="198" rx="30" ry="17" />
      </g>
      <g className="village-cloud village-cloud-two" fill="#fff" fillOpacity=".38">
        <ellipse cx="860" cy="330" rx="58" ry="16" />
        <ellipse cx="840" cy="321" rx="25" ry="17" />
        <ellipse cx="869" cy="316" rx="31" ry="21" />
        <ellipse cx="895" cy="325" rx="25" ry="13" />
      </g>

      <g className="village-birds" fill="none" stroke="#557b5d" strokeOpacity=".32" strokeWidth="2" strokeLinecap="round">
        <path d="M620 235q9-10 18 0 9-10 18 0" />
        <path d="M676 270q7-8 14 0 7-8 14 0" />
        <path d="M570 285q6-7 12 0 6-7 12 0" />
      </g>

      <path d="M0 625q180-91 370-20t370-9q190-83 380-5t320-13v322H0z" fill="url(#village-hill-back)" />
      <path d="M0 704q185-79 367-12t372-13q218-95 414-4t287-12v237H0z" fill="url(#village-hill-front)" />

      <g className="village-house-group">
        <use href="#village-house" x="270" y="630" />
        <use href="#village-house" x="390" y="675" />
        <use href="#village-house" x="955" y="645" />
        <use href="#village-house" x="1090" y="675" />
      </g>

      <g className="village-tree-group village-tree-left">
        <use href="#village-tree" x="172" y="666" />
      </g>
      <g className="village-tree-group village-tree-right">
        <use href="#village-tree" x="1220" y="635" />
      </g>
      <g className="village-tree-group village-tree-small">
        <use href="#village-tree" x="855" y="700" />
      </g>

      <path d="M0 806q180-15 360 0t360 0 360 0 360 0v94H0z" fill="url(#village-water)" />
      <g className="village-water-lines" fill="none" stroke="#557b5d" strokeOpacity=".16" strokeWidth="2" strokeLinecap="round">
        <path d="M120 835h175m44 0h92m175 0h215m56 0h100m76 0h102" />
        <path d="M260 865h92m72 0h183m74 0h100m85 0h160" />
      </g>
    </svg>
    <div className="village-backdrop-wash" />
  </div>
);

export default VillageBackdrop;
