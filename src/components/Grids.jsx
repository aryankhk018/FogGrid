import React, { useState, useEffect, useMemo } from "react";
import "../App.css";

const NUM_ROWS = 10;
const NUM_COLS = 10;
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

// --- Get color for each cell ---
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

const Grid = () => {
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

  return (
    <div className="app">
      <div className="console">
        <div
          className="grid"
          style={{
            gridTemplateRows: `repeat(${NUM_ROWS}, 1fr)`,
            gridTemplateColumns: `repeat(${NUM_COLS}, 1fr)`,
          }}
        >
          {gridCells}
        </div>
      </div>

      {/* <div className="status">
        <p>
          Direction: <span>{direction === 1 ? "Right →" : "← Left"}</span>
        </p>
        <p>
          Color:{" "}
          <span
            style={{
              backgroundColor: `rgb(${baseColor
                .map((x) => Math.floor(x))
                .join(",")})`,
              color: "#000",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            {`rgb(${baseColor.map((x) => Math.floor(x)).join(",")})`}
          </span>
        </p>
        <p>FPS: {1000 / ANIMATION_SPEED_MS}</p>
      </div> */}
    </div>
  );
};

export default Grid;
