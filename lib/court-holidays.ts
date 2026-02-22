export interface CourtHoliday {
  date: string;      // YYYY-MM-DD
  day: string;
  occasion: string;
  courts: string;    // "All" | "High Court" | "District Courts"
}

// Kerala High Court & District Courts — Holiday Calendar 2026
export const courtHolidays: CourtHoliday[] = [
  // ── January ──
  { date: "2026-01-01", day: "Thursday", occasion: "New Year's Day", courts: "All" },
  { date: "2026-01-15", day: "Thursday", occasion: "Makar Sankranti / Pongal", courts: "All" },
  { date: "2026-01-26", day: "Monday", occasion: "Republic Day", courts: "All" },

  // ── February ──
  { date: "2026-02-19", day: "Thursday", occasion: "Maha Shivaratri", courts: "All" },

  // ── March ──
  { date: "2026-03-14", day: "Saturday", occasion: "Holi", courts: "All" },
  { date: "2026-03-20", day: "Friday", occasion: "Id-ul-Fitr (Eid)", courts: "All" },
  { date: "2026-03-29", day: "Sunday", occasion: "Easter Sunday", courts: "All" },
  { date: "2026-03-30", day: "Monday", occasion: "Easter Monday", courts: "All" },

  // ── April ──
  { date: "2026-04-01", day: "Wednesday", occasion: "Annual Closing (Summer Vacation begins)", courts: "All" },
  { date: "2026-04-06", day: "Monday", occasion: "Ram Navami", courts: "All" },
  { date: "2026-04-14", day: "Tuesday", occasion: "Dr. Ambedkar Jayanti / Vishu", courts: "All" },
  { date: "2026-04-15", day: "Wednesday", occasion: "Vishu", courts: "All" },

  // ── May ──
  { date: "2026-05-01", day: "Friday", occasion: "May Day / Kerala Day", courts: "All" },
  { date: "2026-05-07", day: "Thursday", occasion: "Buddha Purnima", courts: "All" },
  { date: "2026-05-27", day: "Wednesday", occasion: "Id-ul-Zuha (Bakrid)", courts: "All" },
  { date: "2026-05-31", day: "Sunday", occasion: "Summer Vacation ends", courts: "All" },

  // ── June ──
  { date: "2026-06-26", day: "Friday", occasion: "Muharram", courts: "All" },

  // ── July ──
  { date: "2026-07-26", day: "Sunday", occasion: "Milad-un-Nabi (Prophet's Birthday)", courts: "All" },

  // ── August ──
  { date: "2026-08-15", day: "Saturday", occasion: "Independence Day", courts: "All" },
  { date: "2026-08-20", day: "Thursday", occasion: "Sree Narayana Guru Jayanti", courts: "All" },
  { date: "2026-08-22", day: "Saturday", occasion: "Onam (Thiruvonam)", courts: "All" },
  { date: "2026-08-21", day: "Friday", occasion: "First Onam (Uthradom)", courts: "All" },
  { date: "2026-08-23", day: "Sunday", occasion: "Third Onam (Avittom)", courts: "All" },
  { date: "2026-08-24", day: "Monday", occasion: "Fourth Onam", courts: "All" },

  // ── September ──
  { date: "2026-09-05", day: "Saturday", occasion: "Teachers' Day / Sree Narayana Guru Samadhi Day", courts: "District Courts" },

  // ── October ──
  { date: "2026-10-02", day: "Friday", occasion: "Gandhi Jayanti", courts: "All" },
  { date: "2026-10-20", day: "Tuesday", occasion: "Maha Navami", courts: "All" },
  { date: "2026-10-21", day: "Wednesday", occasion: "Vijayadashami (Dussehra)", courts: "All" },

  // ── November ──
  { date: "2026-11-01", day: "Sunday", occasion: "Kerala Piravi (Kerala Formation Day)", courts: "All" },
  { date: "2026-11-09", day: "Monday", occasion: "Deepavali", courts: "All" },

  // ── December ──
  { date: "2026-12-25", day: "Friday", occasion: "Christmas Day", courts: "All" },

  // ── Vacation periods ──
  { date: "2026-04-01", day: "Wednesday", occasion: "Summer Vacation begins", courts: "High Court" },
  { date: "2026-05-31", day: "Sunday", occasion: "Summer Vacation ends", courts: "High Court" },
  { date: "2026-12-21", day: "Monday", occasion: "Christmas Vacation begins", courts: "High Court" },
  { date: "2026-12-31", day: "Thursday", occasion: "Christmas Vacation ends", courts: "High Court" },
];

// Regular weekly holidays
export const weeklyHolidays = {
  saturday: "Second Saturdays are holidays for all courts",
  sunday: "All Sundays are holidays",
};

export function isCourtHoliday(dateStr: string): { isHoliday: boolean; reason?: string } {
  // Check if it's a Sunday
  const date = new Date(dateStr);
  if (date.getDay() === 0) {
    return { isHoliday: true, reason: "Sunday — weekly holiday" };
  }

  // Check if it's 2nd Saturday
  const dayOfMonth = date.getDate();
  if (date.getDay() === 6 && dayOfMonth > 7 && dayOfMonth <= 14) {
    return { isHoliday: true, reason: "Second Saturday — court holiday" };
  }

  // Check listed holidays
  const holiday = courtHolidays.find((h) => h.date === dateStr);
  if (holiday) {
    return { isHoliday: true, reason: `${holiday.occasion} (${holiday.courts} courts)` };
  }

  return { isHoliday: false };
}

export function getUpcomingHolidays(fromDate: string, count: number = 5): CourtHoliday[] {
  return courtHolidays
    .filter((h) => h.date >= fromDate)
    .slice(0, count);
}

export function getHolidaysSummary(): string {
  const today = new Date().toISOString().split("T")[0];
  const upcoming = getUpcomingHolidays(today, 10);
  if (upcoming.length === 0) return "No upcoming holidays found in calendar.";
  return upcoming
    .map((h) => `- ${h.date} (${h.day}): ${h.occasion} [${h.courts}]`)
    .join("\n");
}
