"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Users, Zap, Award } from 'lucide-react';
import { useScoutingStore } from '@/lib/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamComparisonTable } from '@/components/TeamComparisonTable';
import { AllianceSimulator } from '@/components/AllianceSimulator';
import { AllianceRecommendations } from '@/components/AllianceRecommendations';

export default function AllianceAnalysisPage() {
  const { matchScoutingData, pitScoutingData } = useScoutingStore();
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);

  // Get unique team numbers
  const uniqueTeamNumbers = [...new Set(
    [...matchScoutingData.map(match => match.teamNumber), 
     ...pitScoutingData.map(pit => pit.teamNumber)]
  )].sort((a, b) => a - b);

  const handleTeamSelect = (teamNumber: number) => {
    if (selectedTeams.includes(teamNumber)) {
      setSelectedTeams(selectedTeams.filter(t => t !== teamNumber));
    } else if (selectedTeams.length < 4) {
      setSelectedTeams([...selectedTeams, teamNumber]);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Link href="/analysis" className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Alliance Selection & Analysis</h1>
      </div>

      <p className="text-gray-600 mb-8">
        Compare teams, simulate alliance combinations, and make data-driven decisions for picking the optimal alliance partners.
      </p>

      <Tabs defaultValue="recommendations" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations" className="flex items-center justify-center">
            <Award className="h-4 w-4 mr-2" />
            <span>Alliance Recommendations</span>
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center justify-center">
            <Users className="h-4 w-4 mr-2" />
            <span>Team Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="simulator" className="flex items-center justify-center">
            <Zap className="h-4 w-4 mr-2" />
            <span>Alliance Simulator</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <AllianceRecommendations />
        </TabsContent>

        <TabsContent value="compare">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Team Comparison</h2>
              <p className="text-gray-600 mb-6">
                Select up to 4 teams to compare their performance and capabilities side-by-side.
              </p>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Selected Teams</h3>
                {selectedTeams.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedTeams.map(teamNumber => {
                      const pitData = pitScoutingData.find(pit => pit.teamNumber === teamNumber);
                      return (
                        <div 
                          key={teamNumber}
                          className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
                        >
                          <div className="mr-2">
                            <div className="font-medium">{teamNumber}</div>
                            <div className="text-xs text-gray-500">{pitData?.teamName || `Team ${teamNumber}`}</div>
                          </div>
                          <button 
                            className="h-6 w-6 text-gray-400 hover:text-red-500"
                            onClick={() => handleTeamSelect(teamNumber)}
                          >
                            &times;
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 italic mb-4">No teams selected. Select teams below to compare.</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Available Teams</h3>
                <div className="flex flex-wrap gap-2">
                  {uniqueTeamNumbers.map(teamNumber => (
                    <button
                      key={teamNumber}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        selectedTeams.includes(teamNumber)
                          ? 'bg-blue-100 border border-blue-300 font-medium'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => handleTeamSelect(teamNumber)}
                      disabled={selectedTeams.length >= 4 && !selectedTeams.includes(teamNumber)}
                    >
                      {teamNumber}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selectedTeams.length >= 2 && (
              <TeamComparisonTable teamNumbers={selectedTeams} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="simulator">
          <AllianceSimulator />
        </TabsContent>
      </Tabs>
    </div>
  );
} 