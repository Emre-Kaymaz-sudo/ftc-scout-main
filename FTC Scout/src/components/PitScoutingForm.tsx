"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useScoutingStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  teamNumber: z.number().min(1, 'Team number must be at least 1'),
  teamName: z.string().min(1, 'Team name is required'),
  // Robot specs
  drivetrainType: z.enum(['tank', 'mecanum', 'swerve', 'other']),
  drivetrainNotes: z.string().optional(),
  weight: z.number().min(0),
  length: z.number().min(0),
  width: z.number().min(0),
  height: z.number().min(0),
  // Game abilities
  canCollectSamples: z.boolean(),
  canPlaceInNetZone: z.boolean(),
  canScoreLowBasket: z.boolean(),
  canScoreHighBasket: z.boolean(),
  canPlaceInLowChamber: z.boolean(),
  canPlaceInHighChamber: z.boolean(),
  maxAscentLevel: z.enum(['none', 'level1', 'level2', 'level3']),
  // Autonomous capabilities
  autoStartPositions: z.array(z.enum(['observation', 'net', 'specimen'])),
  autoSampleCollection: z.boolean(),
  autoScoring: z.boolean(),
  autoAscent: z.boolean(),
  // Strategy
  robotSpeed: z.number().min(1).max(5),
  robotReliability: z.number().min(1).max(5),
  robotManeuverability: z.number().min(1).max(5),
  preferredRole: z.enum(['sampler', 'scorer', 'hybrid']),
  preferredZone: z.enum(['observation', 'net', 'specimen', 'mixed']),
  strategyNotes: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function PitScoutingForm() {
  const { toast } = useToast();
  const { addPitScoutingData } = useScoutingStore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamNumber: undefined,
      teamName: '',
      drivetrainType: 'tank',
      drivetrainNotes: '',
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      canCollectSamples: false,
      canPlaceInNetZone: false,
      canScoreLowBasket: false,
      canScoreHighBasket: false,
      canPlaceInLowChamber: false,
      canPlaceInHighChamber: false,
      maxAscentLevel: 'none',
      autoStartPositions: [],
      autoSampleCollection: false,
      autoScoring: false,
      autoAscent: false,
      robotSpeed: 3,
      robotReliability: 3,
      robotManeuverability: 3,
      preferredRole: 'hybrid',
      preferredZone: 'mixed',
      strategyNotes: '',
      notes: '',
    },
  });

  const onSubmit = (data: FormData) => {
    try {
      // Convert FormData to PitScoutingData (without id and timestamp)
      const pitData = {
        teamNumber: data.teamNumber || 0,
        teamName: data.teamName || '',
        drivetrainType: data.drivetrainType || 'tank',
        drivetrainNotes: data.drivetrainNotes,
        weight: data.weight || 0,
        length: data.length || 0,
        width: data.width || 0,
        height: data.height || 0,
        canCollectSamples: data.canCollectSamples || false,
        canPlaceInNetZone: data.canPlaceInNetZone || false,
        canScoreLowBasket: data.canScoreLowBasket || false,
        canScoreHighBasket: data.canScoreHighBasket || false,
        canPlaceInLowChamber: data.canPlaceInLowChamber || false,
        canPlaceInHighChamber: data.canPlaceInHighChamber || false,
        maxAscentLevel: data.maxAscentLevel || 'none',
        autoStartPositions: data.autoStartPositions || [],
        autoSampleCollection: data.autoSampleCollection || false,
        autoScoring: data.autoScoring || false,
        autoAscent: data.autoAscent || false,
        robotSpeed: data.robotSpeed || 3,
        robotReliability: data.robotReliability || 3,
        robotManeuverability: data.robotManeuverability || 3,
        preferredRole: data.preferredRole || 'hybrid',
        preferredZone: data.preferredZone || 'mixed',
        strategyNotes: data.strategyNotes,
        notes: data.notes
      };
      
      addPitScoutingData(pitData);
      form.reset();
      toast({
        title: 'Success',
        description: 'Pit scouting data has been saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save pit scouting data. Please try again.',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Team Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Team Information</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="teamNumber">Team Number</Label>
            <input
              type="number"
              id="teamNumber"
              {...form.register('teamNumber', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <Label htmlFor="teamName">Team Name</Label>
            <input
              type="text"
              id="teamName"
              {...form.register('teamName')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Robot Design */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Robot Design</h3>
        <div className="grid gap-4">
          <div>
            <Label>Drivetrain Type</Label>
            <RadioGroup
              onValueChange={(value) =>
                form.setValue(
                  'drivetrainType',
                  value as 'tank' | 'mecanum' | 'swerve' | 'other'
                )
              }
              defaultValue={form.getValues('drivetrainType')}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tank" id="tank" />
                <Label htmlFor="tank">Tank</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mecanum" id="mecanum" />
                <Label htmlFor="mecanum">Mecanum</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="swerve" id="swerve" />
                <Label htmlFor="swerve">Swerve</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="drivetrainNotes">Drivetrain Notes</Label>
            <textarea
              id="drivetrainNotes"
              {...form.register('drivetrainNotes')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={2}
              placeholder="Details about unique features"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight (lbs)</Label>
              <input
                type="number"
                id="weight"
                {...form.register('weight', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <Label htmlFor="length">Length (inches)</Label>
              <input
                type="number"
                id="length"
                {...form.register('length', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <Label htmlFor="width">Width (inches)</Label>
              <input
                type="number"
                id="width"
                {...form.register('width', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <Label htmlFor="height">Height (inches)</Label>
              <input
                type="number"
                id="height"
                {...form.register('height', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Game Abilities */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Game Capabilities</h3>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="canCollectSamples"
                checked={form.watch('canCollectSamples')}
                onCheckedChange={(checked) =>
                  form.setValue('canCollectSamples', !!checked)
                }
              />
              <Label htmlFor="canCollectSamples">
                Can Collect Samples
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="canPlaceInNetZone"
                checked={form.watch('canPlaceInNetZone')}
                onCheckedChange={(checked) =>
                  form.setValue('canPlaceInNetZone', !!checked)
                }
              />
              <Label htmlFor="canPlaceInNetZone">
                Can Place in Net Zone (2 pts)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="canScoreLowBasket"
                checked={form.watch('canScoreLowBasket')}
                onCheckedChange={(checked) =>
                  form.setValue('canScoreLowBasket', !!checked)
                }
              />
              <Label htmlFor="canScoreLowBasket">
                Can Score in Low Basket (4 pts)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="canScoreHighBasket"
                checked={form.watch('canScoreHighBasket')}
                onCheckedChange={(checked) =>
                  form.setValue('canScoreHighBasket', !!checked)
                }
              />
              <Label htmlFor="canScoreHighBasket">
                Can Score in High Basket (8 pts)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="canPlaceInLowChamber"
                checked={form.watch('canPlaceInLowChamber')}
                onCheckedChange={(checked) =>
                  form.setValue('canPlaceInLowChamber', !!checked)
                }
              />
              <Label htmlFor="canPlaceInLowChamber">
                Can Place in Low Chamber (6 pts)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="canPlaceInHighChamber"
                checked={form.watch('canPlaceInHighChamber')}
                onCheckedChange={(checked) =>
                  form.setValue('canPlaceInHighChamber', !!checked)
                }
              />
              <Label htmlFor="canPlaceInHighChamber">
                Can Place in High Chamber (10 pts)
              </Label>
            </div>
          </div>
          
          <div>
            <Label>Maximum Ascent Level</Label>
            <RadioGroup
              onValueChange={(value) =>
                form.setValue(
                  'maxAscentLevel',
                  value as 'none' | 'level1' | 'level2' | 'level3'
                )
              }
              defaultValue={form.getValues('maxAscentLevel')}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="ascent-none" />
                <Label htmlFor="ascent-none">No Ascent (0 pts)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="level1" id="ascent-level1" />
                <Label htmlFor="ascent-level1">Level 1 (3 pts)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="level2" id="ascent-level2" />
                <Label htmlFor="ascent-level2">Level 2 (15 pts)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="level3" id="ascent-level3" />
                <Label htmlFor="ascent-level3">Level 3 (30 pts)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Autonomous Capabilities */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Autonomous Capabilities</h3>
        <div className="grid gap-4">
          <div>
            <Label>Start Positions (Select all that apply)</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoStartObservation"
                  checked={form.watch('autoStartPositions').includes('observation')}
                  onCheckedChange={(checked) => {
                    const current = form.watch('autoStartPositions');
                    if (checked) {
                      form.setValue('autoStartPositions', [...current, 'observation']);
                    } else {
                      form.setValue(
                        'autoStartPositions',
                        current.filter((pos) => pos !== 'observation')
                      );
                    }
                  }}
                />
                <Label htmlFor="autoStartObservation">Observation Zone</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoStartNet"
                  checked={form.watch('autoStartPositions').includes('net')}
                  onCheckedChange={(checked) => {
                    const current = form.watch('autoStartPositions');
                    if (checked) {
                      form.setValue('autoStartPositions', [
                        ...current,
                        'net',
                      ]);
                    } else {
                      form.setValue(
                        'autoStartPositions',
                        current.filter((pos) => pos !== 'net')
                      );
                    }
                  }}
                />
                <Label htmlFor="autoStartNet">Net Zone</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoStartSpecimen"
                  checked={form.watch('autoStartPositions').includes('specimen')}
                  onCheckedChange={(checked) => {
                    const current = form.watch('autoStartPositions');
                    if (checked) {
                      form.setValue('autoStartPositions', [
                        ...current,
                        'specimen',
                      ]);
                    } else {
                      form.setValue(
                        'autoStartPositions',
                        current.filter((pos) => pos !== 'specimen')
                      );
                    }
                  }}
                />
                <Label htmlFor="autoStartSpecimen">Specimen Zone</Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoSampleCollection"
                checked={form.watch('autoSampleCollection')}
                onCheckedChange={(checked) =>
                  form.setValue('autoSampleCollection', !!checked)
                }
              />
              <Label htmlFor="autoSampleCollection">
                Autonomous Sample Collection
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoScoring"
                checked={form.watch('autoScoring')}
                onCheckedChange={(checked) =>
                  form.setValue('autoScoring', !!checked)
                }
              />
              <Label htmlFor="autoScoring">
                Autonomous Scoring (Any Location)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoAscent"
                checked={form.watch('autoAscent')}
                onCheckedChange={(checked) =>
                  form.setValue('autoAscent', !!checked)
                }
              />
              <Label htmlFor="autoAscent">
                Autonomous Ascent
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Robot Performance and Strategy */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Performance and Strategy</h3>
        <div className="grid gap-4">
          <div>
            <Label>Speed</Label>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[form.watch('robotSpeed')]}
              onValueChange={([value]) => form.setValue('robotSpeed', value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Reliability</Label>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[form.watch('robotReliability')]}
              onValueChange={([value]) =>
                form.setValue('robotReliability', value)
              }
              className="mt-2"
            />
          </div>
          <div>
            <Label>Maneuverability</Label>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[form.watch('robotManeuverability')]}
              onValueChange={([value]) =>
                form.setValue('robotManeuverability', value)
              }
              className="mt-2"
            />
          </div>

          <div>
            <Label>Preferred Role</Label>
            <RadioGroup
              onValueChange={(value) =>
                form.setValue(
                  'preferredRole',
                  value as 'sampler' | 'scorer' | 'hybrid'
                )
              }
              defaultValue={form.getValues('preferredRole')}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sampler" id="sampler" />
                <Label htmlFor="sampler">Sample Collector</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scorer" id="scorer" />
                <Label htmlFor="scorer">Scorer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hybrid" id="hybrid" />
                <Label htmlFor="hybrid">Hybrid/Versatile</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Preferred Zone</Label>
            <RadioGroup
              onValueChange={(value) =>
                form.setValue(
                  'preferredZone',
                  value as 'observation' | 'net' | 'specimen' | 'mixed'
                )
              }
              defaultValue={form.getValues('preferredZone')}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="observation" id="pref-observation" />
                <Label htmlFor="pref-observation">Observation Zone</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="net" id="pref-net" />
                <Label htmlFor="pref-net">Net Zone</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specimen" id="pref-specimen" />
                <Label htmlFor="pref-specimen">Specimen Zone</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mixed" id="pref-mixed" />
                <Label htmlFor="pref-mixed">Mixed/Multiple Zones</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="strategyNotes">Strategy Notes</Label>
            <textarea
              id="strategyNotes"
              {...form.register('strategyNotes')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              placeholder="Team's strategy, strengths, alliance preferences..."
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">General Notes</Label>
        <textarea
          id="notes"
          {...form.register('notes')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          rows={4}
          placeholder="Additional observations, unique features, or problems..."
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
} 