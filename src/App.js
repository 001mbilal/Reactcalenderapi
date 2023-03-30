import React, { useEffect, useState, useRef, useCallback } from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./event-utils";

export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [data, setData] = useState();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const calendar = useRef(null);

  const responseData = () => {
    fetch("https://www.gov.uk/bank-holidays.json")
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        setData(jsonResponse);
        console.log(jsonResponse["england-and-wales"].events[0].title);
      });
  };

  useEffect(() => {
    responseData();
  }, []);

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }

  function handleDateSelect(selectInfo) {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;
    console.log("hello", calendarApi.currentData.options.initialEvents);

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  function handleEventClick(clickInfo) {
    if (
      window.confirm(
        `Are you sure you want to delete the event ${clickInfo.event.title}`
      )
    ) {
      clickInfo.event.remove();
    }
  }

  // function handleEvents(events) {
  //   setCalendarEvents(events);
  // }

  const handleEvents = (events) => {
    const updatedEvents = events.map((event) => {
      const existingEvent = calendarEvents.find((e) => e.id === event.id);
      if (existingEvent) {
        return {
          ...existingEvent,
          ...event,
        };
      }
      return event;
    });

    if (updatedEvents.some((e) => !calendarEvents.includes(e))) {
      setCalendarEvents(updatedEvents);
    }
  };

  function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }

  // function renderSidebarEvent(event) {
  //   return (
  //     <li key={event.id}>
  //       <b>
  //         {formatDate(event.start, {
  //           // year: "numeric",
  //           // month: "short",
  //           day: "numeric",
  //         })}
  //       </b>
  //       <i>{event.title}</i>
  //     </li>
  //   );
  // }

  function renderSidebarEvent(event) {
    const { title, start } = event;
    return (
      <li key={event.id}>
        <b>{formatDate(start, { day: "numeric" })}</b>
        <i>{title}</i>
      </li>
    );
  }

  let eventGuid = 0;
  let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

  // const INITIAL_EVENTS = [
  //   {
  //     id: 0,
  //     title: data?.scotland.events[0].title,
  //     start: new Date(),
  //   },
  // ];

  const INITIAL_EVENTS = data?.scotland.events.map((event) => ({
    id: createEventId(),
    title: event.title,
    start: event.date,
  }));

  function createEventId() {
    return String(eventGuid++);
  }

  return (
    <div className="demo-app">
      <div className="demo-app-sidebar">
        {/* <div className="demo-app-sidebar-section">
          <h2>Instructions</h2>
          <ul>
            <li>Select dates and you will be prompted to create a new event</li>
            <li>Drag, drop, and resize events</li>
            <li>Click an event to delete it</li>
          </ul>
        </div> */}
        <div className="demo-app-sidebar-section">
          <label>
            <input
              type="checkbox"
              checked={weekendsVisible}
              onChange={handleWeekendsToggle}
            ></input>
            toggle weekends
          </label>
        </div>
        <div className="demo-app-sidebar-section">
          <h2>All Events ({data?.scotland.events.length})</h2>
          <ul>{data?.scotland.events.map(renderSidebarEvent)}</ul>
        </div>
      </div>
      <div className="demo-app-main">
        <FullCalendar
          ref={calendar}
          fixedWeekCount={true}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          events={INITIAL_EVENTS}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={(events) => {
            console.log("Events set: ", events);
          }}
          // eventsSet={handleEvents}
          /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
        />
      </div>
    </div>
  );
}
