import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, lightTheme, darkTheme } from "./styles/theme";
import Header from "./components/Header.jsx";

import LoginPage from "./pages/LoginPage/LoginPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import MyStorePage from "./pages/MyStorePage/MyStorePage";
import CreateStorePage from "./pages/CreateStorePage/CreateStorePage";
import ViewStorePage from "./pages/ViewStore/ViewStorePAge";

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
          <Route path="/my-store" element={<MyStorePage />} />
          <Route path="/create-store" element={<CreateStorePage />} />
          <Route path="/create-store" element={<CreateStorePage />} />
          <Route path="/view-store/:id" element={<ViewStorePage />} />
        </Routes>
      </main>
    </ThemeProvider>
  );
}

export default App;
