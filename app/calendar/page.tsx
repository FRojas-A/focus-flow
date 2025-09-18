"use client";
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function CalendarPage() {
    return (
        <div className="calendar-page h-full w-full flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-auto">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: "title",
                        center: "prev,today,next",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    height="100%"
                    expandRows={true}
                    handleWindowResize={true}
                    slotMinTime="07:00:00"
                    slotMaxTime="22:00:00"
                />
            </div>
        </div>
    )
}
