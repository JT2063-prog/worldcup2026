// All times stored as AEST (UTC+10). ET + 15 hours = AEST (no DST currently applies)
// Scores: null = not yet played, number = final/current score

export const CONFEDERATIONS = {
  UEFA: { name: 'UEFA', color: '#003DA5', logo: '🔵' },
  CONMEBOL: { name: 'CONMEBOL', color: '#009B3A', logo: '🟢' },
  CAF: { name: 'CAF', color: '#009B3A', logo: '⭐' },
  AFC: { name: 'AFC', color: '#005BAA', logo: '🔵' },
  CONCACAF: { name: 'CONCACAF', color: '#00529B', logo: '🌎' },
  OFC: { name: 'OFC', color: '#0067B1', logo: '🌊' },
};

export const TEAMS = {
  // Group A
  MEX: { name: 'Mexico', flag: '🇲🇽', confederation: 'CONCACAF', code: 'MEX' },
  RSA: { name: 'South Africa', flag: '🇿🇦', confederation: 'CAF', code: 'RSA' },
  KOR: { name: 'South Korea', flag: '🇰🇷', confederation: 'AFC', code: 'KOR' },
  CZE: { name: 'Czechia', flag: '🇨🇿', confederation: 'UEFA', code: 'CZE' },
  // Group B
  CAN: { name: 'Canada', flag: '🇨🇦', confederation: 'CONCACAF', code: 'CAN' },
  BIH: { name: 'Bosnia & Herz.', flag: '🇧🇦', confederation: 'UEFA', code: 'BIH' },
  QAT: { name: 'Qatar', flag: '🇶🇦', confederation: 'AFC', code: 'QAT' },
  SUI: { name: 'Switzerland', flag: '🇨🇭', confederation: 'UEFA', code: 'SUI' },
  // Group C
  BRA: { name: 'Brazil', flag: '🇧🇷', confederation: 'CONMEBOL', code: 'BRA' },
  MAR: { name: 'Morocco', flag: '🇲🇦', confederation: 'CAF', code: 'MAR' },
  HAI: { name: 'Haiti', flag: '🇭🇹', confederation: 'CONCACAF', code: 'HAI' },
  SCO: { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA', code: 'SCO' },
  // Group D
  USA: { name: 'USA', flag: '🇺🇸', confederation: 'CONCACAF', code: 'USA' },
  PAR: { name: 'Paraguay', flag: '🇵🇾', confederation: 'CONMEBOL', code: 'PAR' },
  AUS: { name: 'Australia', flag: '🇦🇺', confederation: 'AFC', code: 'AUS' },
  TUR: { name: 'Türkiye', flag: '🇹🇷', confederation: 'UEFA', code: 'TUR' },
  // Group E
  GER: { name: 'Germany', flag: '🇩🇪', confederation: 'UEFA', code: 'GER' },
  CUW: { name: 'Curaçao', flag: '🇨🇼', confederation: 'CONCACAF', code: 'CUW' },
  CIV: { name: "Côte d'Ivoire", flag: '🇨🇮', confederation: 'CAF', code: 'CIV' },
  ECU: { name: 'Ecuador', flag: '🇪🇨', confederation: 'CONMEBOL', code: 'ECU' },
  // Group F
  NED: { name: 'Netherlands', flag: '🇳🇱', confederation: 'UEFA', code: 'NED' },
  JPN: { name: 'Japan', flag: '🇯🇵', confederation: 'AFC', code: 'JPN' },
  SWE: { name: 'Sweden', flag: '🇸🇪', confederation: 'UEFA', code: 'SWE' },
  TUN: { name: 'Tunisia', flag: '🇹🇳', confederation: 'CAF', code: 'TUN' },
  // Group G
  BEL: { name: 'Belgium', flag: '🇧🇪', confederation: 'UEFA', code: 'BEL' },
  EGY: { name: 'Egypt', flag: '🇪🇬', confederation: 'CAF', code: 'EGY' },
  IRN: { name: 'Iran', flag: '🇮🇷', confederation: 'AFC', code: 'IRN' },
  NZL: { name: 'New Zealand', flag: '🇳🇿', confederation: 'OFC', code: 'NZL' },
  // Group H
  ESP: { name: 'Spain', flag: '🇪🇸', confederation: 'UEFA', code: 'ESP' },
  CPV: { name: 'Cape Verde', flag: '🇨🇻', confederation: 'CAF', code: 'CPV' },
  KSA: { name: 'Saudi Arabia', flag: '🇸🇦', confederation: 'AFC', code: 'KSA' },
  URU: { name: 'Uruguay', flag: '🇺🇾', confederation: 'CONMEBOL', code: 'URU' },
  // Group I
  FRA: { name: 'France', flag: '🇫🇷', confederation: 'UEFA', code: 'FRA' },
  SEN: { name: 'Senegal', flag: '🇸🇳', confederation: 'CAF', code: 'SEN' },
  IRQ: { name: 'Iraq', flag: '🇮🇶', confederation: 'AFC', code: 'IRQ' },
  NOR: { name: 'Norway', flag: '🇳🇴', confederation: 'UEFA', code: 'NOR' },
  // Group J
  ARG: { name: 'Argentina', flag: '🇦🇷', confederation: 'CONMEBOL', code: 'ARG' },
  ALG: { name: 'Algeria', flag: '🇩🇿', confederation: 'CAF', code: 'ALG' },
  AUT: { name: 'Austria', flag: '🇦🇹', confederation: 'UEFA', code: 'AUT' },
  JOR: { name: 'Jordan', flag: '🇯🇴', confederation: 'AFC', code: 'JOR' },
  // Group K
  POR: { name: 'Portugal', flag: '🇵🇹', confederation: 'UEFA', code: 'POR' },
  COL: { name: 'Colombia', flag: '🇨🇴', confederation: 'CONMEBOL', code: 'COL' },
  UZB: { name: 'Uzbekistan', flag: '🇺🇿', confederation: 'AFC', code: 'UZB' },
  COD: { name: 'DR Congo', flag: '🇨🇩', confederation: 'CAF', code: 'COD' },
  // Group L
  ENG: { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA', code: 'ENG' },
  CRO: { name: 'Croatia', flag: '🇭🇷', confederation: 'UEFA', code: 'CRO' },
  PAN: { name: 'Panama', flag: '🇵🇦', confederation: 'CONCACAF', code: 'PAN' },
  GHA: { name: 'Ghana', flag: '🇬🇭', confederation: 'CAF', code: 'GHA' },
};

// Confederation badge SVG paths (simplified emblems as colored badges)
export const CONF_COLORS = {
  UEFA: '#003DA5',
  CONMEBOL: '#009B3A',
  CAF: '#007A3D',
  AFC: '#005BAA',
  CONCACAF: '#00529B',
  OFC: '#0067B1',
};

// Parse match times as Eastern Time (America/New_York) so DST is handled automatically.
// In June 2026, the US is on EDT = UTC-4. AEST = UTC+10. Difference = 14 hours.
// We store a plain UTC Date object; all display uses timeZone: 'Australia/Sydney'.
const toAEST = (etDate, etTime) => {
  // Build an ISO string with the ET offset for June (-04:00 = EDT)
  // Using Intl to safely parse: treat the date/time as New York local time
  const isoET = `${etDate}T${etTime}:00`;
  // Parse as if it's UTC, then adjust for EDT (UTC-4) to get true UTC
  const [year, month, day] = etDate.split('-').map(Number);
  const [hour, min] = etTime.split(':').map(Number);
  // America/New_York in June = UTC-4 (EDT)
  const utcMs = Date.UTC(year, month - 1, day, hour + 4, min);
  return new Date(utcMs);
};

// G() helper: goal entry { player, team, minute, og (own goal), pen (penalty) }
const G = (player, team, minute, og = false, pen = false) => ({ player, team, minute, og, pen });

const M = (id, group, home, away, etDate, etTime, homeScore, awayScore, homeRed, awayRed, venue, matchday, goals = []) => ({
  id, group, home, away,
  kickoffAEST: toAEST(etDate, etTime),
  homeScore, awayScore, homeRed: homeRed || 0, awayRed: awayRed || 0,
  venue, matchday, goals,
  status: homeScore !== null ? 'FT' : (Date.now() > toAEST(etDate, etTime).getTime() && Date.now() < toAEST(etDate, etTime).getTime() + 115*60000 ? 'LIVE' : 'NS'),
});

export const MATCHES = [
  // ===== GROUP A =====
  M('A1', 'A', 'MEX', 'RSA', '2026-06-11', '15:00', 2, 0, 0, 0, 'Estadio Azteca, Mexico City', 1, [
    G('Julián Quiñones', 'MEX', 9), G('Raúl Jiménez', 'MEX', 67),
  ]),
  M('A2', 'A', 'KOR', 'CZE', '2026-06-11', '22:00', 2, 1, 0, 0, 'Estadio Akron, Guadalajara', 1, [
    G('Ladislav Krejčí', 'CZE', 58), G('Hwang In-beom', 'KOR', 71), G('Oh Hyeon-gyu', 'KOR', 84),
  ]),
  M('A3', 'A', 'CZE', 'RSA', '2026-06-18', '12:00', null, null, 0, 0, 'Mercedes-Benz Stadium, Atlanta', 2),
  M('A4', 'A', 'MEX', 'KOR', '2026-06-18', '21:00', null, null, 0, 0, 'Estadio Akron, Guadalajara', 2),
  M('A5', 'A', 'CZE', 'MEX', '2026-06-24', '21:00', null, null, 0, 0, 'TBD', 3),
  M('A6', 'A', 'RSA', 'KOR', '2026-06-24', '21:00', null, null, 0, 0, 'TBD', 3),

  // ===== GROUP B =====
  M('B1', 'B', 'CAN', 'BIH', '2026-06-12', '15:00', 1, 1, 0, 0, 'BMO Field, Toronto', 1, [
    G('Jovo Lukić', 'BIH', 23), G('Cyle Larin', 'CAN', 67),
  ]),
  M('B2', 'B', 'QAT', 'SUI', '2026-06-13', '15:00', 1, 1, 0, 0, "Levi's Stadium, Santa Clara", 1, [
    G('Breel Embolo', 'SUI', 17, false, true), G('Boualem Khoukhi', 'QAT', 90, true),
  ]),
  M('B3', 'B', 'SUI', 'BIH', '2026-06-18', '15:00', null, null, 0, 0, 'SoFi Stadium, Inglewood', 2),
  M('B4', 'B', 'CAN', 'QAT', '2026-06-18', '18:00', null, null, 0, 0, 'BC Place, Vancouver', 2),
  M('B5', 'B', 'BIH', 'QAT', '2026-06-24', '17:00', null, null, 0, 0, 'TBD', 3),
  M('B6', 'B', 'SUI', 'CAN', '2026-06-24', '17:00', null, null, 0, 0, 'TBD', 3),

  // ===== GROUP C =====
  M('C1', 'C', 'BRA', 'MAR', '2026-06-13', '18:00', 1, 1, 0, 0, 'MetLife Stadium, East Rutherford', 1, [
    G('Ismael Saibari', 'MAR', 21), G('Vinícius Júnior', 'BRA', 32),
  ]),
  M('C2', 'C', 'HAI', 'SCO', '2026-06-13', '21:00', 0, 1, 0, 0, 'Gillette Stadium, Foxborough', 1, [
    G('John McGinn', 'SCO', 28),
  ]),
  M('C3', 'C', 'SCO', 'MAR', '2026-06-19', '18:00', null, null, 0, 0, 'Gillette Stadium, Foxborough', 2),
  M('C4', 'C', 'BRA', 'HAI', '2026-06-19', '20:30', null, null, 0, 0, 'Lincoln Financial Field, Philadelphia', 2),
  M('C5', 'C', 'MAR', 'HAI', '2026-06-24', '18:00', null, null, 0, 0, 'Mercedes-Benz Stadium, Atlanta', 3),
  M('C6', 'C', 'SCO', 'BRA', '2026-06-24', '18:00', null, null, 0, 0, 'TBD', 3),

  // ===== GROUP D =====
  M('D1', 'D', 'USA', 'PAR', '2026-06-12', '21:00', 4, 1, 0, 0, 'SoFi Stadium, Inglewood', 1, [
    G('Damián Bobadilla', 'PAR', 7, true), G('Folarin Balogun', 'USA', 31), G('Folarin Balogun', 'USA', 45),
    G('Mauricio', 'PAR', 73), G('Giovanni Reyna', 'USA', 90),
  ]),
  M('D2', 'D', 'AUS', 'TUR', '2026-06-14', '00:00', 2, 0, 0, 0, 'BC Place, Vancouver', 1, [
    G('Nestory Irankunda', 'AUS', 27), G('Connor Metcalfe', 'AUS', 75),
  ]),
  M('D3', 'D', 'USA', 'AUS', '2026-06-19', '15:00', null, null, 0, 0, 'Lumen Field, Seattle', 2),
  M('D4', 'D', 'TUR', 'PAR', '2026-06-19', '23:00', null, null, 0, 0, "Levi's Stadium, Santa Clara", 2),
  M('D5', 'D', 'TUR', 'USA', '2026-06-25', '22:00', null, null, 0, 0, 'TBD', 3),
  M('D6', 'D', 'PAR', 'AUS', '2026-06-25', '22:00', null, null, 0, 0, 'TBD', 3),

  // ===== GROUP E =====
  M('E1', 'E', 'GER', 'CUW', '2026-06-14', '13:00', 7, 1, 0, 0, 'NRG Stadium, Houston', 1, [
    G('Felix Nmecha', 'GER', 6), G('Livano Comenencia', 'CUW', 21),
    G('Nico Schlotterbeck', 'GER', 38), G('Kai Havertz', 'GER', 43),
    G('Jamal Musiala', 'GER', 47), G('Nathaniel Brown', 'GER', 68),
    G('Deniz Undav', 'GER', 78), G('Kai Havertz', 'GER', 88),
  ]),
  M('E2', 'E', 'CIV', 'ECU', '2026-06-14', '19:00', null, null, 0, 0, 'Lincoln Financial Field, Philadelphia', 1),
  M('E3', 'E', 'GER', 'CIV', '2026-06-20', '16:00', null, null, 0, 0, 'BMO Field, Toronto', 2),
  M('E4', 'E', 'ECU', 'CUW', '2026-06-20', '20:00', null, null, 0, 0, 'Arrowhead Stadium, Kansas City', 2),
  M('E5', 'E', 'ECU', 'GER', '2026-06-25', '16:00', null, null, 0, 0, 'TBD', 3),
  M('E6', 'E', 'CUW', 'CIV', '2026-06-25', '16:00', null, null, 0, 0, 'TBD', 3),

  // ===== GROUP F =====
  M('F1', 'F', 'NED', 'JPN', '2026-06-14', '16:00', 2, 2, 0, 0, 'AT&T Stadium, Arlington', 1, [
    G('Virgil van Dijk', 'NED', 51), G('Keito Nakamura', 'JPN', 58),
    G('Crysencio Summerville', 'NED', 64), G('Daichi Kamada', 'JPN', 88),
  ]),
  M('F2', 'F', 'SWE', 'TUN', '2026-06-14', '22:00', null, null, 0, 0, 'Estadio BBVA, Monterrey', 1),
  M('F3', 'F', 'NED', 'SWE', '2026-06-20', '13:00', null, null, 0, 0, 'NRG Stadium, Houston', 2),
  M('F4', 'F', 'TUN', 'JPN', '2026-06-21', '00:00', null, null, 0, 0, 'Estadio BBVA, Monterrey', 2),
  M('F5', 'F', 'JPN', 'SWE', '2026-06-25', '19:00', null, null, 0, 0, 'TBD', 3),
  M('F6', 'F', 'TUN', 'NED', '2026-06-25', '19:00', null, null, 0, 0, 'TBD', 3),

  // ===== GROUP G =====
  M('G1', 'G', 'BEL', 'EGY', '2026-06-15', '15:00', null, null, 0, 0, 'Lumen Field, Seattle', 1),
  M('G2', 'G', 'IRN', 'NZL', '2026-06-15', '21:00', null, null, 0, 0, 'SoFi Stadium, Inglewood', 1),
  M('G3', 'G', 'BEL', 'IRN', '2026-06-21', '15:00', null, null, 0, 0, 'SoFi Stadium, Inglewood', 2),
  M('G4', 'G', 'NZL', 'EGY', '2026-06-21', '21:00', null, null, 0, 0, 'BC Place, Vancouver', 2),
  M('G5', 'G', 'EGY', 'IRN', '2026-06-26', '23:00', null, null, 0, 0, 'TBD', 3),
  M('G6', 'G', 'NZL', 'BEL', '2026-06-26', '23:00', null, null, 0, 0, 'TBD', 3),

  // ===== GROUP H =====
  M('H1', 'H', 'ESP', 'CPV', '2026-06-15', '12:00', null, null, 0, 0, 'Mercedes-Benz Stadium, Atlanta', 1),
  M('H2', 'H', 'KSA', 'URU', '2026-06-15', '18:00', null, null, 0, 0, 'Hard Rock Stadium, Miami Gardens', 1),
  M('H3', 'H', 'ESP', 'KSA', '2026-06-21', '12:00', null, null, 0, 0, 'Mercedes-Benz Stadium, Atlanta', 2),
  M('H4', 'H', 'URU', 'CPV', '2026-06-21', '18:00', null, null, 0, 0, 'Hard Rock Stadium, Miami Gardens', 2),
  M('H5', 'H', 'CPV', 'KSA', '2026-06-26', '21:00', null, null, 0, 0, 'TBD', 3),
  M('H6', 'H', 'URU', 'ESP', '2026-06-26', '21:00', null, null, 0, 0, 'TBD', 3),

  // ===== GROUP I =====
  M('I1', 'I', 'FRA', 'SEN', '2026-06-16', '15:00', null, null, 0, 0, 'MetLife Stadium, East Rutherford', 1),
  M('I2', 'I', 'IRQ', 'NOR', '2026-06-16', '18:00', null, null, 0, 0, 'Gillette Stadium, Foxborough', 1),
  M('I3', 'I', 'FRA', 'IRQ', '2026-06-22', '17:00', null, null, 0, 0, 'Lincoln Financial Field, Philadelphia', 2),
  M('I4', 'I', 'NOR', 'SEN', '2026-06-22', '20:00', null, null, 0, 0, 'MetLife Stadium, East Rutherford', 2),
  M('I5', 'I', 'SEN', 'IRQ', '2026-06-27', '16:00', null, null, 0, 0, 'TBD', 3),
  M('I6', 'I', 'NOR', 'FRA', '2026-06-27', '16:00', null, null, 0, 0, 'TBD', 3),

  // ===== GROUP J =====
  M('J1', 'J', 'ARG', 'ALG', '2026-06-16', '21:00', null, null, 0, 0, 'Arrowhead Stadium, Kansas City', 1),
  M('J2', 'J', 'AUT', 'JOR', '2026-06-17', '00:00', null, null, 0, 0, "Levi's Stadium, Santa Clara", 1),
  M('J3', 'J', 'ARG', 'AUT', '2026-06-22', '13:00', null, null, 0, 0, 'AT&T Stadium, Arlington', 2),
  M('J4', 'J', 'JOR', 'ALG', '2026-06-22', '23:00', null, null, 0, 0, "Levi's Stadium, Santa Clara", 2),
  M('J5', 'J', 'ALG', 'AUT', '2026-06-27', '19:00', null, null, 0, 0, 'TBD', 3),
  M('J6', 'J', 'JOR', 'ARG', '2026-06-27', '19:00', null, null, 0, 0, 'TBD', 3),

  // ===== GROUP K =====
  M('K1', 'K', 'POR', 'COD', '2026-06-17', '13:00', null, null, 0, 0, 'NRG Stadium, Houston', 1),
  M('K2', 'K', 'UZB', 'COL', '2026-06-17', '22:00', null, null, 0, 0, 'Estadio Azteca, Mexico City', 1),
  M('K3', 'K', 'POR', 'UZB', '2026-06-23', '13:00', null, null, 0, 0, 'TBD', 2),
  M('K4', 'K', 'COL', 'COD', '2026-06-23', '16:00', null, null, 0, 0, 'TBD', 2),
  M('K5', 'K', 'COD', 'UZB', '2026-06-27', '19:00', null, null, 0, 0, 'TBD', 3),
  M('K6', 'K', 'COL', 'POR', '2026-06-27', '19:00', null, null, 0, 0, 'TBD', 3),

  // ===== GROUP L =====
  M('L1', 'L', 'ENG', 'CRO', '2026-06-17', '16:00', null, null, 0, 0, 'AT&T Stadium, Arlington', 1),
  M('L2', 'L', 'GHA', 'PAN', '2026-06-17', '19:00', null, null, 0, 0, 'BMO Field, Toronto', 1),
  M('L3', 'L', 'ENG', 'GHA', '2026-06-23', '16:00', null, null, 0, 0, 'TBD', 2),
  M('L4', 'L', 'PAN', 'CRO', '2026-06-23', '19:00', null, null, 0, 0, 'TBD', 2),
  M('L5', 'L', 'CRO', 'GHA', '2026-06-27', '19:00', null, null, 0, 0, 'TBD', 3),
  M('L6', 'L', 'PAN', 'ENG', '2026-06-27', '19:00', null, null, 0, 0, 'TBD', 3),
];

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const GROUP_TEAMS = {
  A: ['MEX', 'RSA', 'KOR', 'CZE'],
  B: ['CAN', 'BIH', 'QAT', 'SUI'],
  C: ['BRA', 'MAR', 'HAI', 'SCO'],
  D: ['USA', 'PAR', 'AUS', 'TUR'],
  E: ['GER', 'CUW', 'CIV', 'ECU'],
  F: ['NED', 'JPN', 'SWE', 'TUN'],
  G: ['BEL', 'EGY', 'IRN', 'NZL'],
  H: ['ESP', 'CPV', 'KSA', 'URU'],
  I: ['FRA', 'SEN', 'IRQ', 'NOR'],
  J: ['ARG', 'ALG', 'AUT', 'JOR'],
  K: ['POR', 'COL', 'UZB', 'COD'],
  L: ['ENG', 'CRO', 'PAN', 'GHA'],
};

export const GROUP_COLORS = {
  A: '#e74c3c', B: '#e67e22', C: '#f1c40f',
  D: '#2ecc71', E: '#1abc9c', F: '#3498db',
  G: '#9b59b6', H: '#e91e63', I: '#ff5722',
  J: '#00bcd4', K: '#8bc34a', L: '#ff9800',
};

// Calculate standings from match results (+ optional live data)
export function calcStandings(group, liveData = {}) {
  const teams = GROUP_TEAMS[group];
  const matches = MATCHES.filter(m => {
    const key = `${m.home}_${m.away}`;
    const live = liveData[key];
    const score = live?.homeScore ?? m.homeScore;
    return m.group === group && score !== null && score !== undefined;
  }).map(m => {
    const key = `${m.home}_${m.away}`;
    const live = liveData[key];
    if (!live) return m;
    return { ...m, homeScore: live.homeScore ?? m.homeScore, awayScore: live.awayScore ?? m.awayScore };
  });

  const table = {};
  teams.forEach(t => { table[t] = { team: t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }; });

  matches.forEach(m => {
    const h = table[m.home], a = table[m.away];
    if (!h || !a) return;
    h.p++; a.p++;
    h.gf += m.homeScore; h.ga += m.awayScore;
    a.gf += m.awayScore; a.ga += m.homeScore;
    if (m.homeScore > m.awayScore) { h.w++; h.pts += 3; a.l++; }
    else if (m.homeScore < m.awayScore) { a.w++; a.pts += 3; h.l++; }
    else { h.d++; a.d++; h.pts++; a.pts++; }
  });

  return Object.values(table).sort((a, b) =>
    b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf
  );
}
