import { Button } from "@mui/material";
import { format } from "date-fns";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "./Calender.css";
import { Appointment } from "./Calender.types";
import { v4 as uuidv4 } from "uuid";
import { useWeek } from "./useWeek";

const today = new Date();
const firstDayOfWeek = today;
const openingHours = { from: 9, to: 20 };
const quarterHour = [":00", ":15", ":30", ":45"];

export function Calender() {
    const { week, onNextWeek } = useWeek(firstDayOfWeek);

    const renderHours = () => (
        getCalendarHours().map((a) => (
            <TableCell key={uuidv4()}>
                <Button variant="contained" size="large" fullWidth>
                    <h3>{a.hour}</h3>
                </Button>
            </TableCell>
        ))
    );

    return (
        <div className="calender">
            <button onClick={onNextWeek}>Get Next Week</button>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {week.map((d: Date) => (
                            <TableCell align="center" key={uuidv4()}>
                                {format(d, "eee LLL dd yy")}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {renderHours().map((a, i) => (
                        <TableRow
                            key={i}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            {
                                week.map(() => a)
                            }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function getCalendarHours() {
    const appointment: Array<Appointment> = [];
    for (let index = openingHours.from; index < openingHours.to; index++) {
        appointment.push({ 
            hour: String(index), 
            minutes: quarterHour 
        });
    }
    return appointment;
}

export default Calender;
