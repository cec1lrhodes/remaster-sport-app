import type { JournalExerciseLog, TemplateExercise } from "@/types/templates";
import type { DayTone } from "@/utils/journalUtils";
import {
  DAY_LABELS,
  formatJournalDate,
  getDayTone,
  getJournalDayDateIso,
} from "@/utils/journalUtils";
import { useJournal } from "@/store/templates/hooks/useJournal";

interface DaySelectorProps {
  templateId: string;
  weekNumber: number;
  days: Record<number, TemplateExercise[]>;
  openDay: number | null;
  logs: Record<string, JournalExerciseLog>;
  onDayToggle: (day: number) => void;
}

const ACTIVE_CLASS =
  "border-white/40 bg-white text-black ring-2 ring-white/25 ring-offset-2 ring-offset-[#1a1a1a]";

const TONE_CLASSES: Record<DayTone, string> = {
  green: "border-none bg-[#003c33] text-white",
  orange: "border-none bg-[#a9583e] text-white",
  neutral: "border-white/10 text-white/70 hover:bg-white/10 hover:text-white",
};

export const DaySelector = ({
  templateId,
  weekNumber,
  days,
  openDay,
  logs,
  onDayToggle,
}: DaySelectorProps) => {
  const { journalDayDates } = useJournal();

  const dayEntries = Object.entries(days).sort(
    ([dayA], [dayB]) => Number(dayA) - Number(dayB),
  );

  return (
    <div className="grid grid-cols-3 gap-3">
      {dayEntries.map(([dayNumber]) => {
        const numericDay = Number(dayNumber);
        const isActive = openDay === numericDay;
        const tone = getDayTone(days[numericDay] ?? [], logs);
        const dateIso = getJournalDayDateIso(
          templateId,
          weekNumber,
          numericDay,
          journalDayDates,
        );

        return (
          <button
            key={dayNumber}
            type="button"
            className={`flex flex-col items-center gap-0.5 rounded-md border px-3 py-2 font-space-mono text-sm transition-colors ${
              isActive ? ACTIVE_CLASS : TONE_CLASSES[tone]
            }`}
            onClick={() => onDayToggle(numericDay)}
          >
            <span>Day {DAY_LABELS[numericDay] ?? dayNumber}</span>
            {dateIso && (
              <span
                className={`text-[10px] ${
                  isActive ? "text-black/60" : "text-white/50"
                }`}
              >
                {formatJournalDate(dateIso)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
