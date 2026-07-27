import { useMemo } from "react";

/**
 * Computes the stroke-dashoffset needed to render a circular
 * progress gauge for a given score (0-100) and circle radius.
 */
export function useSafetyGauge(score: number, radius = 54) {
  return useMemo(() => {
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    return { circumference, offset };
  }, [score, radius]);
}
