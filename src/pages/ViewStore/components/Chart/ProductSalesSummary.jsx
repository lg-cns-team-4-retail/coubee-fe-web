import React, { useState } from "react";
import { useSelector } from "react-redux";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { useGetProductSalesSummaryQuery } from "../../../../redux/api/salesApi";
import styled, { keyframes } from "styled-components";
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
import Text from "../../../../components/common/Text";

const loadingAnimation = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const SkeletonBlock = styled.div`
  height: ${(props) => props.height || "2.5em"};
  width: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${loadingAnimation} 1.5s infinite;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    background: #fff;
  }

  th {
    background-color: #f2f2f2;
  }
`;

const MonthPicker = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  width: auto;
`;

const TableSkeleton = () => (
  <Table>
    <thead>
      <tr>
        <th>
          <SkeletonBlock height="1em" />
        </th>
        <th>
          <SkeletonBlock height="1em" />
        </th>
        <th>
          <SkeletonBlock height="1em" />
        </th>
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index}>
          <td>
            <SkeletonBlock />
          </td>
          <td>
            <SkeletonBlock />
          </td>
          <td>
            <SkeletonBlock />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const ProductSalesSummary = () => {
  const [date, setDate] = useState(new Date());
  const { storeId } = useSelector((state) => state.viewStore.storeData);

  const startDate = format(startOfMonth(date), "yyyy-MM-dd");
  const endDate = format(endOfMonth(date), "yyyy-MM-dd");

  const { data, error, isLoading } = useGetProductSalesSummaryQuery(
    { storeId, startDate, endDate },
    { skip: !storeId }
  );

  if (isLoading)
    return (
      <div>
        <h2>상품별 판매 요약</h2>
        <MonthPicker type="month" value={format(date, "yyyy-MM")} disabled />
        <TableSkeleton />
      </div>
    );

  if (error) return <div>일시적인 오류에요</div>;
  if (!data) return <div>가능한 데이터가 없어요</div>;

  return (
    <div>
      <Text
        as="h2"
        variant="h3"
        weight="bold"
        style={{ marginBottom: "0.5rem" }}
      >
        {format(date, "yyyy년 MM월")} 상품별 판매 요약
      </Text>
      <MonthPicker
        type="month"
        value={format(date, "yyyy-MM")}
        onChange={(e) => setDate(new Date(e.target.value))}
      />

      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="productName" />

          <YAxis
            yAxisId="left"
            tickFormatter={(value) => value.toLocaleString()}
            orientation="left"
            stroke="#000"
          />

          <YAxis yAxisId="right" orientation="right" stroke="#000" />

          <Tooltip
            formatter={(value, name) => {
              if (name === "총 매출") {
                return `${value.toLocaleString()}원`;
              }
              if (name === "총 판매 수량") {
                return `${value.toLocaleString()}개`;
              }
              return value;
            }}
          />
          <Legend />

          <Bar
            yAxisId="left"
            dataKey="totalSalesAmount"
            name="총 매출"
            fill="#82ca9d"
          />

          <Bar
            yAxisId="right"
            dataKey="totalQuantitySold"
            name="총 판매 수량"
            fill="#6495ED"
          />
        </BarChart>
      </ResponsiveContainer>

      <Table>
        <thead>
          <tr>
            <th>상품명</th>
            <th>총 판매 수량</th>
            <th>총 매출</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.productId}>
              <td>{item.productName}</td>
              <td>{item.totalQuantitySold}</td>
              <td>{item.totalSalesAmount.toLocaleString()}원</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductSalesSummary;
