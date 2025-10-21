export function SeesawLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      {/* Circle in top-left */}
      <circle cx="28" cy="28" r="15" />

      {/* Diagonal slash from top-left to bottom-right */}
      <rect x="46" y="10" width="8" height="80" rx="4" transform="rotate(35 50 50)" />

      <path d="M 60 78 L 88 78 L 74 50 Z" />
    </svg>
  )
}

export function SeesawBrand({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <SeesawLogo />
      <span className="text-xl font-semibold">
        <span className="font-bold">Seesaw</span>
        <span className="font-normal">.Finance</span>
      </span>
    </div>
  )
}
