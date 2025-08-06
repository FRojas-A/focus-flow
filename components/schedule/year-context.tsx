"use client";
import { Database } from "@/database.types";
import { createContext, useContext, useState, ReactNode } from "react";

type YearContextType = {
    year: string | null;
    setYear: (year: string) => void;
    yearId: number | null;
    setYearId: (yearId: number) => void;
    yearStart: string;
    setYearStart: (yearStart: string) => void;
    yearEnd: string;
    setYearEnd: (yearEnd: string) => void;
    terms: TermRecord[];
    setTerms: React.Dispatch<React.SetStateAction<TermRecord[]>>;
    termId: number | null;
    setTermId: React.Dispatch<React.SetStateAction<number | null>>;
    termStart: string;
    setTermStart: React.Dispatch<React.SetStateAction<string>>;
    termEnd: string;
    setTermEnd: React.Dispatch<React.SetStateAction<string>>;
};

type TermRecord = Database["public"]["Tables"]["terms"]["Row"];

const YearContext = createContext<YearContextType | undefined>(undefined);

export function YearProvider({ children }: { children: ReactNode }) {
  const [year, setYear] = useState<string | null>(null);
  const [yearId, setYearId] = useState<number | null>(null);
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [terms, setTerms] = useState<TermRecord[]>([]);
  const [termId, setTermId] = useState<number | null>(null);
  const [termStart, setTermStart] = useState("");
  const [termEnd, setTermEnd] = useState("");

  return (
    <YearContext.Provider value={{ 
        year, 
        setYear, 
        yearId, 
        setYearId, 
        yearStart, 
        setYearStart, 
        yearEnd, 
        setYearEnd, 
        terms, 
        setTerms, 
        termId, 
        setTermId, 
        termStart, 
        setTermStart, 
        termEnd, 
        setTermEnd 
    }}>
      {children}
    </YearContext.Provider>
  );
}

export function useYear() {
  const context = useContext(YearContext);
  if (!context) {
    throw new Error("useYear must be used within a YearProvider");
  }
  return context;
}