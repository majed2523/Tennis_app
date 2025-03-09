'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { Button } from '../../components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover';

interface CalendarProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export default function CalendarPicker({ selectedDate, onSelect }: CalendarProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal bg-gray-700 border-gray-600 hover:bg-gray-600"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, 'PPP')
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-gray-800 border-gray-700"
        align="start"
      >
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            console.log("Date selected:", date);
            onSelect(date);
          }}
          initialFocus
          disabled={(date) => date < new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}
