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
  AreaChart,
  Area,
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
  margin: 1rem 0;
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
  if (error) return <div>일시적인 오류에요</div>;
  if (!data) return <div>가능한 데이터가 없어요</div>;

  const { overallSummary, hourlyBreakdown } = data;

  return (
    <div>
      <Text
        as="h2"
        variant="h3"
        weight="bold"
        style={{ marginBottom: "0.5rem" }}
      >
        {formattedDate} 매출
      </Text>
      <DatePicker
        type="date"
        value={formattedDate}
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
        시간대별 매출
      </Text>
      <ResponsiveContainer width="100%" height={500}>
        <AreaChart
          data={hourlyBreakdown}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis
            domain={[0, (dataMax) => Math.ceil((dataMax * 1.2) / 1000) * 1000]}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="salesAmount"
            name="매출"
            stroke="#6495ED"
            strokeWidth={3}
            fill="#6495ED"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailySalesChart;
