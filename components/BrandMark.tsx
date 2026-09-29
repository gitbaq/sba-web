import React from "react";

/**
 * Brand mark — AI insight spark: central hexagon with six radiating nodes.
 * Strong silhouette at 32px; identifiable without letterforms.
 */
export default function BrandMark({
  className = "h-8 w-8",
  title = "Syed Baqir Ali",
}: {
  className?: string;
  title?: string;
}) {
  const ink = "hsl(var(--brand-foreground))";
  const tile = "hsl(var(--brand))";

  // Hexagon center 16,16 — flat-top, radius ~5.2
  const hex = "16 10.8 20.5 13.4 20.5 18.6 16 21.2 11.5 18.6 11.5 13.4";

  const nodes = [
    { x: 16, y: 5.2 },
    { x: 25.2, y: 10.4 },
    { x: 25.2, y: 21.6 },
    { x: 16, y: 26.8 },
    { x: 6.8, y: 21.6 },
    { x: 6.8, y: 10.4 },
  ];

  // Hexagon vertex nearest each node (for short rays)
  const verts = [
    { x: 16, y: 10.8 },
    { x: 20.5, y: 13.4 },
    { x: 20.5, y: 18.6 },
    { x: 16, y: 21.2 },
    { x: 11.5, y: 18.6 },
    { x: 11.5, y: 13.4 },
  ];

  return (
    <svg
      viewBox='0 0 32 32'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      role='img'
      aria-label={title}
    >
      <title>{title}</title>
      <rect x='1' y='1' width='30' height='30' rx='8' fill={tile} />

      <g stroke={ink} strokeWidth='1.5' strokeLinecap='round'>
        {nodes.map((n, i) => (
          <line
            key={`ray-${i}`}
            x1={verts[i].x}
            y1={verts[i].y}
            x2={n.x}
            y2={n.y}
          />
        ))}
      </g>

      <polygon points={hex} fill={ink} />

      <g fill={ink}>
        {nodes.map((n, i) => (
          <circle key={`node-${i}`} cx={n.x} cy={n.y} r='2.05' />
        ))}
      </g>
    </svg>
  );
}
