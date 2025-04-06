"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useScoutingStore } from "@/lib/store";
import { MatchScoutingForm } from "@/components/MatchScoutingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditMatchPage() {
  const router = useRouter();
  const params = useParams();
  const matchId = params.matchId as string;
  const [matchData, setMatchData] = useState(null);
  const { matchScoutingData } = useScoutingStore();

  // Load match data on component mount
  useEffect(() => {
    const match = matchScoutingData.find((match) => match.id === matchId);
    if (match) {
      setMatchData(match);
    } else {
      // Match not found, redirect to matches list
      router.push("/scouting/match");
    }
  }, [matchId, matchScoutingData, router]);

  const handleUpdateMatch = (updatedData) => {
    try {
      // Keep the same ID and timestamp
      const combinedData = {
        ...updatedData,
        id: matchData.id,
        timestamp: matchData.timestamp,
      };

      // Update the match in the store
      const updatedMatches = matchScoutingData.map((match) =>
        match.id === matchId ? combinedData : match
      );

      // Update state in the store
      useScoutingStore.setState({ matchScoutingData: updatedMatches });

      // Navigate back to team page
      router.push(`/analysis/teams/${matchData.teamNumber}`);
    } catch (error) {
      console.error("Failed to update match data:", error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-4">
        <Link href={`/analysis/teams/${matchData?.teamNumber || ''}`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Team
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Edit Match Data</CardTitle>
        </CardHeader>
        <CardContent>
          {matchData ? (
            <MatchScoutingForm
              initialData={matchData}
              onSubmit={handleUpdateMatch}
              submitLabel="Update Match Data"
            />
          ) : (
            <div className="text-center py-8">Loading match data...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 