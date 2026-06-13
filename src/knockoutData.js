// Knockout bracket data
// Populated as results come in from June 28 onwards

export const KNOCKOUT_ROUNDS = [
  { id: 'r32', name: 'Round of 32', matches: 16 },
  { id: 'r16', name: 'Round of 16', matches: 8 },
  { id: 'qf',  name: 'Quarter-finals', matches: 4 },
  { id: 'sf',  name: 'Semi-finals', matches: 2 },
  { id: 'f',   name: 'Final', matches: 1 },
];

// Knockout matches — updated as results come in
// home/away: team code or 'TBD'
// homeScore/awayScore: null = not played
export const KNOCKOUT_MATCHES = [
  // ── ROUND OF 32 ── June 28 – July 3
  // Slot labels follow FIFA bracket: 1W = Group 1 winner, 3X = best 3rd from groups X
  { id: 'R32-1',  round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '1A', awayLabel: '2C', date: '2026-06-28', timeET: '12:00', homeScore: null, awayScore: null },
  { id: 'R32-2',  round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '1C', awayLabel: '2A', date: '2026-06-28', timeET: '15:00', homeScore: null, awayScore: null },
  { id: 'R32-3',  round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '1E', awayLabel: '2G', date: '2026-06-28', timeET: '18:00', homeScore: null, awayScore: null },
  { id: 'R32-4',  round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '1G', awayLabel: '2E', date: '2026-06-28', timeET: '21:00', homeScore: null, awayScore: null },
  { id: 'R32-5',  round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '1I', awayLabel: '2K', date: '2026-06-29', timeET: '12:00', homeScore: null, awayScore: null },
  { id: 'R32-6',  round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '1K', awayLabel: '2I', date: '2026-06-29', timeET: '15:00', homeScore: null, awayScore: null },
  { id: 'R32-7',  round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '3rd', awayLabel: '3rd', date: '2026-06-29', timeET: '18:00', homeScore: null, awayScore: null },
  { id: 'R32-8',  round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '3rd', awayLabel: '3rd', date: '2026-06-29', timeET: '21:00', homeScore: null, awayScore: null },
  { id: 'R32-9',  round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '1B', awayLabel: '2D', date: '2026-06-30', timeET: '12:00', homeScore: null, awayScore: null },
  { id: 'R32-10', round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '1D', awayLabel: '2B', date: '2026-06-30', timeET: '15:00', homeScore: null, awayScore: null },
  { id: 'R32-11', round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '1F', awayLabel: '2H', date: '2026-06-30', timeET: '18:00', homeScore: null, awayScore: null },
  { id: 'R32-12', round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '1H', awayLabel: '2F', date: '2026-06-30', timeET: '21:00', homeScore: null, awayScore: null },
  { id: 'R32-13', round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '1J', awayLabel: '2L', date: '2026-07-01', timeET: '12:00', homeScore: null, awayScore: null },
  { id: 'R32-14', round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '1L', awayLabel: '2J', date: '2026-07-01', timeET: '15:00', homeScore: null, awayScore: null },
  { id: 'R32-15', round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '3rd', awayLabel: '3rd', date: '2026-07-01', timeET: '18:00', homeScore: null, awayScore: null },
  { id: 'R32-16', round: 'r32', home: 'TBD', away: 'TBD', homeLabel: '3rd', awayLabel: '3rd', date: '2026-07-01', timeET: '21:00', homeScore: null, awayScore: null },

  // ── ROUND OF 16 ── July 4–7
  { id: 'R16-1', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-1', awayLabel: 'W R32-2', date: '2026-07-04', timeET: '12:00', homeScore: null, awayScore: null },
  { id: 'R16-2', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-3', awayLabel: 'W R32-4', date: '2026-07-04', timeET: '18:00', homeScore: null, awayScore: null },
  { id: 'R16-3', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-5', awayLabel: 'W R32-6', date: '2026-07-05', timeET: '12:00', homeScore: null, awayScore: null },
  { id: 'R16-4', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-7', awayLabel: 'W R32-8', date: '2026-07-05', timeET: '18:00', homeScore: null, awayScore: null },
  { id: 'R16-5', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-9', awayLabel: 'W R32-10', date: '2026-07-06', timeET: '12:00', homeScore: null, awayScore: null },
  { id: 'R16-6', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-11', awayLabel: 'W R32-12', date: '2026-07-06', timeET: '18:00', homeScore: null, awayScore: null },
  { id: 'R16-7', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-13', awayLabel: 'W R32-14', date: '2026-07-07', timeET: '12:00', homeScore: null, awayScore: null },
  { id: 'R16-8', round: 'r16', home: 'TBD', away: 'TBD', homeLabel: 'W R32-15', awayLabel: 'W R32-16', date: '2026-07-07', timeET: '18:00', homeScore: null, awayScore: null },

  // ── QUARTER-FINALS ── July 9–11
  { id: 'QF-1', round: 'qf', home: 'TBD', away: 'TBD', homeLabel: 'W R16-1', awayLabel: 'W R16-2', date: '2026-07-09', timeET: '15:00', homeScore: null, awayScore: null },
  { id: 'QF-2', round: 'qf', home: 'TBD', away: 'TBD', homeLabel: 'W R16-3', awayLabel: 'W R16-4', date: '2026-07-10', timeET: '15:00', homeScore: null, awayScore: null },
  { id: 'QF-3', round: 'qf', home: 'TBD', away: 'TBD', homeLabel: 'W R16-5', awayLabel: 'W R16-6', date: '2026-07-10', timeET: '19:00', homeScore: null, awayScore: null },
  { id: 'QF-4', round: 'qf', home: 'TBD', away: 'TBD', homeLabel: 'W R16-7', awayLabel: 'W R16-8', date: '2026-07-11', timeET: '15:00', homeScore: null, awayScore: null },

  // ── SEMI-FINALS ── July 14–15
  { id: 'SF-1', round: 'sf', home: 'TBD', away: 'TBD', homeLabel: 'W QF-1', awayLabel: 'W QF-2', date: '2026-07-14', timeET: '15:00', homeScore: null, awayScore: null },
  { id: 'SF-2', round: 'sf', home: 'TBD', away: 'TBD', homeLabel: 'W QF-3', awayLabel: 'W QF-4', date: '2026-07-15', timeET: '15:00', homeScore: null, awayScore: null },

  // ── THIRD PLACE ── July 18
  { id: '3P-1', round: '3p', home: 'TBD', away: 'TBD', homeLabel: 'L SF-1', awayLabel: 'L SF-2', date: '2026-07-18', timeET: '15:00', homeScore: null, awayScore: null },

  // ── FINAL ── July 19
  { id: 'F-1', round: 'f', home: 'TBD', away: 'TBD', homeLabel: 'W SF-1', awayLabel: 'W SF-2', date: '2026-07-19', timeET: '15:00', homeScore: null, awayScore: null },
];
