import { useEffect, useState } from 'react';
import { DailyTransferType, useGetDailyTransfers } from '../../hooks/useGetDailyTransfers';
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

// Sample data (could be replaced by API fetched data)
const sampleData = [
  { date: '2024-08-01', value: "1000000000000000000000110000000000000000001100000000000000000022000000000000000000220000000000000000007100000000000000000080000000000000000000037000000000000000000100000000000000000001000000000000000000010000000000000000000130000000000000000001000000000000000000100000000000000000555500000000000000000055550000000000000000001000000000000000000001000000000000000000000000500000000000000000000000" },
  { date: '2024-08-08', value: "1000000000000000000000110000000000000000001100000000000000000022000000000000000000220000000000000000007100000000000000000080000000000000000000037000000000000000000100000000000000000001000000000000000000010000000000000000000130000000000000000001000000000000000000100000000000000000555500000000000000000055550000000000000000001000000000000000000001000000000000000000000000500000000000000000000000" },
  { date: '2024-08-15', value: "1000000000000000000000110000000000000000001100000000000000000022000000000000000000220000000000000000007100000000000000000080000000000000000000037000000000000000000100000000000000000001000000000000000000010000000000000000000130000000000000000001000000000000000000100000000000000000555500000000000000000055550000000000000000001000000000000000000001000000000000000000000000500000000000000000000000" },
  { date: '2024-08-22', value: "1000000000000000000000110000000000000000001100000000000000000022000000000000000000220000000000000000007100000000000000000080000000000000000000037000000000000000000100000000000000000001000000000000000000010000000000000000000130000000000000000001000000000000000000100000000000000000555500000000000000000055550000000000000000001000000000000000000001000000000000000000000000500000000000000000000000" },
  { date: '2024-08-29', value: "1000000000000000000000110000000000000000001100000000000000000022000000000000000000220000000000000000007100000000000000000080000000000000000000037000000000000000000100000000000000000001000000000000000000010000000000000000000130000000000000000001000000000000000000100000000000000000555500000000000000000055550000000000000000001000000000000000000001000000000000000000000000500000000000000000000000" },
  { date: '2024-09-05', value: "310000000000000000000000007500000000000000000000000150000000000000000000000" },
  { date: '2024-09-12', value: "310000000000000000000000007500000000000000000000000150000000000000000000000" },
  { date: '2024-09-19', value: "310000000000000000000000007500000000000000000000000150000000000000000000000" },
  { date: '2024-09-26', value: "310000000000000000000000007500000000000000000000000150000000000000000000000" },
];

// Helper function to filter data based on range
const filterData = (data: DailyTransferType[], range: string) => {
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
  const { data: dailyData } = useGetDailyTransfers();
  // const dailyData = sampleData;
  const [filteredData, setFilteredData] = useState<DailyTransferType[]>([]);


  useEffect(() => {
    if (dailyData) {
      console.log("dailyData", dailyData);
      setFilteredData(filterData(dailyData, timeRange));
    }
  }, [dailyData, timeRange]);


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
          <Bar dataKey="value" fill="#d5588e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

