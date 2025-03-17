'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import React from 'react';
import { authService } from '../../services/authService';

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
  '17H-18H30',
  '18H30-20H',
];

const groupTypes = {
  ECOLE: { color: 'bg-yellow-400 hover:bg-yellow-500', text: 'text-black' },
  PUB: { color: 'bg-blue-400 hover:bg-blue-500', text: 'text-white' },
  CU10: { color: 'bg-green-500 hover:bg-green-600', text: 'text-white' },
  CU12: { color: 'bg-red-600 hover:bg-red-700', text: 'text-white' },
  CU14: { color: 'bg-blue-600 hover:bg-blue-700', text: 'text-white' },
  CU16: { color: 'bg-cyan-500 hover:bg-cyan-600', text: 'text-white' },
  CU18: { color: 'bg-gray-800 hover:bg-gray-900', text: 'text-white' },
  A1: { color: 'bg-pink-500 hover:bg-pink-600', text: 'text-white' },
  A2: { color: 'bg-purple-500 hover:bg-purple-600', text: 'text-white' },
  A3: { color: 'bg-purple-700 hover:bg-purple-800', text: 'text-white' },
  A4: { color: 'bg-purple-400 hover:bg-purple-500', text: 'text-white' },
  A5: { color: 'bg-purple-300 hover:bg-purple-400', text: 'text-black' },
  I1: { color: 'bg-red-500 hover:bg-red-600', text: 'text-white' },
  Y1: { color: 'bg-amber-700 hover:bg-amber-800', text: 'text-white' },
  L1: { color: 'bg-yellow-300 hover:bg-yellow-400', text: 'text-black' },
  PUBET: { color: 'bg-blue-300 hover:bg-blue-400', text: 'text-black' },
  ET: { color: 'bg-blue-200 hover:bg-blue-300', text: 'text-black' },
};

