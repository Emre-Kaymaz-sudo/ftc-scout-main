"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { useScoutingStore } from '@/lib/store';
import { memoizedCalculateScore } from '@/lib/utils';
import { MatchScoutingData } from '@/lib/store';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, Plus } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  matchNumber: z.number().min(1, "Match number must be at least 1"),
  teamNumber: z.number().min(1, "Team number must be at least 1"),
  allianceColor: z.enum(["red", "blue"]),
  // Autonomous
  autoStartPosition: z.enum(["observation", "net", "specimen"]),
  // Auto Scoring
  autoParkObservationZone: z.boolean().default(false),
  autoSampleCollection: z.number().min(0),
  autoNetZonePlacement: z.number().min(0),
  autoLowBasket: z.number().min(0),
  autoHighBasket: z.number().min(0),
  autoSpecimenLowChamber: z.number().min(0),
  autoHighChamber: z.number().min(0),
  // Teleop
  teleopParkObservationZone: z.boolean().default(false),
  teleopSampleCollection: z.number().min(0),
  teleopNetZonePlacement: z.number().min(0),
  teleopLowBasket: z.number().min(0),
  teleopHighBasket: z.number().min(0),
  teleopSpecimenLowChamber: z.number().min(0),
  teleopHighChamber: z.number().min(0),
  // Endgame/Ascent
  endgameAscentLevel: z.enum(["none", "level1", "level2", "level3"]),
  // Match Result
  matchResult: z.enum(["win", "tie", "loss"]),
  // Robot Performance
  robotSpeed: z.number().min(1).max(5),
  robotReliability: z.number().min(1).max(5),
  robotManeuverability: z.number().min(1).max(5),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MatchScoutingFormProps {
  initialData?: MatchScoutingData;
  onSubmit?: (data: FormData) => void;
  submitLabel?: string;
}

