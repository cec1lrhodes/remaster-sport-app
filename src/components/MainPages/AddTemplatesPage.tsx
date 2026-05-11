import { ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

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

const exercises = [
  { name: "Squat", id: 1 },
  { name: "Bench Press", id: 2 },
  { name: "Deadlift", id: 3 },
  { name: "Squat", id: 4 },
  { name: "Pull-ups", id: 5 },
  { name: "Bar pressing", id: 6 },
];

export const AddTemplatesPage = () => {
  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <Link
          to="/templates"
          aria-label="Back to library"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-accent"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <h1 className="text-[20px] font-space-grotesk text-[#fcfdff]">
          Create new template
        </h1>
      </div>

      <div className="mt-8 pl-2">
        <h1 className="text-[16px] font-montserrat text-[#fcfdff]">
          select week & day
        </h1>

        <div className="mt-3 grid w-full grid-cols-2 gap-3">
          <Select>
            <SelectTrigger className="w-full focus-visible:border-input focus-visible:ring-0 border-0 border-b border-white/20 rounded-none ">
              <SelectValue placeholder="week" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className="z-9999 w-(--radix-select-trigger-width) border border-white/20 bg-black ring-0"
            >
              <SelectGroup>
                <SelectItem value="week-1">1</SelectItem>
                <SelectItem value="week-2">2</SelectItem>
                <SelectItem value="week-3">3</SelectItem>
                <SelectItem value="week-4">4</SelectItem>
                <SelectItem value="week-5">5</SelectItem>
                <SelectItem value="week-6">6</SelectItem>
                <SelectItem value="week-7">7</SelectItem>
                <SelectItem value="week-8">8</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full border-0 border-b border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0">
              <SelectValue placeholder="day" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className="z-9999 w-(--radix-select-trigger-width) border border-white/20 bg-black ring-0"
            >
              <SelectGroup>
                <SelectItem value="day-a">A</SelectItem>
                <SelectItem value="day-b">B</SelectItem>
                <SelectItem value="day-c">C</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {exercises.map((exercise) => (
          <div key={exercise.id}>
            <Button className="">
              <span className="font-space-mono">{exercise.name}</span>
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Input
          className="w-full border-0 border-b border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
          placeholder="custom exercise"
        />
        <Button className="">
          <span className="font-montserrat">Add</span>
        </Button>
      </div>
    </div>
  );
};
