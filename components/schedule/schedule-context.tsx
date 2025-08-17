"use client";

import { ReactNode, useContext, useState } from "react";
import { createContext } from "react";

type ScheduleContextType = {
    year: string | null;
    setYear: (year: string) => void;
    yearId: number | null;
    setYearId: (yearId: number) => void;
    yearStart: string;
    setYearStart: (yearStart: string) => void;
    yearEnd: string;
    setYearEnd: (yearEnd: string) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [year, setYear] = useState<string | null>(null);
  const [yearId, setYearId] = useState<number | null>(null);
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  
  return (
    <ScheduleContext value={{
        year, 
        setYear, 
        yearId, 
        setYearId, 
        yearStart, 
        setYearStart, 
        yearEnd, 
        setYearEnd
    }}>
        {children}
    </ScheduleContext>
  )
}

export function useSchedule() {
    const context = useContext(ScheduleContext);
    if (!context) {
        throw new Error("useSchedule must be used within a ScheduleProvider");
    }
    return context;
}