"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface VelocityDataPoint {
  week: string;
  applications: number;
  goal: number;
}

interface VelocityChartProps {
  data: VelocityDataPoint[];
  weeklyGoal: number;
}

export default function VelocityChart({
  data,
  weeklyGoal,
}: VelocityChartProps) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="week"
            stroke="#9CA3AF"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F3F4F6",
            }}
          />
          <ReferenceLine
            y={weeklyGoal}
            stroke="#10B981"
            strokeDasharray="5 5"
            label={{ value: "Goal", position: "right", fill: "#10B981" }}
          />
          <Line
            type="monotone"
            dataKey="applications"
            stroke="#6366F1"
            strokeWidth={2}
            dot={{ fill: "#6366F1", r: 4 }}
            activeDot={{ r: 6 }}
            name="Applications"
          />
          <Line
            type="monotone"
            dataKey="goal"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Goal"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


