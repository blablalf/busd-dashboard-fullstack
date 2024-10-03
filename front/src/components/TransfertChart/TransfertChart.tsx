import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import './TransfertChart.css';

// interface for data
interface DataType {
  date: string;
  transfers: number;
}

// Sample data (could be replaced by API fetched data)
const sampleData: DataType[] = [
  { date: '2024-09-01', transfers: 100 },
  { date: '2024-09-02', transfers: 120 },
  { date: '2024-09-03', transfers: 150 },
  { date: '2024-09-04', transfers: 90 },
  { date: '2024-09-05', transfers: 200 },
  { date: '2024-09-06', transfers: 130 },
  { date: '2024-09-07', transfers: 70 },
  { date: '2024-09-08', transfers: 100 },
  { date: '2024-09-09', transfers: 120 },
  { date: '2024-09-10', transfers: 150 },
  { date: '2024-09-11', transfers: 90 },
  { date: '2024-09-12', transfers: 200 },
  { date: '2024-09-13', transfers: 130 },
  { date: '2024-10-05', transfers: 70 },
  { date: '2024-10-06', transfers: 70 },
  { date: '2024-10-07', transfers: 70 },
  { date: '2024-10-08', transfers: 70 },
  { date: '2024-10-09', transfers: 70 },
  { date: '2024-10-10', transfers: 70 },
  // Add more data for weeks, months, etc.
];

// Helper function to filter data based on range
const filterData = (data: DataType[], range: string) => {
  const now = new Date();
  const rangeStart = new Date();

  switch (range) {
    case 'weekly':
      rangeStart.setDate(now.getDate() - 7); // Past week
      break;
    case 'monthly':
      rangeStart.setMonth(now.getMonth() - 1); // Past month
      break;
    case '3months':
      rangeStart.setMonth(now.getMonth() - 3); // Past 3 months
      break;
    case '6months':
      rangeStart.setMonth(now.getMonth() - 6); // Past 6 months
      break;
    case 'max':
      return data; // Return all data
    default:
      return data; // Return all data for undefined range
  }

  // Filter data by comparing the date
  return data.filter((item) => new Date(item.date) >= rangeStart);
};

// TypeScript types for props
type RangeType = 'weekly' | 'monthly' | '3months' | '6months' | 'max';

export default function TransfertChart() {
  const [timeRange, setTimeRange] = useState<RangeType>('weekly');

  const filteredData = filterData(sampleData, timeRange);

  return (
    <div className="chart-container">
      <div className="chart-buttons">
        <button onClick={() => setTimeRange('weekly')}>Weekly</button>
        <button onClick={() => setTimeRange('monthly')}>Monthly</button>
        <button onClick={() => setTimeRange('3months')}>3 Months</button>
        <button onClick={() => setTimeRange('6months')}>6 Months</button>
        <button onClick={() => setTimeRange('max')}>Max</button>
      </div>

      <ResponsiveContainer className="responsive-container">
        <BarChart
          data={filteredData}
          className="chart"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="transfers" fill="#d5588e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

