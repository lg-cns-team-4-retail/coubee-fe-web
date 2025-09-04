import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, lightTheme, darkTheme } from "./styles/theme";
import Header from "./components/Header.jsx";

import LoginPage from "./pages/LoginPage/LoginPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import MyStorePage from "./pages/MyStorePage/MyStorePage";
import CreateStorePage from "./pages/CreateStorePage/CreateStorePage";
import ViewStorePage from "./pages/ViewStore/ViewStorePage";
import SseListener from "./components/SseClient.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast-theme.css";
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/my-store" element={<MyStorePage />} />
          <Route path="/create-store" element={<CreateStorePage />} />
          <Route path="/view-store/:id" element={<ViewStorePage />} />
        </Routes>
      </main>
    </ThemeProvider>
  );
}

export default App;
