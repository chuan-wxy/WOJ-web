// loading SVG
export const loadingSvg = (color: string) => `
<svg width="50" height="40" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg">
  <style>
    .rect {
      fill: ${color};
      transform-origin: center;
      animation: sk-stretchdelay 1.2s infinite ease-in-out;
    }
    .r2 { animation-delay: -1.1s; }
    .r3 { animation-delay: -1.0s; }
    .r4 { animation-delay: -0.9s; }
    .r5 { animation-delay: -0.8s; }

    @keyframes sk-stretchdelay {
      0%, 40%, 100% { transform: scaleY(0.4); }
      20% { transform: scaleY(1.0); }
    }
  </style>
  <rect class="rect r1" x="0" y="0" width="6" height="40" />
  <rect class="rect r2" x="9" y="0" width="6" height="40" />
  <rect class="rect r3" x="18" y="0" width="6" height="40" />
  <rect class="rect r4" x="27" y="0" width="6" height="40" />
  <rect class="rect r5" x="36" y="0" width="6" height="40" />
</svg>`
