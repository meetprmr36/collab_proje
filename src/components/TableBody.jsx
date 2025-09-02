import moment from "moment";
import React from "react";
import Popup from 'reactjs-popup';
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Action from "./Action";

const TableBody = () => {
    const exampleData = [
        {
            date: '27-08-2016',
            inOut: [
                { type: 'in', time: '09:30' },
                { type: 'out', time: '10:10' },
                { type: 'in', time: '10:30' },
                { type: 'out', time: '13:10' },
                { type: 'in', time: '13:50' },
                { type: 'out', time: '16:10' },
                { type: 'in', time: '16:20' },
                { type: 'out', time: '19:10' }
            ],
        },
        {
            date: '26-08-2016',
            inOut: [
                { type: 'in', time: '09:40' },
                { type: 'out', time: '10:10' },
                { type: 'in', time: '10:30' },
                { type: 'out', time: '13:10' },
                { type: 'in', time: '14:20' },
                { type: 'out', time: '16:10' },
                { type: 'in', time: '16:20' },
                { type: 'out', time: '20:10' }
            ],
        },
        {
            date: '25-08-2016',
            inOut: [
                { type: 'in', time: '09:20' },
                { type: 'out', time: '11:00' },
                { type: 'in', time: '11:20' },
                { type: 'out', time: '13:00' },
                { type: 'in', time: '14:00' },
                { type: 'out', time: '15:30' },
                { type: 'in', time: '16:40' },
                { type: 'out', time: '17:00' },
                { type: 'in', time: '17:20' },
                { type: 'out', time: '19:30' }
            ],
        }
    ]

    const session = (inOut) => {
        let InoutArray = [];
        for (let i = 0; i < inOut.length; i += 1) {
            if (inOut[i].type == 'in') {
                const inTime = moment(inOut[i].time, 'HH:mm');
                if (inOut[i + 1] && inOut[i + 1].type == 'out') {
                    const outTime = moment(inOut[i + 1].time, 'HH:mm');
                    InoutArray.push({ in: inTime.format('HH:mm'), out: outTime.format('HH:mm') });
                    i++;
                } else {
                    InoutArray.push({ in: inTime.format('HH:mm'), out: 'Missing' });
                }
            } else if (inOut[i].type == 'out') {
                const outTime = moment(inOut[i].time, 'HH:mm');
                InoutArray.push({ in: 'Missing', out: outTime.format('HH:mm') });
            }
        }
        return InoutArray;
    }

    const calculateEfficient = (inOut) => {
        let totalMinutes = 0;
        for (let i = 0; i < inOut.length; i += 1) {
            if (inOut[i]?.type == 'in' && inOut[i + 1]?.type == 'out') {
                const inTime = moment(inOut[i].time, 'HH:mm');
                const outTime = moment(inOut[i + 1].time, 'HH:mm');
                const duration = moment.duration(outTime.diff(inTime));
                totalMinutes += duration.asMinutes();
                i++;
            } else {
                console.log("skipped");
            }
        };
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    const calculateBreak = (inOut) => {
        let totalMinutes = 0;
        for (let i = 1; i < inOut.length - 1; i += 1) {
            if (inOut[i].type == 'out' && inOut[i + 1].type == 'in') {
                const outTime = moment(inOut[i].time, 'HH:mm');
                const nextInTime = moment(inOut[i + 1].time, 'HH:mm');
                const duration = moment.duration(nextInTime.diff(outTime));
                totalMinutes += duration.asMinutes();
            }
            else if (inOut[i].type == 'in' && inOut[i + 1].type == 'in') {
                console.log("something went wrong")
            }
        };
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    const calsulateGross = (inOut) => {
        const breaktime = calculateBreak(inOut);
        const efficienttime = calculateEfficient(inOut);
        const breakParts = breaktime.split(' ');
        const efficientParts = efficienttime.split(' ');
        const breakHours = parseInt(breakParts[0].replace('h', '')) * 60;
        const breakMinutes = parseInt(breakParts[1].replace('m', ''));
        const efficientHours = parseInt(efficientParts[0].replace('h', '')) * 60;
        const efficientMinutes = parseInt(efficientParts[1].replace('m', ''));
        const breakTotalMinutes = breakHours + breakMinutes;
        const efficientTotalMinutes = efficientHours + efficientMinutes;
        const totalMinutes = breakTotalMinutes + efficientTotalMinutes;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    }

    const PrintingData = (data) => {
        return data.map((entry, index) => {
            const formattedDay = moment(entry.date, 'DD-MM-YYYY').format('llll').slice(0, 3);
            const formattedate = moment(entry.date, 'DD-MM-YYYY').format('llll').slice(8, 12);
            const formattedmonth = moment(entry.date, 'DD-MM-YYYY').format('llll').slice(4, 8);

            return (
                <tr className="TabHead" key={index}>
                    <td className="Series">{index + 1}</td>
                    <td className="Date" title={formattedDay + formattedate + formattedmonth}>{formattedDay + formattedate + formattedmonth}</td>
                    <td className="Attendace" style={{ width: "20%" }}>
                        <Popup
                            trigger={
                                <div className="inOutTimes">
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <span key={i} className="Line">|</span>
                                    ))}
                                    {session(entry.inOut).map((session, idx) => {
                                        if (session.out !== 'Missing' && session.in !== 'Missing') {
                                            const inMoment = moment(session.in, 'HH:mm');
                                            const outMoment = moment(session.out, 'HH:mm');
                                            const inMinutes = inMoment.hours() * 60 + inMoment.minutes();
                                            const outMinutes = outMoment.hours() * 60 + outMoment.minutes();
                                            const leftPercent = (inMinutes / 1440) * 100;
                                            const widthPercent = ((outMinutes - inMinutes) / 1440) * 100;
                                            return (
                                                <span
                                                    key={idx}
                                                    className="time"
                                                    style={{
                                                        position: "absolute",
                                                        left: `${leftPercent}%`,
                                                        width: `${widthPercent}%`,
                                                        height: "16px",
                                                        borderRadius: "3px",
                                                        zIndex: 1,
                                                    }}
                                                    title={`${session.in} - ${session.out}`}
                                                ></span>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </div>
                            }
                            position="bottom center"
                            closeOnDocumentClick

                        >
                            <div className="POpup">
                                {session(entry.inOut).map((session, idx) => {
                                    return <div key={idx} className="sessionTimes">
                                        <span className="inTime"><FaArrowUp className="Green"></FaArrowUp> {session.in}</span>
                                        <span className="outTime"><FaArrowDown className="Red"></FaArrowDown> {session.out}</span>
                                    </div>
                                })}
                            </div>
                        </Popup>
                    </td >
                    <td className="eff">{calculateEfficient(entry.inOut)}</td>
                    <td className="Break">{calculateBreak(entry.inOut)}</td>
                    <td className="Gross">{calsulateGross(entry.inOut)}</td>
                    <td className="Action">
                        <Action in={session(entry.inOut)[0]?.in} out={session(entry.inOut)[0]?.out} />
                    </td>
                </tr>
            );
        });
    };

    return (
        <div className="wholeTable">
            <table className="tableee">
                <tbody className="TabBody">
                    {PrintingData(exampleData)}
                </tbody>
            </table>
        </div>
    )
}
export default TableBody;