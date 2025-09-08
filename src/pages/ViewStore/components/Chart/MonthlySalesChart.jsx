import React, { useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { useGetMonthlySalesQuery } from "../../../../redux/api/salesApi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styled from "styled-components";
import ChartSkeleton from "./ChartSkeleton";

const MonthPicker = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  width: auto;
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
        <TooltipLabel>{`${label}주차 매출`}</TooltipLabel>
        <TooltipValue>
          {`${payload[0].name}: ${payload[0].value.toLocaleString()}원`}
        </TooltipValue>
      </TooltipWrapper>
    );
  }
  return null;
};

const MonthlySalesChart = () => {
  const [date, setDate] = useState(new Date());
  const { storeId } = useSelector((state) => state.viewStore.storeData);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const { data, error, isLoading } = useGetMonthlySalesQuery(
    { storeId, year, month },
    { skip: !storeId }
  );
  if (isLoading) return <ChartSkeleton />;
  if (error) return <div>Error fetching data</div>;
  if (!data) return <div>No data available</div>;

  const { overallSummary, weeklyBreakdown } = data;

  return (
    <div>
      <h2>
        {year}년 {month}월 매출
      </h2>
      <MonthPicker
        type="month"
        value={format(date, "yyyy-MM")}
        onChange={(e) => setDate(new Date(e.target.value))}
      />
      <div>
        <h3>요약</h3>
        <p>총 매출: {overallSummary.totalSalesAmount.toLocaleString()}원</p>
        <p>총 주문 수: {overallSummary.totalOrderCount}건</p>
      </div>

      <h3>주별 매출</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={weeklyBreakdown}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="weekNumber"
            tickFormatter={(value) => `${value}주차`}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="salesAmount"
            name="매출"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySalesChart;
