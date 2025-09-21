import React, { useState, useEffect, useMemo } from "react";
import Grid from "./components/Grids";

const NUM_ROWS = 15;
const NUM_COLS = 20;
const ANIMATION_SPEED_MS = 150;
const WAVE_WIDTH = 4;
const BACKGROUND_COLOR = "#111";
const GRID_GAP_COLOR = "#000";

// --- HSL → RGB helper ---
const hslToRgb = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
};
// Helper component for glowing effect
const Glow = () => (
  <>
    <div className="absolute top-0 left-0 w-full h-full border-2 border-cyan-400 rounded-lg opacity-70 animate-pulse"></div>
    <div className="absolute top-0 left-0 w-full h-full border-2 border-cyan-400 rounded-lg opacity-70 blur-md"></div>
  </>
);

// Reusable Card component for each module
const Card = ({ children, className = "" }) => (
  <div
    className={`relative bg-black bg-opacity-30 border border-cyan-400/50 rounded-lg p-4 backdrop-blur-sm ${className}`}
  >
    {children}
  </div>
);

// Component for the main Power Level bar
const PowerLevel = ({ level }) => (
  <Card>
    <div className="flex justify-between items-center mb-2 text-cyan-300 text-sm font-medium">
      <span>POWER LEVEL</span>
      <span>{level}%</span>
    </div>
    <div className="w-full bg-cyan-900 rounded-full h-4 overflow-hidden">
      <div
        className="bg-gradient-to-r from-cyan-400 to-cyan-200 h-4 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${level}%` }}
      ></div>
    </div>
  </Card>
);

// Component for the Energy Flow section
const EnergyFlow = ({ flow }) => (
  <Card>
    <div className="flex items-center justify-center gap-4">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-cyan-900"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className="text-cyan-400 transition-all duration-500"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 40}
            strokeDashoffset={2 * Math.PI * 40 * (1 - flow / 100)}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-cyan-200 text-2xl font-bold">
          {flow}%
        </div>
      </div>
      <div className="flex-1">
        <span className="text-cyan-300 text-sm font-medium">ENERGY FLOW</span>
        <div className="w-full bg-cyan-900 rounded-full h-3 mt-2">
          <div
            className="bg-cyan-400 h-3 rounded-full"
            style={{ width: `${flow}%` }}
          ></div>
        </div>
      </div>
    </div>
  </Card>
);

// Component for the Direction controller
const DirectionControl = () => {
  const [rotation, setRotation] = useState(-35.7);

  const handleRotate = () => {
    setRotation((prev) => (prev + 45) % 360);
  };

  const getDirectionLabel = (angle) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round((((angle % 360) + 360) % 360) / 45) % 8;
    return `${directions[index]}:${angle.toFixed(1)}`;
  };

  return (
    <Card className="flex flex-col items-center justify-center">
      <span className="text-cyan-300 text-sm font-medium mb-2">DIRECTION</span>
      <button
        onClick={handleRotate}
        className="w-24 h-24 bg-cyan-900/50 rounded-full flex items-center justify-center border-2 border-cyan-600 hover:bg-cyan-800/50 transition-colors"
        aria-label="Change Direction"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-cyan-300 transform transition-transform duration-500 ease-in-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <path d="M12 2L12 12" />
          <path d="M12 22L18 16" />
          <path d="M12 22L6 16" />
        </svg>
      </button>
      <span className="text-cyan-200 font-mono mt-2 text-lg">
        {getDirectionLabel(rotation)}
      </span>
    </Card>
  );
};

// Component for the Color Picker
const ColorPicker = () => (
  <Card className="flex flex-col items-center justify-center">
    {/* <div className="console">
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${NUM_ROWS}, 1fr)`,
          gridTemplateColumns: `repeat(${NUM_COLS}, 1fr)`,
        }}
      >
        {gridCells}
      </div>
    </div> */}
    <Grid />
  </Card>
);

