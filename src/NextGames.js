import React, { useRef } from 'react';
import { MATCHES, TEAMS, GROUP_COLORS } from './data';
import { isLivePhase, phaseLabel } from './useLiveScores';
import './NextGames.css';

function NextGameChip({ match, liveData, onClick }) {
  const home = TEAMS[match.home];
  const away = TEAMS[match.away];
  const color = GROUP_COLORS[match.group];

  const key = `${match.home}_${match.away}`;
  const live = liveData[key];
  const homeScore = live?.homeScore ?? match.homeScore;
  const awayScore = live?.awayScore ?? match.awayScore;
  const phase = live?.phase || (match.homeScore !== null ? 'FT' : 'PRE');
  const isLive = isLivePhase(phase);
  const hasScore = homeScore !== null;

  const aestTime = (d) => d.toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const aestDate = (d) => d.toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney',
    weekday: 'short', day: 'numeric', month: 'short',
  });

  return (
    <button
      className={`ngc ${isLive ? 'ngc--live' : ''} ${hasScore && !isLive ? 'ngc--done' : ''}`}
      style={{ '--gc': color }}
      onClick={onClick}
      title={`${home?.name} vs ${away?.name} · ${aestDate(match.kickoffAEST)} ${aestTime(match.kickoffAEST)} AEST`}
    >
      <span className="ngc-group">GRP {match.group}</span>
      <div className="ngc-matchup">
        <span className="ngc-flag">{home?.flag}</span>
        {isLive ? (
          <span className="ngc-live-score">
            {homeScore ?? '?'}<span className="ngc-sep">–</span>{awayScore ?? '?'}
          </span>
        ) : hasScore ? (
          <span className="ngc-final-score">
            {homeScore}<span className="ngc-sep">–</span>{awayScore}
          </span>
        ) : (
          <span className="ngc-time">{aestTime(match.kickoffAEST)}</span>
        )}
        <span className="ngc-flag">{away?.flag}</span>
      </div>
      {isLive && <span className="ngc-phase-dot">● {phaseLabel(phase)}</span>}
    </button>
  );
}

export default function NextGames({ liveData, onMatchClick }) {
  const scrollRef = useRef(null);
  const now = new Date();

  // Sort all matches by kickoff, split into upcoming/live/recent
  const sorted = [...MATCHES].sort((a, b) => a.kickoffAEST - b.kickoffAEST);

  // Show: any live matches first, then next 20 upcoming, then last 5 finished
  const live = sorted.filter(m => {
    const key = `${m.home}_${m.away}`;
    const phase = liveData[key]?.phase;
    return phase && isLivePhase(phase);
  });

  const upcoming = sorted.filter(m => {
    const key = `${m.home}_${m.away}`;
    const live2 = liveData[key];
    const hasScore = (live2?.homeScore ?? m.homeScore) !== null;
    return !hasScore && m.kickoffAEST > now;
  }).slice(0, 24);

  const recent = sorted.filter(m => {
    const key = `${m.home}_${m.away}`;
    const live2 = liveData[key];
    const hs = live2?.homeScore ?? m.homeScore;
    return hs !== null;
  }).slice(-6);

  // Deduplicate: live + upcoming, prepend recent at the start
  const liveIds = new Set(live.map(m => m.id));
  const upcomingDeduped = upcoming.filter(m => !liveIds.has(m.id));
  const recentIds = new Set([...live, ...upcomingDeduped].map(m => m.id));
  const recentDeduped = recent.filter(m => !recentIds.has(m.id));

  const chips = [...recentDeduped, ...live, ...upcomingDeduped];

  if (chips.length === 0) return null;

  return (
    <div className="next-games-bar">
      <div className="ngb-label">
        {live.length > 0
          ? <span className="ngb-label--live">● LIVE</span>
          : <span>UPCOMING</span>}
      </div>
      <div className="ngb-scroll" ref={scrollRef}>
        {chips.map(m => (
          <NextGameChip
            key={m.id}
            match={m}
            liveData={liveData}
            onClick={() => onMatchClick && onMatchClick(m)}
          />
        ))}
      </div>
    </div>
  );
}
