import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";

const locales = {
    "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// საწყისი ღონისძიებები
const defaultEvents = [
    {
        title: "Big Meeting",
        allDay: true,
        start: new Date(2021, 6, 0),
        end: new Date(2021, 6, 0),
    },
    {
        title: "Vacation",
        start: new Date(2021, 6, 7),
        end: new Date(2021, 6, 10),
    },
    {
        title: "Conference",
        start: new Date(2021, 6, 20),
        end: new Date(2021, 6, 23),
    },
];

export default function CalendarssApp() {
    const [newEvent, setNewEvent] = useState({ title: "", start: null, end: null });
    const [allEvents, setAllEvents] = useState([]);

    // წამოიღე ღონისძიებები localStorage 
    useEffect(() => {
        const savedEvents = localStorage.getItem("calendarEvents");
        if (savedEvents) {
            setAllEvents(JSON.parse(savedEvents)); 
        } else {
            setAllEvents(defaultEvents); 
        }
    }, []);

    // ღონისძიებების დამახსოვრება localStorage
    useEffect(() => {
        localStorage.setItem("calendarEvents", JSON.stringify(allEvents));
    }, [allEvents]);

    function handleAddEvent() {
        if (!newEvent.start || !newEvent.end) {
            alert("Please select valid start and end dates");
            return;
        }

        for (let i = 0; i < allEvents.length; i++) {
            const existingStart = new Date(allEvents[i].start);
            const existingEnd = new Date(allEvents[i].end);
            const newStart = new Date(newEvent.start);
            const newEnd = new Date(newEvent.end);

            if (
                (existingStart <= newStart && newStart <= existingEnd) ||
                (existingStart <= newEnd && newEnd <= existingEnd)
            ) {
                alert("Event clash detected!");
                return;
            }
        }

        // ახალი ღონისძიებების დამატება და განახლება local storage
        const updatedEvents = [...allEvents, newEvent];
        setAllEvents(updatedEvents);
        setNewEvent({ title: "", start: null, end: null }); 
    }

    return (
        <div className="Calendar">
            <h1>Calendar</h1>
            <h2>Add New Event</h2>
            <div>
                <input
                    type="text"
                    placeholder="Add Title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="addtitle"
                />
                <DatePicker
                    placeholderText="Start Date"
                    selected={newEvent.start}
                    onChange={(start) => setNewEvent({ ...newEvent, start })}
                    className="datepicker" 
                />
                <DatePicker
                    placeholderText="End Date"
                    selected={newEvent.end}
                    onChange={(end) => setNewEvent({ ...newEvent, end })}
                />
                <button style={{ marginTop: "10px" }} onClick={handleAddEvent}>
                    Add Event
                </button>
            </div>
            <Calendar
                localizer={localizer}
                events={allEvents}
                startAccessor="start"
                endAccessor="end"
                className="my-calendar" 
            />
        </div>
    );
}