// Component for Shield Integrity and System Status
const SystemStatus = ({ shield, status, transfer }) => (
  <Card className="flex gap-6 ">
    <div className="flex-1 flex flex-col items-center  ">
      <span className="text-cyan-300 text-sm font-medium mb-2">
        SHIELD INTEGRITY
      </span>
      <div className="w-8 h-48 bg-cyan-900 rounded-full overflow-hidden relative">
        <div
          className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-cyan-400 to-cyan-200 transition-all duration-500 ease-in-out"
          style={{ height: `${shield}%` }}
        ></div>
      </div>
      <span className="text-cyan-200 text-2xl font-bold mt-2">{shield}%</span>
    </div>
    <div className="flex-1 flex flex-col pt-8">
      <span className="text-cyan-300 text-sm font-medium">SYSTEM STATUS</span>
      <div className="w-full bg-cyan-900 rounded-full h-3 mt-2">
        <div
          className="bg-cyan-400 h-3 rounded-full"
          style={{ width: `${status}%` }}
        ></div>
      </div>
      <span className="text-cyan-200 text-right mt-1">{status}%</span>

      <div className="w-full bg-cyan-900 rounded-full h-3 mt-6">
        <div
          className="bg-cyan-400 h-3 rounded-full"
          style={{ width: `${transfer}%` }}
        ></div>
      </div>
      <span className="text-cyan-200 text-right mt-1">{transfer}%</span>
      <span className="text-cyan-400 text-xs text-right -mt-1">
        DATA TRANSFER
      </span>
    </div>
  </Card>
);