export function MatchScoutingForm({ initialData, onSubmit: customOnSubmit, submitLabel = "Save" }: MatchScoutingFormProps) {
  const { toast } = useToast();
  const { addMatchScoutingData } = useScoutingStore();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      matchNumber: initialData.matchNumber,
      teamNumber: initialData.teamNumber,
      allianceColor: initialData.allianceColor,
      autoStartPosition: initialData.autoStartPosition,
      autoParkObservationZone: initialData.autoParkObservationZone,
      autoSampleCollection: initialData.autoSampleCollection,
      autoNetZonePlacement: initialData.autoNetZonePlacement,
      autoLowBasket: initialData.autoLowBasket,
      autoHighBasket: initialData.autoHighBasket,
      autoSpecimenLowChamber: initialData.autoSpecimenLowChamber,
      autoHighChamber: initialData.autoHighChamber,
      teleopParkObservationZone: initialData.teleopParkObservationZone,
      teleopSampleCollection: initialData.teleopSampleCollection,
      teleopNetZonePlacement: initialData.teleopNetZonePlacement,
      teleopLowBasket: initialData.teleopLowBasket,
      teleopHighBasket: initialData.teleopHighBasket,
      teleopSpecimenLowChamber: initialData.teleopSpecimenLowChamber,
      teleopHighChamber: initialData.teleopHighChamber,
      endgameAscentLevel: initialData.endgameAscentLevel,
      matchResult: initialData.matchResult,
      robotSpeed: initialData.robotSpeed,
      robotReliability: initialData.robotReliability,
      robotManeuverability: initialData.robotManeuverability,
      notes: initialData.notes || "",
    } : {
      matchNumber: 1,
      teamNumber: undefined,
      allianceColor: "red",
      autoStartPosition: "observation",
      autoParkObservationZone: false,
      autoSampleCollection: 0,
      autoNetZonePlacement: 0,
      autoLowBasket: 0,
      autoHighBasket: 0,
      autoSpecimenLowChamber: 0,
      autoHighChamber: 0,
      teleopParkObservationZone: false,
      teleopSampleCollection: 0,
      teleopNetZonePlacement: 0,
      teleopLowBasket: 0,
      teleopHighBasket: 0,
      teleopSpecimenLowChamber: 0,
      teleopHighChamber: 0,
      endgameAscentLevel: "none",
      matchResult: "loss",
      robotSpeed: 3,
      robotReliability: 3,
      robotManeuverability: 3,
      notes: "",
    },
  });

  // Calculate total score based on current form values
  const calculateTotalScore = () => {
    const values = form.getValues();
    // Add dummy id and timestamp for score calculation and ensure required fields have values
    const dataForScoring: MatchScoutingData = {
      id: initialData?.id || 'temp-id',
      timestamp: initialData?.timestamp || new Date().toISOString(),
      matchNumber: values.matchNumber || 1,
      teamNumber: values.teamNumber || 0,
      allianceColor: values.allianceColor || 'red',
      autoStartPosition: values.autoStartPosition || 'observation',
      autoParkObservationZone: values.autoParkObservationZone || false,
      autoSampleCollection: values.autoSampleCollection || 0,
      autoNetZonePlacement: values.autoNetZonePlacement || 0,
      autoLowBasket: values.autoLowBasket || 0,
      autoHighBasket: values.autoHighBasket || 0,
      autoSpecimenLowChamber: values.autoSpecimenLowChamber || 0,
      autoHighChamber: values.autoHighChamber || 0,
      teleopParkObservationZone: values.teleopParkObservationZone || false,
      teleopSampleCollection: values.teleopSampleCollection || 0,
      teleopNetZonePlacement: values.teleopNetZonePlacement || 0,
      teleopLowBasket: values.teleopLowBasket || 0,
      teleopHighBasket: values.teleopHighBasket || 0,
      teleopSpecimenLowChamber: values.teleopSpecimenLowChamber || 0,
      teleopHighChamber: values.teleopHighChamber || 0,
      endgameAscentLevel: values.endgameAscentLevel || 'none',
      matchResult: values.matchResult || 'loss',
      robotSpeed: values.robotSpeed || 3,
      robotReliability: values.robotReliability || 3,
      robotManeuverability: values.robotManeuverability || 3,
      notes: values.notes
    };
    
    const scoreData = memoizedCalculateScore(dataForScoring);
    
    return {
      autoScore: scoreData.auto,
      teleopScore: scoreData.teleop,
      endgameScore: scoreData.endgame,
      matchBonus: scoreData.bonus,
      totalScore: scoreData.total
    };
  };

  // Update score whenever form values change
  useEffect(() => {
    const subscription = form.watch(() => {
      form.trigger(); // This will validate the form and update errors
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const scoreData = calculateTotalScore();

  const handleSubmit = (data: FormData) => {
    try {
      if (customOnSubmit) {
        customOnSubmit(data);
      } else {
        // Convert FormData to MatchScoutingData (without id and timestamp)
        const matchData = {
          matchNumber: data.matchNumber || 1,
          teamNumber: data.teamNumber || 0,
          allianceColor: data.allianceColor || 'red',
          autoStartPosition: data.autoStartPosition || 'observation',
          autoParkObservationZone: data.autoParkObservationZone || false,
          autoSampleCollection: data.autoSampleCollection || 0,
          autoNetZonePlacement: data.autoNetZonePlacement || 0,
          autoLowBasket: data.autoLowBasket || 0,
          autoHighBasket: data.autoHighBasket || 0,
          autoSpecimenLowChamber: data.autoSpecimenLowChamber || 0,
          autoHighChamber: data.autoHighChamber || 0,
          teleopParkObservationZone: data.teleopParkObservationZone || false,
          teleopSampleCollection: data.teleopSampleCollection || 0,
          teleopNetZonePlacement: data.teleopNetZonePlacement || 0,
          teleopLowBasket: data.teleopLowBasket || 0,
          teleopHighBasket: data.teleopHighBasket || 0,
          teleopSpecimenLowChamber: data.teleopSpecimenLowChamber || 0,
          teleopHighChamber: data.teleopHighChamber || 0,
          endgameAscentLevel: data.endgameAscentLevel || 'none',
          matchResult: data.matchResult || 'loss',
          robotSpeed: data.robotSpeed || 3,
          robotReliability: data.robotReliability || 3,
          robotManeuverability: data.robotManeuverability || 3,
          notes: data.notes
        };
        
        addMatchScoutingData(matchData);
        form.reset();
      }
      
      toast({
        title: "Success",
        description: "Match data saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving the match data.",
      });
    }
  };

  // Helper for counter inputs
  const Counter = ({ name, label, points = '' }) => {
    const value = form.watch(name) || 0;
    
    const increment = () => {
      form.setValue(name, value + 1, { shouldValidate: true });
    };
    
    const decrement = () => {
      if (value > 0) {
        form.setValue(name, value - 1, { shouldValidate: true });
      }
    };
    
    // Extract the point value from the points text
    const pointValue = points.match(/(\d+)/)?.[0] || '';
    
    return (
      <div className="space-y-2">
        <div className="group relative">
          <Label className="flex justify-between cursor-help">
            <span className="border-b border-dotted border-gray-400">{label}</span>
            {points && <span className="text-sm text-blue-600 font-medium">{points}</span>}
          </Label>
          {pointValue && (
            <div className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 -mt-1 z-10 w-auto whitespace-nowrap">
              Each {label} = {pointValue} points
            </div>
          )}
        </div>
        <div className="flex items-center">
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            className="h-9 w-9 rounded-r-none"
            onClick={decrement}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <input
            type="number"
            value={value}
            onChange={(e) => form.setValue(name, parseInt(e.target.value) || 0, { shouldValidate: true })}
            className="h-9 px-3 py-2 text-center border-y border-gray-300 w-14"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            className="h-9 w-9 rounded-l-none"
            onClick={increment}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-1 text-xs text-gray-600 text-center">
          {value > 0 && pointValue && `${value} × ${pointValue} = ${value * parseInt(pointValue)} points`}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      {/* Score Summary (at the top for visibility) */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 overflow-hidden shadow-sm">
        <div className="bg-blue-600 py-3 px-4">
          <h3 className="text-md font-medium text-white">Score Summary</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col items-center justify-center transition-all hover:shadow-md">
              <div className="text-xs uppercase font-semibold text-blue-600 mb-1">Auto</div>
              <div className="text-2xl font-bold">{scoreData.autoScore}</div>
              <div className="text-xs font-medium text-green-600">(x2 in total)</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col items-center justify-center transition-all hover:shadow-md">
              <div className="text-xs uppercase font-semibold text-blue-600 mb-1">Teleop</div>
              <div className="text-2xl font-bold">{scoreData.teleopScore}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col items-center justify-center transition-all hover:shadow-md">
              <div className="text-xs uppercase font-semibold text-blue-600 mb-1">Endgame</div>
              <div className="text-2xl font-bold">{scoreData.endgameScore}</div>
            </div>
            <div className="bg-blue-600 rounded-lg p-3 shadow-sm flex flex-col items-center justify-center transition-all hover:shadow-md">
              <div className="text-xs uppercase font-semibold text-white mb-1">Total</div>
              <div className="text-2xl font-bold text-white">{scoreData.totalScore}</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between items-center text-sm text-blue-700">
            <div className="flex items-center">
              <span className="font-medium">Estimated Match Score</span>
              <span className="ml-3 text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">
                Auto points doubled
              </span>
              {scoreData.matchBonus > 0 && (
                <span className="ml-3 text-xs text-gray-600">
                  Match result: {form.watch("matchResult")} (not included in total)
                </span>
              )}
            </div>
            <div>
              <span className="text-xs bg-blue-100 py-1 px-2 rounded-full">FTC Centerstage 2023-2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Match Information */}
      <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium border-b pb-2">Match Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="matchNumber">Match Number</Label>
            <input
              type="number"
              id="matchNumber"
              {...form.register("matchNumber", { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <Label htmlFor="teamNumber">Team Number</Label>
            <input
              type="number"
              id="teamNumber"
              {...form.register("teamNumber", { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <div>
            <Label>Alliance Color</Label>
            <div className="flex mt-2 gap-4">
              <div 
                className={`flex-1 flex items-center justify-center cursor-pointer p-3 rounded-md border ${form.watch("allianceColor") === "red" ? "bg-red-100 border-red-400" : "border-gray-200"}`}
                onClick={() => form.setValue("allianceColor", "red")}
              >
                <div className="w-6 h-6 rounded-full bg-red-500 mr-2"></div>
                <span className={form.watch("allianceColor") === "red" ? "font-medium" : ""}>Red</span>
              </div>
              <div 
                className={`flex-1 flex items-center justify-center cursor-pointer p-3 rounded-md border ${form.watch("allianceColor") === "blue" ? "bg-blue-100 border-blue-400" : "border-gray-200"}`}
                onClick={() => form.setValue("allianceColor", "blue")}
              >
                <div className="w-6 h-6 rounded-full bg-blue-500 mr-2"></div>
                <span className={form.watch("allianceColor") === "blue" ? "font-medium" : ""}>Blue</span>
              </div>
            </div>
          </div>
          
          <div>
            <Label>Match Result</Label>
            <div className="text-xs text-gray-500 mb-1">
              For statistical purposes only (doesn't affect total score)
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div 
                className={`flex flex-col items-center justify-center cursor-pointer p-2 rounded-md border ${form.watch("matchResult") === "win" ? "bg-green-100 border-green-400" : "border-gray-200"}`}
                onClick={() => form.setValue("matchResult", "win")}
              >
                <span className={`${form.watch("matchResult") === "win" ? "font-medium" : ""}`}>Won</span>
              </div>
              <div 
                className={`flex flex-col items-center justify-center cursor-pointer p-2 rounded-md border ${form.watch("matchResult") === "tie" ? "bg-yellow-100 border-yellow-400" : "border-gray-200"}`}
                onClick={() => form.setValue("matchResult", "tie")}
              >
                <span className={`${form.watch("matchResult") === "tie" ? "font-medium" : ""}`}>Tied</span>
              </div>
              <div 
                className={`flex flex-col items-center justify-center cursor-pointer p-2 rounded-md border ${form.watch("matchResult") === "loss" ? "bg-red-100 border-red-400" : "border-gray-200"}`}
                onClick={() => form.setValue("matchResult", "loss")}
              >
                <span className={`${form.watch("matchResult") === "loss" ? "font-medium" : ""}`}>Lost</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scoring Tabs */}
      <Tabs defaultValue="auto" className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <TabsList className="w-full grid grid-cols-3 bg-gray-100 rounded-none border-b p-0">
          <TabsTrigger value="auto" className="py-3 data-[state=active]:bg-white rounded-none border-r">Autonomous</TabsTrigger>
          <TabsTrigger value="teleop" className="py-3 data-[state=active]:bg-white rounded-none border-r">Teleop</TabsTrigger>
          <TabsTrigger value="endgame" className="py-3 data-[state=active]:bg-white rounded-none">Endgame</TabsTrigger>
        </TabsList>
        
        {/* Autonomous Scoring */}
        <TabsContent value="auto" className="p-6 space-y-6">
          <div>
            <Label>Starting Position</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div 
                className={`flex items-center justify-center cursor-pointer p-3 rounded-md border ${form.watch("autoStartPosition") === "observation" ? "bg-blue-100 border-blue-400" : "border-gray-200"}`}
                onClick={() => form.setValue("autoStartPosition", "observation")}
              >
                <span className={form.watch("autoStartPosition") === "observation" ? "font-medium" : ""}>Observation Zone</span>
              </div>
              <div 
                className={`flex items-center justify-center cursor-pointer p-3 rounded-md border ${form.watch("autoStartPosition") === "net" ? "bg-blue-100 border-blue-400" : "border-gray-200"}`}
                onClick={() => form.setValue("autoStartPosition", "net")}
              >
                <span className={form.watch("autoStartPosition") === "net" ? "font-medium" : ""}>Net Zone</span>
              </div>
              <div 
                className={`flex items-center justify-center cursor-pointer p-3 rounded-md border ${form.watch("autoStartPosition") === "specimen" ? "bg-blue-100 border-blue-400" : "border-gray-200"}`}
                onClick={() => form.setValue("autoStartPosition", "specimen")}
              >
                <span className={form.watch("autoStartPosition") === "specimen" ? "font-medium" : ""}>Specimen Zone</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="autoParkObservationZone" 
                checked={form.watch("autoParkObservationZone")}
                onCheckedChange={(checked) => {
                  form.setValue("autoParkObservationZone", checked === true, { shouldValidate: true });
                }}
              />
              <div className="group relative w-full">
                <Label 
                  htmlFor="autoParkObservationZone" 
                  className="cursor-pointer flex justify-between"
                >
                  <span className="border-b border-dotted border-gray-400">Park in Observation Zone</span>
                  <span className="text-sm text-blue-600 font-medium ml-2">3 points</span>
                </Label>
                <div className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 -mt-1 z-10 w-auto whitespace-nowrap">
                  Parking in Observation Zone = 3 points
                </div>
              </div>
            </div>
            <Counter name="autoNetZonePlacement" label="Net Zone Placement" points="2 points/each" />
            <Counter name="autoLowBasket" label="Low Basket" points="4 points/each" /> 
            <Counter name="autoHighBasket" label="High Basket" points="8 points/each" />
            <Counter name="autoSpecimenLowChamber" label="Low Chamber" points="6 points/each" />
            <Counter name="autoHighChamber" label="High Chamber" points="10 points/each" />
            <Counter name="autoSampleCollection" label="Sample Collection" />
          </div>
        </TabsContent>
        
        {/* Teleop Scoring */}
        <TabsContent value="teleop" className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="teleopParkObservationZone" 
                checked={form.watch("teleopParkObservationZone")}
                onCheckedChange={(checked) => {
                  form.setValue("teleopParkObservationZone", checked === true, { shouldValidate: true });
                }}
              />
              <div className="group relative w-full">
                <Label 
                  htmlFor="teleopParkObservationZone" 
                  className="cursor-pointer flex justify-between"
                >
                  <span className="border-b border-dotted border-gray-400">Park in Observation Zone</span>
                  <span className="text-sm text-blue-600 font-medium ml-2">3 points</span>
                </Label>
                <div className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 -mt-1 z-10 w-auto whitespace-nowrap">
                  Parking in Observation Zone = 3 points
                </div>
              </div>
            </div>
            <Counter name="teleopNetZonePlacement" label="Net Zone Placement" points="2 points/each" />
            <Counter name="teleopLowBasket" label="Low Basket" points="4 points/each" />
            <Counter name="teleopHighBasket" label="High Basket" points="8 points/each" />
            <Counter name="teleopSpecimenLowChamber" label="Low Chamber" points="6 points/each" />
            <Counter name="teleopHighChamber" label="High Chamber" points="10 points/each" />
            <Counter name="teleopSampleCollection" label="Sample Collection" />
          </div>
        </TabsContent>
        
        {/* Endgame Scoring */}
        <TabsContent value="endgame" className="p-6 space-y-6">
          <div>
            <Label>Climbing Level</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <div 
                className="group relative flex flex-col items-center justify-center cursor-pointer p-3 rounded-md border border-gray-200 hover:bg-gray-50"
                onClick={() => form.setValue("endgameAscentLevel", "none")}
              >
                <span className={form.watch("endgameAscentLevel") === "none" ? "font-medium" : ""}>No Climbing</span>
                <span className="text-xs text-gray-500">(0 points)</span>
                {form.watch("endgameAscentLevel") === "none" && <div className="absolute inset-0 bg-gray-100 border-gray-400 rounded-md -z-10"></div>}
                <div className="absolute invisible group-hover:visible top-full mt-1 bg-gray-900 text-white text-xs rounded py-1 px-2 z-10">
                  No climbing = 0 points
                </div>
              </div>
              <div 
                className="group relative flex flex-col items-center justify-center cursor-pointer p-3 rounded-md border border-gray-200 hover:bg-green-50"
                onClick={() => form.setValue("endgameAscentLevel", "level1")}
              >
                <span className={form.watch("endgameAscentLevel") === "level1" ? "font-medium" : ""}>Level 1</span>
                <span className="text-xs text-gray-500">(3 points)</span>
                {form.watch("endgameAscentLevel") === "level1" && <div className="absolute inset-0 bg-green-100 border-green-400 rounded-md -z-10"></div>}
                <div className="absolute invisible group-hover:visible top-full mt-1 bg-gray-900 text-white text-xs rounded py-1 px-2 z-10">
                  Level 1 climbing = 3 points
                </div>
              </div>
              <div 
                className="group relative flex flex-col items-center justify-center cursor-pointer p-3 rounded-md border border-gray-200 hover:bg-green-50"
                onClick={() => form.setValue("endgameAscentLevel", "level2")}
              >
                <span className={form.watch("endgameAscentLevel") === "level2" ? "font-medium" : ""}>Level 2</span>
                <span className="text-xs text-gray-500">(15 points)</span>
                {form.watch("endgameAscentLevel") === "level2" && <div className="absolute inset-0 bg-green-100 border-green-400 rounded-md -z-10"></div>}
                <div className="absolute invisible group-hover:visible top-full mt-1 bg-gray-900 text-white text-xs rounded py-1 px-2 z-10">
                  Level 2 climbing = 15 points
                </div>
              </div>
              <div 
                className="group relative flex flex-col items-center justify-center cursor-pointer p-3 rounded-md border border-gray-200 hover:bg-green-50"
                onClick={() => form.setValue("endgameAscentLevel", "level3")}
              >
                <span className={form.watch("endgameAscentLevel") === "level3" ? "font-medium" : ""}>Level 3</span>
                <span className="text-xs text-gray-500">(30 points)</span>
                {form.watch("endgameAscentLevel") === "level3" && <div className="absolute inset-0 bg-green-100 border-green-400 rounded-md -z-10"></div>}
                <div className="absolute invisible group-hover:visible top-full mt-1 bg-gray-900 text-white text-xs rounded py-1 px-2 z-10">
                  Level 3 climbing = 30 points (maximum)
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Robot Performance */}
      <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium border-b pb-2">Robot Performance</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-1">
              <Label>Speed</Label>
              <span className="text-sm font-medium">{form.watch("robotSpeed")}/5</span>
            </div>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[form.watch("robotSpeed")]}
              onValueChange={([value]) => form.setValue("robotSpeed", value)}
              className="mt-2"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <Label>Reliability</Label>
              <span className="text-sm font-medium">{form.watch("robotReliability")}/5</span>
            </div>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[form.watch("robotReliability")]}
              onValueChange={([value]) => form.setValue("robotReliability", value)}
              className="mt-2"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <Label>Maneuverability</Label>
              <span className="text-sm font-medium">{form.watch("robotManeuverability")}/5</span>
            </div>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[form.watch("robotManeuverability")]}
              onValueChange={([value]) =>
                form.setValue("robotManeuverability", value)
              }
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <Label htmlFor="notes" className="block mb-2">Notes</Label>
        <textarea
          id="notes"
          {...form.register("notes")}
          className="block w-full rounded-md border border-gray-300 px-3 py-2"
          rows={4}
          placeholder="Additional observations, strategy notes, or issues..."
        />
      </div>

      <Button 
        type="submit" 
        className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700"
      >
        {submitLabel}
      </Button>
    </form>
  );
} 