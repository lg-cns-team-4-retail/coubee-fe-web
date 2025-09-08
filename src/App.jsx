import React, { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, lightTheme, darkTheme } from "./styles/theme";
import { useSelector } from "react-redux";
import Header from "./components/Header.jsx";

import LoginPage from "./pages/LoginPage/LoginPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import MyStorePage from "./pages/MyStorePage/MyStorePage";
import CreateStorePage from "./pages/CreateStorePage/CreateStorePage";
import OrderDetailPage from "./pages/OrderDetailPage/OrderDetailPage";
import LandingPage from "./pages/LandingPage/LandingPage";
//view store page & components
import ViewStorePage from "./pages/ViewStore/ViewStorePage";
import InformationSection from "./pages/ViewStore/components/InformationSection.jsx";
import ItemSection from "./pages/ViewStore/components/ItemSection.jsx";
import OrderSection from "./pages/ViewStore/components/Order/OrderSection";
import ChartSection from "./pages/ViewStore/components/Chart/ChartSection.jsx";

import SseListener from "./components/SseClient.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast-theme.css";

const PrivateRoute = () => {
  const { isLoggedIn } = useSelector((state) => state.user);
  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

const PublicRoute = () => {
  const { isLoggedIn } = useSelector((state) => state.user);
  return isLoggedIn ? <Navigate to="/my-store" /> : <Outlet />;
};

function App() {
  const [theme, setTheme] = useState("light");
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <SseListener />
      <ToastContainer
        position="top-right" // 위치
        autoClose={3000} // 3초 후 자동 닫힘
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Header />
      <main>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/my-store" element={<MyStorePage />} />
            <Route path="/create-store" element={<CreateStorePage />} />
            <Route path="/view-store/:id" element={<ViewStorePage />}>
              <Route index element={<Navigate to="product" replace />} />
              <Route path="product" element={<ItemSection />} />
              <Route path="info" element={<InformationSection />} />
              <Route path="chart" element={<ChartSection />} />
              <Route path="orders" element={<Outlet />}>
                <Route index element={<OrderSection />} />
                <Route path=":orderId" element={<OrderDetailPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </main>
    </ThemeProvider>
  );
}

export default App;
