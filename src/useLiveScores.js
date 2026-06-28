import { useState, useEffect, useCallback, useRef } from 'react';

// wc2026api.com - premium key, real-time scores during matches
const WC_API = 'https://api.wc2026api.com/matches';
const WC_KEY = 'wc26_28BSv81D2UZyAetHA7GnMf';

const NAME_MAP = {
  'Mexico':'MEX','South Africa':'RSA','South Korea':'KOR','Korea Republic':'KOR',
  'Czech Republic':'CZE','Czechia':'CZE',
  'Canada':'CAN','Bosnia & Herzegovina':'BIH','Bosnia and Herzegovina':'BIH',
  'Qatar':'QAT','Switzerland':'SUI',
  'Brazil':'BRA','Morocco':'MAR','Haiti':'HAI','Scotland':'SCO',
  'USA':'USA','United States':'USA','Paraguay':'PAR','Australia':'AUS',
  'Turkey':'TUR','Türkiye':'TUR',
  'Germany':'GER','Curaçao':'CUW','Curacao':'CUW',
  "Ivory Coast":'CIV',"Côte d'Ivoire":'CIV',
  'Ecuador':'ECU','Netherlands':'NED','Japan':'JPN','Sweden':'SWE','Tunisia':'TUN',
  'Belgium':'BEL','Egypt':'EGY','Iran':'IRN','New Zealand':'NZL',
  'Spain':'ESP','Cape Verde':'CPV','Saudi Arabia':'KSA','Uruguay':'URU',
  'France':'FRA','Senegal':'SEN','Iraq':'IRQ','Norway':'NOR',
  'Argentina':'ARG','Algeria':'ALG','Austria':'AUT','Jordan':'JOR',
  'Portugal':'POR','Colombia':'COL','Uzbekistan':'UZB','DR Congo':'COD',
  'England':'ENG','Croatia':'CRO','Panama':'PAN','Ghana':'GHA',
};

function resolveCode(name) {
  if (!name) return null;
  const clean = name.trim();
  if (NAME_MAP[clean]) return NAME_MAP[clean];
  for (const [k,v] of Object.entries(NAME_MAP)) {
    if (clean.includes(k)) return v;
  }
  return null;
}

export function phaseLabel(phase) {
  return {'1H':'1H','HT':'HT','2H':'2H','ET':'ET','PEN':'PEN','FT':'FT','FT_PEN':'FT(P)'}[phase] ?? phase;
}
export function isLivePhase(phase) { return ['1H','2H','ET','PEN'].includes(phase); }
export function isFinishedPhase(phase) { return ['FT','FT_PEN','HT'].includes(phase); }

function parseWCAPI(matches) {
  const parsed = {};
  matches.forEach(m => {
    const homeCode = resolveCode(m.home_team || m.home);
    const awayCode = resolveCode(m.away_team || m.away);
    if (!homeCode || !awayCode) return;
    const key = `${homeCode}_${awayCode}`;
    const hs = m.home_score ?? m.score?.home ?? null;
    const as = m.away_score ?? m.score?.away ?? null;
    const phase = m.phase || m.status || 'PRE';

    const goals = [];
    (m.events || []).forEach(e => {
      if (e.type === 'goal' || e.type === 'GOAL') {
        const team = resolveCode(e.team);
        if (team) goals.push({ player: e.player || e.player_name || '', team, minute: e.minute || 0, og: e.own_goal || false, pen: e.penalty || false });
      }
    });

    let homeRed = 0, awayRed = 0;
    (m.events || []).forEach(e => {
      if (e.type === 'red_card' || e.type === 'RED_CARD') {
        const team = resolveCode(e.team);
        if (team === homeCode) homeRed++;
        else if (team === awayCode) awayRed++;
      }
    });

    parsed[key] = { homeScore: hs, awayScore: as, phase, homeRed, awayRed, goals, source: 'live' };
  });
  return parsed;
}

export function useLiveScores() {
  const [liveData, setLiveData] = useState({});
  const [status, setStatus] = useState('loading');
  const [source, setSource] = useState('');
  const [lastFetched, setLastFetched] = useState(null);
  const pollRef = useRef(null);

  const fetchScores = useCallback(async () => {
    setStatus('fetching');
    try {
      const res = await fetch(WC_API, {
        headers: { 'Authorization': `Bearer ${WC_KEY}` },
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        const matches = Array.isArray(data) ? data : (data.matches || data.data || []);
        if (matches.length > 0) {
          const parsed = parseWCAPI(matches);
          // Merge rather than replace — never let a thin response erase good data
          setLiveData(prev => ({ ...prev, ...parsed }));
          setStatus('ok');
          setSource('wc2026api');
          setLastFetched(new Date());
          return;
        }
      }
      // API reachable but returned nothing useful this poll — don't wipe existing data
      setStatus('ok');
    } catch (e) {
      console.warn('Live API failed:', e.message);
      // Network/API down — keep showing last known liveData, don't clear it
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchScores();
    pollRef.current = setInterval(fetchScores, 60 * 1000);
    return () => clearInterval(pollRef.current);
  }, [fetchScores]);

  return { liveData, status, source, lastFetched, refetch: fetchScores };
}
