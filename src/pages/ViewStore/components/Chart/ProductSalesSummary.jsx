import React, { useState } from "react";
import { useSelector } from "react-redux";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { useGetProductSalesSummaryQuery } from "../../../../redux/api/salesApi";
import styled, { keyframes } from "styled-components";

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

  if (error) return <div>Error fetching data</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div>
      <h2>{format(date, "yyyy년 MM월")} 상품별 판매 요약</h2>
      <MonthPicker
        type="month"
        value={format(date, "yyyy-MM")}
        onChange={(e) => setDate(new Date(e.target.value))}
      />

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
