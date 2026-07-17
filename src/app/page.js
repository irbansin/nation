"use client";

import { useState, useEffect } from "react";
import { SUPPORTED_COUNTRIES, MOCK_COUNTRY_NAMES, DEFAULT_LLM_MODEL, DEFAULT_LLM_SIZE } from "./constants";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FlagCard from "../components/FlagCard";
import FactsBubble from "../components/FactsBubble";
import PrModal from "../components/PrModal";
import ModelStatus from "../components/ModelStatus";
import ContributeButton from "../components/ContributeButton";

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
  const [factSource, setFactSource] = useState("");
  const [bubbleStyle, setBubbleStyle] = useState({});

  // Local WebGPU LLM Engine States
  const [engine, setEngine] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);

  const getMockCountryName = (code) => {
    return MOCK_COUNTRY_NAMES[code] || `Country (${code})`;
  };


  // Trigger background loading of local WebGPU model once presenter screen is active
  useEffect(() => {
    async function preinitAI() {
      if (activeState === "flag-presenter" && !engine && !isAiLoading) {
        setIsAiLoading(true);
        setAiProgress(0);
        try {
          const webllm = await import("@mlc-ai/web-llm");
          const initProgressCallback = (report) => {
            setAiProgress(Math.round(report.progress * 100));
          };
          const coreEngine = await webllm.CreateMLCEngine(DEFAULT_LLM_MODEL, { initProgressCallback });
          setEngine(coreEngine);
        } catch (error) {
          console.error("Failed to pre-load local WebGPU model:", error);
        } finally {
          setIsAiLoading(false);
        }
      }
    }
    preinitAI();
  }, [activeState, engine, isAiLoading]);

  const fetchFallbackFact = async (name) => {
    try {
      const queryName = name === "your local region" ? "India" : name;
      const factsRes = await fetch(`/api/facts?country=${encodeURIComponent(queryName)}&t=${Date.now()}`);
      if (factsRes.ok) {
        const factsData = await factsRes.json();
        if (factsData.fact) {
          setFactText(factsData.fact);
        } else {
          setFactText("Fascinating region with a rich history and culture!");
        }
        if (factsData.source) {
          setFactSource(factsData.source);
        } else {
          setFactSource("Wikipedia Fallback");
        }
      } else {
        setFactText("Unique culture and rich history waiting to be explored!");
        setFactSource("Static Fallback");
      }
    } catch (err) {
      console.error(err);
      setFactText("Unique culture and rich history waiting to be explored!");
      setFactSource("Static Fallback");
    } finally {
      setFactLoading(false);
    }
  };

  // Fetch facts dynamically when countryName or bubble status changes
  const fetchCountryFacts = async (name) => {
    if (!name || name === "Unknown Country") return;
    setFactLoading(true);
    setFactText("");
    setFactStats(null);
    setFactSource(""); const queryName = name === "your local region" ? "India" : name;

    // 1. Fetch stats in parallel from the server-side REST API
    try {
      const factsRes = await fetch(`/api/facts?country=${encodeURIComponent(queryName)}&t=${Date.now()}`);
      if (factsRes.ok) {
        const factsData = await factsRes.json();
        if (factsData.stats) {
          setFactStats(factsData.stats);
        }
      }
    } catch (statsErr) {
      console.warn("Rest Countries API stats fetch failed:", statsErr);
    }

    // 2. If local LLM engine is loaded, stream AI fact generation
    if (engine) {
      setFactSource(DEFAULT_LLM_MODEL);
      try {
        const template = process.env.NEXT_PUBLIC_LLM_PROMPT_TEMPLATE || "Share one mind-blowing historical fact about {country}! Just one line with minium 7 words and maximum 15 words.";
        const prompt = template.replace("{country}", queryName);

        const chunks = await engine.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          stream: true,
        });

        let streamedText = "";
        for await (const chunk of chunks) {
          const token = chunk.choices[0]?.delta?.content || "";
          streamedText += token;
          setFactText(streamedText);
        }
      } catch (llmErr) {
        console.error("Local LLM generation failed, falling back...", llmErr);
        await fetchFallbackFact(name);
      } finally {
        setFactLoading(false);
      }
    } else {
      // Fallback to Wikipedia summary if engine is not loaded
      await fetchFallbackFact(name);
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
      setStatusText("Welcome to Fun facts about!");
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
    // Let bubble stay visible indefinitely on animation end
  };

  const toggleFactsBubble = async () => {
    if (factLoading) return;
    if (isBubbleOpen) {
      setIsBubbleOpen(false);
    }
    await fetchCountryFacts(countryName);
    randomizeBubblePosition();
    setIsBubbleOpen(true);
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
        factSource={factSource}
        bubbleStyle={bubbleStyle}
        toggleFactsBubble={toggleFactsBubble}
        handleAnimationEnd={handleAnimationEnd}
        isAiReady={!!engine}
        isAiLoading={isAiLoading}
        aiProgress={aiProgress}
      />

      <PrModal
        isOpen={isPrModalOpen}
        onClose={() => setIsPrModalOpen(false)}
        countryCode={countryCode}
        countryName={countryName}
      />

      <ModelStatus
        isAiReady={!!engine}
        modelLabel={DEFAULT_LLM_MODEL}
      />

      <ContributeButton
        onOpenPr={() => setIsPrModalOpen(true)}
      />
    </>
  );
}
