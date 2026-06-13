import { useState, useEffect, useCallback, useRef } from 'react';

// wc2026api.com - free tier: 100 req/day
// API key stored in localStorage (user-provided)
const API_BASE = 'https://api.wc2026api.com';

// Map API team names → our team codes
const TEAM_NAME_MAP = {
  'Mexico': 'MEX', 'South Africa': 'RSA', 'South Korea': 'KOR', 'Korea Republic': 'KOR',
  'Czechia': 'CZE', 'Czech Republic': 'CZE',
  'Canada': 'CAN', 'Bosnia and Herzegovina': 'BIH', 'Bosnia & Herzegovina': 'BIH',
  'Qatar': 'QAT', 'Switzerland': 'SUI',
  'Brazil': 'BRA', 'Morocco': 'MAR', 'Haiti': 'HAI', 'Scotland': 'SCO',
  'USA': 'USA', 'United States': 'USA', 'Paraguay': 'PAR', 'Australia': 'AUS',
  'Turkey': 'TUR', 'Türkiye': 'TUR',
  'Germany': 'GER', 'Curaçao': 'CUW', 'Curacao': 'CUW',
  "Ivory Coast": 'CIV', "Côte d'Ivoire": 'CIV', 'Cote d\'Ivoire': 'CIV',
  'Ecuador': 'ECU',
  'Netherlands': 'NED', 'Japan': 'JPN', 'Sweden': 'SWE', 'Tunisia': 'TUN',
  'Belgium': 'BEL', 'Egypt': 'EGY', 'Iran': 'IRN', 'New Zealand': 'NZL',
  'Spain': 'ESP', 'Cape Verde': 'CPV', 'Saudi Arabia': 'KSA', 'Uruguay': 'URU',
  'France': 'FRA', 'Senegal': 'SEN', 'Iraq': 'IRQ', 'Norway': 'NOR',
  'Argentina': 'ARG', 'Algeria': 'ALG', 'Austria': 'AUT', 'Jordan': 'JOR',
  'Portugal': 'POR', 'Colombia': 'COL', 'Uzbekistan': 'UZB', 'DR Congo': 'COD',
  'Democratic Republic of Congo': 'COD', 'Congo DR': 'COD',
  'England': 'ENG', 'Croatia': 'CRO', 'Panama': 'PAN', 'Ghana': 'GHA',
};

export function resolveTeamCode(name) {
  if (!name) return null;
  return TEAM_NAME_MAP[name] || TEAM_NAME_MAP[name.trim()] || null;
}

// Phase → display label
export function phaseLabel(phase) {
  const labels = {
    'PRE': null,
    '1H': '1H', 'HT': 'HT', '2H': '2H',
    'ET1': 'ET1', 'ET2': 'ET2', 'PEN': 'PEN',
    'FT': 'FT', 'FT_PEN': 'FT (P)',
  };
  return labels[phase] ?? phase;
}

export function isLivePhase(phase) {
  return ['1H', '2H', 'ET1', 'ET2', 'PEN'].includes(phase);
}

export function isFinishedPhase(phase) {
  return ['FT', 'FT_PEN', 'HT'].includes(phase);
}

// Main hook
export function useLiveScores(apiKey) {
  const [liveData, setLiveData] = useState({}); // matchId → {homeScore, awayScore, phase, homeRed, awayRed}
  const [status, setStatus] = useState('idle'); // idle | fetching | ok | error | no-key
  const [lastFetched, setLastFetched] = useState(null);
  const [requestsUsed, setRequestsUsed] = useState(0);
  const pollRef = useRef(null);

  const fetchMatches = useCallback(async (key) => {
    if (!key) { setStatus('no-key'); return; }
    setStatus('fetching');
    try {
      const res = await fetch(`${API_BASE}/matches`, {
        headers: { 'Authorization': `Bearer ${key}` }
      });
      if (res.status === 401) { setStatus('error'); return; }
      if (res.status === 429) { setStatus('rate-limited'); return; }
      if (!res.ok) { setStatus('error'); return; }
      const data = await res.json();
      const matches = Array.isArray(data) ? data : (data.matches || data.data || []);

      const parsed = {};
      matches.forEach(m => {
        const homeCode = resolveTeamCode(m.home_team || m.homeTeam || m.home);
        const awayCode = resolveTeamCode(m.away_team || m.awayTeam || m.away);
        if (!homeCode || !awayCode) return;

        const key2 = `${homeCode}_${awayCode}`;
        const homeScore = m.home_score ?? m.homeScore ?? m.score?.home ?? null;
        const awayScore = m.away_score ?? m.awayScore ?? m.score?.away ?? null;
        const phase = m.phase || m.status || 'PRE';

        // Events for red cards
        const events = m.events || [];
        let homeRed = 0, awayRed = 0;
        events.forEach(e => {
          const isRed = e.type === 'red_card' || e.type === 'RED_CARD' || e.card === 'red';
          if (!isRed) return;
          const teamCode = resolveTeamCode(e.team);
          if (teamCode === homeCode) homeRed++;
          else if (teamCode === awayCode) awayRed++;
        });

        parsed[key2] = { homeScore, awayScore, phase, homeRed, awayRed };
      });

      setLiveData(parsed);
      setStatus('ok');
      setLastFetched(new Date());
      setRequestsUsed(r => r + 1);
    } catch (e) {
      setStatus('error');
    }
  }, []);

  // Start/stop polling based on whether apiKey is set
  useEffect(() => {
    if (!apiKey) { setStatus('no-key'); return; }

    fetchMatches(apiKey);

    // Poll every 60 seconds during matches, 5 min otherwise
    const INTERVAL = 60 * 1000;
    pollRef.current = setInterval(() => fetchMatches(apiKey), INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [apiKey, fetchMatches]);

  const refetch = () => fetchMatches(apiKey);

  return { liveData, status, lastFetched, requestsUsed, refetch };
}
