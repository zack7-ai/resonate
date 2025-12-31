"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VelocityDataPoint {
  day: string;
  applications: number;
}

interface VelocityChart7DaysProps {
  data: VelocityDataPoint[];
}

export default function VelocityChart7Days({ data }: VelocityChart7DaysProps) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="day"
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
          <Line
            type="monotone"
            dataKey="applications"
            stroke="#6366F1"
            strokeWidth={2}
            dot={{ fill: "#6366F1", r: 4 }}
            activeDot={{ r: 6 }}
            name="Applications"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


