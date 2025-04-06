"use client"

import { useScoutingStore } from '@/lib/store';
import { memoizedCalculateScore } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { CheckCircle, XCircle } from 'lucide-react';

interface TeamComparisonTableProps {
  teamNumbers: number[];
}

export function TeamComparisonTable({ teamNumbers }: TeamComparisonTableProps) {
  const { matchScoutingData, pitScoutingData } = useScoutingStore();

  // Prepare team data for comparison
  const teamsData = teamNumbers.map(teamNumber => {
    const teamMatches = matchScoutingData.filter(match => match.teamNumber === teamNumber);
    const pitData = pitScoutingData.find(pit => pit.teamNumber === teamNumber);
    
    // Calculate average scores
    const scoreDetails = {
      autoAverage: 0,
      teleopAverage: 0,
      endgameAverage: 0,
      totalAverage: 0
    };
    
    if (teamMatches.length > 0) {
      const scores = teamMatches.map(match => memoizedCalculateScore(match));
      
      scoreDetails.autoAverage = Math.round(
        scores.reduce((sum, score) => sum + score.autoScore, 0) / scores.length
      );
      
      scoreDetails.teleopAverage = Math.round(
        scores.reduce((sum, score) => sum + score.teleopScore, 0) / scores.length
      );
      
      scoreDetails.endgameAverage = Math.round(
        scores.reduce((sum, score) => sum + score.endgameScore, 0) / scores.length
      );
      
      scoreDetails.totalAverage = Math.round(
        scores.reduce((sum, score) => sum + score.totalScore, 0) / scores.length
      );
    }
    
    // Calculate win rate
    const winRate = teamMatches.length > 0 
      ? Math.round((teamMatches.filter(m => m.matchResult === "win").length / teamMatches.length) * 100)
      : 0;
    
    // Get robot capabilities
    const capabilities = {
      canCollectSamples: pitData?.canCollectSamples || false,
      canPlaceInNetZone: pitData?.canPlaceInNetZone || false,
      canScoreLowBasket: pitData?.canScoreLowBasket || false,
      canScoreHighBasket: pitData?.canScoreHighBasket || false,
      canPlaceInLowChamber: pitData?.canPlaceInLowChamber || false,
      canPlaceInHighChamber: pitData?.canPlaceInHighChamber || false,
      maxAscentLevel: pitData?.maxAscentLevel || "none",
    };
    
    // Get robot metrics
    const avgRobotSpeed = teamMatches.length > 0
      ? Math.round(teamMatches.reduce((sum, m) => sum + m.robotSpeed, 0) / teamMatches.length)
      : (pitData?.robotSpeed || 0);
      
    const avgRobotReliability = teamMatches.length > 0
      ? Math.round(teamMatches.reduce((sum, m) => sum + m.robotReliability, 0) / teamMatches.length)
      : (pitData?.robotReliability || 0);
      
    const avgRobotManeuverability = teamMatches.length > 0
      ? Math.round(teamMatches.reduce((sum, m) => sum + m.robotManeuverability, 0) / teamMatches.length)
      : (pitData?.robotManeuverability || 0);
    
    return {
      teamNumber,
      teamName: pitData?.teamName || `Team ${teamNumber}`,
      matchCount: teamMatches.length,
      winRate,
      scoreDetails,
      capabilities,
      robotSpeed: avgRobotSpeed,
      robotReliability: avgRobotReliability,
      robotManeuverability: avgRobotManeuverability,
      preferredRole: pitData?.preferredRole || "unknown",
      preferredZone: pitData?.preferredZone || "unknown",
    };
  });

  const renderCapabilityIcon = (capable: boolean) => {
    return capable 
      ? <CheckCircle className="h-5 w-5 text-green-500" /> 
      : <XCircle className="h-5 w-5 text-red-300" />;
  };

  const renderRatingBar = (rating: number) => (
    <div className="flex items-center">
      <div className="w-24 bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${(rating / 5) * 100}%` }} 
        />
      </div>
      <span className="ml-2 text-xs">{rating}/5</span>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
      <Table>
        <TableCaption>Side-by-side team comparison based on scouting data</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Metric</TableHead>
            {teamsData.map(team => (
              <TableHead key={team.teamNumber} className="text-center">
                <div className="font-medium">{team.teamNumber}</div>
                <div className="text-xs font-normal text-gray-500">{team.teamName}</div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Match Data */}
          <TableRow className="bg-gray-50">
            <TableCell className="font-medium" colSpan={teamNumbers.length + 1}>
              Match Performance
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Matches Scouted</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber} className="text-center">
                {team.matchCount}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Win Rate</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber} className="text-center">
                {team.winRate}%
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Average Total Score</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber} className="text-center font-semibold">
                {team.scoreDetails.totalAverage}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Auto Score</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber} className="text-center">
                {team.scoreDetails.autoAverage}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Teleop Score</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber} className="text-center">
                {team.scoreDetails.teleopAverage}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Endgame Score</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber} className="text-center">
                {team.scoreDetails.endgameAverage}
              </TableCell>
            ))}
          </TableRow>

          {/* Robot Capabilities */}
          <TableRow className="bg-gray-50">
            <TableCell className="font-medium" colSpan={teamNumbers.length + 1}>
              Robot Capabilities
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Collect Samples</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber} className="text-center">
                {renderCapabilityIcon(team.capabilities.canCollectSamples)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Place in Net Zone</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber} className="text-center">
                {renderCapabilityIcon(team.capabilities.canPlaceInNetZone)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Score in Low Basket</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber} className="text-center">
                {renderCapabilityIcon(team.capabilities.canScoreLowBasket)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Score in High Basket</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber} className="text-center">
                {renderCapabilityIcon(team.capabilities.canScoreHighBasket)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Place in Low Chamber</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber} className="text-center">
                {renderCapabilityIcon(team.capabilities.canPlaceInLowChamber)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Place in High Chamber</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber} className="text-center">
                {renderCapabilityIcon(team.capabilities.canPlaceInHighChamber)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Max Ascent Level</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber} className="text-center">
                <span className={
                  team.capabilities.maxAscentLevel === "level3" ? "font-semibold text-green-600" :
                  team.capabilities.maxAscentLevel === "level2" ? "font-medium text-blue-600" :
                  team.capabilities.maxAscentLevel === "level1" ? "text-gray-600" : "text-gray-400"
                }>
                  {team.capabilities.maxAscentLevel === "none" ? "None" : 
                   team.capabilities.maxAscentLevel === "level1" ? "Level 1" :
                   team.capabilities.maxAscentLevel === "level2" ? "Level 2" : "Level 3"}
                </span>
              </TableCell>
            ))}
          </TableRow>

          {/* Robot Performance */}
          <TableRow className="bg-gray-50">
            <TableCell className="font-medium" colSpan={teamNumbers.length + 1}>
              Robot Performance
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Speed</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber}>
                {renderRatingBar(team.robotSpeed)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Reliability</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber}>
                {renderRatingBar(team.robotReliability)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Maneuverability</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber}>
                {renderRatingBar(team.robotManeuverability)}
              </TableCell>
            ))}
          </TableRow>

          {/* Strategy */}
          <TableRow className="bg-gray-50">
            <TableCell className="font-medium" colSpan={teamNumbers.length + 1}>
              Strategy
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Preferred Role</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber} className="text-center capitalize">
                {team.preferredRole === "unknown" ? "-" : team.preferredRole}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Preferred Zone</TableCell>
            {teamsData.map(team => (
              <TableCell key={team.teamNumber} className="text-center capitalize">
                {team.preferredZone === "unknown" ? "-" : team.preferredZone}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
} 