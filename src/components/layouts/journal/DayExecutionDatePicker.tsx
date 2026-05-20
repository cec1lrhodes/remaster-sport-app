import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { uk } from "react-day-picker/locale";

import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { useJournal } from "@/store/templates/hooks/useJournal";
import {
  DAY_LABELS,
  formatJournalDate,
  journalDayDateKey,
  parseJournalDate,
  toJournalDateIso,
} from "@/utils/journalUtils";

interface DayExecutionDatePickerProps {
  templateId: string;
  weekNumber: number;
  dayNumber: number;
}

export const DayExecutionDatePicker = ({
  templateId,
  weekNumber,
  dayNumber,
}: DayExecutionDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const dateKey = journalDayDateKey(templateId, weekNumber, dayNumber);
  const { journalDayDates, setJournalDayDate } = useJournal();
  const dateIso = journalDayDates[dateKey];

  const dayLabel = DAY_LABELS[dayNumber] ?? String(dayNumber);
  const selectedDate = dateIso ? parseJournalDate(dateIso) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    setJournalDayDate(
      templateId,
      weekNumber,
      dayNumber,
      toJournalDateIso(date),
    );
    setOpen(false);
  };

  const handleClear = () => {
    setJournalDayDate(templateId, weekNumber, dayNumber, null);
    setOpen(false);
  };

  const handleToday = () => {
    setJournalDayDate(
      templateId,
      weekNumber,
      dayNumber,
      toJournalDateIso(new Date()),
    );
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-md px-3 py-2">
      <span className="font-montserrat text-sm text-white/70">
        Day {dayLabel} · execution date
      </span>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            className="border-white/10 bg-white/5 font-space-mono text-xs text-[#fcfdff] hover:bg-white/10"
          >
            <CalendarIcon className="size-3.5" aria-hidden="true" />
            {dateIso ? formatJournalDate(dateIso) : "date"}
          </Button>
        </DialogTrigger>

        <DialogContent
          overlayClassName="bg-black/70 backdrop-blur-md"
          className="w-auto max-w-[calc(100vw-2rem)] gap-0 overflow-hidden border-0 bg-[#1a1a1a] p-0 text-[#fcfdff] shadow-xl ring-0 sm:max-w-fit"
        >
          <DialogTitle className="border-b border-white/10 px-4 py-3 font-montserrat text-sm font-medium text-[#fcfdff]">
            Day {dayLabel} · select date
          </DialogTitle>

          <Calendar
            mode="single"
            locale={uk}
            selected={selectedDate}
            onSelect={handleSelect}
            defaultMonth={selectedDate}
            className="bg-[#1a1a1a] p-3 "
          />

          <div className="grid grid-cols-2 gap-2 border-t border-white/10 px-3 py-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className=" text-xs text-white/80 hover:bg-white/10 hover:text-white"
              onClick={handleClear}
            >
              <span className="font-montserrat">Clear</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="font-montserrat text-xs text-white/80 hover:bg-white/10 hover:text-white"
              onClick={handleToday}
            >
              <span className="font-montserrat">Today</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
