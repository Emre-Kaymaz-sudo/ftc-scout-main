import { MatchScoutingForm } from '@/components/MatchScoutingForm';
import { Clipboard, StopCircle, Gamepad2 } from 'lucide-react';

export default function MatchScoutingPage() {
  return (
    <main className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Match Scouting</h1>
          <p className="text-gray-600">
            Record match performance data for a team. Fill out this form while watching a match or immediately after.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
            <div className="p-4 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Clipboard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Enter match info</h3>
                <p className="text-sm text-gray-500">Team and match number</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Gamepad2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Track score</h3>
                <p className="text-sm text-gray-500">Monitor points during the match</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <StopCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Complete the form</h3>
                <p className="text-sm text-gray-500">Fill all fields and save</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-4 px-6">
            <h2 className="text-xl font-bold text-white">Match Scouting Form</h2>
          </div>
          <div className="p-6">
            <MatchScoutingForm />
          </div>
        </div>
      </div>
    </main>
  );
} 