import { addDays } from "date-fns";
import { useState } from "react";
import { Week } from "./Calender.types";

export const useWeek = (d: Date) => {
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(d);
  const [week, setWeek] = useState<Date[]>(
      getWeekByFirstDayOfWeek(firstDayOfWeek)
  );

  const onNextWeek = () => {
      const nextDayInAWeek = addDays(week[Week.SUNDAY], 1);
      setFirstDayOfWeek(nextDayInAWeek);
      setWeek(getWeekByFirstDayOfWeek(nextDayInAWeek));
  };

  function getWeekByFirstDayOfWeek(f: Date) {
      const res: Date[] = [];
      for (let i = 0; i < 7; i++) {
          res.push(addDays(f, i));
      }
      return res;
  }

  return {
      week,
      onNextWeek
  }
}