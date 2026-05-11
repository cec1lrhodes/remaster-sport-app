import { ChevronLeft, XIcon } from "lucide-react";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";

const exercises = [
  { name: "Squat", id: 1 },
  { name: "Bench Press", id: 2 },
  { name: "Deadlift", id: 3 },
  { name: "Squat", id: 4 },
  { name: "Pull-ups", id: 5 },
  { name: "Bar pressing", id: 6 },
];

const templatePreview = [
  {
    day: "A",
    exercises: [
      { name: "Bench", sets: 3, reps: 5, kg: 70 },
      { name: "Squat", sets: 3, reps: 3, kg: 90 },
      { name: "Pull-ups", sets: 4, reps: 8, kg: 0 },
    ],
  },
  {
    day: "B",
    exercises: [
      { name: "Deadlift", sets: 3, reps: 5, kg: 110 },
      { name: "Bar pressing", sets: 4, reps: 6, kg: 45 },
    ],
  },
  {
    day: "C",
    exercises: [{ name: "Bench Press", sets: 5, reps: 5, kg: 75 }],
  },
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

      {/* REPS SETS KG */}
      <div className="mt-10 flex  justify-center gap-20 font-montserrat text-[#fcfdff]">
        <div>
          <h2>reps</h2>
          <Input
            className="w-full border-0 border-b placeholder:text-center text-center border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
            placeholder="0"
          />
        </div>
        <div>
          <h2>sets</h2>
          <Input
            className="w-full border-0 border-b  placeholder:text-center text-center border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
            placeholder="0"
          />
        </div>
        <div>
          <h2>kg</h2>
          <Input
            className="w-full border-0 border-b  placeholder:text-center text-center border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
            placeholder="0"
          />
        </div>
      </div>

      {/* FULL CARD | CONFIRM | NAME */}

      <div className="mt-10">
        <Card className="rounded-[10px] border border-white/20 bg-transparent ring-0 ">
          <CardHeader>
            <CardTitle className="font-space-grotesk text-[#fcfdff]">
              Full Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1" className="border-white/20">
                <AccordionTrigger className=" text-[#fcfdff] hover:no-underline focus-visible:border-input focus-visible:ring-0 border-0 border-b border-white/20 rounded-none  ">
                  <span className="font-montserrat"> Week 1</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-5 mt-5">
                  {templatePreview.map((day) => (
                    <div key={day.day} className="space-y-2">
                      <h3 className="font-space-mono text-sm text-white/70">
                        {day.day}
                      </h3>

                      <div className="space-y-2">
                        {day.exercises.map((exercise) => (
                          <div
                            key={`${day.day}-${exercise.name}`}
                            className="flex items-center justify-between gap-3 rounded-md border border-white/10 px-3 py-2"
                          >
                            <span className="font-space-mono text-sm text-[#fcfdff]">
                              {exercise.name} {exercise.sets}x{exercise.reps}{" "}
                              {exercise.kg}kg
                            </span>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              aria-label={`Delete ${exercise.name}`}
                              className="text-white/50 hover:bg-white/10 hover:text-white focus-visible:border-input focus-visible:ring-0"
                            >
                              <XIcon className="size-3" aria-hidden="true" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="flex justify-between border-t-0 bg-transparent">
            <Button className="bg-blue-50 text-blue-500 dark:bg-blue-950 dark:text-blue-300 ">
              <span className="font-montserrat">Set name</span>
            </Button>
            <Button className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 hover:text-green-500">
              <span className="font-montserrat">Confirm</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
