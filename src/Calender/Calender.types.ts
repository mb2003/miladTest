export interface CalendarYear {
  year: number;
  months: CalendarMonth[];
}

export enum Week {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THUERSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
}

export interface CalendarMonth {
  month: number;
  days: CalendarDay[];
}

export interface CalendarDay {
  day: string;
  appointments: Appointment[];
}

export interface Appointment {
  hour: string;
  minutes: Array<string>;
}
