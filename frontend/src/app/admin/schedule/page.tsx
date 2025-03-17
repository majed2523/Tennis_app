'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Plus, Save, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { teamService } from '../../../services/teamService';

interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  court: string;
  team: string;
}

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const courts = [
  'Court 1',
  'Court 2',
  'Court 3',
  'Court 4',
  'Court 5',
  'Court 6',
];

export default function AdminSchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      const fetchedTeams = await teamService.getAllTeams();
      setTeams(
        fetchedTeams.map((team: { team_name: string }) => team.team_name)
      );
    };

    fetchTeams();
  }, []);

  const addScheduleItem = () => {
    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      day: '',
      time: '',
      court: '',
      team: '',
    };
    setSchedule([...schedule, newItem]);
    setIsEditing(true);
  };

  const updateScheduleItem = (
    id: string,
    field: keyof ScheduleItem,
    value: string
  ) => {
    setSchedule(
      schedule.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeScheduleItem = (id: string) => {
    setSchedule(schedule.filter((item) => item.id !== id));
  };

  const saveSchedule = () => {
    console.log('🔹 Schedule Saved Locally:', schedule);
    setIsEditing(false);
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Schedule Management
            </h1>
            <p className="text-gray-400 mt-2">
              Edit and manage court schedules
            </p>
          </div>

          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={addScheduleItem}
              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Schedule Item
            </Button>

            {isEditing && (
              <Button
                onClick={saveSchedule}
                className="bg-green-600 hover:bg-green-500"
              >
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          {schedule.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-white text-sm font-medium">
                    Schedule Item
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeScheduleItem(item.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Select
                      value={item.day}
                      onValueChange={(value) =>
                        updateScheduleItem(item.id, 'day', value)
                      }
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {days.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="time"
                      value={item.time}
                      onChange={(e) =>
                        updateScheduleItem(item.id, 'time', e.target.value)
                      }
                      className="bg-gray-700 border-gray-600"
                    />

                    <Select
                      value={item.court}
                      onValueChange={(value) =>
                        updateScheduleItem(item.id, 'court', value)
                      }
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select court" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {courts.map((court) => (
                          <SelectItem key={court} value={court}>
                            {court}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={item.team}
                      onValueChange={(value) =>
                        updateScheduleItem(item.id, 'team', value)
                      }
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {teams.map((team) => (
                          <SelectItem key={team} value={team}>
                            {team}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
