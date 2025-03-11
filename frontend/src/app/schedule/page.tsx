'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import React from 'react';

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

const initialSchedule =
  JSON.parse(localStorage.getItem('scheduleData') || '[]') || [];

export default function SchedulePage() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [isLegendVisible, setIsLegendVisible] = useState(true);
  const [newDay, setNewDay] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCourt, setNewCourt] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('admin_role');
    if (role === 'schedule_manager') {
      setIsAdmin(true);
    }
  }, []);

  // Function to get all unique group types from the schedule data
  const getUniqueGroups = () => {
    const groups = new Set<string>();
    schedule.forEach((item) => groups.add(item.group)); // Use 'schedule' instead of 'scheduleData'
    return Array.from(groups);
  };

  const uniqueGroups = getUniqueGroups();

  const handleAddSchedule = () => {
    if (!newDay || !newTime || !newCourt || !newGroup) {
      alert('Please fill all fields.');
      return;
    }
    const newEntry = {
      day: newDay,
      time: newTime,
      court: newCourt,
      group: newGroup,
    };
    const updatedSchedule = [...schedule, newEntry];
    setSchedule(updatedSchedule);
    localStorage.setItem('scheduleData', JSON.stringify(updatedSchedule));
    setNewDay('');
    setNewTime('');
    setNewCourt('');
    setNewGroup('');
  };

  const handleRemoveSchedule = (index: number) => {
    const updatedSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(updatedSchedule);
    localStorage.setItem('scheduleData', JSON.stringify(updatedSchedule));
  };

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

      {/* Add New Schedule */}
      {isAdmin && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">Ajouter un horaire</h2>
          <div className="flex gap-2">
            <select
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              className="p-2 border border-gray-600 rounded-md bg-gray-900 text-white"
            >
              <option value="">Jour</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="p-2 border border-gray-600 rounded-md bg-gray-900 text-white"
            >
              <option value="">Heure</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <select
              value={newCourt}
              onChange={(e) => setNewCourt(e.target.value)}
              className="p-2 border border-gray-600 rounded-md bg-gray-900 text-white"
            >
              <option value="">Court</option>
              {[
                'COURT 1',
                'COURT 2',
                'COURT 3',
                'COURT 4',
                'COURT 5',
                'COURT 6',
                'COURT 7',
                'COURT 8',
              ].map((court) => (
                <option key={court} value={court}>
                  {court}
                </option>
              ))}
            </select>
            <select
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              className="p-2 border border-gray-600 rounded-md bg-gray-900 text-white"
            >
              <option value="">Groupe</option>
              {Object.keys(groupTypes).map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddSchedule}
              className="bg-green-500 text-white px-3 py-2 rounded-md"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}

      {/* Schedule Grid */}
      <div className="w-full overflow-x-auto pb-6">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-8 gap-1">
            <div className="bg-gray-800/50 p-4 font-semibold rounded-tl-lg">
              Horaire
            </div>
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
            {timeSlots.map((time) => (
              <React.Fragment key={`time-row-${time}`}>
                <motion.div
                  key={`time-${time}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: timeSlots.indexOf(time) * 0.1 }}
                  className="bg-gray-800/50 p-4 font-semibold"
                >
                  {time}
                </motion.div>
                {days.map((day) => {
                  const cellId = `${day}-${time}`;
                  const scheduleItems = schedule.filter(
                    (item) => item.day === day && item.time === time
                  );

                  return (
                    <motion.div
                      key={cellId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay:
                          (timeSlots.indexOf(time) * 7 + days.indexOf(day)) *
                          0.02,
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
                                {isAdmin && (
                                  <button
                                    onClick={() => handleRemoveSchedule(index)}
                                    className="bg-red-500 text-white rounded-full px-2 py-1 text-sm mt-2"
                                  >
                                    Supprimer
                                  </button>
                                )}
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
