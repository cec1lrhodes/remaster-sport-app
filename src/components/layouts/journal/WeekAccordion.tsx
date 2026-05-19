import { ChevronDown } from "lucide-react";
import { DaySelector } from "./DaySelector";
import { DayExecutionDatePicker } from "./DayExecutionDatePicker";
import { OpenDayCard } from "./OpenDayCard";
import type { JournalExerciseLog, TemplateExercise } from "@/types/templates";

interface Props {
  templateId: string;
  weekNumber: number;
  days: Record<number, TemplateExercise[]>;
  isOpen: boolean;
  openDay: number | null;
  logs: Record<string, JournalExerciseLog>;
  onWeekToggle: (week: number) => void;
  onDayToggle: (day: number) => void;
  onFieldChange: (
    exerciseId: string,
    field: keyof JournalExerciseLog,
    value: string,
  ) => void;
}

export const WeekAccordion = ({
  templateId,
  weekNumber,
  days,
  isOpen,
  openDay,
  logs,
  onWeekToggle,
  onDayToggle,
  onFieldChange,
}: Props) => (
  <div className="border-white/20">
    <button
      type="button"
      className="flex w-full items-center justify-between border-0 border-b border-white/20 py-4 font-montserrat font-normal text-[#fcfdff] focus-visible:border-input focus-visible:ring-0"
      style={{ fontFamily: "Montserrat, sans-serif" }}
      onClick={() => onWeekToggle(weekNumber)}
    >
      <span>Week {weekNumber}</span>

      <ChevronDown
        className={`size-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
        aria-hidden="true"
      />
    </button>

    {isOpen && (
      <div className="mt-5 space-y-4 pb-2">
        <DaySelector
          days={days}
          openDay={openDay}
          logs={logs}
          onDayToggle={onDayToggle}
        />

        {openDay && days[openDay] && (
          <div className="space-y-3">
            <DayExecutionDatePicker
              templateId={templateId}
              weekNumber={weekNumber}
              dayNumber={openDay}
            />

            {days[openDay].map((exercise) => (
              <OpenDayCard
                key={exercise.id}
                exercise={exercise}
                log={logs[exercise.id]}
                onFieldChange={(field, value) =>
                  onFieldChange(exercise.id, field, value)
                }
              />
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);
