"use client"

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useScoutingStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Search, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { memoizedCalculateScore } from '@/lib/utils';

export default function MatchAnalysisPage() {
  const { matchScoutingData } = useScoutingStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState('all');
  const [filterResult, setFilterResult] = useState('all');
  
  // Filtered and sorted matches
  const filteredMatches = useMemo(() => {
    let filtered = [...matchScoutingData];
    
    if (searchTerm) {
      filtered = filtered.filter(match => 
        match.teamNumber.toString().includes(searchTerm)
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(match => match.allianceColor === filterType);
    }
    
    if (filterResult !== 'all') {
      filtered = filtered.filter(match => match.matchResult === filterResult);
    }
    
    return filtered.sort((a, b) => b.matchNumber - a.matchNumber);
  }, [matchScoutingData, searchTerm, filterType, filterResult]);

  // Alliance statistics
  const allianceStats = useMemo(() => {
    // Alliance wins
    const totalRedWins = matchScoutingData.filter(m => m.allianceColor === 'red' && m.matchResult === 'win').length;
    const totalBlueWins = matchScoutingData.filter(m => m.allianceColor === 'blue' && m.matchResult === 'win').length;
    
    return { totalRedWins, totalBlueWins };
  }, [matchScoutingData]);

  // Calculate average scores
  const averageScores = useMemo(() => {
    if (matchScoutingData.length === 0) return { autoScore: 0, teleopScore: 0, endgameScore: 0, totalScore: 0 };
    
    const totals = matchScoutingData.reduce((acc, match) => {
      const scores = memoizedCalculateScore(match);
      acc.autoScore += scores.autoScore;
      acc.teleopScore += scores.teleopScore;
      acc.endgameScore += scores.endgameScore;
      acc.totalScore += scores.totalScore;
      return acc;
    }, { autoScore: 0, teleopScore: 0, endgameScore: 0, totalScore: 0 });
    
    return {
      autoScore: Math.round(totals.autoScore / matchScoutingData.length),
      teleopScore: Math.round(totals.teleopScore / matchScoutingData.length),
      endgameScore: Math.round(totals.endgameScore / matchScoutingData.length),
      totalScore: Math.round(totals.totalScore / matchScoutingData.length)
    };
  }, [matchScoutingData]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Link href="/analysis" className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Match Analysis</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Matches</div>
          <div className="text-3xl font-bold text-blue-600">{matchScoutingData.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-sm font-medium text-gray-500 mb-1">Avg Total Score</div>
          <div className="text-3xl font-bold text-blue-600">{averageScores.totalScore}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-sm font-medium text-gray-500 mb-1">Red Alliance Wins</div>
          <div className="text-3xl font-bold text-red-500">{allianceStats.totalRedWins}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-sm font-medium text-gray-500 mb-1">Blue Alliance Wins</div>
          <div className="text-3xl font-bold text-blue-500">{allianceStats.totalBlueWins}</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by match or team number"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Matches Table */}
      {filteredMatches.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Match #</TableHead>
                  <TableHead>Team #</TableHead>
                  <TableHead>Alliance</TableHead>
                  <TableHead>Auto</TableHead>
                  <TableHead>Teleop</TableHead>
                  <TableHead>Endgame</TableHead>
                  <TableHead>Total Score</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMatches.map((match) => {
                  const scores = memoizedCalculateScore(match);
                  return (
                    <TableRow key={match.id}>
                      <TableCell className="font-medium">{match.matchNumber}</TableCell>
                      <TableCell>{match.teamNumber}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          match.allianceColor === 'red' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {match.allianceColor.charAt(0).toUpperCase() + match.allianceColor.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{scores.autoScore}</TableCell>
                      <TableCell>{scores.teleopScore}</TableCell>
                      <TableCell>{scores.endgameScore}</TableCell>
                      <TableCell className="font-medium">{scores.totalScore}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          match.matchResult === 'win' ? 'bg-green-100 text-green-800' : 
                          match.matchResult === 'tie' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {match.matchResult.charAt(0).toUpperCase() + match.matchResult.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">
            {searchTerm ? "No matches match your search criteria" : "No match data available yet"}
          </p>
          {!searchTerm && (
            <div className="flex justify-center">
              <Link href="/scout/match">
                <Button>Start Match Scouting</Button>
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Score Breakdown */}
      {matchScoutingData.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Score Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-700 mb-2">Autonomous</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Average Auto Score:</span>
                <span className="font-bold">{averageScores.autoScore}</span>
              </div>
              <div className="bg-blue-100 h-2 rounded-full">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(averageScores.autoScore / averageScores.totalScore) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-700 mb-2">Teleop</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Average Teleop Score:</span>
                <span className="font-bold">{averageScores.teleopScore}</span>
              </div>
              <div className="bg-green-100 h-2 rounded-full">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(averageScores.teleopScore / averageScores.totalScore) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-700 mb-2">Endgame</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Average Endgame Score:</span>
                <span className="font-bold">{averageScores.endgameScore}</span>
              </div>
              <div className="bg-purple-100 h-2 rounded-full">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${(averageScores.endgameScore / averageScores.totalScore) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 