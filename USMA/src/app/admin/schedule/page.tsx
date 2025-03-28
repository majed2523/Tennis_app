'use client';

import React from 'react';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Plus, Save, Trash2, AlertTriangle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '../../../components/ui/card';
import { teamService } from '../../../services/teamService';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';

// Schedule structure
interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  court: string;
  team: string;
  locked?: boolean;
}

// Valid days and time slots
const days = [
  'DIMANCHE',
  'LUNDI',
  'MARDI',
  'MERCREDI',
  'JEUDI',
  'VENDREDI',
  'SAMEDI',
];
const timeSlots = [
  '9H',
  '10H30',
  '12H',
  '14H-15H30',
  '15H30',
  '17H',
  '18H30-20H',
];
const courts = [
  'COURT 1',
  'COURT 2',
  'COURT 3',
  'COURT 4',
  'COURT 5',
  'COURT 6',
];

// Remove the static groupTypes object and replace with:

// Function to generate a unique color with better contrast
const generateColor = (index: number) => {
  // Use a color palette with good contrast and visibility
  const colorPalette = [
    'hsl(0, 85%, 60%)', // Red
    'hsl(210, 85%, 60%)', // Blue
    'hsl(120, 85%, 60%)', // Green
    'hsl(48, 85%, 60%)', // Yellow
    'hsl(275, 85%, 60%)', // Purple
    'hsl(30, 85%, 60%)', // Orange
    'hsl(180, 85%, 60%)', // Teal
    'hsl(330, 85%, 60%)', // Pink
    'hsl(150, 85%, 60%)', // Mint
    'hsl(300, 85%, 60%)', // Magenta
  ];

  // Use modulo to cycle through colors if we have more teams than colors
  return colorPalette[index % colorPalette.length];
};

// Function to determine if text should be black or white based on background color
const getTextColor = (backgroundColor: string) => {
  // Simple heuristic: if it's a light color (HSL with L > 65%), use black text
  const lightColor =
    backgroundColor.includes('85%') &&
    !backgroundColor.includes('0,') &&
    !backgroundColor.includes('210,') &&
    !backgroundColor.includes('275,') &&
    !backgroundColor.includes('330,') &&
    !backgroundColor.includes('300,');
  return lightColor ? 'text-black' : 'text-white';
};

// Retrieve stored team colors from localStorage
const getStoredTeamColors = () => {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('team_colors') || '{}');
  }
  return {}; // Return empty object on server to avoid errors
};

// Store updated team colors in localStorage
const storeTeamColors = (colors: Record<string, string>) => {
  localStorage.setItem('team_colors', JSON.stringify(colors));
};

