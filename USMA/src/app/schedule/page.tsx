'use client';

import React from 'react';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { authService } from '../../services/authService';
import { Badge } from '../../components/ui/badge';
import { Filter, Info } from 'lucide-react';
import Link from 'next/link';
import { teamService } from '../../services/teamService';

// Schedule structure
interface ScheduleItem {
  day: string;
  time: string;
  court: string;
  team: string;
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
const timeSlots = ['9H', '10H30', '12H', '14H', '15H30', '17H', '18H30'];

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

// Initial schedule data in case localStorage is empty
const initialScheduleData: ScheduleItem[] = [
  { day: 'LUNDI', time: '9H', court: 'COURT 1', team: 'ECOLE' },
  { day: 'MARDI', time: '10H30', court: 'COURT 2', team: 'PUB' },
  { day: 'MERCREDI', time: '15H30', court: 'COURT 3', team: 'CU10' },
  { day: 'JEUDI', time: '17H', court: 'COURT 4', team: 'CU12' },
  { day: 'VENDREDI', time: '18H30-20H', court: 'COURT 5', team: 'A1' },
];

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [teamColors, setTeamColors] = useState<Record<string, string>>({});
  const [teamTextColors, setTeamTextColors] = useState<Record<string, string>>(
    {}
  );
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isLegendVisible, setIsLegendVisible] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [teams, setTeams] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Prevent running on the server

    // Check if user is admin
    const checkAdmin = () => {
      const user = authService.getCurrentUser();
      setIsAdmin(user?.role === 'admin');
    };

    checkAdmin();

    // Fetch teams to get their names
    const fetchTeams = async () => {
      try {
        const fetchedTeams = await teamService.getAllTeams();
        if (!fetchedTeams.error && Array.isArray(fetchedTeams)) {
          const teamNames = fetchedTeams.map(
            (team: { team_name: string }) => team.team_name
          );
          setTeams(teamNames);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();

    const savedSchedule = localStorage.getItem('tennis_schedule');
    if (savedSchedule) {
      const parsedSchedule = JSON.parse(savedSchedule);
      setSchedule(parsedSchedule);

      // Get stored colors
      const storedColors = getStoredTeamColors();
      setTeamColors(storedColors);

      // Generate text colors based on background colors
      const textColors: Record<string, string> = {};
      Object.entries(storedColors).forEach(([team, color]) => {
        textColors[team] = getTextColor(color);
      });
      setTeamTextColors(textColors);
    }
  }, []);

  // Get all unique teams from the schedule
  const getUniqueTeams = () => {
    const uniqueTeams = new Set<string>();
    schedule.forEach((item) => {
      if (item.team) uniqueTeams.add(item.team);
    });
    return Array.from(uniqueTeams);
  };

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-club-red mb-2">
              Tennis Schedule
            </h1>
            <p className="text-gray-600">
              View court availability and training times
            </p>
          </div>

          {isAdmin && (
            <Link href="/admin/schedule">
              <Button className="mt-4 md:mt-0 bg-club-red hover:bg-club-red/90">
                Manage Schedule
              </Button>
            </Link>
          )}
        </div>

        {/* Filters and Legend Toggle */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              className={!selectedFilter ? 'bg-club-red text-white' : ''}
              onClick={() => setSelectedFilter(null)}
            >
              <Filter className="mr-2 h-4 w-4" />
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

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLegendVisible(!isLegendVisible)}
            className="flex items-center text-gray-700 border-gray-300"
          >
            <Info className="h-4 w-4 mr-2" />
            {isLegendVisible ? 'Hide Legend' : 'Show Legend'}
          </Button>

          {/* Legend */}
          {isLegendVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-100 rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-3">Legend</h3>
              <div className="flex flex-wrap gap-2">
                {getUniqueTeams().map((team) => (
                  <div
                    key={team}
                    className={`px-3 py-1 rounded-md text-sm ${
                      teamTextColors[team] || 'text-white'
                    }`}
                    style={{ backgroundColor: teamColors[team] || '#6b7280' }}
                  >
                    {team}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Schedule Table */}
      <div className="w-full overflow-x-auto pb-6">
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
                  const cellId = `${day}-${time}`;
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
                      key={cellId}
                      className={`border border-gray-200 p-2 min-h-[80px] transition-all duration-200
                        ${hoveredCell === cellId ? 'ring-2 ring-club-red' : ''}
                        ${filteredItems.length ? 'bg-gray-100' : 'bg-gray-50'}`}
                      onMouseEnter={() => setHoveredCell(cellId)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {filteredItems.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`rounded-md p-2 mb-1 transition-all hover:scale-105 ${
                            teamTextColors[item.team] || 'text-white'
                          }`}
                          style={{
                            backgroundColor: teamColors[item.team] || '#6b7280',
                          }}
                        >
                          <div className="font-medium">{item.court}</div>
                          <Badge variant="outline" className="mt-1">
                            {item.team}
                          </Badge>
                        </motion.div>
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
  );
}
