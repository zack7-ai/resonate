import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { matchScore, daysSincePosted } = await req.json();

    if (typeof matchScore !== 'number') {
      return NextResponse.json(
        { error: 'matchScore must be a number' },
        { status: 400 }
      );
    }

    // Calculate base probability from match score (0-100)
    // Match score contributes 80% to the probability
    const baseProbability = matchScore * 0.8;

    // Freshness factor: newer jobs have slightly higher probability
    // Jobs posted within 7 days get a bonus
    let freshnessBonus = 0;
    if (daysSincePosted !== undefined && typeof daysSincePosted === 'number') {
      if (daysSincePosted <= 7) {
        freshnessBonus = 15; // New jobs get +15% bonus
      } else if (daysSincePosted <= 14) {
        freshnessBonus = 8; // Week-old jobs get +8% bonus
      } else if (daysSincePosted <= 30) {
        freshnessBonus = 3; // Month-old jobs get +3% bonus
      }
      // Older jobs get no bonus
    }

    // Small random factor for variance (-5% to +5%)
    const randomFactor = (Math.random() * 10) - 5;

    // Calculate final probability (cap at 95% max, floor at 5% min)
    let probability = Math.round(baseProbability + freshnessBonus + randomFactor);
    probability = Math.max(5, Math.min(95, probability));

    // Determine label based on probability
    let label: "High" | "Medium" | "Low";
    if (probability >= 70) {
      label = "High";
    } else if (probability >= 40) {
      label = "Medium";
    } else {
      label = "Low";
    }

    return NextResponse.json({
      probability,
      label,
    });
  } catch (error) {
    console.error('Error calculating probability:', error);
    return NextResponse.json(
      { error: 'Failed to calculate probability' },
      { status: 500 }
    );
  }
}


