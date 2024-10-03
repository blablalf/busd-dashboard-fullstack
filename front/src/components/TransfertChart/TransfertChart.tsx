import { useEffect, useState } from "react";
import { DailyTransferType } from "../../hooks/useGetDailyTransfers";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./TransfertChart.css";
import { useGetDailyTransfersApi } from "../../hooks/useGetDailyTransfersApi";

// Helper function to filter data based on range
const filterData = (data: DailyTransferType[], range: string) => {
  const now = new Date();
  const rangeStart = new Date();

  switch (range) {
    case "weekly":
      rangeStart.setDate(now.getDate() - 7); // Past week
      break;
    case "monthly":
      rangeStart.setMonth(now.getMonth() - 1); // Past month
      break;
    case "3months":
      rangeStart.setMonth(now.getMonth() - 3); // Past 3 months
      break;
    case "6months":
      rangeStart.setMonth(now.getMonth() - 6); // Past 6 months
      break;
    case "max":
      return data; // Return all data
    default:
      return data; // Return all data for undefined range
  }

  // Filter data by comparing the date
  return data.filter((item) => new Date(item.date) >= rangeStart);
};

// TypeScript types for props
type RangeType = "weekly" | "monthly" | "3months" | "6months" | "max";

export default function TransfertChart() {
  const [timeRange, setTimeRange] = useState<RangeType>("weekly");
  const { data: dailyData } = useGetDailyTransfersApi();
  // const dailyData = sampleData;
  const [filteredData, setFilteredData] = useState<DailyTransferType[]>([]);

  useEffect(() => {
    if (dailyData) {
      setFilteredData(filterData(dailyData, timeRange));
    }
  }, [dailyData, timeRange]);

  return (
    <div className="chart-container">
      <div className="chart-buttons">
        <button onClick={() => setTimeRange("weekly")}>Weekly</button>
        <button onClick={() => setTimeRange("monthly")}>Monthly</button>
        <button onClick={() => setTimeRange("3months")}>3 Months</button>
        <button onClick={() => setTimeRange("6months")}>6 Months</button>
        <button onClick={() => setTimeRange("max")}>Max</button>
      </div>

      <ResponsiveContainer className="responsive-container">
        <BarChart data={filteredData} className="chart">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#d5588e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