// Complete schedule data based on the image
const scheduleData = [
  // VENDREDI 9H
  { day: 'VENDREDI', time: '9H', court: 'COURT 8', group: 'ECOLE' },
  // SAMEDI 9H
  { day: 'SAMEDI', time: '9H', court: 'COURT 8', group: 'ECOLE' },

  // VENDREDI 10H30
  { day: 'VENDREDI', time: '10H30', court: 'COURT 7', group: 'PUB' },
  { day: 'VENDREDI', time: '10H30', court: 'COURT 2', group: 'PUB' },
  // SAMEDI 10H30
  { day: 'SAMEDI', time: '10H30', court: 'COURT 7', group: 'PUB' },
  { day: 'SAMEDI', time: '10H30', court: 'COURT 2', group: 'PUB' },

  // VENDREDI 12H
  { day: 'VENDREDI', time: '12H', court: 'COURT 8', group: 'ECOLE' },
  { day: 'VENDREDI', time: '12H', court: 'COURT 7', group: 'CU10' },
  { day: 'VENDREDI', time: '12H', court: 'COURT 2', group: 'A1' },
  // SAMEDI 12H
  { day: 'SAMEDI', time: '12H', court: 'COURT 8', group: 'ECOLE' },
  { day: 'SAMEDI', time: '12H', court: 'COURT 7', group: 'CU10' },
  { day: 'SAMEDI', time: '12H', court: 'COURT 2', group: 'A1' },

  // DIMANCHE 14H-15H30
  { day: 'DIMANCHE', time: '14H-15H30', court: 'COURT 8', group: 'ECOLE' },
  // VENDREDI 14H-15H30
  { day: 'VENDREDI', time: '14H-15H30', court: 'COURT 8', group: 'L1' },
  { day: 'VENDREDI', time: '14H-15H30', court: 'COURT 7', group: 'CU12' },
  // SAMEDI 14H-15H30
  { day: 'SAMEDI', time: '14H-15H30', court: 'COURT 8', group: 'CU12' },

  // MARDI 14H-15H30
  { day: 'MARDI', time: '14H-15H30', court: 'COURT 8', group: 'ECOLE' },
  { day: 'MARDI', time: '14H-15H30', court: 'COURT 2', group: 'ET' },
  { day: 'MARDI', time: '14H-15H30', court: 'COURT 7', group: 'PUBET' },

  // DIMANCHE 15H30
  { day: 'DIMANCHE', time: '15H30', court: 'COURT 7', group: 'CU10' },
  // VENDREDI 15H30
  { day: 'VENDREDI', time: '15H30', court: 'COURT 7', group: 'A2' },
  // SAMEDI 15H30
  { day: 'SAMEDI', time: '15H30', court: 'COURT 7', group: 'A2' },

  // DIMANCHE 17H
  { day: 'DIMANCHE', time: '17H', court: 'COURT 8', group: 'I1' },
  // LUNDI 17H
  { day: 'LUNDI', time: '17H', court: 'COURT 8', group: 'I1' },
  // MARDI 17H
  { day: 'MARDI', time: '17H', court: 'COURT 8', group: 'CU12' },
  // MERCREDI 17H
  { day: 'MERCREDI', time: '17H', court: 'COURT 8', group: 'I1' },
  // JEUDI 17H
  { day: 'JEUDI', time: '17H', court: 'COURT 8', group: 'I1' },
  // VENDREDI 17H
  { day: 'VENDREDI', time: '17H', court: 'COURT 8', group: 'CU14' },
  { day: 'VENDREDI', time: '17H', court: 'COURT 7', group: 'CU14' },
  // SAMEDI 17H
  { day: 'SAMEDI', time: '17H', court: 'COURT 8', group: 'CU14' },
  { day: 'SAMEDI', time: '17H', court: 'COURT 7', group: 'CU14' },

  // DIMANCHE 17H-18H30
  { day: 'DIMANCHE', time: '17H-18H30', court: 'COURT 8', group: 'A5' },
  { day: 'DIMANCHE', time: '17H-18H30', court: 'COURT 7', group: 'Y1' },
  // LUNDI 17H-18H30
  { day: 'LUNDI', time: '17H-18H30', court: 'COURT 8', group: 'A4' },
  { day: 'LUNDI', time: '17H-18H30', court: 'COURT 7', group: 'A3' },
  // MARDI 17H-18H30
  { day: 'MARDI', time: '17H-18H30', court: 'COURT 8', group: 'CU14' },
  { day: 'MARDI', time: '17H-18H30', court: 'COURT 7', group: 'Y1' },
  // MERCREDI 17H-18H30
  { day: 'MERCREDI', time: '17H-18H30', court: 'COURT 8', group: 'A5' },
  { day: 'MERCREDI', time: '17H-18H30', court: 'COURT 7', group: 'Y1' },
  // JEUDI 17H-18H30
  { day: 'JEUDI', time: '17H-18H30', court: 'COURT 8', group: 'A4' },
  { day: 'JEUDI', time: '17H-18H30', court: 'COURT 7', group: 'A3' },
  // VENDREDI 17H-18H30
  { day: 'VENDREDI', time: '17H-18H30', court: 'COURT 8', group: 'CU16' },
  { day: 'VENDREDI', time: '17H-18H30', court: 'COURT 7', group: 'L1' },
  // SAMEDI 17H-18H30
  { day: 'SAMEDI', time: '17H-18H30', court: 'COURT 8', group: 'CU16' },
  { day: 'SAMEDI', time: '17H-18H30', court: 'COURT 7', group: 'L1' },

  // DIMANCHE 18H30-20H
  { day: 'DIMANCHE', time: '18H30-20H', court: 'COURT 8', group: 'CU18' },
  { day: 'DIMANCHE', time: '18H30-20H', court: 'COURT 7', group: 'Y1' },
  // LUNDI 18H30-20H
  { day: 'LUNDI', time: '18H30-20H', court: 'COURT 8', group: 'Y1' },
  // MARDI 18H30-20H
  { day: 'MARDI', time: '18H30-20H', court: 'COURT 8', group: 'L1' },
  { day: 'MARDI', time: '18H30-20H', court: 'COURT 7', group: 'CU16' },
  // MERCREDI 18H30-20H
  { day: 'MERCREDI', time: '18H30-20H', court: 'COURT 8', group: 'CU18' },
  // JEUDI 18H30-20H
  { day: 'JEUDI', time: '18H30-20H', court: 'COURT 7', group: 'Y1' },
  // VENDREDI 18H30-20H
  { day: 'VENDREDI', time: '18H30-20H', court: 'COURT 8', group: 'CU18' },
  // SAMEDI 18H30-20H
  { day: 'SAMEDI', time: '18H30-20H', court: 'COURT 8', group: 'CU16' },
];

