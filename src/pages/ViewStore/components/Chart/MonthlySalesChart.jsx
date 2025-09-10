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
  BarChart,
  Bar,
} from "recharts";
import styled from "styled-components";
import ChartSkeleton from "./ChartSkeleton";
import Text from "../../../../components/common/Text";

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
  if (error) return <div>일시적인 오류에요</div>;
  if (!data) return <div>가능한 데이터가 없어요</div>;

  const { overallSummary, weeklyBreakdown } = data;

  return (
    <div>
      <Text
        as="h2"
        variant="h3"
        weight="bold"
        style={{ marginBottom: "0.5rem" }}
      >
        {year}년 {month}월 매출
      </Text>
      <MonthPicker
        type="month"
        value={format(date, "yyyy-MM")}
        onChange={(e) => setDate(new Date(e.target.value))}
      />
      <div style={{ marginBottom: "1rem" }}>
        <Text
          as="h2"
          variant="h3"
          weight="bold"
          style={{ marginBottom: "0.5rem" }}
        >
          요약
        </Text>
        <Text as="p" variant="body" color="text_secondary">
          총 매출:{" "}
          <Text as="span" weight="bold" color="text">
            {overallSummary.totalSalesAmount.toLocaleString()}원
          </Text>
        </Text>
        <Text as="p" variant="body" color="text_secondary">
          총 주문 수:{" "}
          <Text as="span" weight="bold" color="text">
            {overallSummary.totalOrderCount}건
          </Text>
        </Text>
      </div>

      <Text
        as="h2"
        variant="h3"
        weight="bold"
        style={{ marginBottom: "0.5rem" }}
      >
        주별 매출
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        {/* AreaChart -> BarChart */}
        <BarChart data={weeklyBreakdown}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="weekNumber"
            tickFormatter={(value) => `${value}주차`}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {/* Area -> Bar, stroke와 fill을 fill 하나로 통일합니다. */}
          <Bar dataKey="salesAmount" name="매출" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySalesChart;
