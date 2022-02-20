import {
    add,
    addDays,
    format,
    getDate,
    startOfWeek,
    eachHourOfInterval,
} from "date-fns";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

    // var myJson = [
    //     {
    //         day: "",
    //         date: "",
    //         times: [
    //             { hour: 9, booked: true },
    //             { hour: 10, booked: true },
    //             { hour: 11, booked: true },
    //             { hour: 12, booked: true },
    //         ],
    //     },
    // ];

    // const overJson = () => {
    //     for (let index = 0; index < myJson.length; index++) {
    //         let date = week[index].toLocaleDateString();
    //         let day = week[index].toDateString().substring(0, 3);
    //         myJson[index].date = date;
    //         myJson[index].day = day;
    //     }
    // };

    interface json {
        day: string;
        date: string;
        times: bookingTime[];
    }
    type bookingTime = {
        hour: number;
        booked: boolean;
    };
    const appointmentData = () => {
        let times: any[] = [];
        let tmp: Array<json> = [];
        for (let index = 0; index < week.length; index++) {
            let date = week[index].toLocaleDateString();
            let day = week[index].toDateString().substring(0, 3);
            for (let i = 0; i < 8; i++) {
                let hour = i;
                times[i] = { hour: hour + 9, booked: true };
            }
            tmp.push({ date, day, times });
        }
        return tmp;
    };
    appointmentData();

    return (
        <div className="calender">
            <button onClick={getNextWeek}>Get Next Week</button>

            <table>
                {appointmentData().map((v) => (
                    <>
                        <tr>
                            {" "}
                            <th>
                                {v.day} / {v.date}
                            </th>
                            {v.times.map((a) => (
                                <td>
                                    <button value={v.date + "--" + a.hour}>
                                        {" "}
                                        {a.hour}{" "}
                                    </button>{" "}
                                </td>
                            ))}
                        </tr>
                    </>
                ))}
            </table>
        </div>
    );
}

export default Calender;
