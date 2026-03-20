import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import metaData from "../data/generated/meta.json";

const defaultYear = metaData.years[metaData.years.length - 1]!;

interface YearContextValue {
  years: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}

const YearContext = createContext<YearContextValue | null>(null);

export function YearProvider({ children }: { children: ReactNode }) {
  const [selectedYear, setYear] = useState(defaultYear);

  const setSelectedYear = useCallback((year: number) => {
    setYear(year);
  }, []);

  const value = useMemo(
    () => ({
      years: metaData.years,
      selectedYear,
      setSelectedYear,
    }),
    [selectedYear, setSelectedYear],
  );

  return <YearContext.Provider value={value}>{children}</YearContext.Provider>;
}

export function useYear(): YearContextValue {
  const ctx = useContext(YearContext);
  if (!ctx) {
    throw new Error("useYear must be used within YearProvider");
  }
  return ctx;
}
