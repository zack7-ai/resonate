"use client";

interface SeatsCounterProps {
  totalSeats?: number;
  seatsRemaining?: number;
}

export default function SeatsCounter({
  totalSeats = 100,
  seatsRemaining = 16,
}: SeatsCounterProps) {
  const seatsTaken = totalSeats - seatsRemaining;
  const progressPercentage = (seatsTaken / totalSeats) * 100;

  return (
    <div className="rounded-lg border border-gray-800 bg-slate-900/50 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Seats Remaining: {seatsRemaining}</h3>
      </div>
      <div className="relative h-4 overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-green transition-all duration-1000"
          style={{ width: `${progressPercentage}%` }}
        >
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-400">
        {progressPercentage.toFixed(0)}% of seats claimed
      </p>
    </div>
  );
}


