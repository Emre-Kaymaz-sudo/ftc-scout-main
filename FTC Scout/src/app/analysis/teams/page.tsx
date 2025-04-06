"use client"

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useScoutingStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ChevronLeft, Download, Star, Search, Filter } from 'lucide-react';
import { calculateScore, memoizedCalculateScore } from '@/lib/utils';

interface TeamSummary {
  teamNumber: number;
  teamName: string;
  matchCount: number;
  averageScore: number;
  winRate: number;
  hasPitData: boolean;
  robotSpeed: number;
  robotReliability: number;
  robotManeuverability: number;
}

export default function TeamsAnalysisPage() {
  const { matchScoutingData, pitScoutingData } = useScoutingStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof TeamSummary>("teamNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Get unique team numbers from both match and pit data
  const uniqueTeamNumbers = useMemo(() => {
    const uniqueMatchTeams = new Set(matchScoutingData.map(match => match.teamNumber));
    const uniquePitTeams = new Set(pitScoutingData.map(pit => pit.teamNumber));
    return new Set([...uniqueMatchTeams, ...uniquePitTeams]);
  }, [matchScoutingData, pitScoutingData]);

  // Generate team summaries
  const teamSummaries = useMemo(() => {
    return Array.from(uniqueTeamNumbers).map(teamNumber => {
      const teamMatches = matchScoutingData.filter(match => match.teamNumber === teamNumber);
      const pitData = pitScoutingData.find(pit => pit.teamNumber === teamNumber);
      
      // Calculate average score
      const totalScore = teamMatches.reduce((total, match) => {
        const scores = memoizedCalculateScore(match);
        return total + scores.totalScore;
      }, 0);
      
      const averageScore = teamMatches.length > 0 ? Math.round(totalScore / teamMatches.length) : 0;
      
      // Calculate win rate
      const wins = teamMatches.filter(match => match.matchResult === 'win').length;
      const winRate = teamMatches.length > 0 ? (wins / teamMatches.length) * 100 : 0;
      
      // Robot performance metrics (from pit or average of matches)
      let robotSpeed = 0;
      let robotReliability = 0;
      let robotManeuverability = 0;
      
      if (pitData) {
        robotSpeed = pitData.robotSpeed;
        robotReliability = pitData.robotReliability;
        robotManeuverability = pitData.robotManeuverability;
      } else if (teamMatches.length > 0) {
        robotSpeed = Math.round(teamMatches.reduce((sum, match) => sum + match.robotSpeed, 0) / teamMatches.length);
        robotReliability = Math.round(teamMatches.reduce((sum, match) => sum + match.robotReliability, 0) / teamMatches.length);
        robotManeuverability = Math.round(teamMatches.reduce((sum, match) => sum + match.robotManeuverability, 0) / teamMatches.length);
      }
      
      return {
        teamNumber,
        teamName: pitData?.teamName || `Team ${teamNumber}`,
        matchCount: teamMatches.length,
        averageScore,
        winRate,
        hasPitData: !!pitData,
        robotSpeed,
        robotReliability,
        robotManeuverability
      };
    });
  }, [uniqueTeamNumbers, matchScoutingData, pitScoutingData]);

  // Filter and sort teams
  const filteredAndSortedTeams = useMemo(() => {
    // Filter teams based on search
    const filteredTeams = teamSummaries.filter(team => 
      team.teamNumber.toString().includes(searchTerm) || 
      team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort teams
    return [...filteredTeams].sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });
  }, [teamSummaries, searchTerm, sortField, sortDirection]);

  // Handle sort change
  const handleSort = (field: keyof TeamSummary) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sort indicator
  const getSortIndicator = (field: keyof TeamSummary) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Link href="/analysis" className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Team Analysis</h1>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by team number or name"
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
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        </div>

      {/* Team Table */}
      {filteredAndSortedTeams.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort("teamNumber")}
                  >
                    Team # {getSortIndicator("teamNumber")}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort("teamName")}
                  >
                    Team Name {getSortIndicator("teamName")}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort("matchCount")}
                  >
                    Matches {getSortIndicator("matchCount")}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort("averageScore")}
                  >
                    Avg. Score {getSortIndicator("averageScore")}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort("winRate")}
                  >
                    Win Rate {getSortIndicator("winRate")}
                  </TableHead>
                  <TableHead className="text-center">Pit Data</TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort("robotReliability")}
                  >
                    Reliability {getSortIndicator("robotReliability")}
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTeams.map((team) => (
                  <TableRow key={team.teamNumber}>
                    <TableCell className="font-medium">{team.teamNumber}</TableCell>
                    <TableCell>{team.teamName}</TableCell>
                    <TableCell>{team.matchCount}</TableCell>
                    <TableCell>{team.averageScore}</TableCell>
                    <TableCell>{team.winRate.toFixed(0)}%</TableCell>
                    <TableCell className="text-center">
                      {team.hasPitData ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${(team.robotReliability / 5) * 100}%` }} 
                          />
                        </div>
                        <span className="ml-2 text-sm">{team.robotReliability}/5</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/analysis/teams/${team.teamNumber}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">
            {searchTerm ? "No teams match your search criteria" : "No team data available yet"}
          </p>
          {!searchTerm && (
            <div className="flex justify-center">
              <Link href="/scout">
                <Button>Start Scouting</Button>
              </Link>
          </div>
          )}
        </div>
      )}
      </div>
  );
} 