/**
 * Determine the activity type from its description text.
 * @param {string} text
 * @returns {"hotel"|"restaurant"|"airport"|"attraction"}
 */
function inferType(text) {
  if (/\b(hotel|resort|check.?in|accommodation|lodge|hostel|inn|stay at|overnight)\b/i.test(text)) {
    return "hotel";
  }
  if (
    /\b(restaurant|café|cafe|lunch|dinner|breakfast|brunch|eatery|bistro|dine|dining|food court|hawker|cuisine|meal)\b/i.test(
      text
    )
  ) {
    return "restaurant";
  }
  if (/\b(airport|flight|depart|departure|arrive|arrival|terminal|board|check.?out|transfer)\b/i.test(text)) {
    return "airport";
  }
  return "attraction";
}

/**
 * Strip markdown bold/italic/code markers from a string.
 * @param {string} text
 * @returns {string}
 */
function stripMarkdown(text) {
  return text
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

/**
 * Parse an AI-generated trip plan (markdown text) into the itinerary array
 * format used by ItineraryBoard.
 *
 * Returns an array of day objects:
 *   [{ day: "Day 1", items: [{ id, name, description, duration, travelTime, type, location, rating, opens }] }]
 *
 * Returns null when no recognisable day sections were found.
 *
 * @param {string} text  Raw markdown text from the AI backend.
 * @returns {Array|null}
 */
export function parseItinerary(text) {
  if (!text || typeof text !== "string") return null;

  const days = [];
  const lines = text.split("\n");

  let currentDay = null;
  let currentItems = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Match lines that introduce a new day: "Day 1", "**Day 2**", "## Day 3", etc.
    const dayMatch = trimmed.match(/^(?:[#*_>\s]*)\b(Day\s+\d+)\b/i);
    if (dayMatch) {
      if (currentDay && currentItems.length > 0) {
        days.push({ day: currentDay, items: currentItems });
        currentItems = [];
      }
      // Normalise to "Day N" regardless of original casing or surrounding markdown
      const dayNumber = dayMatch[1].match(/\d+/)[0];
      currentDay = `Day ${dayNumber}`;
      continue;
    }

    if (!currentDay) continue;

    // Match bullet-point lines (-, *, •) that describe an activity.
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)/);
    if (!bulletMatch) continue;

    const raw = bulletMatch[1].trim();
    if (raw.length < 6) continue; // skip very short fragments

    // Strip optional leading time stamp: "09:00 - ...", "9:00 AM – ..."
    const timeMatch = raw.match(/^(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)\s*[-–:]\s*(.+)/i);
    const content = stripMarkdown(timeMatch ? timeMatch[2] : raw);

    if (content.length < 6) continue;

    const name = content.length > 72 ? content.slice(0, 69) + "…" : content;

    currentItems.push({
      id: crypto.randomUUID(),
      name,
      description: content,
      duration: "2h",
      travelTime: "15 min",
      type: inferType(content),
      location: null, // Coordinates are not provided by the AI text response
      rating: 4.5,
      opens: "09:00 – 18:00"
    });
  }

  // Flush the last day
  if (currentDay && currentItems.length > 0) {
    days.push({ day: currentDay, items: currentItems });
  }

  return days.length > 0 ? days : null;
}
