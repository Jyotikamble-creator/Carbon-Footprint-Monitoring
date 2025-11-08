'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface DateRangeCalendarProps {
  selectedRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  onRangeChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
}

export default function DateRangeCalendar({ selectedRange, onRangeChange }: DateRangeCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateClick = (day: number, monthOffset: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + monthOffset;
    const clickedDate = new Date(year, month, day);

    if (!selectedRange.startDate || (selectedRange.startDate && selectedRange.endDate)) {
      // Start new range
      onRangeChange({ startDate: clickedDate, endDate: null });
    } else {
      // Complete range
      if (clickedDate >= selectedRange.startDate) {
        onRangeChange({ ...selectedRange, endDate: clickedDate });
      } else {
        onRangeChange({ startDate: clickedDate, endDate: selectedRange.startDate });
      }
    }
  };

  const isDateInRange = (day: number, monthOffset: number) => {
    if (!selectedRange.startDate) return false;

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + monthOffset;
    const date = new Date(year, month, day);

    if (selectedRange.endDate) {
      return date >= selectedRange.startDate && date <= selectedRange.endDate;
    } else {
      return date.getTime() === selectedRange.startDate.getTime();
    }
  };

  const isStartOrEndDate = (day: number, monthOffset: number) => {
    if (!selectedRange.startDate) return false;

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + monthOffset;
    const date = new Date(year, month, day);

    return (
      date.getTime() === selectedRange.startDate.getTime() ||
      (selectedRange.endDate && date.getTime() === selectedRange.endDate.getTime())
    );
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const renderMonth = (monthOffset: number) => {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1);
    const days = getDaysInMonth(month);
    const monthName = month.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
      <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <CalendarIcon className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xl font-bold text-white">{monthName}</h3>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center text-gray-400 text-sm font-semibold py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="aspect-square" />;
            }

            const inRange = isDateInRange(day, monthOffset);
            const isStartEnd = isStartOrEndDate(day, monthOffset);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day, monthOffset)}
                className={`aspect-square rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-300 transform hover:scale-110 ${
                  isStartEnd
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/50'
                    : inRange
                    ? 'bg-emerald-500/40 text-white hover:bg-emerald-500/60'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Navigation */}
      <div className="flex items-center justify-center mb-8 gap-6">
        <button
          onClick={prevMonth}
          className="group p-3 text-gray-400 hover:text-white transition-all duration-300 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-white">Select Date Range</h2>
          <p className="text-sm text-gray-400">Choose start and end dates for your report</p>
        </div>

        <button
          onClick={nextMonth}
          className="group p-3 text-gray-400 hover:text-white transition-all duration-300 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Two Month View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderMonth(0)}
        {renderMonth(1)}
      </div>

      {/* Selected Range Summary */}
      {selectedRange.startDate && (
        <div className="mt-6 p-4 bg-emerald-500/10 rounded-xl border border-emerald-400/20">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-emerald-300 font-medium">Selected Range:</span>
            <span className="text-white font-semibold">
              {selectedRange.startDate.toLocaleDateString()}
            </span>
            {selectedRange.endDate && (
              <>
                <span className="text-emerald-400">→</span>
                <span className="text-white font-semibold">
                  {selectedRange.endDate.toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}