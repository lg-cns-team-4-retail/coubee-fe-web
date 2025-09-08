import React, { useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { useGetDailySalesQuery } from "../../../../redux/api/salesApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styled from "styled-components";
import ChartSkeleton from "./ChartSkeleton";

const DatePicker = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  width: auto; /* 너비를 자동으로 조정 */
`;

const TooltipWrapper = styled.div`
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const TooltipLabel = styled.p`
  margin: 0 0 0.5rem 0;
  font-weight: bold;
  color: #333;
`;

const TooltipValue = styled.p`
  margin: 0;
  color: #666;
`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <TooltipWrapper>
        <TooltipLabel>{`${label}시 매출`}</TooltipLabel>
        <TooltipValue>
          {`${payload[0].name}: ${payload[0].value.toLocaleString()}원`}
        </TooltipValue>
      </TooltipWrapper>
    );
  }
  return null;
};

const DailySalesChart = () => {
  const [date, setDate] = useState(new Date());
  const { storeId } = useSelector((state) => state.viewStore.storeData);
  const formattedDate = format(date, "yyyy-MM-dd");

  const { data, error, isLoading } = useGetDailySalesQuery(
    { storeId, date: formattedDate },
    { skip: !storeId }
  );

  if (isLoading) return <ChartSkeleton />;
  if (error) return <div>Error fetching data</div>;
  if (!data) return <div>No data available</div>;

  const { overallSummary, hourlyBreakdown } = data;

  return (
    <div>
      <h2>{formattedDate} 매출</h2>
      <DatePicker
        type="date"
        value={formattedDate}
        onChange={(e) => setDate(new Date(e.target.value))}
      />
      <div>
        <h3>요약</h3>
        <p>총 매출: {overallSummary.totalSalesAmount.toLocaleString()}원</p>
        <p>총 주문 수: {overallSummary.totalOrderCount}건</p>
      </div>

      <h3>시간대별 매출</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={hourlyBreakdown}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="salesAmount"
            name="매출"
            stroke="#8884d8"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailySalesChart;
