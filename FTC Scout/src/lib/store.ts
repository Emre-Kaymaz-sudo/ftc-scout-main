import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MatchScoutingData {
  id: string;
  timestamp: string;
  matchNumber: number;
  teamNumber: number;
  allianceColor: 'red' | 'blue';
  // Autonomous
  autoStartPosition: 'observation' | 'net' | 'specimen';
  // Auto Scoring
  autoParkObservationZone: boolean;
  autoSampleCollection: number;
  autoNetZonePlacement: number;
  autoLowBasket: number;
  autoHighBasket: number;
  autoSpecimenLowChamber: number;
  autoHighChamber: number;
  // Teleop
  teleopParkObservationZone: boolean;
  teleopSampleCollection: number;
  teleopNetZonePlacement: number;
  teleopLowBasket: number;
  teleopHighBasket: number;
  teleopSpecimenLowChamber: number;
  teleopHighChamber: number;
  // Endgame/Ascent
  endgameAscentLevel: 'none' | 'level1' | 'level2' | 'level3';
  // Match Result
  matchResult: 'win' | 'tie' | 'loss';
  // Robot Performance
  robotSpeed: number;
  robotReliability: number;
  robotManeuverability: number;
  notes?: string;
}

export interface PitScoutingData {
  id: string;
  timestamp: string;
  teamNumber: number;
  teamName: string;
  // Robot specs
  drivetrainType: 'tank' | 'mecanum' | 'swerve' | 'other';
  drivetrainNotes?: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  // Game abilities
  canCollectSamples: boolean;
  canPlaceInNetZone: boolean;
  canScoreLowBasket: boolean;
  canScoreHighBasket: boolean;
  canPlaceInLowChamber: boolean;
  canPlaceInHighChamber: boolean;
  maxAscentLevel: 'none' | 'level1' | 'level2' | 'level3';
  // Autonomous capabilities
  autoStartPositions: Array<'observation' | 'net' | 'specimen'>;
  autoSampleCollection: boolean;
  autoScoring: boolean;
  autoAscent: boolean;
  // Strategy
  robotSpeed: number;
  robotReliability: number;
  robotManeuverability: number;
  preferredRole: 'sampler' | 'scorer' | 'hybrid';
  preferredZone: 'observation' | 'net' | 'specimen' | 'mixed';
  strategyNotes?: string;
  notes?: string;
}

interface ScoutingStore {
  matchScoutingData: MatchScoutingData[];
  pitScoutingData: PitScoutingData[];
  addMatchScoutingData: (data: Omit<MatchScoutingData, 'id' | 'timestamp'>) => void;
  addPitScoutingData: (data: Omit<PitScoutingData, 'id' | 'timestamp'>) => void;
  clearMatchScoutingData: () => void;
  clearPitScoutingData: () => void;
}

export const useScoutingStore = create<ScoutingStore>()(
  persist(
    (set) => ({
      matchScoutingData: [],
      pitScoutingData: [],
      addMatchScoutingData: (data) => {
        try {
          const newData = {
            ...data,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          };
          set((state) => ({
            matchScoutingData: [...state.matchScoutingData, newData],
          }));
        } catch (error) {
          console.error('Failed to add match scouting data:', error);
          throw error;
        }
      },
      addPitScoutingData: (data) => {
        try {
          const newData = {
            ...data,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          };
          set((state) => ({
            pitScoutingData: [...state.pitScoutingData, newData],
          }));
        } catch (error) {
          console.error('Failed to add pit scouting data:', error);
          throw error;
        }
      },
      clearMatchScoutingData: () => {
        try {
          set({ matchScoutingData: [] });
        } catch (error) {
          console.error('Failed to clear match scouting data:', error);
          throw error;
        }
      },
      clearPitScoutingData: () => {
        try {
          set({ pitScoutingData: [] });
        } catch (error) {
          console.error('Failed to clear pit scouting data:', error);
          throw error;
        }
      },
    }),
    {
      name: 'ftc-scout-storage',
    }
  )
); 