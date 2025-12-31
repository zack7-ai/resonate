"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DollarSign, TrendingUp } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface MarketValueData {
  currentSalary: number;
  marketMedian: number;
  topOpportunities: number;
  potentialUplift: number;
  potentialUpliftPercent: number;
}

interface MarketValueChartProps {
  jobs: Array<{
    salary_min?: number;
    salary_max?: number;
    extracted_salary?: number;
  }>;
}

export default function MarketValueChart({ jobs }: MarketValueChartProps) {
  const { user } = useUser();
  const [marketData, setMarketData] = useState<MarketValueData | null>(null);
  const [currentSalary, setCurrentSalary] = useState<number>(0);

  useEffect(() => {
    // Fetch user's current salary from profile
    const fetchCurrentSalary = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setCurrentSalary(data.current_salary || 0);
        }
      } catch (error) {
        console.error("Error fetching current salary:", error);
      }
    };

    if (user) {
      fetchCurrentSalary();
    }
  }, [user]);

  useEffect(() => {
    if (jobs.length === 0) return;

    // Calculate market metrics
    const salaries = jobs
      .map((job) => {
        if (job.extracted_salary) return job.extracted_salary;
        if (job.salary_min && job.salary_max) {
          return Math.round((job.salary_min + job.salary_max) / 2);
        }
        return job.salary_min || job.salary_max || 0;
      })
      .filter((s) => s > 0);

    if (salaries.length === 0) return;

    // Market median (average of all salaries)
    const marketMedian = Math.round(
      salaries.reduce((sum, s) => sum + s, 0) / salaries.length
    );

    // Top opportunities (average of top 3 highest salaries)
    const sortedSalaries = [...salaries].sort((a, b) => b - a);
    const topOpportunities = Math.round(
      sortedSalaries.slice(0, 3).reduce((sum, s) => sum + s, 0) / Math.min(3, sortedSalaries.length)
    );

    // Potential uplift
    const baseSalary = currentSalary || marketMedian * 0.8; // Default to 80% of market if not set
    const potentialUplift = topOpportunities - baseSalary;
    const potentialUpliftPercent = baseSalary > 0 
      ? Math.round((potentialUplift / baseSalary) * 100) 
      : 0;

    setMarketData({
      currentSalary: baseSalary,
      marketMedian,
      topOpportunities,
      potentialUplift,
      potentialUpliftPercent,
    });
  }, [jobs, currentSalary]);

  if (!marketData) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Calculating market value...</p>
        </div>
      </div>
    );
  }

  const chartData = [
    {
      name: "Your Current",
      value: marketData.currentSalary,
      color: "hsl(var(--muted-foreground))",
    },
    {
      name: "Market Median",
      value: marketData.marketMedian,
      color: "hsl(var(--primary))",
    },
    {
      name: "Top Opportunities",
      value: marketData.topOpportunities,
      color: "hsl(var(--success))",
    },
  ];

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-card-foreground">Market Value</h3>
          <p className="text-sm text-muted-foreground">
            Salary benchmarking based on current opportunities
          </p>
        </div>
        <div className="rounded-lg bg-primary/10 p-2">
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis 
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: any) => formatCurrency(value as number)}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insight */}
      {marketData.potentialUplift > 0 && (
        <div className="rounded-lg border border-success/30 bg-success/5 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <div>
              <p className="font-semibold text-card-foreground">
                Potential Uplift: {formatCurrency(marketData.potentialUplift)}
              </p>
              <p className="text-sm text-muted-foreground">
                {marketData.potentialUpliftPercent > 0 ? `+${marketData.potentialUpliftPercent}%` : ""} increase targeting top opportunities
              </p>
            </div>
          </div>
        </div>
      )}

      {marketData.currentSalary === 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
          <p className="text-sm text-muted-foreground">
            <a href="/dashboard/settings" className="text-primary hover:underline">
              Add your current salary
            </a>{" "}
            to see personalized market value comparison.
          </p>
        </div>
      )}
    </div>
  );
}

