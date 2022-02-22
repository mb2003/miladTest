import { addDays, getDate } from "date-fns";
import { stringify } from "querystring";
import React, {
    JSXElementConstructor,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import "./Calender.css";

enum Week {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THUERSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY,
}

const today = new Date();
const startDay = getDate(today);
const firstDayOfWeek = today;

function Calender() {
    const [startOfWeek, setStartOfWeek] = useState(firstDayOfWeek);
    const [week, setWeek] = useState<Date[]>(
        getWeekByFirstDayOfWeek(firstDayOfWeek)
    );

    function getWeekByFirstDayOfWeek(f: Date) {
        const res: Date[] = [];
        for (let i = 0; i < 7; i++) {
            res.push(addDays(f, i));
        }
        return res;
    }

    useEffect(() => {}, [startOfWeek]);

    const getNextWeek = () => {
        const nextMonday = addDays(week[Week.SUNDAY], 1);
        setStartOfWeek(nextMonday);
        setWeek(getWeekByFirstDayOfWeek(nextMonday));
    };

    const weekDayNames = useMemo(
        () =>
            week.map((_, i) => {
                switch (i) {
                    case Week.SUNDAY:
                        return "Sunday";
                    case Week.MONDAY:
                        return "Monday";
                    case Week.TUESDAY:
                        return "Tuesday";
                    case Week.WEDNESDAY:
                        return "Wednesday";
                    case Week.THUERSDAY:
                        return "Thursday";
                    case Week.FRIDAY:
                        return "Friday";
                    case Week.SATURDAY:
                        return "Saturday";
                }
            }) as string[],
        [week]
    );

    const openingHours = { from: 9, to: 20 };

    const quarterHour = [":00", ":15", ":30", ":45"];

    const calenderDate: CalendarYear[] = [
        {
            year: 2023,
            months: [
                {
                    month: 1,
                    days: [
                        {
                            day: 1,
                            appointments: [
                                { hour: "09", minutes: quarterHour },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    interface CalendarYear {
        year: number;
        months: CalendarMonth[];
    }

    interface CalendarMonth {
        month: number;
        days: CalendarDay[];
    }

    interface CalendarDay {
        day: number;
        appointments: Appointment[];
    }

    interface Appointment {
        hour: string;
        minutes: Array<string>;
    }

    function DataCalender() {
        const calenderData: CalendarYear[] = [];
        const appointment: Array<Appointment> = [];
        const hourRowsReactElement = [];
        for (let index = openingHours.from; index < openingHours.to; index++) {
            const appTmp: Array<Appointment> = [
                {
                    hour: String(index),
                    minutes: quarterHour,
                },
            ];
            appointment.push(...appTmp);
        }
        week.map((day, i) => {
            const tmp: CalendarYear[] = [
                {
                    year: day.getFullYear(),
                    months: [
                        {
                            month: day.getMonth() + 1,
                            days: [
                                {
                                    day: day.getDate(),
                                    appointments: appointment,
                                },
                            ],
                        },
                    ],
                },
            ];
            calenderData.push(...tmp);
        });

        for (let index = 0; index < appointment.length; index++) {
            hourRowsReactElement.push(
                calenderData.flatMap((a) =>
                    a.months.flatMap((a) =>
                        a.days.flatMap((a) => (
                            <td>{a.appointments[index].hour}</td>
                        ))
                    )
                )
            );
        }

        return (
            <>
                <tr>
                    {calenderData.map((v) => (
                        <th>{v.months.map((a) => a.days.map((a) => a.day))}</th>
                    ))}
                </tr>

                {hourRowsReactElement.map((a) => (
                    <tr>{a}</tr>
                ))}
            </>
        );
    }

    return (
        <div className="calender">
            <button onClick={getNextWeek}>Get Next Week</button>
            <table>
                <DataCalender />
            </table>
        </div>
    );
}

export default Calender;
