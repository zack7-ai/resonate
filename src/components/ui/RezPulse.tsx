type RezPulseStatus = "default" | "success" | "error" | "loading" | "idle" | "active" | "warning";

interface RezPulseProps {
  status?: RezPulseStatus;
  message?: string;
}

export default function RezPulse({ status = "default", message }: RezPulseProps) {
  // Normalize status to match existing logic
  let normalizedStatus: "default" | "success" | "error" | "loading" = "default";
  if (status === "active") {
    normalizedStatus = "loading";
  } else if (status === "warning") {
    normalizedStatus = "error";
  } else if (status === "idle") {
    normalizedStatus = "default";
  } else {
    normalizedStatus = status;
  }

  // Determine colors based on status
  const getColors = () => {
    switch (normalizedStatus) {
      case "success":
        return {
          bg: "bg-brand-green",
          glow: "rgba(74, 222, 128, 0.6)",
          shadow: "shadow-[0_0_10px_#4ade80]",
          ping: "bg-brand-green",
        };
      case "error":
        return {
          bg: "bg-brand-alert",
          glow: "rgba(239, 68, 68, 0.6)",
          shadow: "shadow-[0_0_10px_#ef4444]",
          ping: "bg-brand-alert",
        };
      case "loading":
        return {
          bg: "bg-brand-blue",
          glow: "rgba(99, 102, 241, 0.6)",
          shadow: "shadow-[0_0_10px_#6366f1]",
          ping: "bg-brand-blue",
        };
      default:
        return {
          bg: "bg-brand-green",
          glow: "rgba(74, 222, 128, 0.6)",
          shadow: "shadow-[0_0_10px_#4ade80]",
          ping: "bg-brand-green",
        };
    }
  };

  const colors = getColors();
  // Faster pulse for "active" status
  const isActive = status === "active";
  const pulseSpeed = "animate-pulse";
  const pulseDuration = isActive ? "[animation-duration:0.75s]" : "";

  return (
    <div className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
      {/* The Sci-Fi Orb */}
      <div className="relative flex-shrink-0">
        {/* Outer glow pulse */}
        <div
          className={`absolute h-6 w-6 ${pulseSpeed} rounded-full ${colors.ping} opacity-30 ${pulseDuration}`}
        />
        {/* Main orb */}
        <div
          className={`relative h-3 w-3 rounded-full ${colors.bg} ${colors.shadow} ${pulseSpeed} ${pulseDuration}`}
        />
      </div>

      {/* Speech Bubble / HUD Terminal */}
      {message && (
        <div className="flex-1 rounded border border-gray-800 bg-slate-900/50 px-3 py-2">
          <p className="text-sm text-brand-blue font-mono">{message}</p>
        </div>
      )}
    </div>
  );
}

