import Link from 'next/link';
import { BadgeInfo, Ruler, Database } from 'lucide-react';

export default function ScoutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
            <Database className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">FTC Scout</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive scouting system for FTC. Track robot capabilities, scoring patterns, and team performances.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Match Scouting Card */}
        <Link 
          href="/scout/match"
          className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:shadow-orange-100 transition-all duration-300"
        >
          <div className="p-8">
            <div className="flex items-center justify-center mb-6 h-16 w-16 rounded-full bg-orange-100 text-orange-500 mx-auto">
              <Database className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-3 text-gray-900">Match Scouting</h2>
            <p className="text-gray-600 text-center mb-6">
              Record team performance during matches, including scoring capabilities, autonomous routines, and endgame strategies.
            </p>
            <div className="bg-orange-50 rounded-xl p-4 text-sm text-orange-700">
              <p className="font-medium">Capture critical match data:</p>
              <ul className="mt-2 space-y-1 list-disc pl-5">
                <li>Autonomous performance</li>
                <li>Teleop scoring efficiency</li>
                <li>Endgame capabilities</li>
                <li>Match results & alliance strength</li>
              </ul>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t text-center">
            <span className="inline-block bg-orange-100 text-orange-600 font-medium px-6 py-2 rounded-full group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
              Start Match Scouting
            </span>
          </div>
        </Link>

        {/* Pit Scouting Card */}
        <Link 
          href="/scout/pit"
          className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:shadow-orange-100 transition-all duration-300"
        >
          <div className="p-8">
            <div className="flex items-center justify-center mb-6 h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
              <BadgeInfo className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-3 text-gray-900">Pit Scouting</h2>
            <p className="text-gray-600 text-center mb-6">
              Document robot specifications, drivetrain details, mechanisms, and team strategies before matches begin.
            </p>
            <div className="bg-green-50 rounded-xl p-4 text-sm text-green-700">
              <p className="font-medium">Record robot details:</p>
              <ul className="mt-2 space-y-1 list-disc pl-5">
                <li>Drivetrain & physical specifications</li>
                <li>Scoring mechanisms</li>
                <li>Autonomous capabilities</li>
                <li>Team strategy & preferred roles</li>
              </ul>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t text-center">
            <span className="inline-block bg-green-100 text-green-600 font-medium px-6 py-2 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
              Start Pit Scouting
            </span>
          </div>
        </Link>
      </div>

      <div className="mt-12 bg-orange-50 border border-orange-100 rounded-2xl p-8 max-w-3xl mx-auto">
        <div className="flex items-start space-x-4">
          <div className="bg-orange-100 p-3 rounded-full text-orange-600 mt-1">
            <Ruler className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">FTC Scouting Guide</h3>
            <p className="text-gray-700 mb-4">
              Effective scouting leads to better alliance selections and match strategies:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs font-bold">1</span>
                Record match data for consistent performance tracking
              </li>
              <li className="flex items-center">
                <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs font-bold">2</span>
                Document robot specifications in the pit area
              </li>
              <li className="flex items-center">
                <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs font-bold">3</span>
                Analyze scoring patterns and capabilities
              </li>
              <li className="flex items-center">
                <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs font-bold">4</span>
                Make data-driven alliance selections
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 