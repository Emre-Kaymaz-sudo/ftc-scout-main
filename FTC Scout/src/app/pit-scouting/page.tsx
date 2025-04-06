import { PitScoutingForm } from '@/components/PitScoutingForm';

export default function PitScoutingPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Pit Scouting</h1>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <PitScoutingForm />
      </div>
    </div>
  );
} 