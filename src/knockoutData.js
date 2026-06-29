// Round of 32 - fully confirmed June 27, 2026 after group stage completion.
// Times stored as UTC. Venue/date verified from Yahoo Sports, NBC Sports, Sky Sports, FanDuel.

function utcFromZone(dateStr, timeStr, dstOffsetHours) {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  return new Date(Date.UTC(y, mo - 1, d, h - dstOffsetHours, mi));
}
const ET = (d, t) => utcFromZone(d, t, -4);
const CT = (d, t) => utcFromZone(d, t, -5);
const MT = (d, t) => utcFromZone(d, t, -6);
const PT = (d, t) => utcFromZone(d, t, -7);

function G(player, team, minute, og, pen) { return { player, team, minute, og: og||false, pen: pen||false }; }

export const KNOCKOUT_ROUNDS = [
  { id: 'r32', name: 'Round of 32', matches: 16 },
  { id: 'r16', name: 'Round of 16', matches: 8 },
  { id: 'qf',  name: 'Quarter-finals', matches: 4 },
  { id: 'sf',  name: 'Semi-finals', matches: 2 },
  { id: 'f',   name: 'Final', matches: 1 },
];

// home/away are confirmed team codes; null homeScore/awayScore = not yet played
export const KNOCKOUT_MATCHES = [
  // ── ROUND OF 32 ── June 28 – July 3, 2026 (all confirmed)
  { id: 'R32-1', round: 'r32', home: 'RSA', away: 'CAN', kickoffUTC: PT('2026-06-28', '15:00'), venue: 'SoFi Stadium, Inglewood', homeScore: 0, awayScore: 1, goals: [G('Stephen Eustáquio', 'CAN', 92)] },
  { id: 'R32-2', round: 'r32', home: 'BRA', away: 'JPN', kickoffUTC: CT('2026-06-29', '13:00'), venue: 'NRG Stadium, Houston', homeScore: null, awayScore: null },
  { id: 'R32-3', round: 'r32', home: 'GER', away: 'PAR', kickoffUTC: ET('2026-06-29', '16:30'), venue: 'Gillette Stadium, Foxborough', homeScore: null, awayScore: null },
  { id: 'R32-4', round: 'r32', home: 'NED', away: 'MAR', kickoffUTC: CT('2026-06-29', '21:00'), venue: 'Estadio BBVA, Monterrey', homeScore: null, awayScore: null },
  { id: 'R32-5', round: 'r32', home: 'CIV', away: 'NOR', kickoffUTC: CT('2026-06-30', '13:00'), venue: 'AT&T Stadium, Arlington', homeScore: null, awayScore: null },
  { id: 'R32-6', round: 'r32', home: 'FRA', away: 'SWE', kickoffUTC: ET('2026-06-30', '17:00'), venue: 'MetLife Stadium, East Rutherford', homeScore: null, awayScore: null },
  { id: 'R32-7', round: 'r32', home: 'MEX', away: 'ECU', kickoffUTC: CT('2026-06-30', '21:00'), venue: 'Estadio Azteca, Mexico City', homeScore: null, awayScore: null },
  { id: 'R32-8', round: 'r32', home: 'ENG', away: 'COD', kickoffUTC: ET('2026-07-01', '12:00'), venue: 'Mercedes-Benz Stadium, Atlanta', homeScore: null, awayScore: null },
  { id: 'R32-9', round: 'r32', home: 'BEL', away: 'SEN', kickoffUTC: PT('2026-07-01', '13:00'), venue: 'Lumen Field, Seattle', homeScore: null, awayScore: null },
  { id: 'R32-10', round: 'r32', home: 'USA', away: 'BIH', kickoffUTC: PT('2026-07-01', '17:00'), venue: "Levi's Stadium, Santa Clara", homeScore: null, awayScore: null },
  { id: 'R32-11', round: 'r32', home: 'ESP', away: 'AUT', kickoffUTC: PT('2026-07-02', '12:00'), venue: 'SoFi Stadium, Inglewood', homeScore: null, awayScore: null },
  { id: 'R32-12', round: 'r32', home: 'POR', away: 'CRO', kickoffUTC: ET('2026-07-02', '19:00'), venue: 'BMO Field, Toronto', homeScore: null, awayScore: null },
  { id: 'R32-13', round: 'r32', home: 'SUI', away: 'ALG', kickoffUTC: PT('2026-07-02', '20:00'), venue: 'BC Place, Vancouver', homeScore: null, awayScore: null },
  { id: 'R32-14', round: 'r32', home: 'EGY', away: 'AUS', kickoffUTC: CT('2026-07-03', '13:00'), venue: 'AT&T Stadium, Arlington', homeScore: null, awayScore: null },
  { id: 'R32-15', round: 'r32', home: 'ARG', away: 'CPV', kickoffUTC: ET('2026-07-03', '18:00'), venue: 'Hard Rock Stadium, Miami Gardens', homeScore: null, awayScore: null },
  { id: 'R32-16', round: 'r32', home: 'COL', away: 'GHA', kickoffUTC: CT('2026-07-03', '21:30'), venue: 'Arrowhead Stadium, Kansas City', homeScore: null, awayScore: null },

  // ── ROUND OF 16 ── July 4–7 (TBD until R32 results known)
  { id: 'R16-1', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-3', awayLabel: 'W R32-6', kickoffUTC: ET('2026-07-04', '17:00'), venue: 'Lincoln Financial Field, Philadelphia', homeScore: null, awayScore: null },
  { id: 'R16-2', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-1', awayLabel: 'W R32-4', kickoffUTC: CT('2026-07-04', '13:00'), venue: 'NRG Stadium, Houston', homeScore: null, awayScore: null },
  { id: 'R16-3', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-5', awayLabel: 'W R32-2', kickoffUTC: ET('2026-07-05', '16:00'), venue: 'MetLife Stadium, East Rutherford', homeScore: null, awayScore: null },
  { id: 'R16-4', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-7', awayLabel: 'W R32-8', kickoffUTC: CT('2026-07-05', '20:00'), venue: 'Estadio Azteca, Mexico City', homeScore: null, awayScore: null },
  { id: 'R16-5', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-12', awayLabel: 'W R32-11', kickoffUTC: CT('2026-07-06', '15:00'), venue: 'AT&T Stadium, Arlington', homeScore: null, awayScore: null },
  { id: 'R16-6', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-10', awayLabel: 'W R32-9', kickoffUTC: PT('2026-07-06', '17:00'), venue: 'Lumen Field, Seattle', homeScore: null, awayScore: null },
  { id: 'R16-7', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-15', awayLabel: 'W R32-14', kickoffUTC: ET('2026-07-07', '12:00'), venue: 'Mercedes-Benz Stadium, Atlanta', homeScore: null, awayScore: null },
  { id: 'R16-8', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-13', awayLabel: 'W R32-16', kickoffUTC: PT('2026-07-07', '13:00'), venue: 'BC Place, Vancouver', homeScore: null, awayScore: null },

  // ── QUARTER-FINALS ── July 9–11
  { id: 'QF-1', round: 'qf', home: 'TBD', away: 'TBD', homeLabel: 'W R16-1', awayLabel: 'W R16-2', kickoffUTC: ET('2026-07-09', '16:00'), venue: 'Gillette Stadium, Foxborough', homeScore: null, awayScore: null },
  { id: 'QF-2', round: 'qf', home: 'TBD', away: 'TBD', homeLabel: 'W R16-5', awayLabel: 'W R16-6', kickoffUTC: PT('2026-07-10', '12:00'), venue: 'SoFi Stadium, Inglewood', homeScore: null, awayScore: null },
  { id: 'QF-3', round: 'qf', home: 'TBD', away: 'TBD', homeLabel: 'W R16-3', awayLabel: 'W R16-4', kickoffUTC: ET('2026-07-11', '17:00'), venue: 'Hard Rock Stadium, Miami Gardens', homeScore: null, awayScore: null },
  { id: 'QF-4', round: 'qf', home: 'TBD', away: 'TBD', homeLabel: 'W R16-7', awayLabel: 'W R16-8', kickoffUTC: CT('2026-07-11', '21:00'), venue: 'Arrowhead Stadium, Kansas City', homeScore: null, awayScore: null },

  // ── SEMI-FINALS ── July 14–15
  { id: 'SF-1', round: 'sf', home: 'TBD', away: 'TBD', homeLabel: 'W QF-1', awayLabel: 'W QF-2', kickoffUTC: CT('2026-07-14', '15:00'), venue: 'AT&T Stadium, Arlington', homeScore: null, awayScore: null },
  { id: 'SF-2', round: 'sf', home: 'TBD', away: 'TBD', homeLabel: 'W QF-3', awayLabel: 'W QF-4', kickoffUTC: ET('2026-07-15', '15:00'), venue: 'Mercedes-Benz Stadium, Atlanta', homeScore: null, awayScore: null },

  // ── THIRD PLACE ── July 18
  { id: '3P-1', round: '3p', home: 'TBD', away: 'TBD', homeLabel: 'L SF-1', awayLabel: 'L SF-2', kickoffUTC: ET('2026-07-18', '17:00'), venue: 'Hard Rock Stadium, Miami Gardens', homeScore: null, awayScore: null },

  // ── FINAL ── July 19
  { id: 'F-1', round: 'f', home: 'TBD', away: 'TBD', homeLabel: 'W SF-1', awayLabel: 'W SF-2', kickoffUTC: ET('2026-07-19', '15:00'), venue: 'MetLife Stadium, East Rutherford', homeScore: null, awayScore: null },
];
