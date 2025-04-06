"use client"

import Link from 'next/link';
import { useState } from 'react';
import { Database, BarChart3, Users, ChevronRight } from 'lucide-react';
import { useScoutingStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function AnalysisPage() {
  const { matchScoutingData, pitScoutingData } = useScoutingStore();
  
  // Count unique teams
  const uniqueMatchTeams = new Set(matchScoutingData.map(match => match.teamNumber));
  const uniquePitTeams = new Set(pitScoutingData.map(pit => pit.teamNumber));
  
  // Merge both sets to get total unique teams
  const allUniqueTeams = new Set([...uniqueMatchTeams, ...uniquePitTeams]);
  
  const stats = {
    totalMatches: matchScoutingData.length,
    totalTeams: allUniqueTeams.size,
    totalPitScouted: pitScoutingData.length,
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Analysis Dashboard</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Review scouting data, analyze team performances, and make informed alliance selections.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 p-6 text-center">
          <div className="inline-flex h-12 w-12 rounded-full bg-blue-100 items-center justify-center mb-4">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">{stats.totalTeams}</div>
          <div className="text-gray-600">Unique Teams</div>
        </div>
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 p-6 text-center">
          <div className="inline-flex h-12 w-12 rounded-full bg-orange-100 items-center justify-center mb-4">
            <Database className="h-6 w-6 text-orange-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">{stats.totalMatches}</div>
          <div className="text-gray-600">Matches Recorded</div>
        </div>
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 p-6 text-center">
          <div className="inline-flex h-12 w-12 rounded-full bg-green-100 items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
            </svg>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">{stats.totalPitScouted}</div>
          <div className="text-gray-600">Pit Scouting Reports</div>
        </div>
      </div>

      {/* Analysis Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
        <Link 
          href="/analysis/teams"
          className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 overflow-hidden group"
        >
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-4 rounded-xl mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Team Analysis</h2>
            </div>
            <p className="text-gray-600 mb-6">
              View detailed statistics for each team, including performance metrics, scoring capabilities, and robot specifications.
            </p>
            <div className="flex items-center text-blue-600 font-medium group-hover:text-orange-500 transition-colors">
              View Teams <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link 
          href="/analysis/matches"
          className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 overflow-hidden group"
        >
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 p-4 rounded-xl mr-4">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Match Analysis</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Analyze match performance data, compare alliance scores, and track scoring patterns across different matches.
            </p>
            <div className="flex items-center text-orange-600 font-medium group-hover:text-orange-500 transition-colors">
              View Matches <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link 
          href="/analysis/alliance"
          className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 overflow-hidden group"
        >
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-4 rounded-xl mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Alliance Selection</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Compare teams, simulate alliance combinations, and make data-driven decisions for optimal alliance selections.
            </p>
            <div className="flex items-center text-green-600 font-medium group-hover:text-orange-500 transition-colors">
              Alliance Tools <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Team List */}
      <div className="bg-white rounded-2xl shadow-md mb-12 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Recently Scouted Teams</h2>
          <Link href="/analysis/teams" className="text-orange-500 text-sm hover:text-orange-600 font-medium">
            View All Teams
          </Link>
        </div>

        {allUniqueTeams.size > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matches
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pit Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.from(allUniqueTeams).slice(0, 5).map((teamNumber) => {
                  const teamMatches = matchScoutingData.filter(m => m.teamNumber === teamNumber);
                  const pitData = pitScoutingData.find(p => p.teamNumber === teamNumber);
                  
                  return (
                    <tr key={teamNumber} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {teamNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {pitData?.teamName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {teamMatches.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {pitData ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/analysis/teams/${teamNumber}`}>
                          <Button variant="outline" size="sm" className="text-orange-500 hover:text-orange-600">
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="mt-4 text-gray-500 mb-6">No team data available yet.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/scout/match">
                <Button variant="outline" className="rounded-full">Start Match Scouting</Button>
              </Link>
              <Link href="/scout/pit">
                <Button variant="outline" className="rounded-full">Start Pit Scouting</Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 max-w-3xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Management</h3>
        <p className="text-gray-700 mb-6">
          Export your scouting data for backup or import from another device to ensure your valuable insights are never lost.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="bg-white rounded-full hover:bg-orange-500 hover:text-white border-orange-200">
            Export Data
          </Button>
          <Button variant="outline" className="bg-white rounded-full hover:bg-orange-500 hover:text-white border-orange-200">
            Import Data
          </Button>
        </div>
      </div>
    </div>
  );
} 