export default function AdminSchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [teamColors, setTeamColors] = useState<Record<string, string>>({});
  const [teamTextColors, setTeamTextColors] = useState<Record<string, string>>(
    {}
  );
  const [activeTab, setActiveTab] = useState('edit');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<{ [key: string]: string[] }>({});
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const fetchedTeams = await teamService.getAllTeams();
        if (!fetchedTeams.error && Array.isArray(fetchedTeams)) {
          const teamNames = fetchedTeams.map(
            (team: { team_name: string }) => team.team_name
          );
          setTeams(teamNames);

          // Generate and store colors for teams
          const storedColors = getStoredTeamColors();
          const updatedColors: Record<string, string> = { ...storedColors };
          const updatedTextColors: Record<string, string> = {};

          teamNames.forEach((team, index) => {
            if (!updatedColors[team]) {
              updatedColors[team] = generateColor(index);
            }
            updatedTextColors[team] = getTextColor(updatedColors[team]);
          });

          setTeamColors(updatedColors);
          setTeamTextColors(updatedTextColors);
          storeTeamColors(updatedColors);
        } else {
          console.error('Failed to fetch teams or invalid response format');
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    const savedSchedule = localStorage.getItem('tennis_schedule');
    if (savedSchedule) {
      const parsedSchedule = JSON.parse(savedSchedule);
      setSchedule(parsedSchedule);

      // Check for conflicts in the loaded schedule
      detectConflicts(parsedSchedule);
    }

    fetchTeams();
  }, []);

  // Detect conflicts in the schedule
  const detectConflicts = (scheduleItems: ScheduleItem[]) => {
    const newConflicts: { [key: string]: string[] } = {};

    // Check for court conflicts (same day, time, court but different teams)
    scheduleItems.forEach((item) => {
      if (!item.day || !item.time || !item.court || !item.team) return;

      const conflictingItems = scheduleItems.filter(
        (other) =>
          other.id !== item.id &&
          other.day === item.day &&
          other.time === item.time &&
          other.court === item.court
      );

      if (conflictingItems.length > 0) {
        newConflicts[item.id] = conflictingItems.map((c) => c.team);
      }
    });

    // Check for team conflicts (same team scheduled at the same time on different courts)
    scheduleItems.forEach((item) => {
      if (!item.day || !item.time || !item.court || !item.team) return;

      const teamConflicts = scheduleItems.filter(
        (other) =>
          other.id !== item.id &&
          other.day === item.day &&
          other.time === item.time &&
          other.team === item.team
      );

      if (teamConflicts.length > 0) {
        if (!newConflicts[item.id]) {
          newConflicts[item.id] = [];
        }
        newConflicts[item.id].push(`${item.team} (double booking)`);
      }
    });

    setConflicts(newConflicts);
    return Object.keys(newConflicts).length === 0;
  };

  const checkConflicts = (newItem: ScheduleItem) => {
    return schedule.some(
      (item) =>
        item.id !== newItem.id &&
        item.day === newItem.day &&
        item.time === newItem.time &&
        (item.court === newItem.court || item.team === newItem.team)
    );
  };

  const addScheduleItem = () => {
    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      day: '',
      time: '',
      court: '',
      team: '',
      locked: false,
    };
    setSchedule([...schedule, newItem]);
    setIsEditing(true);
  };

  const updateScheduleItem = (
    id: string,
    field: keyof ScheduleItem,
    value: string
  ) => {
    const updatedSchedule = schedule.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );

    setSchedule(updatedSchedule);
    setIsEditing(true);

    // Check for conflicts after update
    detectConflicts(updatedSchedule);
  };

  const removeScheduleItem = (id: string) => {
    const updatedSchedule = schedule.filter((item) => item.id !== id);
    setSchedule(updatedSchedule);
    setIsEditing(true);

    // Re-check conflicts after removal
    detectConflicts(updatedSchedule);
  };

  const lockScheduleItem = (id: string) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((item) =>
        item.id === id ? { ...item, locked: !item.locked } : item
      )
    );
  };

  const saveSchedule = () => {
    // Check for incomplete items
    const incompleteItems = schedule.filter(
      (item) => !item.day || !item.time || !item.court || !item.team
    );

    if (incompleteItems.length > 0) {
      setSaveStatus({
        type: 'error',
        message: 'Please complete all schedule items before saving.',
      });
      return;
    }

    // Check for conflicts
    if (Object.keys(conflicts).length > 0) {
      setSaveStatus({
        type: 'error',
        message: 'Please resolve all conflicts before saving.',
      });
      return;
    }

    localStorage.setItem('tennis_schedule', JSON.stringify(schedule));
    setSaveStatus({
      type: 'success',
      message: 'Schedule saved successfully!',
    });
    setIsEditing(false);

    // Clear status after 3 seconds
    setTimeout(() => {
      setSaveStatus({ type: null, message: '' });
    }, 3000);
  };

  // Get all unique teams from the schedule
  const getUniqueTeams = () => {
    const uniqueTeams = new Set<string>();
    schedule.forEach((item) => {
      if (item.team) uniqueTeams.add(item.team);
    });
    return Array.from(uniqueTeams);
  };

  return (
    <div className="p-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Schedule Management
          </h1>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={addScheduleItem}
              className="bg-club-red hover:bg-club-red/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Schedule Item
            </Button>

            {isEditing && (
              <Button
                onClick={saveSchedule}
                className="bg-club-red hover:bg-club-red/90"
                disabled={Object.keys(conflicts).length > 0}
              >
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            )}
          </div>
        </div>

        {saveStatus.type && (
          <Alert
            className={`mb-4 ${
              saveStatus.type === 'success'
                ? 'bg-green-500/20 border-green-500'
                : 'bg-red-500/20 border-red-500'
            }`}
          >
            <AlertDescription>{saveStatus.message}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="edit">Edit Schedule</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <div className="grid gap-6">
              {schedule.map((item) => {
                const hasConflict = conflicts[item.id];

                return (
                  <Card
                    key={item.id}
                    className={`${
                      hasConflict
                        ? 'bg-red-100 border-red-500/50'
                        : 'bg-white border-gray-200 shadow-sm'
                    }`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-gray-800 text-sm font-medium flex items-center">
                        Schedule Item
                        {hasConflict && (
                          <span className="ml-2 text-red-400 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Conflict
                          </span>
                        )}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => lockScheduleItem(item.id)}
                          className={
                            item.locked ? 'bg-club-red' : 'bg-gray-400'
                          }
                        >
                          {item.locked ? 'Unlock' : 'Lock'}
                        </Button>
                        <Button
                          onClick={() => removeScheduleItem(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Day Selection */}
                        <Select
                          value={item.day}
                          onValueChange={(value) =>
                            updateScheduleItem(item.id, 'day', value)
                          }
                          disabled={item.locked}
                        >
                          <SelectTrigger className="bg-white border-gray-300">
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {days.map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Time Selection */}
                        <Select
                          value={item.time}
                          onValueChange={(value) =>
                            updateScheduleItem(item.id, 'time', value)
                          }
                          disabled={item.locked}
                        >
                          <SelectTrigger className="bg-white border-gray-300">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Court Selection */}
                        <Select
                          value={item.court}
                          onValueChange={(value) =>
                            updateScheduleItem(item.id, 'court', value)
                          }
                          disabled={item.locked}
                        >
                          <SelectTrigger className="bg-white border-gray-300">
                            <SelectValue placeholder="Select court" />
                          </SelectTrigger>
                          <SelectContent>
                            {courts.map((court) => (
                              <SelectItem key={court} value={court}>
                                {court}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Team Selection */}
                        <Select
                          value={item.team}
                          onValueChange={(value) =>
                            updateScheduleItem(item.id, 'team', value)
                          }
                          disabled={item.locked}
                        >
                          <SelectTrigger className="bg-white border-gray-300">
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                          <SelectContent>
                            {teams.map((team) => (
                              <SelectItem
                                key={team}
                                value={team}
                                className={teamTextColors[team] || 'text-white'}
                                style={{
                                  backgroundColor:
                                    teamColors[team] || '#6b7280',
                                }}
                              >
                                {team}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>

                    {hasConflict && (
                      <CardFooter className="bg-red-900/20 text-red-300 text-sm p-3 rounded-b-lg">
                        <div>
                          Conflicts with: {conflicts[item.id].join(', ')}
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white mb-4">
                Schedule Preview
              </h2>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant="outline"
                  className={!selectedFilter ? 'bg-green-600 text-white' : ''}
                  onClick={() => setSelectedFilter(null)}
                >
                  All Teams
                </Button>

                {getUniqueTeams().map((team) => (
                  <Button
                    key={team}
                    variant="outline"
                    className={
                      selectedFilter === team
                        ? teamTextColors[team] || 'text-white'
                        : ''
                    }
                    onClick={() => setSelectedFilter(team)}
                    style={{
                      backgroundColor:
                        selectedFilter === team ? teamColors[team] : '',
                    }}
                  >
                    {team}
                  </Button>
                ))}
              </div>

              {/* Schedule Grid */}
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1000px]">
                  <div className="grid grid-cols-8 gap-1">
                    <div className="bg-gray-100 p-4 font-semibold rounded-tl-lg text-gray-800">
                      Time
                    </div>
                    {days.map((day) => (
                      <div
                        key={day}
                        className="bg-gray-100 p-4 font-semibold text-center text-gray-800"
                      >
                        {day}
                      </div>
                    ))}

                    {timeSlots.map((time) => (
                      <React.Fragment key={time}>
                        <div className="bg-gray-100 p-4 font-semibold text-gray-800">
                          {time}
                        </div>
                        {days.map((day) => {
                          const scheduleItems = schedule.filter(
                            (item) => item.day === day && item.time === time
                          );

                          // Filter by selected team if filter is active
                          const filteredItems = selectedFilter
                            ? scheduleItems.filter(
                                (item) => item.team === selectedFilter
                              )
                            : scheduleItems;

                          return (
                            <div
                              key={`${day}-${time}`}
                              className="border border-gray-200 p-2 min-h-[80px] bg-gray-50"
                            >
                              {filteredItems.map((item, index) => (
                                <div
                                  key={index}
                                  className={`rounded-md p-2 mb-1 ${
                                    teamTextColors[item.team] || 'text-white'
                                  }`}
                                  style={{
                                    backgroundColor:
                                      teamColors[item.team] || '#6b7280',
                                  }}
                                >
                                  <div className="font-medium">
                                    {item.court}
                                  </div>
                                  <Badge variant="outline" className="mt-1">
                                    {item.team}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
