import { PitScoutingForm } from '@/components/PitScoutingForm';
import { Ruler, Bot, Lightbulb } from 'lucide-react';

export default function PitScoutingPage() {
  return (
    <main className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Pit Scouting</h1>
          <p className="text-gray-600">
            Collect information about robot designs, capabilities, and team strategies during pit visits.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
            <div className="p-4 flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <Ruler className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium">Robot Features</h3>
                <p className="text-sm text-gray-500">Physical dimensions and technical details</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <Bot className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium">Game Capabilities</h3>
                <p className="text-sm text-gray-500">Robot abilities during the game</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <Lightbulb className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium">Team Strategy</h3>
                <p className="text-sm text-gray-500">Preferred roles and strategies</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-4 px-6">
            <h2 className="text-xl font-bold text-white">Pit Scouting Form</h2>
          </div>
          <div className="p-6">
            <PitScoutingForm />
          </div>
        </div>
      </div>
    </main>
  );
} 