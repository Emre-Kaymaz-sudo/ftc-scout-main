"use client"

import { useState } from 'react';
import { useScoutingStore } from '@/lib/store';
import { memoizedCalculateScore } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Cpu, ArrowRight, BarChart, Users } from 'lucide-react';

export function AllianceSimulator() {
  const { matchScoutingData, pitScoutingData } = useScoutingStore();
  const [allianceTeams, setAllianceTeams] = useState<number[]>([]);
  const [currentTeam, setCurrentTeam] = useState<string>('');
  const [showSimulation, setShowSimulation] = useState(false);

  // Get unique team numbers
  const uniqueTeamNumbers = [...new Set(
    [...matchScoutingData.map(match => match.teamNumber), 
     ...pitScoutingData.map(pit => pit.teamNumber)]
  )].sort((a, b) => a - b);

  // Add a team to the alliance
  const addTeam = () => {
    const teamNumber = parseInt(currentTeam);
    if (!isNaN(teamNumber) && !allianceTeams.includes(teamNumber) && uniqueTeamNumbers.includes(teamNumber)) {
      setAllianceTeams([...allianceTeams, teamNumber]);
      setCurrentTeam('');
    }
  };

  // Remove a team from the alliance
  const removeTeam = (teamNumber: number) => {
    setAllianceTeams(allianceTeams.filter(t => t !== teamNumber));
  };

  // Run the alliance simulation
  const runSimulation = () => {
    setShowSimulation(true);
  };

  // Calculate alliance metrics
  const calculateAllianceMetrics = () => {
    if (allianceTeams.length === 0) return null;

    // Get all matches for alliance teams
    const allTeamMatches = allianceTeams.flatMap(teamNumber => 
      matchScoutingData.filter(match => match.teamNumber === teamNumber)
    );

    // Calculate average scores
    const teamAverages = allianceTeams.map(teamNumber => {
      const teamMatches = matchScoutingData.filter(match => match.teamNumber === teamNumber);
      if (teamMatches.length === 0) return { auto: 0, teleop: 0, endgame: 0, total: 0 };
      
      const scores = teamMatches.map(match => memoizedCalculateScore(match));
      return {
        auto: Math.round(scores.reduce((sum, score) => sum + score.auto, 0) / scores.length),
        teleop: Math.round(scores.reduce((sum, score) => sum + score.teleop, 0) / scores.length),
        endgame: Math.round(scores.reduce((sum, score) => sum + score.endgame, 0) / scores.length),
        total: Math.round(scores.reduce((sum, score) => sum + score.total, 0) / scores.length)
      };
    });

    // Calculate total alliance score potential
    const allianceScore = {
      auto: teamAverages.reduce((sum, team) => sum + team.auto, 0),
      teleop: teamAverages.reduce((sum, team) => sum + team.teleop, 0),
      endgame: teamAverages.reduce((sum, team) => sum + team.endgame, 0),
      total: teamAverages.reduce((sum, team) => sum + team.total, 0)
    };

    // Get top performance metrics
    const topSpeed = Math.max(...allianceTeams.map(teamNumber => {
      const teamMatches = matchScoutingData.filter(match => match.teamNumber === teamNumber);
      if (teamMatches.length === 0) {
        const pitData = pitScoutingData.find(pit => pit.teamNumber === teamNumber);
        return pitData?.robotSpeed || 0;
      }
      return Math.round(teamMatches.reduce((sum, m) => sum + m.robotSpeed, 0) / teamMatches.length);
    }));

    const topReliability = Math.max(...allianceTeams.map(teamNumber => {
      const teamMatches = matchScoutingData.filter(match => match.teamNumber === teamNumber);
      if (teamMatches.length === 0) {
        const pitData = pitScoutingData.find(pit => pit.teamNumber === teamNumber);
        return pitData?.robotReliability || 0;
      }
      return Math.round(teamMatches.reduce((sum, m) => sum + m.robotReliability, 0) / teamMatches.length);
    }));

    // Get capabilities coverage
    const capabilities = {
      canCollectSamples: allianceTeams.some(teamNumber => {
        const pitData = pitScoutingData.find(pit => pit.teamNumber === teamNumber);
        return pitData?.canCollectSamples || false;
      }),
      canPlaceInNetZone: allianceTeams.some(teamNumber => {
        const pitData = pitScoutingData.find(pit => pit.teamNumber === teamNumber);
        return pitData?.canPlaceInNetZone || false;
      }),
      canScoreLowBasket: allianceTeams.some(teamNumber => {
        const pitData = pitScoutingData.find(pit => pit.teamNumber === teamNumber);
        return pitData?.canScoreLowBasket || false;
      }),
      canScoreHighBasket: allianceTeams.some(teamNumber => {
        const pitData = pitScoutingData.find(pit => pit.teamNumber === teamNumber);
        return pitData?.canScoreHighBasket || false;
      }),
      canPlaceInLowChamber: allianceTeams.some(teamNumber => {
        const pitData = pitScoutingData.find(pit => pit.teamNumber === teamNumber);
        return pitData?.canPlaceInLowChamber || false;
      }),
      canPlaceInHighChamber: allianceTeams.some(teamNumber => {
        const pitData = pitScoutingData.find(pit => pit.teamNumber === teamNumber);
        return pitData?.canPlaceInHighChamber || false;
      })
    };

    // Calculate coverage percentage
    const coverageCount = Object.values(capabilities).filter(Boolean).length;
    const coveragePercentage = Math.round((coverageCount / Object.keys(capabilities).length) * 100);

    return {
      allianceScore,
      teamAverages,
      topSpeed,
      topReliability,
      capabilities,
      coveragePercentage
    };
  };

  const allianceMetrics = calculateAllianceMetrics();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Alliance Simulator</h2>
        <p className="text-gray-600 mb-6">
          Add teams to simulate how they would perform together as an alliance.
        </p>

        <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
          <div className="flex-1">
            <Label htmlFor="teamNumber">Team Number</Label>
            <Input
              id="teamNumber"
              type="number"
              placeholder="Enter team number"
              value={currentTeam}
              onChange={(e) => setCurrentTeam(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button 
            onClick={addTeam}
            disabled={!currentTeam || allianceTeams.length >= 3}
          >
            Add to Alliance
          </Button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Current Alliance</h3>
          {allianceTeams.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allianceTeams.map(teamNumber => {
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                      onClick={() => removeTeam(teamNumber)}
                    >
                      &times;
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 italic">No teams selected</p>
          )}
        </div>

        <Button 
          className="w-full"
          onClick={runSimulation}
          disabled={allianceTeams.length === 0}
        >
          Simulate Alliance Performance
        </Button>
      </div>

      {showSimulation && allianceMetrics && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white mb-1">Alliance Simulation Results</h2>
            <p className="text-blue-100 text-sm">
              Teams: {allianceTeams.join(', ')}
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Estimated Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{allianceMetrics.allianceScore.total}</div>
                  <div className="text-sm text-gray-500 mt-1">Combined match average</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{allianceMetrics.coveragePercentage}%</div>
                  <div className="text-sm text-gray-500 mt-1">Game element capabilities</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Speed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{allianceMetrics.topSpeed}/5</div>
                  <div className="text-sm text-gray-500 mt-1">Highest rated team</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Reliability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{allianceMetrics.topReliability}/5</div>
                  <div className="text-sm text-gray-500 mt-1">Highest rated team</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Cpu className="mr-2 h-5 w-5 text-blue-500" />
                  Game Element Coverage
                </h3>
                <ul className="space-y-2">
                  {Object.entries(allianceMetrics.capabilities).map(([capability, covered]) => (
                    <li key={capability} className="flex items-center">
                      <div className={`h-4 w-4 rounded-full mr-2 ${covered ? 'bg-green-500' : 'bg-red-200'}`}></div>
                      <span className="capitalize">{capability.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-blue-500" />
                  Score Breakdown
                </h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Auto:</span>
                    <span className="font-medium">{allianceMetrics.allianceScore.auto}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Teleop:</span>
                    <span className="font-medium">{allianceMetrics.allianceScore.teleop}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Endgame:</span>
                    <span className="font-medium">{allianceMetrics.allianceScore.endgame}</span>
                  </li>
                  <li className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">{allianceMetrics.allianceScore.total}</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-500" />
                  Alliance Synergy
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Compatible Roles</div>
                    <div className="font-medium">
                      {allianceTeams.length >= 2 ? "Good role coverage" : "Need more teams"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Strategy Assessment</div>
                    <div className="font-medium">
                      {allianceMetrics.coveragePercentage >= 80 
                        ? "Strong all-around alliance" 
                        : allianceMetrics.coveragePercentage >= 50
                          ? "Balanced alliance with some gaps"
                          : "Limited capabilities, consider adjusting"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Recommendation</div>
                    <div className="font-medium text-green-600">
                      {allianceTeams.length < 3 
                        ? "Add more teams to complete alliance" 
                        : allianceMetrics.coveragePercentage >= 70
                          ? "Ready for competition!"
                          : "Consider different team combinations"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 