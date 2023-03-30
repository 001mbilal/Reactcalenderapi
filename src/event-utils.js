let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: "Kashmir Doy",
    start: new Date("2023-03-22"),
  },
  {
    id: createEventId(),
    title: "Pokiston Doy",
    start: new Date("2023-03-23"),
  },
  {
    id: createEventId(),
    title: "Eid-ui-Fitr,(lst Showol",
    start: new Date("2023-04-22"),
  },
  {
    id: createEventId(),
    title: "Lobour Doy",
    start: new Date("2023-05-01"),
  },
];

export function createEventId() {
  return String(eventGuid++);
}
