import type { JournalExerciseLog, TemplateExercise } from "@/types/templates";
import type { DayTone } from "@/utils/journalUtils";
import { DAY_LABELS, getDayTone } from "@/utils/journalUtils";

interface DaySelectorProps {
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
  days,
  openDay,
  logs,
  onDayToggle,
}: DaySelectorProps) => {
  const dayEntries = Object.entries(days).sort(
    ([dayA], [dayB]) => Number(dayA) - Number(dayB),
  );
  return (
    <div className="grid grid-cols-3 gap-3">
      {dayEntries.map(([dayNumber]) => {
        const numericDay = Number(dayNumber);
        const isActive = openDay === numericDay;
        const tone = getDayTone(days[numericDay] ?? [], logs);

        return (
          <button
            key={dayNumber}
            type="button"
            className={`rounded-md border px-3 py-2 font-space-mono text-sm transition-colors ${
              isActive ? ACTIVE_CLASS : TONE_CLASSES[tone]
            }`}
            onClick={() => onDayToggle(numericDay)}
          >
            Day {DAY_LABELS[numericDay] ?? dayNumber}
          </button>
        );
      })}
      {/* <div className="flex items-center justify-center">
        <Button variant="secondary" className="border-none">
          notes
        </Button>
      </div> */}
    </div>
  );
};