// Reusable Action Button
const ActionButton = ({ children, onClick, active }) => (
  <button
    onClick={onClick}
    className={`relative font-bold text-lg text-black px-10 py-3 rounded-md overflow-hidden transition-all duration-300
                    bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700
                    focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50
                    shadow-[0_0_10px_rgba(249,115,22,0.5)] hover:shadow-[0_0_20px_rgba(249,115,22,0.8)]
                    ${active ? "ring-4 ring-orange-400" : ""}`}
  >
    <span className="relative z-10">{children}</span>
    <div className="absolute inset-0 bg-white opacity-10 "></div>
  </button>
);
const getCellColor = (col, wavePosition, baseColor, direction) => {
  let distance = -1;
  if (direction === 1) {
    if (col <= wavePosition && col > wavePosition - WAVE_WIDTH) {
      distance = wavePosition - col;
    }
  } else {
    if (col >= wavePosition && col < wavePosition + WAVE_WIDTH) {
      distance = col - wavePosition;
    }
  }
  if (distance !== -1) {
    const intensity = Math.pow(1 - distance / WAVE_WIDTH, 2);
    const r = Math.floor(baseColor[0] * intensity);
    const g = Math.floor(baseColor[1] * intensity);
    const b = Math.floor(baseColor[2] * intensity);
    return `rgb(${r}, ${g}, ${b})`;
  }
  return BACKGROUND_COLOR;
};
// Main App Component
export default function App() {
  // State for various UI elements
  const [powerLevel, setPowerLevel] = useState(75);
  const [energyFlow, setEnergyFlow] = useState(60);
  const [shieldIntegrity, setShieldIntegrity] = useState(90);
  const [systemStatus, setSystemStatus] = useState(88);
  const [dataTransfer, setDataTransfer] = useState(40);
  const [statusMessage, setStatusMessage] = useState("System Standby");
  const [activeButton, setActiveButton] = useState(null);

  // Function to get a random value for simulation
  const getRandomValue = () => Math.floor(Math.random() * 81) + 20; // 20 to 100
  const [wavePosition, setWavePosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hue, setHue] = useState(120); // Start at green (120° in HSL)
  // Animate wave + hue shift
  useEffect(() => {
    const interval = setInterval(() => {
      setWavePosition((prev) => {
        if (prev >= NUM_COLS - 1 && direction === 1) {
          setDirection(-1);
        } else if (prev <= 0 && direction === -1) {
          setDirection(1);
        }
        return prev + direction;
      });

      // Slowly shift hue (0–360 loop)
      setHue((prevHue) => (prevHue + 2) % 360);
    }, ANIMATION_SPEED_MS);

    return () => clearInterval(interval);
  }, [direction]);

  const baseColor = hslToRgb(hue, 100, 50);
  const gridCells = useMemo(() => {
    const cells = [];
    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        cells.push(
          <div
            key={`${r}-${c}`}
            className="grid-cell"
            style={{
              backgroundColor: getCellColor(
                c,
                wavePosition,
                baseColor,
                direction
              ),
            }}
          />
        );
      }
    }
    return cells;
  }, [wavePosition, baseColor, direction]);
  // Handlers for button actions
  const handleActivate = () => {
    setStatusMessage("System Activated. All channels open.");
    setActiveButton("activate");
    setPowerLevel(100);
    setEnergyFlow(95);
  };

  const handleReboot = () => {
    setStatusMessage("Rebooting systems... Please wait.");
    setActiveButton("reboot");
    // Simulate a reboot by resetting values after a delay
    setTimeout(() => {
      setPowerLevel(getRandomValue());
      setEnergyFlow(getRandomValue());
      setShieldIntegrity(getRandomValue());
      setSystemStatus(getRandomValue());
      setDataTransfer(getRandomValue());
      setStatusMessage("System Reboot Complete. Awaiting commands.");
      setActiveButton(null);
    }, 2000);
  };

  const handleEngage = () => {
    setStatusMessage("Engaging primary systems. Power routed.");
    setActiveButton("engage");
  };

  useEffect(() => {
    // A simple effect to simulate data transfer fluctuations
    const interval = setInterval(() => {
      if (activeButton !== "reboot") {
        setDataTransfer((prev) => {
          const newValue = prev + (Math.random() > 0.5 ? 2 : -2);
          if (newValue < 20) return 20;
          if (newValue > 100) return 100;
          return newValue;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeButton]);

  return (
    <>
      <style>
        {`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
                body {
                    font-family: 'Orbitron', sans-serif;
                    background-color: #0a0f1f;
                    color: #e0f2f1;
                }
                 @keyframes spin-slow {
                    to { transform: rotate(360deg); }
                 }
                 .animate-spin-slow {
                    animation: spin-slow 5s linear infinite;
                 }
                .bg-conic-gradient {
                  background-image: conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops));
                }
                `}
      </style>
      <div
        className="min-h-screen bg-gray-900 bg-cover bg-center p-4 sm:p-8 flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://placehold.co/1920x1080/0a0f1f/0a0f1f?text=.')",
        }}
      >
        <div className="w-full max-w-6xl mx-auto">
          {/* Main UI Frame */}
          <div className="relative p-8 border-2 border-cyan-400/50 rounded-lg bg-black/20 shadow-[0_0_20px_rgba(0,255,255,0.3),inset_0_0_15px_rgba(0,255,255,0.2)]">
            <Glow />

            {/* Header Section */}
            <header className="mb-6">
              <PowerLevel level={powerLevel} />
            </header>

            {/* Main Grid */}
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <EnergyFlow flow={energyFlow} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <DirectionControl />
                  <ColorPicker />
                </div>
              </div>

              <div className="lg:col-span-1">
                <SystemStatus
                  shield={shieldIntegrity}
                  status={systemStatus}
                  transfer={dataTransfer}
                />
              </div>
            </main>

            {/* Footer Actions */}
            <footer className="mt-8 pt-6 border-t-2 border-cyan-400/30 flex flex-col sm:flex-row items-center justify-center gap-6">
              <ActionButton
                onClick={handleActivate}
                active={activeButton === "activate"}
              >
                ACTIVATE
              </ActionButton>
              <ActionButton
                onClick={handleReboot}
                active={activeButton === "reboot"}
              >
                REBOOT
              </ActionButton>
              <ActionButton
                onClick={handleEngage}
                active={activeButton === "engage"}
              >
                ENGAGE
              </ActionButton>
            </footer>

            {/* Status Message Display */}
            <div className="text-center mt-6 text-cyan-300 font-mono tracking-widest h-6">
              <p>{statusMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
