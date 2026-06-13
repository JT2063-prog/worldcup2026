import React, { useState, useEffect } from 'react';
import { MATCHES, TEAMS, GROUP_TEAMS, GROUP_COLORS } from './data';
import { FA_EMBLEMS, FA_NAMES } from './emblems';
import { phaseLabel, isLivePhase, isFinishedPhase } from './useLiveScores';
import './MyTeams.css';

const LS_FOLLOWED = 'wc2026_followed_teams';

// All 48 team codes grouped by confederation for the picker
const ALL_TEAMS_BY_CONF = {
  'UEFA': ['CZE','BIH','SUI','SCO','TUR','GER','NED','SWE','BEL','IRN','ESP','NOR','AUT','POR','CRO','ENG','FRA'],
  'CONMEBOL': ['PAR','ECU','URU','ARG','COL','BRA'],
  'CAF': ['RSA','MAR','EGY','CPV','SEN','ALG','TUN','GHA','COD','CIV'],
  'AFC': ['KOR','QAT','AUS','JPN','KSA','IRQ','JOR','UZB'],
  'CONCACAF': ['MEX','CAN','CUW','USA','PAN','HAI'],
  'OFC': ['NZL'],
};

function FAEmblemSmall({ code }) {
  const [failed, setFailed] = useState(false);
  const url = FA_EMBLEMS[code];
  if (!url || failed) return null;
  return (
    <img src={url} alt="" width={20} height={20}
      style={{ objectFit: 'contain', flexShrink: 0 }}
      onError={() => setFailed(true)} />
  );
}

function TeamPickerRow({ code, followed, onToggle }) {
  const t = TEAMS[code];
  if (!t) return null;
  return (
    <button
      className={`tp-row ${followed ? 'tp-row--on' : ''}`}
      onClick={() => onToggle(code)}
    >
      <span className="tp-flag">{t.flag}</span>
      <FAEmblemSmall code={code} />
      <span className="tp-name">{t.name}</span>
      <span className="tp-check">{followed ? '★' : '☆'}</span>
    </button>
  );
}

function FollowedMatchCard({ match, liveData, teamCode }) {
  const home = TEAMS[match.home];
  const away = TEAMS[match.away];
  const isHome = match.home === teamCode;

  // Merge live data
  const key = `${match.home}_${match.away}`;
  const live = liveData[key];
  const homeScore = live?.homeScore ?? match.homeScore;
  const awayScore = live?.awayScore ?? match.awayScore;
  const phase = live?.phase || (match.homeScore !== null ? 'FT' : 'PRE');
  const homeRed = live?.homeRed ?? match.homeRed;
  const awayRed = live?.awayRed ?? match.awayRed;

  const hasScore = homeScore !== null;
  const isLive = isLivePhase(phase);
  const isFinished = isFinishedPhase(phase) || (hasScore && !isLive);

  const aestTime = (d) => d.toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney',
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  const groupColor = GROUP_COLORS[match.group];

  // Result for the followed team
  let result = null;
  if (isFinished && hasScore) {
    const myScore = isHome ? homeScore : awayScore;
    const theirScore = isHome ? awayScore : homeScore;
    if (myScore > theirScore) result = 'W';
    else if (myScore < theirScore) result = 'L';
    else result = 'D';
  }

  const resultColor = { W: '#22c55e', L: '#ef4444', D: '#c9a84c' };

  return (
    <div className={`fmc ${isLive ? 'fmc--live' : ''}`} style={{ '--gc': groupColor }}>
      <div className="fmc-top">
        <span className="fmc-group" style={{ color: groupColor }}>GROUP {match.group} · MD{match.matchday}</span>
        {isLive && <span className="fmc-live-badge">● {phaseLabel(phase)}</span>}
        {isFinished && result && (
          <span className="fmc-result" style={{ color: resultColor[result] }}>{result}</span>
        )}
        {!hasScore && !isLive && <span className="fmc-date">{aestTime(match.kickoffAEST)}</span>}
      </div>

      <div className="fmc-body">
        {/* Home */}
        <div className={`fmc-team fmc-team--home ${isHome ? 'fmc-team--me' : ''}`}>
          <span className="fmc-flag">{home?.flag}</span>
          <span className="fmc-tname">{home?.name}</span>
          {homeRed > 0 && <span>{'🟥'.repeat(Math.min(homeRed, 3))}</span>}
        </div>

        {/* Score */}
        <div className="fmc-score-wrap">
          {hasScore || isLive ? (
            <span className={`fmc-score ${isLive ? 'fmc-score--live' : ''}`}>
              {homeScore ?? '?'} – {awayScore ?? '?'}
            </span>
          ) : (
            <span className="fmc-vs">VS</span>
          )}
        </div>

        {/* Away */}
        <div className={`fmc-team fmc-team--away ${!isHome ? 'fmc-team--me' : ''}`}>
          {awayRed > 0 && <span>{'🟥'.repeat(Math.min(awayRed, 3))}</span>}
          <span className="fmc-tname fmc-tname--r">{away?.name}</span>
          <span className="fmc-flag">{away?.flag}</span>
        </div>
      </div>

      {!hasScore && !isLive && (
        <div className="fmc-kickoff">{aestTime(match.kickoffAEST)} AEST</div>
      )}
    </div>
  );
}

