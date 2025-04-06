import { NextResponse } from 'next/server';

// Örnek veri
const sampleTeams = [
  {
    id: 1,
    teamNumber: 10355,
    teamName: "Robotakev",
    matchCount: 12,
    averageScore: 145,
    winRate: 75,
    robotSpeed: 4.5,
    robotReliability: 4.2,
    robotManeuverability: 4.7
  },
  {
    id: 2,
    teamNumber: 12345,
    teamName: "Tech Titans",
    matchCount: 8,
    averageScore: 132,
    winRate: 62.5,
    robotSpeed: 4.2,
    robotReliability: 4.0,
    robotManeuverability: 4.3
  },
  {
    id: 3,
    teamNumber: 67890,
    teamName: "Quantum Mechanics",
    matchCount: 10,
    averageScore: 157,
    winRate: 80,
    robotSpeed: 4.8,
    robotReliability: 4.5,
    robotManeuverability: 4.9
  }
];

export async function GET() {
  return NextResponse.json(sampleTeams);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Yeni bir takım oluştur
    const newTeam = {
      id: sampleTeams.length + 1,
      teamNumber: body.teamNumber || 0,
      teamName: body.teamName || 'Unnamed Team',
      matchCount: body.matchCount || 0,
      averageScore: body.averageScore || 0,
      winRate: body.winRate || 0,
      robotSpeed: body.robotSpeed || 3,
      robotReliability: body.robotReliability || 3,
      robotManeuverability: body.robotManeuverability || 3
    };
    
    // Gerçek bir veritabanı olmadığı için burada sadece başarılı olduğunu simüle ediyoruz
    return NextResponse.json(newTeam, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 400 }
    );
  }
} 