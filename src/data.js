// All match times stored as true UTC moments.
// Display layer converts to AEST or the viewer's local timezone on demand.
// US/Canada/Mexico are on DST (EDT=UTC-4, CDT=UTC-5, MDT=UTC-6, PDT=UTC-7) in June/July 2026.

export const TEAMS = {
  MEX: { name: 'Mexico', flag: '🇲🇽', confederation: 'CONCACAF' },
  RSA: { name: 'South Africa', flag: '🇿🇦', confederation: 'CAF' },
  KOR: { name: 'South Korea', flag: '🇰🇷', confederation: 'AFC' },
  CZE: { name: 'Czechia', flag: '🇨🇿', confederation: 'UEFA' },
  CAN: { name: 'Canada', flag: '🇨🇦', confederation: 'CONCACAF' },
  BIH: { name: 'Bosnia & Herz.', flag: '🇧🇦', confederation: 'UEFA' },
  QAT: { name: 'Qatar', flag: '🇶🇦', confederation: 'AFC' },
  SUI: { name: 'Switzerland', flag: '🇨🇭', confederation: 'UEFA' },
  BRA: { name: 'Brazil', flag: '🇧🇷', confederation: 'CONMEBOL' },
  MAR: { name: 'Morocco', flag: '🇲🇦', confederation: 'CAF' },
  HAI: { name: 'Haiti', flag: '🇭🇹', confederation: 'CONCACAF' },
  SCO: { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA' },
  USA: { name: 'USA', flag: '🇺🇸', confederation: 'CONCACAF' },
  PAR: { name: 'Paraguay', flag: '🇵🇾', confederation: 'CONMEBOL' },
  AUS: { name: 'Australia', flag: '🇦🇺', confederation: 'AFC' },
  TUR: { name: 'Türkiye', flag: '🇹🇷', confederation: 'UEFA' },
  GER: { name: 'Germany', flag: '🇩🇪', confederation: 'UEFA' },
  CUW: { name: 'Curaçao', flag: '🇨🇼', confederation: 'CONCACAF' },
  CIV: { name: "Côte d'Ivoire", flag: '🇨🇮', confederation: 'CAF' },
  ECU: { name: 'Ecuador', flag: '🇪🇨', confederation: 'CONMEBOL' },
  NED: { name: 'Netherlands', flag: '🇳🇱', confederation: 'UEFA' },
  JPN: { name: 'Japan', flag: '🇯🇵', confederation: 'AFC' },
  SWE: { name: 'Sweden', flag: '🇸🇪', confederation: 'UEFA' },
  TUN: { name: 'Tunisia', flag: '🇹🇳', confederation: 'CAF' },
  BEL: { name: 'Belgium', flag: '🇧🇪', confederation: 'UEFA' },
  EGY: { name: 'Egypt', flag: '🇪🇬', confederation: 'CAF' },
  IRN: { name: 'Iran', flag: '🇮🇷', confederation: 'AFC' },
  NZL: { name: 'New Zealand', flag: '🇳🇿', confederation: 'OFC' },
  ESP: { name: 'Spain', flag: '🇪🇸', confederation: 'UEFA' },
  CPV: { name: 'Cape Verde', flag: '🇨🇻', confederation: 'CAF' },
  KSA: { name: 'Saudi Arabia', flag: '🇸🇦', confederation: 'AFC' },
  URU: { name: 'Uruguay', flag: '🇺🇾', confederation: 'CONMEBOL' },
  FRA: { name: 'France', flag: '🇫🇷', confederation: 'UEFA' },
  SEN: { name: 'Senegal', flag: '🇸🇳', confederation: 'CAF' },
  IRQ: { name: 'Iraq', flag: '🇮🇶', confederation: 'AFC' },
  NOR: { name: 'Norway', flag: '🇳🇴', confederation: 'UEFA' },
  ARG: { name: 'Argentina', flag: '🇦🇷', confederation: 'CONMEBOL' },
  ALG: { name: 'Algeria', flag: '🇩🇿', confederation: 'CAF' },
  AUT: { name: 'Austria', flag: '🇦🇹', confederation: 'UEFA' },
  JOR: { name: 'Jordan', flag: '🇯🇴', confederation: 'AFC' },
  POR: { name: 'Portugal', flag: '🇵🇹', confederation: 'UEFA' },
  COL: { name: 'Colombia', flag: '🇨🇴', confederation: 'CONMEBOL' },
  UZB: { name: 'Uzbekistan', flag: '🇺🇿', confederation: 'AFC' },
  COD: { name: 'DR Congo', flag: '🇨🇩', confederation: 'CAF' },
  ENG: { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA' },
  CRO: { name: 'Croatia', flag: '🇭🇷', confederation: 'UEFA' },
  PAN: { name: 'Panama', flag: '🇵🇦', confederation: 'CONCACAF' },
  GHA: { name: 'Ghana', flag: '🇬🇭', confederation: 'CAF' },
};

export const CONF_COLORS = {
  UEFA: '#003DA5', CONMEBOL: '#009B3A', CAF: '#007A3D',
  AFC: '#005BAA', CONCACAF: '#00529B', OFC: '#0067B1',
};

// Build a UTC Date from a US-zone local wall-clock time.
function utcFromZone(dateStr, timeStr, dstOffsetHours) {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  return new Date(Date.UTC(y, mo - 1, d, h - dstOffsetHours, mi));
}
const ET = (d, t) => utcFromZone(d, t, -4);
const CT = (d, t) => utcFromZone(d, t, -5);
const MT = (d, t) => utcFromZone(d, t, -6);
const PT = (d, t) => utcFromZone(d, t, -7);

const G = (player, team, minute, og = false, pen = false) => ({ player, team, minute, og, pen });

const M = (id, group, home, away, kickoffUTC, homeScore, awayScore, homeRed, awayRed, venue, matchday, goals = []) => ({
  id, group, home, away, kickoffUTC,
  homeScore, awayScore, homeRed: homeRed || 0, awayRed: awayRed || 0,
  venue, matchday, goals,
});

export const MATCHES = [
  M('A1', 'A', 'MEX', 'RSA', CT('2026-06-11', '13:00'), 2, 0, 0, 0, 'Estadio Azteca, Mexico City', 1, [
    G('Julián Quiñones', 'MEX', 9), G('Raúl Jiménez', 'MEX', 67),
  ]),
  M('A2', 'A', 'KOR', 'CZE', CT('2026-06-11', '20:00'), 2, 1, 0, 0, 'Estadio Akron, Guadalajara', 1, [
    G('Ladislav Krejčí', 'CZE', 58), G('Hwang In-beom', 'KOR', 71), G('Oh Hyeon-gyu', 'KOR', 84),
  ]),
  M('A3', 'A', 'CZE', 'RSA', ET('2026-06-18', '12:00'), 1, 1, 0, 0, 'Mercedes-Benz Stadium, Atlanta', 2),
  M('A4', 'A', 'MEX', 'KOR', CT('2026-06-18', '19:00'), 1, 0, 0, 0, 'Estadio Akron, Guadalajara', 2),
  M('A5', 'A', 'CZE', 'MEX', CT('2026-06-24', '19:00'), 0, 3, 0, 0, 'Estadio Azteca, Mexico City', 3),
  M('A6', 'A', 'RSA', 'KOR', MT('2026-06-24', '19:00'), 1, 0, 0, 0, 'Estadio BBVA, Monterrey', 3),

  M('B1', 'B', 'CAN', 'BIH', ET('2026-06-12', '15:00'), 1, 1, 0, 0, 'BMO Field, Toronto', 1, [
    G('Jovo Lukić', 'BIH', 23), G('Cyle Larin', 'CAN', 67),
  ]),
  M('B2', 'B', 'QAT', 'SUI', PT('2026-06-13', '12:00'), 1, 1, 0, 0, "Levi's Stadium, Santa Clara", 1, [
    G('Breel Embolo', 'SUI', 17, false, true), G('Boualem Khoukhi', 'QAT', 90, true),
  ]),
  M('B3', 'B', 'SUI', 'BIH', PT('2026-06-18', '12:00'), 4, 1, 0, 0, 'SoFi Stadium, Inglewood', 2),
  M('B4', 'B', 'CAN', 'QAT', PT('2026-06-18', '15:00'), 6, 0, 0, 0, 'BC Place, Vancouver', 2),
  M('B5', 'B', 'BIH', 'QAT', MT('2026-06-24', '17:00'), 3, 1, 0, 0, 'TBD', 3),
  M('B6', 'B', 'SUI', 'CAN', PT('2026-06-24', '12:00'), 3, 1, 0, 0, 'BC Place, Vancouver', 3),

  M('C1', 'C', 'BRA', 'MAR', ET('2026-06-13', '18:00'), 1, 1, 0, 0, 'MetLife Stadium, East Rutherford', 1, [
    G('Ismael Saibari', 'MAR', 21), G('Vinícius Júnior', 'BRA', 32),
  ]),
  M('C2', 'C', 'HAI', 'SCO', ET('2026-06-13', '21:00'), 0, 1, 0, 0, 'Gillette Stadium, Foxborough', 1, [
    G('John McGinn', 'SCO', 28),
  ]),
  M('C3', 'C', 'SCO', 'MAR', ET('2026-06-19', '18:00'), 0, 1, 0, 0, 'Gillette Stadium, Foxborough', 2),
  M('C4', 'C', 'BRA', 'HAI', ET('2026-06-19', '21:00'), 3, 0, 0, 0, 'Lincoln Financial Field, Philadelphia', 2),
  M('C5', 'C', 'MAR', 'HAI', ET('2026-06-24', '18:00'), 1, 0, 0, 0, 'Mercedes-Benz Stadium, Atlanta', 3),
  M('C6', 'C', 'SCO', 'BRA', ET('2026-06-24', '18:00'), 0, 3, 0, 0, 'Hard Rock Stadium, Miami Gardens', 3),

  M('D1', 'D', 'USA', 'PAR', PT('2026-06-12', '18:00'), 4, 1, 0, 0, 'SoFi Stadium, Inglewood', 1, [
    G('Damián Bobadilla', 'PAR', 7, true), G('Folarin Balogun', 'USA', 31), G('Folarin Balogun', 'USA', 45),
    G('Mauricio', 'PAR', 73), G('Giovanni Reyna', 'USA', 90),
  ]),
  M('D2', 'D', 'AUS', 'TUR', PT('2026-06-13', '21:00'), 2, 0, 0, 0, 'BC Place, Vancouver', 1, [
    G('Nestory Irankunda', 'AUS', 27), G('Connor Metcalfe', 'AUS', 75),
  ]),
  M('D3', 'D', 'USA', 'AUS', PT('2026-06-19', '12:00'), 2, 0, 0, 0, 'Lumen Field, Seattle', 2),
  M('D4', 'D', 'TUR', 'PAR', PT('2026-06-19', '21:00'), 0, 1, 0, 0, "Levi's Stadium, Santa Clara", 2),
  M('D5', 'D', 'TUR', 'USA', PT('2026-06-25', '19:00'), 3, 2, 0, 0, 'SoFi Stadium, Inglewood', 3),
  M('D6', 'D', 'PAR', 'AUS', PT('2026-06-25', '19:00'), 0, 0, 0, 0, "Levi's Stadium, Santa Clara", 3),

  M('E1', 'E', 'GER', 'CUW', CT('2026-06-14', '12:00'), 7, 1, 0, 0, 'NRG Stadium, Houston', 1, [
    G('Felix Nmecha', 'GER', 6), G('Livano Comenencia', 'CUW', 21),
    G('Nico Schlotterbeck', 'GER', 38), G('Kai Havertz', 'GER', 43),
    G('Jamal Musiala', 'GER', 47), G('Nathaniel Brown', 'GER', 68),
    G('Deniz Undav', 'GER', 78), G('Kai Havertz', 'GER', 88),
  ]),
  M('E2', 'E', 'CIV', 'ECU', ET('2026-06-14', '19:00'), 1, 0, 0, 0, 'Lincoln Financial Field, Philadelphia', 1),
  M('E3', 'E', 'GER', 'CIV', ET('2026-06-20', '16:00'), 2, 1, 0, 0, 'BMO Field, Toronto', 2),
  M('E4', 'E', 'ECU', 'CUW', CT('2026-06-20', '19:00'), 0, 0, 0, 0, 'Arrowhead Stadium, Kansas City', 2),
  M('E5', 'E', 'ECU', 'GER', ET('2026-06-25', '16:00'), 2, 1, 0, 0, 'MetLife Stadium, East Rutherford', 3),
  M('E6', 'E', 'CUW', 'CIV', ET('2026-06-25', '16:00'), 0, 2, 0, 0, 'Lincoln Financial Field, Philadelphia', 3),

  M('F1', 'F', 'NED', 'JPN', CT('2026-06-14', '15:00'), 2, 2, 0, 0, 'AT&T Stadium, Arlington', 1, [
    G('Virgil van Dijk', 'NED', 51), G('Keito Nakamura', 'JPN', 58),
    G('Crysencio Summerville', 'NED', 64), G('Daichi Kamada', 'JPN', 88),
  ]),
  M('F2', 'F', 'SWE', 'TUN', CT('2026-06-14', '20:00'), 5, 1, 0, 0, 'Estadio BBVA, Monterrey', 1),
  M('F3', 'F', 'NED', 'SWE', CT('2026-06-20', '12:00'), 5, 1, 0, 0, 'NRG Stadium, Houston', 2),
  M('F4', 'F', 'TUN', 'JPN', CT('2026-06-20', '21:00'), 0, 4, 0, 0, 'Estadio BBVA, Monterrey', 2),
  M('F5', 'F', 'JPN', 'SWE', CT('2026-06-25', '18:00'), 1, 1, 0, 0, 'AT&T Stadium, Arlington', 3),
  M('F6', 'F', 'TUN', 'NED', CT('2026-06-25', '18:00'), 1, 3, 0, 0, 'Arrowhead Stadium, Kansas City', 3),

  M('G1', 'G', 'BEL', 'EGY', PT('2026-06-15', '12:00'), 1, 1, 0, 0, 'Lumen Field, Seattle', 1),
  M('G2', 'G', 'IRN', 'NZL', PT('2026-06-15', '18:00'), 2, 2, 0, 0, 'SoFi Stadium, Inglewood', 1),
  M('G3', 'G', 'BEL', 'IRN', PT('2026-06-21', '12:00'), 0, 0, 0, 0, 'SoFi Stadium, Inglewood', 2),
  M('G4', 'G', 'NZL', 'EGY', PT('2026-06-21', '18:00'), 1, 3, 0, 0, 'BC Place, Vancouver', 2),
  M('G5', 'G', 'EGY', 'IRN', ET('2026-06-26', '20:00'), 1, 1, 0, 0, 'Lumen Field, Seattle', 3),
  M('G6', 'G', 'NZL', 'BEL', ET('2026-06-26', '20:00'), 1, 5, 0, 0, 'BC Place, Vancouver', 3),

  M('H1', 'H', 'ESP', 'CPV', ET('2026-06-15', '12:00'), 0, 0, 0, 0, 'Mercedes-Benz Stadium, Atlanta', 1),
  M('H2', 'H', 'KSA', 'URU', ET('2026-06-15', '18:00'), 1, 1, 0, 0, 'Hard Rock Stadium, Miami Gardens', 1, [
    G('Abdulelah Al-Amri', 'KSA', 41), G('Maximiliano Araújo', 'URU', 80),
  ]),
  M('H3', 'H', 'ESP', 'KSA', ET('2026-06-21', '12:00'), 4, 0, 0, 0, 'Mercedes-Benz Stadium, Atlanta', 2, [
    G('Lamine Yamal', 'ESP', 10), G('Mikel Oyarzabal', 'ESP', 21),
    G('Mikel Oyarzabal', 'ESP', 24), G('Hassan Al-Tambakti', 'KSA', 49, true),
  ]),
  M('H4', 'H', 'URU', 'CPV', ET('2026-06-21', '18:00'), 2, 2, 0, 0, 'Hard Rock Stadium, Miami Gardens', 2, [
    G('Kevin Pina', 'CPV', 21), G('Maxi Araújo', 'URU', 44),
    G('Agustín Canobbio', 'URU', 46), G('Hélio Varela', 'CPV', 61),
  ]),
  M('H5', 'H', 'CPV', 'KSA', ET('2026-06-26', '21:00'), 0, 0, 0, 0, 'Hard Rock Stadium, Miami Gardens', 3),
  M('H6', 'H', 'URU', 'ESP', MT('2026-06-26', '13:00'), 0, 1, 0, 1, 'Estadio Akron, Guadalajara', 3, [
    G('Álex Baena', 'ESP', 42),
  ]),

  M('I1', 'I', 'FRA', 'SEN', ET('2026-06-16', '15:00'), 1, 0, 0, 0, 'MetLife Stadium, East Rutherford', 1),
  M('I2', 'I', 'IRQ', 'NOR', ET('2026-06-16', '18:00'), 0, 3, 0, 0, 'Gillette Stadium, Foxborough', 1),
  M('I3', 'I', 'FRA', 'IRQ', ET('2026-06-22', '17:00'), 5, 1, 0, 0, 'Lincoln Financial Field, Philadelphia', 2),
  M('I4', 'I', 'NOR', 'SEN', ET('2026-06-22', '20:00'), 4, 1, 0, 0, 'MetLife Stadium, East Rutherford', 2),
  M('I5', 'I', 'SEN', 'IRQ', ET('2026-06-26', '16:00'), 5, 0, 0, 0, 'Gillette Stadium, Foxborough', 3),
  M('I6', 'I', 'FRA', 'NOR', ET('2026-06-26', '16:00'), 4, 1, 0, 0, 'MetLife Stadium, East Rutherford', 3),

  M('J1', 'J', 'ARG', 'ALG', CT('2026-06-16', '21:00'), 3, 0, 0, 0, 'Arrowhead Stadium, Kansas City', 1),
  M('J2', 'J', 'AUT', 'JOR', PT('2026-06-16', '21:00'), 3, 1, 0, 0, "Levi's Stadium, Santa Clara", 1),
  M('J3', 'J', 'ARG', 'AUT', CT('2026-06-22', '13:00'), 2, 0, 0, 0, 'AT&T Stadium, Arlington', 2),
  M('J4', 'J', 'JOR', 'ALG', PT('2026-06-22', '23:00'), 1, 2, 0, 0, "Levi's Stadium, Santa Clara", 2),
  M('J5', 'J', 'ARG', 'JOR', CT('2026-06-27', '21:00'), 3, 1, 0, 0, 'AT&T Stadium, Arlington', 3, [
    G('Giovani Lo Celso', 'ARG', 19), G('Lautaro Martínez', 'ARG', 30, false, true),
    G('Musa Al-Taamari', 'JOR', 56), G('Lionel Messi', 'ARG', 90),
  ]),
  M('J6', 'J', 'ALG', 'AUT', CT('2026-06-27', '21:00'), 3, 3, 0, 0, 'Arrowhead Stadium, Kansas City', 3, [
    G('Nadhir Benbouali', 'ALG', 11), G('Marko Arnautović', 'AUT', 30),
    G('Riyad Mahrez', 'ALG', 45), G('Stefan Posch', 'AUT', 55),
    G('Rafik Belghali', 'ALG', 70), G('Saša Kalajdžić', 'AUT', 94),
  ]),

  M('K1', 'K', 'POR', 'COD', CT('2026-06-17', '12:00'), 1, 1, 0, 0, 'NRG Stadium, Houston', 1, [
    G('João Neves', 'POR', 6), G('Yoane Wissa', 'COD', 45),
  ]),
  M('K2', 'K', 'UZB', 'COL', CT('2026-06-17', '21:00'), 1, 3, 0, 0, 'Estadio Azteca, Mexico City', 1, [
    G('Daniel Muñoz', 'COL', 40), G('Abbosbek Fayzullaev', 'UZB', 60),
  ]),
  M('K3', 'K', 'POR', 'UZB', CT('2026-06-23', '12:00'), 5, 0, 0, 0, 'NRG Stadium, Houston', 2, [
    G('Cristiano Ronaldo', 'POR', 30), G('Cristiano Ronaldo', 'POR', 52),
  ]),
  M('K4', 'K', 'COL', 'COD', ET('2026-06-23', '15:00'), 1, 0, 0, 0, 'Estadio Azteca, Mexico City', 2, [
    G('Daniel Muñoz', 'COL', 58),
  ]),
  M('K5', 'K', 'COD', 'UZB', ET('2026-06-27', '19:30'), 3, 1, 0, 0, 'Hard Rock Stadium, Miami Gardens', 3),
  M('K6', 'K', 'COL', 'POR', ET('2026-06-27', '19:30'), 0, 0, 0, 0, 'Hard Rock Stadium, Miami Gardens', 3),

  M('L1', 'L', 'ENG', 'CRO', CT('2026-06-17', '15:00'), 4, 2, 0, 0, 'AT&T Stadium, Arlington', 1, [
    G('Harry Kane', 'ENG', 12, false, true), G('Martin Baturina', 'CRO', 36),
    G('Harry Kane', 'ENG', 42), G('Petar Musa', 'CRO', 45),
    G('Jude Bellingham', 'ENG', 47), G('Marcus Rashford', 'ENG', 85),
  ]),
  M('L2', 'L', 'GHA', 'PAN', ET('2026-06-17', '19:00'), 1, 0, 0, 0, 'BMO Field, Toronto', 1),
  M('L3', 'L', 'ENG', 'GHA', ET('2026-06-23', '16:00'), 0, 0, 0, 0, 'Mercedes-Benz Stadium, Atlanta', 2),
  M('L4', 'L', 'PAN', 'CRO', ET('2026-06-23', '19:00'), 0, 1, 0, 0, 'BMO Field, Toronto', 2, [
    G('Ante Budimir', 'CRO', 54),
  ]),
  M('L5', 'L', 'CRO', 'GHA', ET('2026-06-27', '17:00'), 2, 1, 0, 0, 'BMO Field, Toronto', 3),
  M('L6', 'L', 'PAN', 'ENG', ET('2026-06-27', '17:00'), 0, 2, 0, 0, 'Mercedes-Benz Stadium, Atlanta', 3, [
    G('Jude Bellingham', 'ENG', 62), G('Harry Kane', 'ENG', 67),
  ]),
];

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const GROUP_TEAMS = {
  A: ['MEX', 'RSA', 'KOR', 'CZE'], B: ['SUI', 'CAN', 'BIH', 'QAT'],
  C: ['BRA', 'MAR', 'SCO', 'HAI'], D: ['USA', 'AUS', 'PAR', 'TUR'],
  E: ['GER', 'CIV', 'ECU', 'CUW'], F: ['NED', 'JPN', 'SWE', 'TUN'],
  G: ['BEL', 'EGY', 'IRN', 'NZL'], H: ['ESP', 'CPV', 'URU', 'KSA'],
  I: ['FRA', 'NOR', 'SEN', 'IRQ'], J: ['ARG', 'AUT', 'ALG', 'JOR'],
  K: ['COL', 'POR', 'COD', 'UZB'], L: ['ENG', 'CRO', 'GHA', 'PAN'],
};

export const GROUP_COLORS = {
  A: '#e74c3c', B: '#e67e22', C: '#f1c40f', D: '#2ecc71',
  E: '#1abc9c', F: '#3498db', G: '#9b59b6', H: '#e91e63',
  I: '#ff5722', J: '#00bcd4', K: '#8bc34a', L: '#ff9800',
};

export const QUALIFIED_THIRD_PLACE = ['COD', 'SWE', 'ECU', 'GHA', 'BIH', 'ALG', 'PAR', 'SEN'];

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
