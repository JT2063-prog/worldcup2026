import { useState, useEffect, useCallback, useRef } from 'react';

// worldcup26.ir — completely free, no API key required
const API_URL = 'https://worldcup26.ir/get/games';

const NAME_MAP = {
  'Mexico': 'MEX', 'South Africa': 'RSA', 'South Korea': 'KOR', 'Korea Republic': 'KOR',
  'Czechia': 'CZE', 'Czech Republic': 'CZE',
  'Canada': 'CAN', 'Bosnia and Herzegovina': 'BIH', 'Bosnia & Herzegovina': 'BIH',
  'Qatar': 'QAT', 'Switzerland': 'SUI',
  'Brazil': 'BRA', 'Morocco': 'MAR', 'Haiti': 'HAI', 'Scotland': 'SCO',
  'USA': 'USA', 'United States': 'USA', 'Paraguay': 'PAR', 'Australia': 'AUS',
  'Turkey': 'TUR', 'Türkiye': 'TUR',
  'Germany': 'GER', 'Curaçao': 'CUW', 'Curacao': 'CUW',
  "Ivory Coast": 'CIV', "Côte d'Ivoire": 'CIV',
  'Ecuador': 'ECU', 'Netherlands': 'NED', 'Japan': 'JPN', 'Sweden': 'SWE', 'Tunisia': 'TUN',
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
  return NAME_MAP[name] || NAME_MAP[name.trim()] || null;
}

export function phaseLabel(phase) {
  const labels = { '1H': '1H', 'HT': 'HT', '2H': '2H', 'ET1': 'ET1', 'ET2': 'ET2', 'PEN': 'PEN', 'FT': 'FT', 'FT_PEN': 'FT (P)' };
  return labels[phase] ?? phase;
}

export function isLivePhase(phase) {
  return ['1H', '2H', 'ET1', 'ET2', 'PEN'].includes(phase);
}

export function isFinishedPhase(phase) {
  return ['FT', 'FT_PEN', 'HT'].includes(phase);
}

export function useLiveScores() {
  const [liveData, setLiveData] = useState({});
  const [status, setStatus] = useState('loading');
  const [lastFetched, setLastFetched] = useState(null);
  const pollRef = useRef(null);

  const fetchScores = useCallback(async () => {
    try {
      setStatus('fetching');
      const res = await fetch(API_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // API returns array of matches
      const matches = Array.isArray(data) ? data : (data.games || data.matches || data.data || []);

      const parsed = {};
      matches.forEach(m => {
        // Try multiple field name patterns the API might use
        const homeName = m.home_team || m.homeTeam || m.home || m.team_home;
        const awayName = m.away_team || m.awayTeam || m.away || m.team_away;
        const homeCode = resolveTeamCode(homeName);
        const awayCode = resolveTeamCode(awayName);
        if (!homeCode || !awayCode) return;

        const key = `${homeCode}_${awayCode}`;
        const hs = m.home_score ?? m.homeScore ?? m.score_home ?? m.goals_home ?? null;
        const as = m.away_score ?? m.awayScore ?? m.score_away ?? m.goals_away ?? null;
        const phase = m.phase || m.status || m.state || 'PRE';

        // Red cards from events
        const events = m.events || m.cards || [];
        let homeRed = 0, awayRed = 0;
        events.forEach(e => {
          if (e.type === 'red_card' || e.type === 'RED_CARD' || e.card === 'red') {
            const code = resolveTeamCode(e.team);
            if (code === homeCode) homeRed++;
            else if (code === awayCode) awayRed++;
          }
        });

        parsed[key] = { homeScore: hs, awayScore: as, phase, homeRed, awayRed };
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
    // Fetch immediately
    fetchScores();
    // Then every 60 seconds
    pollRef.current = setInterval(fetchScores, 60 * 1000);
    return () => clearInterval(pollRef.current);
  }, [fetchScores]);

  return { liveData, status, lastFetched, refetch: fetchScores };
}
