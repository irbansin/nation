"use client";

import { useState, useEffect } from "react";
import { SUPPORTED_COUNTRIES, LOCAL_TEMPLATES, MOCK_COUNTRY_NAMES } from "./constants";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FlagCard from "../components/FlagCard";
import FactsBubble from "../components/FactsBubble";
import PrModal from "../components/PrModal";

export default function Home() {
  const [statusText, setStatusText] = useState("Detecting your location...");
  const [ipAddress, setIpAddress] = useState("Checking...");
  const [activeState, setActiveState] = useState("loading"); // loading, flag-presenter, fallback
  const [countryCode, setCountryCode] = useState("UNKNOWN");
  const [countryName, setCountryName] = useState("Unknown Country");
  const [flagHtml, setFlagHtml] = useState("");
  const [isPrModalOpen, setIsPrModalOpen] = useState(false);
  const [manualSelection, setManualSelection] = useState("AUTO");

  // Facts Bubble State
  const [isBubbleOpen, setIsBubbleOpen] = useState(false);
  const [factLoading, setFactLoading] = useState(false);
  const [factText, setFactText] = useState("");
  const [factStats, setFactStats] = useState(null);
  const [bubbleStyle, setBubbleStyle] = useState({});

  const getMockCountryName = (code) => {
    return MOCK_COUNTRY_NAMES[code] || `Country (${code})`;
  };

  // Star generation for USA flag
  useEffect(() => {
    if (activeState === "flag-presenter" && countryCode === "US") {
      const canton = document.getElementById("usa-canton");
      if (canton) {
        canton.innerHTML = "";
        for (let r = 0; r < 9; r++) {
          const isEvenRow = r % 2 === 0;
          const starCount = isEvenRow ? 6 : 5;
          const rowDiv = document.createElement("div");
          rowDiv.className = "star-row" + (isEvenRow ? '' : ' five-stars');

          for (let s = 0; s < starCount; s++) {
            rowDiv.innerHTML += `
              <svg class="star-svg" viewBox="0 0 24 24">
                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z"/>
              </svg>
            `;
          }
          canton.appendChild(rowDiv);
        }
      }
    }
  }, [flagHtml, activeState, countryCode]);

  // Fetch facts dynamically when countryName or bubble status changes
  const fetchCountryFacts = async (name) => {
    if (!name || name === "Unknown Country") return;
    setFactLoading(true);
    setFactText("");
    setFactStats(null);

    try {
      const queryName = name === "your local region" ? "India" : name;
      // Add a timestamp cache-buster to ensure we run a fresh search on each click
      const factsRes = await fetch(`/api/facts?country=${encodeURIComponent(queryName)}&t=${Date.now()}`);
      if (factsRes.ok) {
        const factsData = await factsRes.json();
        if (factsData.fact) {
          setFactText(factsData.fact);
        } else {
          setFactText("Failed to retrieve a new fact. Please click again to query the web!");
        }
        if (factsData.stats) {
          setFactStats(factsData.stats);
        }
      } else {
        setFactText("No facts could be found for this location. Click again to query the web.");
      }
    } catch (apiErr) {
      console.warn("Dynamic facts API failed", apiErr);
      setFactText("Failed to query the web. Click again to retry.");
    } finally {
      setFactLoading(false);
    }
  };

  useEffect(() => {
    if (isBubbleOpen && activeState === "flag-presenter") {
      fetchCountryFacts(countryName);
    }
  }, [countryName, activeState]);

  const loadFlagTemplate = async (code) => {
    try {
      const response = await fetch(`/flags/${code.toUpperCase()}.html`);
      if (!response.ok) throw new Error("Template not found");
      const html = await response.text();
      setFlagHtml(html);
      return true;
    } catch (e) {
      console.warn("Could not fetch flag template dynamically.", e);
      return false;
    }
  };

  const handleCountryDetected = async (code, name, ip) => {
    setIpAddress(ip);
    setCountryCode(code);
    setCountryName(name);

    if (SUPPORTED_COUNTRIES.includes(code)) {
      setStatusText("Welcome to Flag Explorer!");
      const success = await loadFlagTemplate(code);
      if (success) {
        setActiveState("flag-presenter");
      } else {
        handleFallback(name, code, ip);
      }
    } else {
      handleFallback(name, code, ip);
    }
  };

  const handleFallback = (name, code, ip) => {
    setStatusText("Flag not supported yet");
    setCountryName(name);
    setCountryCode(code);
    setIpAddress(ip);
    setActiveState("fallback");
    setIsBubbleOpen(false); // Close facts bubble on unsupported countries
  };

  const initDetection = async () => {
    setActiveState("loading");
    setStatusText("Detecting your location...");

    const urlParams = new URLSearchParams(window.location.search);
    const mockCountry = urlParams.get("country");

    if (mockCountry) {
      const code = mockCountry.toUpperCase();
      setTimeout(() => {
        handleCountryDetected(code, getMockCountryName(code), "127.0.0.1 (Mocked)");
      }, 1200);
      return;
    }

    try {
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) throw new Error("Primary API failed");
      const data = await response.json();
      const code = data.country_code ? data.country_code.toUpperCase() : "UNKNOWN";
      const name = data.country_name || "your local region";
      const ip = data.ip || "Unknown IP";
      handleCountryDetected(code, name, ip);
    } catch (error) {
      console.warn("Primary API failed, trying backup API...", error);
      try {
        const response = await fetch("https://ip-api.com/json/");
        if (!response.ok) throw new Error("Backup API failed");
        const data = await response.json();
        const code = data.countryCode ? data.countryCode.toUpperCase() : "UNKNOWN";
        const name = data.country || "your local region";
        const ip = data.query || "Unknown IP";
        handleCountryDetected(code, name, ip);
      } catch (backupError) {
        console.error("All geolocation APIs failed", backupError);
        handleFallback("an undetected country", "UNKNOWN", "Unavailable");
      }
    }
  };

  // Initial load
  useEffect(() => {
    initDetection();
  }, []);

  const handleManualSelection = (code) => {
    setManualSelection(code);
    setActiveState("loading");
    setTimeout(async () => {
      if (code === "AUTO") {
        initDetection();
      } else {
        setStatusText(`Viewing ${getMockCountryName(code)} Flag`);
        handleCountryDetected(code, getMockCountryName(code), "Local Override");
      }
    }, 400);
  };

  const randomizeBubblePosition = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const cardSize = 380;
      const maxLeft = Math.max(20, width - cardSize - 20);
      const randomLeft = Math.random() * maxLeft;
      // Start bubble in the middle-to-lower portion of the screen (e.g. between 40% and 75% height)
      // to give it plenty of room to float upwards on screen without going too high initially
      const minTopVal = height * 0.4;
      const maxTopVal = height * 0.75 - 50;
      const randomTop = minTopVal + Math.random() * (maxTopVal - minTopVal);
      
      setBubbleStyle({
        position: 'fixed',
        left: `${Math.max(10, randomLeft)}px`,
        top: `${Math.max(100, randomTop)}px`,
        bottom: 'auto',
        right: 'auto',
      });
    }
  };

  const handleAnimationEnd = (e) => {
    if (e.animationName === "bubble-float-up") {
      setIsBubbleOpen(false);
    }
  };

  const toggleFactsBubble = () => {
    randomizeBubblePosition();
    setIsBubbleOpen(true);
    fetchCountryFacts(countryName);
  };

  return (
    <>
      {/* Background decoration */}
      <div className="bg-gradient"></div>
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <main className="app-container">
        <Header
          statusText={statusText}
          manualSelection={manualSelection}
          onManualSelection={handleManualSelection}
        />

        <FlagCard
          activeState={activeState}
          flagHtml={flagHtml}
          countryName={countryName}
          countryCode={countryCode}
          onOpenPr={() => setIsPrModalOpen(true)}
        />

        <Footer ipAddress={ipAddress} />
      </main>

      <FactsBubble
        activeState={activeState}
        countryName={countryName}
        isBubbleOpen={isBubbleOpen}
        setIsBubbleOpen={setIsBubbleOpen}
        factLoading={factLoading}
        factText={factText}
        factStats={factStats}
        bubbleStyle={bubbleStyle}
        toggleFactsBubble={toggleFactsBubble}
        handleAnimationEnd={handleAnimationEnd}
      />

      <PrModal
        isOpen={isPrModalOpen}
        onClose={() => setIsPrModalOpen(false)}
        countryCode={countryCode}
        countryName={countryName}
      />
    </>
  );
}
