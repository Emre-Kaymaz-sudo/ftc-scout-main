import { MatchScoutingForm } from '@/components/MatchScoutingForm';

export default function MatchScoutingPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Match Scouting</h1>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <MatchScoutingForm />
      </div>
    </div>
  );
} 