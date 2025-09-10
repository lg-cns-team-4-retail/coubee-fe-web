import React, { useState } from "react";
import { useSelector } from "react-redux";
import { format, startOfWeek } from "date-fns";
import { useGetWeeklySalesQuery } from "../../../../redux/api/salesApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styled from "styled-components";
import ChartSkeleton from "./ChartSkeleton";
import Text from "../../../../components/common/Text";
const DatePicker = styled.input`
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

const dayMap = {
  MONDAY: "월요일",
  TUESDAY: "화요일",
  WEDNESDAY: "수요일",
  THURSDAY: "목요일",
  FRIDAY: "금요일",
  SATURDAY: "토요일",
  SUNDAY: "일요일",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dayLabel = dayMap[label] || label;
    return (
      <TooltipWrapper>
        <TooltipLabel>{`${dayLabel} 매출`}</TooltipLabel>
        <TooltipValue>
          {`${payload[0].name}: ${payload[0].value.toLocaleString()}원`}
        </TooltipValue>
      </TooltipWrapper>
    );
  }
  return null;
};

const WeeklySalesChart = () => {
  const [date, setDate] = useState(new Date());
  const { storeId } = useSelector((state) => state.viewStore.storeData);

  const weekStartDate = format(
    startOfWeek(date, { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );

  const { data, error, isLoading } = useGetWeeklySalesQuery(
    { storeId, weekStartDate },
    { skip: !storeId }
  );

  if (isLoading) return <ChartSkeleton />;
  if (error) return <div>일시적인 오류에요</div>;
  if (!data) return <div>가능한 데이터가 없어요</div>;

  const { overallSummary, dailyBreakdown } = data;

  return (
    <div>
      <Text
        as="h2"
        variant="h3"
        weight="bold"
        style={{ marginBottom: "0.5rem" }}
      >
        {data.weekStartDate} ~ {data.weekEndDate} 매출
      </Text>
      <DatePicker
        type="date"
        value={format(date, "yyyy-MM-dd")}
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
          총 매출: {overallSummary.totalSalesAmount.toLocaleString()}원
        </Text>
        <Text as="p" variant="body" color="text_secondary">
          총 주문 수: {overallSummary.totalOrderCount}건
        </Text>
      </div>

      <Text
        as="h2"
        variant="h3"
        weight="bold"
        style={{ marginBottom: "0.5rem" }}
      >
        요일별 매출
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dailyBreakdown}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dayOfWeek"
            tickFormatter={(value) => dayMap[value] || value}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="salesAmount" name="매출" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklySalesChart;
