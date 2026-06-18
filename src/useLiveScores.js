import { useState, useEffect, useCallback, useRef } from 'react';

// Primary: wc2026api.com (premium key - real-time)
// Fallback: openfootball GitHub JSON (free, community updated)
const WC_API = 'https://api.wc2026api.com/matches';
const WC_KEY = 'wc26_28BSv81D2UZyAetHA7GnMf';
const FALLBACK_API = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';

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

// Parse wc2026api.com response
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

    // Goals from events
    const goals = [];
    (m.events || []).forEach(e => {
      if (e.type === 'goal' || e.type === 'GOAL') {
        const team = resolveCode(e.team);
        if (team) goals.push({ player: e.player || e.player_name || '', team, minute: e.minute || 0, og: e.own_goal || false, pen: e.penalty || false });
      }
    });

    // Red cards
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

// Parse openfootball fallback
function parseOpenFootball(matches) {
  const parsed = {};
  matches.forEach(m => {
    const homeCode = resolveCode(m.team1);
    const awayCode = resolveCode(m.team2);
    if (!homeCode || !awayCode) return;
    const key = `${homeCode}_${awayCode}`;
    const score = m.score;
    if (!score) return;
    const ft = score.ft, ht = score.ht;
    if (!ft && !ht) return;

    const goals = [];
    (m.goals1 || []).forEach(g => goals.push({ player: g.name, team: homeCode, minute: parseInt(g.minute)||0, og: g.og||false, pen: g.pen||false }));
    (m.goals2 || []).forEach(g => goals.push({ player: g.name, team: awayCode, minute: parseInt(g.minute)||0, og: g.og||false, pen: g.pen||false }));

    if (ft) parsed[key] = { homeScore: ft[0], awayScore: ft[1], phase: 'FT', homeRed:0, awayRed:0, goals, source: 'openfootball' };
    else if (ht) parsed[key] = { homeScore: ht[0], awayScore: ht[1], phase: 'HT', homeRed:0, awayRed:0, goals, source: 'openfootball' };
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
    // Try primary API first
    try {
      const res = await fetch(WC_API, {
        headers: { 'Authorization': `Bearer ${WC_KEY}` },
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        const matches = Array.isArray(data) ? data : (data.matches || data.data || []);
        if (matches.length > 0) {
          setLiveData(parseWCAPI(matches));
          setStatus('ok');
          setSource('wc2026api');
          setLastFetched(new Date());
          return;
        }
      }
    } catch(e) { console.warn('Primary API failed:', e.message); }

    // Fallback to openfootball
    try {
      const res = await fetch(`${FALLBACK_API}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const matches = data.matches || [];
      setLiveData(parseOpenFootball(matches));
      setStatus('ok');
      setSource('openfootball');
      setLastFetched(new Date());
    } catch(e) {
      console.warn('Fallback API failed:', e.message);
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
