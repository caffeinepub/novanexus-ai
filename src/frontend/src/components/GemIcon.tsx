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
        <radialGradient id="novaCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.85 0.15 192)" />
          <stop offset="100%" stopColor="oklch(0.62 0.2 195)" />
        </radialGradient>
        <linearGradient id="novaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.72 0.21 192)" />
          <stop offset="60%" stopColor="oklch(0.68 0.19 215)" />
          <stop offset="100%" stopColor="oklch(0.62 0.17 255)" />
        </linearGradient>
        <filter id="novaGlow">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* 4-point starburst: thin north-south spike */}
      <ellipse
        cx="16"
        cy="16"
        rx="2.2"
        ry="13"
        fill="url(#novaGrad)"
        opacity="0.95"
      />
      {/* 4-point starburst: thin east-west spike */}
      <ellipse
        cx="16"
        cy="16"
        rx="13"
        ry="2.2"
        fill="url(#novaGrad)"
        opacity="0.95"
      />
      {/* diagonal spikes at 45deg - shorter */}
      <ellipse
        cx="16"
        cy="16"
        rx="1.4"
        ry="8"
        transform="rotate(45 16 16)"
        fill="url(#novaGrad)"
        opacity="0.6"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="1.4"
        ry="8"
        transform="rotate(-45 16 16)"
        fill="url(#novaGrad)"
        opacity="0.6"
      />
      {/* glowing center */}
      <circle
        cx="16"
        cy="16"
        r="3"
        fill="url(#novaCenter)"
        filter="url(#novaGlow)"
      />
    </svg>
  );
}
