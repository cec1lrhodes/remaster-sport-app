import { Input } from "@/components/ui/input";
import type { JournalExerciseLog, TemplateExercise } from "@/types/templates";

interface OpenDayCardProps {
  exercise: TemplateExercise;
  log: JournalExerciseLog | undefined;
  onFieldChange: (field: keyof JournalExerciseLog, value: string) => void;
}

const FIELDS = ["reps", "sets", "kg"] as const;

export const OpenDayCard = ({
  exercise,
  log,
  onFieldChange,
}: OpenDayCardProps) => {
  return (
    <div className="rounded-md border border-white/10 px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="font-space-mono text-sm text-[#fcfdff]">
          {exercise.exercise}
        </span>
        <span className="font-space-mono text-xs text-white/50">
          plan: {exercise.sets}x{exercise.reps} {exercise.kg ?? 0}kg
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 font-montserrat text-[#fcfdff]">
        {FIELDS.map((field) => (
          <div key={field}>
            <h3 className="text-sm">{field}</h3>
            <Input
              type="number"
              min={0}
              className="w-full rounded-none border-0 border-b border-white/20 text-center placeholder:text-center focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
              placeholder="0"
              value={log?.[field] ?? ""}
              onChange={(e) => onFieldChange(field, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