export default function MyTeams({ liveData }) {
  const [followed, setFollowed] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_FOLLOWED);
      return stored ? JSON.parse(stored) : ['AUS']; // Australia default
    } catch { return ['AUS']; }
  });
  const [showPicker, setShowPicker] = useState(followed.length === 0);

  useEffect(() => {
    localStorage.setItem(LS_FOLLOWED, JSON.stringify(followed));
  }, [followed]);

  const toggleFollow = (code) => {
    setFollowed(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  // Get all matches for followed teams, sorted by kickoff
  const myMatches = MATCHES
    .filter(m => followed.includes(m.home) || followed.includes(m.away))
    .sort((a, b) => a.kickoffAEST - b.kickoffAEST);

  return (
    <div className="my-teams">
      {/* Header row */}
      <div className="mt-header">
        <div className="mt-followed-flags">
          {followed.length === 0 ? (
            <span className="mt-none">No teams followed yet</span>
          ) : (
            followed.map(code => (
              <span key={code} className="mt-pill" title={TEAMS[code]?.name}>
                {TEAMS[code]?.flag}
                <FAEmblemSmall code={code} />
                <span className="mt-pill-name">{TEAMS[code]?.name}</span>
              </span>
            ))
          )}
        </div>
        <button className="mt-edit-btn" onClick={() => setShowPicker(p => !p)}>
          {showPicker ? '✕ Done' : '✎ Edit teams'}
        </button>
      </div>

      {/* Team picker */}
      {showPicker && (
        <div className="mt-picker">
          {Object.entries(ALL_TEAMS_BY_CONF).map(([conf, codes]) => (
            <div key={conf} className="tp-section">
              <div className="tp-conf-label">{conf}</div>
              <div className="tp-grid">
                {codes.map(code => (
                  <TeamPickerRow
                    key={code}
                    code={code}
                    followed={followed.includes(code)}
                    onToggle={toggleFollow}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Matches */}
      {followed.length === 0 ? (
        <div className="mt-empty">
          <p>Tap <strong>Edit teams</strong> above to follow your favourite nations.</p>
        </div>
      ) : myMatches.length === 0 ? (
        <div className="mt-empty"><p>No matches found for your followed teams.</p></div>
      ) : (
        <div className="mt-matches">
          {followed.map(teamCode => {
            const teamMatches = myMatches.filter(
              m => m.home === teamCode || m.away === teamCode
            );
            const t = TEAMS[teamCode];
            return (
              <div key={teamCode} className="mt-team-section">
                <div className="mt-team-header">
                  <span className="mt-team-flag">{t?.flag}</span>
                  <FAEmblemSmall code={teamCode} />
                  <span className="mt-team-name">{t?.name}</span>
                  <span className="mt-team-conf">{t?.confederation}</span>
                </div>
                {teamMatches.map(m => (
                  <FollowedMatchCard
                    key={m.id}
                    match={m}
                    liveData={liveData}
                    teamCode={teamCode}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
