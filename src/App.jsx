import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, lightTheme, darkTheme } from "./styles/theme";
import Header from "./components/Header.jsx";

import LoginPage from "./pages/LoginPage/LoginPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import MyStorePage from "./pages/MyStorePage/MyStorePage";
import CreateStorePage from "./pages/CreateStorePage/CreateStorePage";
import ViewStorePage from "./pages/ViewStore/ViewStorePAge";

const KAKAO_MAP_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

function App() {
  const [theme, setTheme] = useState("dark");
  const currentTheme = theme === "dark" ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "dark" : "light");
  };

  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("Kakao Map loaded");
        setMapLoaded(true);
      });
    };

    return () => {
      const existingScript = document.querySelector(
        `script[src*="${KAKAO_MAP_API_KEY}"]`
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

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
          <Route
            path="/view-store/:id"
            element={<ViewStorePage mapReady={mapLoaded} />}
          />
        </Routes>
      </main>
    </ThemeProvider>
  );
}

export default App;
