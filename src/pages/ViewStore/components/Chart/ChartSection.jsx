import React, { useState } from "react";
import styled from "styled-components";
import DailySalesChart from "./DailySalesChart";
import WeeklySalesChart from "./WeeklySalesChart";
import MonthlySalesChart from "./MonthlySalesChart";
import ProductSalesSummary from "./ProductSalesSummary";

const ChartContainer = styled.div`
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ddd;
`;

const TabButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  color: ${({ active, theme }) => (active ? theme.primary : "#888")};
  border-bottom: 2px solid
    ${({ active, theme }) => (active ? theme.primary : "transparent")};
`;

const ChartSection = () => {
  const [activeTab, setActiveTab] = useState("daily");

  const renderContent = () => {
    switch (activeTab) {
      case "daily":
        return <DailySalesChart />;
      case "weekly":
        return <WeeklySalesChart />;
      case "monthly":
        return <MonthlySalesChart />;
      case "products":
        return <ProductSalesSummary />;
      default:
        return null;
    }
  };

  return (
    <ChartContainer>
      <TabContainer>
        <TabButton
          active={activeTab === "daily"}
          onClick={() => setActiveTab("daily")}
        >
          일별
        </TabButton>
        <TabButton
          active={activeTab === "weekly"}
          onClick={() => setActiveTab("weekly")}
        >
          주별
        </TabButton>
        <TabButton
          active={activeTab === "monthly"}
          onClick={() => setActiveTab("monthly")}
        >
          월별
        </TabButton>
        <TabButton
          active={activeTab === "products"}
          onClick={() => setActiveTab("products")}
        >
          상품별
        </TabButton>
      </TabContainer>
      {renderContent()}
    </ChartContainer>
  );
};

export default ChartSection;