export default function SchedulePage() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [isLegendVisible, setIsLegendVisible] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Function to get all unique group types from the schedule data
  const getUniqueGroups = () => {
    const groups = new Set<string>();
    scheduleData.forEach((item) => groups.add(item.group));
    return Array.from(groups);
  };

  const uniqueGroups = getUniqueGroups();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        setIsAuthenticated(true);
        const user = authService.getCurrentUser();
        setUserData(user);
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }
    };

    checkAuth();

    // Listen for auth changes
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1E2E] text-white p-4 md:p-8 lg:p-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="text-[#2FE6A7]">Programme</span> USMA Section Tennis
        </h1>
        <p className="text-gray-400 mb-6">
          Horaires des cours et disponibilité des courts
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant="outline"
            className={`${
              !selectedFilter ? 'bg-[#2FE6A7] text-[#1A1E2E]' : ''
            }`}
            onClick={() => setSelectedFilter(null)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Tous
          </Button>
          {uniqueGroups.map((group) => {
            const style = groupTypes[group as keyof typeof groupTypes];
            return (
              <Button
                key={group}
                variant="outline"
                className={`${selectedFilter === group ? style.color : ''} ${
                  selectedFilter === group ? style.text : ''
                }`}
                onClick={() => setSelectedFilter(group)}
              >
                {group}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          className="mt-2"
          onClick={() => setIsLegendVisible(!isLegendVisible)}
        >
          {isLegendVisible ? 'Masquer la légende' : 'Afficher la légende'}
        </Button>

        {/* Admin Edit Button - Only show for admins */}
        {isAuthenticated && userData?.role === 'admin' && (
          <Link href="/admin/schedule">
            <Button className="ml-4 bg-green-600 hover:bg-green-500">
              Edit Schedule
            </Button>
          </Link>
        )}

        {/* Legend */}
        {isLegendVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-gray-800/30 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-3">Légende</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(groupTypes).map(([group, styles]) => (
                <div
                  key={group}
                  className={`${styles.color} ${styles.text} px-3 py-1 rounded-md text-sm`}
                >
                  {group}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Schedule Grid */}
      <div className="w-full overflow-x-auto pb-6">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-8 gap-1">
            {/* Time column header */}
            <div className="bg-gray-800/50 p-4 font-semibold rounded-tl-lg">
              Horaire
            </div>

            {/* Day headers */}
            {days.map((day) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: days.indexOf(day) * 0.1 }}
                className="bg-gray-800/50 p-4 font-semibold text-center"
              >
                {day}
              </motion.div>
            ))}

            {/* Time slots and schedule */}
            {timeSlots.map((time, timeIndex) => (
              <React.Fragment key={`time-row-${time}`}>
                {/* Time slot */}
                <motion.div
                  key={`time-${time}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: timeIndex * 0.1 }}
                  className="bg-gray-800/50 p-4 font-semibold"
                >
                  {time}
                </motion.div>

                {/* Schedule cells for each day */}
                {days.map((day) => {
                  const cellId = `${day}-${time}`;
                  const scheduleItems = scheduleData.filter(
                    (item) => item.day === day && item.time === time
                  );

                  return (
                    <motion.div
                      key={cellId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: (timeIndex * 7 + days.indexOf(day)) * 0.02,
                      }}
                      className={`relative min-h-[100px] border border-gray-800/50 rounded-md p-2
                        ${hoveredCell === cellId ? 'ring-2 ring-[#2FE6A7]' : ''}
                        ${
                          scheduleItems.length
                            ? 'bg-gray-800/30'
                            : 'bg-gray-800/10'
                        }
                      `}
                      onMouseEnter={() => setHoveredCell(cellId)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {scheduleItems.length > 0 ? (
                        <div className="grid gap-1">
                          {scheduleItems.map((item, index) => {
                            const style =
                              groupTypes[item.group as keyof typeof groupTypes];

                            // Skip if filtered and not matching
                            if (
                              selectedFilter &&
                              selectedFilter !== item.group
                            ) {
                              return null;
                            }

                            return (
                              <motion.div
                                key={`${cellId}-${index}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 + index * 0.1 }}
                                className={`${style.color} ${style.text} 
                                  rounded-md p-2 text-sm transition-all
                                  transform hover:scale-105 cursor-pointer
                                `}
                              >
                                <div className="font-semibold">
                                  {item.court}
                                </div>
                                <Badge variant="outline" className="mt-1">
                                  {item.group}
                                </Badge>
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : null}
                    </motion.div>
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
