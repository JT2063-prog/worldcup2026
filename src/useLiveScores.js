import { useState, useEffect, useCallback, useRef } from 'react';

// openfootball/worldcup.json - free, no key, community updated with scores + goalscorers
// Structure: { name, matches: [{ team1, team2, score: { ft:[h,a], ht:[h,a] }, goals1:[{name,minute}], goals2:[...] }] }
const API_URL = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';

const NAME_MAP = {
  'Mexico': 'MEX', 'South Africa': 'RSA', 'South Korea': 'KOR',
  'Czech Republic': 'CZE', 'Czechia': 'CZE',
  'Canada': 'CAN', 'Bosnia & Herzegovina': 'BIH', 'Bosnia and Herzegovina': 'BIH',
  'Qatar': 'QAT', 'Switzerland': 'SUI',
  'Brazil': 'BRA', 'Morocco': 'MAR', 'Haiti': 'HAI', 'Scotland': 'SCO',
  'USA': 'USA', 'United States': 'USA', 'Paraguay': 'PAR', 'Australia': 'AUS',
  'Turkey': 'TUR', 'Türkiye': 'TUR',
  'Germany': 'GER', 'Curaçao': 'CUW', 'Curacao': 'CUW',
  'Ivory Coast': 'CIV', "Côte d'Ivoire": 'CIV',
  'Ecuador': 'ECU', 'Netherlands': 'NED', 'Japan': 'JPN', 'Sweden': 'SWE', 'Tunisia': 'TUN',
  'Belgium': 'BEL', 'Egypt': 'EGY', 'Iran': 'IRN', 'New Zealand': 'NZL',
  'Spain': 'ESP', 'Cape Verde': 'CPV', 'Saudi Arabia': 'KSA', 'Uruguay': 'URU',
  'France': 'FRA', 'Senegal': 'SEN', 'Iraq': 'IRQ', 'Norway': 'NOR',
  'Argentina': 'ARG', 'Algeria': 'ALG', 'Austria': 'AUT', 'Jordan': 'JOR',
  'Portugal': 'POR', 'Colombia': 'COL', 'Uzbekistan': 'UZB', 'DR Congo': 'COD',
  'England': 'ENG', 'Croatia': 'CRO', 'Panama': 'PAN', 'Ghana': 'GHA',
};

function resolveCode(name) {
  if (!name) return null;
  // Strip path qualifiers like "UEFA Path D winner" — try partial match
  const clean = name.trim();
  if (NAME_MAP[clean]) return NAME_MAP[clean];
  // Try matching any known name contained within the string
  for (const [k, v] of Object.entries(NAME_MAP)) {
    if (clean.includes(k)) return v;
  }
  return null;
}

export function phaseLabel(phase) {
  const map = { '1H':'1H','HT':'HT','2H':'2H','ET':'ET','PEN':'PEN','FT':'FT' };
  return map[phase] ?? phase;
}
export function isLivePhase(phase) { return ['1H','2H','ET','PEN'].includes(phase); }
export function isFinishedPhase(phase) { return ['FT','HT'].includes(phase); }

export function useLiveScores() {
  const [liveData, setLiveData] = useState({});
  const [status, setStatus] = useState('loading');
  const [lastFetched, setLastFetched] = useState(null);
  const pollRef = useRef(null);

  const fetchScores = useCallback(async () => {
    try {
      setStatus('fetching');
      const res = await fetch(`${API_URL}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // openfootball uses flat matches array (not rounds)
      const matches = data.matches || [];
      const parsed = {};

      matches.forEach(m => {
        const homeCode = resolveCode(m.team1);
        const awayCode = resolveCode(m.team2);
        if (!homeCode || !awayCode) return;

        const key = `${homeCode}_${awayCode}`;
        const score = m.score;
        if (!score) return; // not played yet

        const ft = score.ft;   // [home, away]
        const ht = score.ht;   // [home, away] half time

        if (!ft && !ht) return;

        // Parse goalscorers
        const goals = [];
        (m.goals1 || []).forEach(g => {
          goals.push({ player: g.name, team: homeCode, minute: parseInt(g.minute) || 0, og: g.og || false, pen: g.pen || false });
        });
        (m.goals2 || []).forEach(g => {
          goals.push({ player: g.name, team: awayCode, minute: parseInt(g.minute) || 0, og: g.og || false, pen: g.pen || false });
        });

        if (ft) {
          parsed[key] = { homeScore: ft[0], awayScore: ft[1], phase: 'FT', homeRed: 0, awayRed: 0, goals };
        } else if (ht) {
          parsed[key] = { homeScore: ht[0], awayScore: ht[1], phase: 'HT', homeRed: 0, awayRed: 0, goals };
        }
      });

      setLiveData(parsed);
      setStatus('ok');
      setLastFetched(new Date());
    } catch (e) {
      console.warn('Score fetch failed:', e.message);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchScores();
    pollRef.current = setInterval(fetchScores, 60 * 1000);
    return () => clearInterval(pollRef.current);
  }, [fetchScores]);

  return { liveData, status, lastFetched, refetch: fetchScores };
}
