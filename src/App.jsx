import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, lightTheme, darkTheme } from "./styles/theme";
import Header from "./components/Header.jsx";

// 페이지 컴포넌트 임포트
import LoginPage from "./pages/LoginPage/LoginPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";

function App() {
  const [theme, setTheme] = useState("dark");
  const currentTheme = theme === "dark" ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "dark" : "light");
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <Header />
      <main>
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
        </Routes>
      </main>
    </ThemeProvider>
  );
}

export default App;
