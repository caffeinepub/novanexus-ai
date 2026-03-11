import { cn } from "@/lib/utils";

interface GemIconProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export function GemIcon({
  className,
  size = 24,
  animated = false,
}: GemIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(animated && "shimmer-text", className)}
      role="img"
      aria-label="NovaNexus AI logo"
    >
      <title>NovaNexus AI logo</title>
      <defs>
        <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.62 0.22 260)" />
          <stop offset="50%" stopColor="oklch(0.58 0.2 275)" />
          <stop offset="100%" stopColor="oklch(0.55 0.18 285)" />
        </linearGradient>
        <linearGradient id="gemFacet" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.78 0.16 260)" />
          <stop offset="100%" stopColor="oklch(0.52 0.22 275)" />
        </linearGradient>
        <filter id="gemGlow">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Top facet row */}
      <polygon
        points="16,3 22,10 16,13 10,10"
        fill="url(#gemGrad)"
        opacity="0.95"
      />
      {/* Left upper facet */}
      <polygon
        points="10,10 16,13 10,19"
        fill="url(#gemFacet)"
        opacity="0.85"
      />
      {/* Right upper facet */}
      <polygon points="22,10 16,13 22,19" fill="url(#gemGrad)" opacity="0.75" />
      {/* Center facet */}
      <polygon
        points="10,19 16,13 22,19 16,29"
        fill="url(#gemGrad)"
        opacity="0.9"
        filter="url(#gemGlow)"
      />
      {/* Left lower facet */}
      <polygon points="3,13 10,10 10,19" fill="url(#gemFacet)" opacity="0.65" />
      {/* Right lower facet */}
      <polygon points="29,13 22,10 22,19" fill="url(#gemGrad)" opacity="0.55" />
      {/* Top left bevel */}
      <polygon points="3,13 10,10 16,3" fill="url(#gemGrad)" opacity="0.5" />
      {/* Top right bevel */}
      <polygon points="29,13 22,10 16,3" fill="url(#gemFacet)" opacity="0.6" />
    </svg>
  );
}
