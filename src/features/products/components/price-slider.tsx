"use client";

import { useCallback } from "react";

const SLIDER_MIN = 0;

type Props = {
  minValue: number;
  maxValue: number;
  max?: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number | null) => void;
};

export const PriceSlider = ({ minValue, maxValue, max = 200, onMinChange, onMaxChange }: Props) => {
  const SLIDER_MAX = max;
  const minPct = ((minValue - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;
  const maxPct = ((maxValue - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;

  const handleMin = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onMinChange(Math.min(Number(e.target.value), maxValue - 5));
    },
    [maxValue, onMinChange]
  );

  const handleMax = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onMaxChange(Math.max(Number(e.target.value), minValue + 5));
    },
    [minValue, onMaxChange]
  );

  return (
    <div className="flex flex-col gap-3 w-72">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-zinc-700">${minValue}</span>
        <span className="text-sm font-semibold text-zinc-700">
          {maxValue >= SLIDER_MAX ? `$${SLIDER_MAX}+` : `$${maxValue}`}
        </span>
      </div>

      <div className="relative h-5 flex items-center select-none">
        {/* background track */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-zinc-200" />
        {/* active fill */}
        <div
          className="absolute h-1.5 rounded-full bg-black"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        {/* min range input */}
        <input
          type="range"
          min={SLIDER_MIN}
          max={SLIDER_MAX}
          step={1}
          value={minValue}
          onChange={handleMin}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: minValue > SLIDER_MAX - 20 ? 5 : 3 }}
        />
        {/* max range input */}
        <input
          type="range"
          min={SLIDER_MIN}
          max={SLIDER_MAX}
          step={1}
          value={maxValue}
          onChange={handleMax}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />
        {/* visual thumb – min */}
        <div
          className="absolute w-4 h-4 rounded-full bg-white border-2 border-black shadow pointer-events-none"
          style={{ left: `calc(${minPct}% - 8px)` }}
        />
        {/* visual thumb – max */}
        <div
          className="absolute w-4 h-4 rounded-full bg-white border-2 border-black shadow pointer-events-none"
          style={{ left: `calc(${maxPct}% - 8px)` }}
        />
      </div>
    </div>
  );
};
