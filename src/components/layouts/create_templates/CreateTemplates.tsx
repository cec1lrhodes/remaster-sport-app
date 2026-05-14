import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import type { TemplateDraft } from "@/types/templates";

const exerciseOptions = [
  { name: "Squat", id: 1 },
  { name: "Bench Press", id: 2 },
  { name: "Deadlift", id: 3 },
  { name: "Bulgarian-Squats", id: 4 },
  { name: "Pull-ups", id: 5 },
  { name: "Bar pressing", id: 6 },
];

type SetDraftField = <Key extends keyof TemplateDraft>(
  field: Key,
  value: TemplateDraft[Key],
) => void;

interface TemplateExerciseFormProps {
  draft: TemplateDraft;
  selectedExercise: string;
  setDraftField: SetDraftField;
  onExerciseSelect: (exerciseName: string) => void;
  onCustomExerciseChange: (value: string) => void;
  onAddExercise: () => void;
}

export const TemplateExerciseForm = ({
  draft,
  selectedExercise,
  setDraftField,
  onExerciseSelect,
  onCustomExerciseChange,
  onAddExercise,
}: TemplateExerciseFormProps) => {
  return (
    <>
      <div className="mt-8 pl-2">
        <h1 className="text-[16px] font-montserrat text-[#fcfdff]">
          select week & day
        </h1>

        <div className="mt-3 grid w-full grid-cols-2 gap-3">
          <Select
            value={String(draft.selectedWeek)}
            onValueChange={(value) =>
              setDraftField("selectedWeek", Number(value))
            }
          >
            <SelectTrigger className="w-full focus-visible:border-input focus-visible:ring-0 border-0 border-b border-white/20 rounded-none ">
              <SelectValue placeholder="week" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className="z-9999 w-(--radix-select-trigger-width) border border-white/20 bg-black ring-0"
            >
              <SelectGroup>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="8">8</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={String(draft.selectedDay)}
            onValueChange={(value) =>
              setDraftField("selectedDay", Number(value))
            }
          >
            <SelectTrigger className="w-full border-0 border-b border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0">
              <SelectValue placeholder="day" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className="z-9999 w-(--radix-select-trigger-width) border border-white/20 bg-black ring-0"
            >
              <SelectGroup>
                <SelectItem value="1">A</SelectItem>
                <SelectItem value="2">B</SelectItem>
                <SelectItem value="3">C</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {exerciseOptions.map((exercise) => (
          <div key={exercise.id}>
            <Button
              type="button"
              className={
                !draft.customExercise.trim() &&
                draft.currentExercise === exercise.name
                  ? "border border-white/40 bg-white text-black"
                  : ""
              }
              onClick={() => onExerciseSelect(exercise.name)}
            >
              <span className="font-space-mono">{exercise.name}</span>
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Input
          className="w-full border-0 border-b border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
          placeholder="custom exercise"
          value={draft.customExercise}
          onChange={(event) => onCustomExerciseChange(event.target.value)}
        />
      </div>

      {selectedExercise && (
        <p className="mt-3 pl-2 font-space-mono text-sm text-white/60">
          selected: {selectedExercise}
        </p>
      )}

      <div className="mt-10 flex  justify-center gap-20 font-montserrat text-[#fcfdff]">
        <div>
          <h2>reps</h2>
          <Input
            className="w-full border-0 border-b placeholder:text-center text-center border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
            placeholder="0"
            value={draft.currentReps}
            onChange={(event) =>
              setDraftField("currentReps", event.target.value)
            }
          />
        </div>
        <div>
          <h2>sets</h2>
          <Input
            className="w-full border-0 border-b  placeholder:text-center text-center border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
            placeholder="0"
            value={draft.currentSets}
            onChange={(event) =>
              setDraftField("currentSets", event.target.value)
            }
          />
        </div>
        <div>
          <h2>kg</h2>
          <Input
            className="w-full border-0 border-b  placeholder:text-center text-center border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
            placeholder="0"
            value={draft.currentKg}
            onChange={(event) => setDraftField("currentKg", event.target.value)}
          />
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <Button
          type="button"
          className="bg-white text-black w-full h-[40px] rounded-[32px]"
          onClick={onAddExercise}
        >
          <span className="font-montserrat text-[15px] font-medium">
            Add Exercise
          </span>
        </Button>
      </div>
    </>
  );
};
