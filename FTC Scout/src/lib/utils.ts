import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MatchScoutingData } from "./store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateScore(match: MatchScoutingData) {
  // Auto phase scoring
  const autoScore = 
    (match.autoParkObservationZone ? 3 : 0) + 
    match.autoNetZonePlacement * 2 +
    match.autoLowBasket * 4 + 
    match.autoHighBasket * 8 +
    match.autoSpecimenLowChamber * 6 + 
    match.autoHighChamber * 10;
  
  // Teleop phase scoring
  const teleopScore = 
    (match.teleopParkObservationZone ? 3 : 0) + 
    match.teleopNetZonePlacement * 2 +
    match.teleopLowBasket * 4 + 
    match.teleopHighBasket * 8 +
    match.teleopSpecimenLowChamber * 6 + 
    match.teleopHighChamber * 10;
  
  // Endgame scoring
  let endgameScore = 0;
  switch(match.endgameAscentLevel) {
    case "level1": endgameScore = 3; break;
    case "level2": endgameScore = 15; break;
    case "level3": endgameScore = 30; break;
    default: endgameScore = 0;
  }
  
  // Match result bonus (tracked separately but not added to total)
  let matchBonus = 0;
  switch(match.matchResult) {
    case "win": matchBonus = 2; break;
    case "tie": matchBonus = 1; break;
    default: matchBonus = 0;
  }
  
  // Double the autonomous score for total calculation
  const doubledAutoScore = autoScore * 2;
  
  return {
    auto: autoScore,
    teleop: teleopScore,
    endgame: endgameScore,
    bonus: matchBonus,
    // Total includes doubled autonomous score
    total: doubledAutoScore + teleopScore + endgameScore
  };
}

// Helper to memoize expensive calculations using the same calculation function on the same data
export function memoize<T, R>(fn: (arg: T) => R): (arg: T) => R {
  const cache = new Map<string, R>();
  
  return (arg: T) => {
    const key = JSON.stringify(arg);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(arg);
    cache.set(key, result);
    return result;
  };
}

// Memoized version of calculateScore for performance
export const memoizedCalculateScore = memoize(calculateScore); 