"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface Team {
  id: number;
  teamNumber: number;
  teamName: string;
  matchCount: number;
  averageScore: number;
  winRate: number;
  robotSpeed: number;
  robotReliability: number;
  robotManeuverability: number;
}

export default function TeamsApiPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newTeam, setNewTeam] = useState({
    teamNumber: '',
    teamName: '',
  });
  
  const { toast } = useToast();

  // Get the base path
  const getBasePath = () => {
    // In development, we don't need a base path
    if (process.env.NODE_ENV === 'development') {
      return '';
    }
    // In production, we use the basePath from next.config.js (if any)
    return '';
  };

  // API'den takımları getir
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const basePath = getBasePath();
        const response = await fetch(`${basePath}/api/data`);
        if (!response.ok) {
          throw new Error('API yanıt vermedi');
        }
        const data = await response.json();
        setTeams(data);
        setLoading(false);
      } catch (err) {
        setError('Takımlar yüklenirken bir hata oluştu');
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Yeni takım oluşturma
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTeam.teamNumber || !newTeam.teamName) {
      toast({
        title: "Hata",
        description: "Takım numarası ve adı gereklidir",
      });
      return;
    }
    
    try {
      const basePath = getBasePath();
      const response = await fetch(`${basePath}/api/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamNumber: parseInt(newTeam.teamNumber),
          teamName: newTeam.teamName,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Takım oluşturulamadı');
      }
      
      const createdTeam = await response.json();
      
      // UI'ı güncelle - gerçek bir veritabanında buna gerek olmaz
      setTeams([...teams, createdTeam]);
      
      // Formu sıfırla
      setNewTeam({
        teamNumber: '',
        teamName: '',
      });
      
      toast({
        title: "Başarılı",
        description: "Yeni takım oluşturuldu",
      });
    } catch (err) {
      toast({
        title: "Hata",
        description: "Takım oluşturulurken bir hata oluştu",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Takımlar API Demo</h1>
        <Link href="/">
          <Button variant="outline">Ana Sayfaya Dön</Button>
        </Link>
      </div>

      {/* Yeni Takım Formu */}
      <div className="mb-8 p-6 bg-white rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Yeni Takım Ekle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teamNumber">Takım Numarası</Label>
              <Input
                id="teamNumber"
                type="number"
                value={newTeam.teamNumber}
                onChange={(e) => setNewTeam({ ...newTeam, teamNumber: e.target.value })}
                placeholder="Takım numarası girin"
              />
            </div>
            <div>
              <Label htmlFor="teamName">Takım Adı</Label>
              <Input
                id="teamName"
                value={newTeam.teamName}
                onChange={(e) => setNewTeam({ ...newTeam, teamName: e.target.value })}
                placeholder="Takım adı girin"
              />
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto">Takım Ekle</Button>
        </form>
      </div>

      {/* Takımlar Tablosu */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Takım No</TableHead>
              <TableHead>Takım Adı</TableHead>
              <TableHead>Maç Sayısı</TableHead>
              <TableHead>Ortalama Skor</TableHead>
              <TableHead>Kazanma Oranı</TableHead>
              <TableHead>Robot Hızı</TableHead>
              <TableHead>Güvenilirlik</TableHead>
              <TableHead>Manevra</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.teamNumber}</TableCell>
                <TableCell>{team.teamName}</TableCell>
                <TableCell>{team.matchCount}</TableCell>
                <TableCell>{team.averageScore}</TableCell>
                <TableCell>{team.winRate}%</TableCell>
                <TableCell>{team.robotSpeed}</TableCell>
                <TableCell>{team.robotReliability}</TableCell>
                <TableCell>{team.robotManeuverability}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-8 p-6 bg-white rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">API Endpointleri</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">GET /api/data</h3>
            <p className="text-gray-600">Tüm takımları getirir</p>
            <pre className="bg-gray-100 p-2 rounded mt-2">
              fetch('/api/data').then(res => res.json())
            </pre>
          </div>
          <div>
            <h3 className="font-semibold">POST /api/data</h3>
            <p className="text-gray-600">Yeni takım oluşturur</p>
            <pre className="bg-gray-100 p-2 rounded mt-2">
              {`fetch('/api/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    teamNumber: 12345,
    teamName: 'Yeni Takım'
  })
}).then(res => res.json())`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 