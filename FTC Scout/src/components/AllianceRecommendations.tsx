"use client"

import { useMemo } from 'react';
import { useScoutingStore } from '@/lib/store';
import { memoizedCalculateScore } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { TeamComparisonTable } from './TeamComparisonTable';
import { Award, Zap, Lightbulb, ArrowRight } from 'lucide-react';

export function AllianceRecommendations() {
  const { matchScoutingData, pitScoutingData } = useScoutingStore();

  // Get unique team numbers
  const uniqueTeamNumbers = useMemo(() => {
    return [...new Set(
      [...matchScoutingData.map(match => match.teamNumber), 
      ...pitScoutingData.map(pit => pit.teamNumber)]
    )];
  }, [matchScoutingData, pitScoutingData]);

  // Get team performance data
  const teamPerformance = useMemo(() => {
    return uniqueTeamNumbers.map(teamNumber => {
      const teamMatches = matchScoutingData.filter(match => match.teamNumber === teamNumber);
      const pitData = pitScoutingData.find(pit => pit.teamNumber === teamNumber);
      
      if (teamMatches.length === 0 && !pitData) return null;
      
      // Calculate average scores
      let autoAvg = 0, teleopAvg = 0, endgameAvg = 0, totalAvg = 0;
      
      if (teamMatches.length > 0) {
        const scores = teamMatches.map(match => memoizedCalculateScore(match));
        autoAvg = Math.round(scores.reduce((sum, score) => sum + score.auto, 0) / scores.length);
        teleopAvg = Math.round(scores.reduce((sum, score) => sum + score.teleop, 0) / scores.length);
        endgameAvg = Math.round(scores.reduce((sum, score) => sum + score.endgame, 0) / scores.length);
        totalAvg = Math.round(scores.reduce((sum, score) => sum + score.total, 0) / scores.length);
      }
      
      // Get capabilities
      const capabilities = {
        canCollectSamples: pitData?.canCollectSamples || false,
        canPlaceInNetZone: pitData?.canPlaceInNetZone || false,
        canScoreLowBasket: pitData?.canScoreLowBasket || false,
        canScoreHighBasket: pitData?.canScoreHighBasket || false,
        canPlaceInLowChamber: pitData?.canPlaceInLowChamber || false,
        canPlaceInHighChamber: pitData?.canPlaceInHighChamber || false,
        maxAscentLevel: pitData?.maxAscentLevel || "none",
      };
      
      // Get robot performance metrics
      const reliability = teamMatches.length > 0
        ? Math.round(teamMatches.reduce((sum, m) => sum + m.robotReliability, 0) / teamMatches.length)
        : (pitData?.robotReliability || 0);
        
      const speed = teamMatches.length > 0
        ? Math.round(teamMatches.reduce((sum, m) => sum + m.robotSpeed, 0) / teamMatches.length)
        : (pitData?.robotSpeed || 0);
        
      const maneuverability = teamMatches.length > 0
        ? Math.round(teamMatches.reduce((sum, m) => sum + m.robotManeuverability, 0) / teamMatches.length)
        : (pitData?.robotManeuverability || 0);
      
      return {
        teamNumber,
        teamName: pitData?.teamName || `Team ${teamNumber}`,
        scores: {
          auto: autoAvg,
          teleop: teleopAvg,
          endgame: endgameAvg,
          total: totalAvg
        },
        capabilities,
        preferredRole: pitData?.preferredRole || "unknown",
        preferredZone: pitData?.preferredZone || "unknown",
        performance: {
          reliability,
          speed,
          maneuverability
        },
        matchCount: teamMatches.length
      };
    }).filter(Boolean);
  }, [uniqueTeamNumbers, matchScoutingData, pitScoutingData]);

  // Generate alliance recommendations
  const allianceRecommendations = useMemo(() => {
    if (teamPerformance.length < 6) return [];
    
    // Helper function to calculate alliance score
    const calculateAllianceScore = (teams) => {
      return {
        totalScore: teams.reduce((sum, team) => sum + team.scores.total, 0),
        auto: teams.reduce((sum, team) => sum + team.scores.auto, 0),
        teleop: teams.reduce((sum, team) => sum + team.scores.teleop, 0),
        endgame: teams.reduce((sum, team) => sum + team.scores.endgame, 0)
      };
    };
    
    // Helper function to calculate capability coverage
    const calculateCoverage = (teams) => {
      const capabilities = {
        canCollectSamples: teams.some(team => team.capabilities.canCollectSamples),
        canPlaceInNetZone: teams.some(team => team.capabilities.canPlaceInNetZone),
        canScoreLowBasket: teams.some(team => team.capabilities.canScoreLowBasket),
        canScoreHighBasket: teams.some(team => team.capabilities.canScoreHighBasket),
        canPlaceInLowChamber: teams.some(team => team.capabilities.canPlaceInLowChamber),
        canPlaceInHighChamber: teams.some(team => team.capabilities.canPlaceInHighChamber),
      };
      
      const coveredCount = Object.values(capabilities).filter(Boolean).length;
      return (coveredCount / Object.keys(capabilities).length) * 100;
    };
    
    // Sort teams by total score (for initial seed)
    const sortedTeams = [...teamPerformance].sort((a, b) => b.scores.total - a.scores.total);
    
    // Create a recommendations array with different prioritizations
    const recommendations = [];
    
    // 1. Best Overall Score Alliance
    const bestScoreAlliance = sortedTeams.slice(0, 3);
    recommendations.push({
      name: "Highest Scoring Alliance",
      teams: bestScoreAlliance,
      alliance: calculateAllianceScore(bestScoreAlliance),
      coverage: calculateCoverage(bestScoreAlliance),
      description: "This alliance has the highest combined match score potential.",
      icon: <Award className="h-6 w-6 text-yellow-500" />
    });
    
    // 2. Best Balanced Alliance (Mix of auto, teleop, endgame strengths)
    const autoStrong = [...teamPerformance].sort((a, b) => b.scores.auto - a.scores.auto)[0];
    const teleopStrong = [...teamPerformance]
      .filter(t => t.teamNumber !== autoStrong.teamNumber)
      .sort((a, b) => b.scores.teleop - a.scores.teleop)[0];
    const endgameStrong = [...teamPerformance]
      .filter(t => t.teamNumber !== autoStrong.teamNumber && t.teamNumber !== teleopStrong.teamNumber)
      .sort((a, b) => b.scores.endgame - a.scores.endgame)[0];
    
    const balancedAlliance = [autoStrong, teleopStrong, endgameStrong];
    recommendations.push({
      name: "Balanced Strategy Alliance",
      teams: balancedAlliance,
      alliance: calculateAllianceScore(balancedAlliance),
      coverage: calculateCoverage(balancedAlliance),
      description: "This alliance combines specialists in autonomous, teleop, and endgame phases.",
      icon: <Zap className="h-6 w-6 text-orange-500" />
    });
    
    // 3. Best Capability Coverage Alliance
    // Create all possible 3-team combinations
    const alliances = [];
    for (let i = 0; i < teamPerformance.length; i++) {
      for (let j = i + 1; j < teamPerformance.length; j++) {
        for (let k = j + 1; k < teamPerformance.length; k++) {
          const alliance = [teamPerformance[i], teamPerformance[j], teamPerformance[k]];
          alliances.push({
            teams: alliance,
            coverage: calculateCoverage(alliance),
            score: calculateAllianceScore(alliance).totalScore
          });
        }
      }
    }
    
    // Sort by coverage first, then by score
    alliances.sort((a, b) => {
      if (b.coverage !== a.coverage) return b.coverage - a.coverage;
      return b.score - a.score;
    });
    
    const bestCoverageAlliance = alliances[0].teams;
    recommendations.push({
      name: "Most Versatile Alliance",
      teams: bestCoverageAlliance,
      alliance: calculateAllianceScore(bestCoverageAlliance),
      coverage: calculateCoverage(bestCoverageAlliance),
      description: "This alliance covers the most game elements and scoring opportunities.",
      icon: <Lightbulb className="h-6 w-6 text-blue-500" />
    });
    
    return recommendations;
  }, [teamPerformance]);

  if (uniqueTeamNumbers.length < 6) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Alliance Recommendations</h2>
        <p className="text-gray-600 mb-6">
          Scout more teams to get alliance recommendations. At least 6 teams are needed.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg text-blue-700 text-sm">
          Currently {uniqueTeamNumbers.length} teams scouted. Scout {Math.max(6 - uniqueTeamNumbers.length, 0)} more teams.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Data-Driven Alliance Recommendations</h2>
        <p className="text-gray-600 mb-6">
          Based on your scouting data, these are the optimal alliance combinations to consider.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allianceRecommendations.map((recommendation, index) => (
            <Card key={index} className="border-t-4" style={{ borderTopColor: index === 0 ? '#FBBF24' : index === 1 ? '#F97316' : '#3B82F6' }}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{recommendation.name}</CardTitle>
                  {recommendation.icon}
                </div>
                <CardDescription className="mt-1">{recommendation.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Teams</div>
                    <div className="flex flex-wrap gap-1">
                      {recommendation.teams.map(team => (
                        <span key={team.teamNumber} className="inline-flex text-sm bg-gray-100 px-2 py-1 rounded">
                          {team.teamNumber}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Total Score</div>
                      <div className="text-2xl font-bold text-blue-600">{recommendation.alliance.totalScore}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Coverage</div>
                      <div className="text-2xl font-bold text-green-600">{Math.round(recommendation.coverage)}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <span>Compare Teams</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {allianceRecommendations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Top Recommended Alliance Comparison</h2>
          <TeamComparisonTable teamNumbers={allianceRecommendations[0].teams.map(t => t.teamNumber)} />
        </div>
      )}
    </div>
  );
} 