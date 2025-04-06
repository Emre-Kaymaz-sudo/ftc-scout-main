"use client"

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useScoutingStore } from '@/lib/store';
import { memoizedCalculateScore } from '@/lib/utils';
import { 
  ArrowLeft, 
  Activity, 
  Trophy, 
  Percent,
  Bot,
  Timer,
  Target,
  Gamepad2,
  Flag,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const teamNumber = parseInt(params.teamNumber as string);
  
  const { matchScoutingData, pitScoutingData } = useScoutingStore();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  
  // Store metodlarını al
  const store = useScoutingStore();
  
  // Filter for this team's matches - use number comparison
  const teamMatches = useMemo(() => {
    return matchScoutingData.filter(match => match.teamNumber === teamNumber);
  }, [matchScoutingData, teamNumber]);
  
  // Sort matches by match number (most recent first)
  const sortedMatches = useMemo(() => {
    return [...teamMatches].sort((a, b) => b.matchNumber - a.matchNumber);
  }, [teamMatches]);
  
  // Get pit data for this team - use number comparison
  const teamPitData = useMemo(() => {
    return pitScoutingData.find(pit => pit.teamNumber === teamNumber);
  }, [pitScoutingData, teamNumber]);
  
  // Navigate to edit match form
  const handleEditMatch = (matchId: string) => {
    router.push(`/scouting/match/edit/${matchId}`);
  };
  
  // Delete match record
  const handleDeleteMatch = (matchId: string) => {
    const updatedMatches = matchScoutingData.filter(match => match.id !== matchId);
    useScoutingStore.setState({ matchScoutingData: updatedMatches });
  };
  
  // Seçili maç değişirse sil
  useEffect(() => {
    if (selectedMatchId) {
      handleDeleteMatch(selectedMatchId);
      setSelectedMatchId(null);
    }
  }, [selectedMatchId]);
  
  // Calculate statistics
  const stats = useMemo(() => {
    if (teamMatches.length === 0) return { 
      averageScore: 0, 
      highScore: 0, 
      winRate: 0,
      averageAuto: 0,
      averageTeleop: 0,
      averageEndgame: 0
    };
    
    const scores = teamMatches.map(match => memoizedCalculateScore(match));
    
    const totalScores = scores.reduce((acc, score) => ({
      auto: acc.auto + score.auto,
      teleop: acc.teleop + score.teleop,
      endgame: acc.endgame + score.endgame,
      total: acc.total + score.total
    }), { auto: 0, teleop: 0, endgame: 0, total: 0 });
    
    const wins = teamMatches.filter(match => match.matchResult === 'win').length;
    
    return {
      averageScore: Math.round(totalScores.total / teamMatches.length),
      highScore: Math.max(...scores.map(s => s.total)),
      winRate: Math.round((wins / teamMatches.length) * 100),
      averageAuto: Math.round(totalScores.auto / teamMatches.length),
      averageTeleop: Math.round(totalScores.teleop / teamMatches.length),
      averageEndgame: Math.round(totalScores.endgame / teamMatches.length)
    };
  }, [teamMatches]);
  
  // Reliability metrics
  const reliabilityScore = useMemo(() => {
    if (teamMatches.length === 0) return 0;
    
    // Calculate reliability from robot performance metrics
    const avgReliability = teamMatches.reduce((sum, match) => 
      sum + match.robotReliability, 0) / teamMatches.length;
    
    return Math.round(avgReliability * 20); // Convert 0-5 scale to percentage
  }, [teamMatches]);
  
  const teamName = useMemo(() => {
    return teamPitData?.teamName || `Team ${teamNumber}`;
  }, [teamPitData, teamNumber]);
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-4">
        <Link href="/analysis/teams">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Teams
          </Button>
        </Link>
      </div>
      
      <div className="bg-card rounded-lg p-6 mb-6 border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{teamName}</h1>
            <p className="text-xl text-muted-foreground">#{teamNumber}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-secondary p-2 rounded-md">
              <p className="text-sm text-muted-foreground">Matches Scouted</p>
              <p className="text-xl font-bold">{teamMatches.length}</p>
            </div>
            <div className="bg-secondary p-2 rounded-md">
              <p className="text-sm text-muted-foreground">Pit Data</p>
              <p className="text-xl font-bold">{teamPitData ? "Available" : "None"}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Activity className="h-4 w-4 text-primary" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.averageScore}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Trophy className="h-4 w-4 text-primary" />
              Highest Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.highScore}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Percent className="h-4 w-4 text-primary" />
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.winRate}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Bot className="h-4 w-4 text-primary" />
              Robot Reliability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{reliabilityScore}%</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Timer className="h-4 w-4 text-primary" />
              Autonomous
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.averageAuto}</p>
            <p className="text-sm text-muted-foreground">Avg. Points</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Gamepad2 className="h-4 w-4 text-primary" />
              TeleOp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.averageTeleop}</p>
            <p className="text-sm text-muted-foreground">Avg. Points</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Flag className="h-4 w-4 text-primary" />
              Endgame
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.averageEndgame}</p>
            <p className="text-sm text-muted-foreground">Avg. Points</p>
          </CardContent>
        </Card>
      </div>
      
      {teamPitData && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Robot Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Drive System</h3>
                <p>{teamPitData.drivetrainType.charAt(0).toUpperCase() + teamPitData.drivetrainType.slice(1)}</p>
                {teamPitData.drivetrainNotes && (
                  <p className="text-sm text-muted-foreground mt-1">{teamPitData.drivetrainNotes}</p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">Dimensions</h3>
                <p>{teamPitData.length}" × {teamPitData.width}" × {teamPitData.height}"</p>
                <p className="text-sm text-muted-foreground mt-1">Weight: {teamPitData.weight} lbs</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Auto Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {teamPitData.autoStartPositions.map((pos, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {pos.charAt(0).toUpperCase() + pos.slice(1)}
                    </span>
                  ))}
                  {teamPitData.autoSampleCollection && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Sample Collection
                    </span>
                  )}
                  {teamPitData.autoScoring && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Scoring
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Scoring Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {teamPitData.canCollectSamples && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Sample Collection
                    </span>
                  )}
                  {teamPitData.canPlaceInNetZone && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Net Zone
                    </span>
                  )}
                  {(teamPitData.canScoreLowBasket || teamPitData.canScoreHighBasket) && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Basket Scoring
                    </span>
                  )}
                  {(teamPitData.canPlaceInLowChamber || teamPitData.canPlaceInHighChamber) && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Chamber Placement
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Endgame Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {teamPitData.maxAscentLevel !== 'none' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Ascent Level {teamPitData.maxAscentLevel.charAt(teamPitData.maxAscentLevel.length - 1)}
                    </span>
                  )}
                  {teamPitData.autoAscent && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Autonomous Ascent
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Strategy</h3>
                <p>Preferred Role: <span className="font-medium capitalize">{teamPitData.preferredRole}</span></p>
                <p>Preferred Zone: <span className="font-medium capitalize">{teamPitData.preferredZone}</span></p>
                {teamPitData.strategyNotes && (
                  <div className="mt-2 text-sm bg-gray-50 p-3 rounded-lg">
                    {teamPitData.strategyNotes}
                  </div>
                )}
              </div>
            </div>
            {teamPitData.notes && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Notes</h3>
                <div className="text-sm bg-gray-50 p-3 rounded-lg">
                  {teamPitData.notes}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Matches</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedMatches.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Match</TableHead>
                  <TableHead>Alliance</TableHead>
                  <TableHead>Total Score</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Auto</TableHead>
                  <TableHead>TeleOp</TableHead>
                  <TableHead>Endgame</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMatches.map((match, index) => {
                  const scores = memoizedCalculateScore(match);
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>{match.matchNumber}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          match.allianceColor === "red" 
                            ? "bg-red-100 text-red-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {match.allianceColor.charAt(0).toUpperCase() + match.allianceColor.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{scores.total}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          match.matchResult === "win" 
                            ? "bg-green-100 text-green-800" 
                            : match.matchResult === "tie"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}>
                          {match.matchResult.charAt(0).toUpperCase() + match.matchResult.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{scores.auto}</TableCell>
                      <TableCell>{scores.teleop}</TableCell>
                      <TableCell>{scores.endgame}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditMatch(match.id)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setSelectedMatchId(match.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-6 text-muted-foreground">
              No match data available for this team.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 