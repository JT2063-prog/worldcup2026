import React, { useState } from 'react';
import { MATCHES, TEAMS, GROUP_TEAMS, GROUP_COLORS, calcStandings, CONF_COLORS } from './data';
import { FA_EMBLEMS, FA_NAMES } from './emblems';
import { phaseLabel, isLivePhase, isFinishedPhase } from './useLiveScores';
import './GroupPanel.css';

// Merge static match data with live API data
function mergeMatchData(match, liveData) {
  const key = `${match.home}_${match.away}`;
  const live = liveData[key];
  if (!live) return match;
  return {
    ...match,
    homeScore: live.homeScore ?? match.homeScore,
    awayScore: live.awayScore ?? match.awayScore,
    phase: live.phase || (match.homeScore !== null ? 'FT' : 'PRE'),
    homeRed: live.homeRed ?? match.homeRed,
    awayRed: live.awayRed ?? match.awayRed,
    isLive: true,
  };
}

// FA Emblem with fallback
function FAEmblem({ code, size = 28 }) {
  const [failed, setFailed] = useState(false);
  const url = FA_EMBLEMS[code];
  const name = FA_NAMES[code] || code;
  const conf = TEAMS[code]?.confederation || 'UEFA';
  const color = CONF_COLORS[conf] || '#003DA5';

  if (!url || failed) {
    return (
      <span className="fa-emblem-fallback" style={{ background: color, width: size, height: size }} title={name}>
        {code?.slice(0, 2)}
      </span>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      title={name}
      width={size}
      height={size}
      className="fa-emblem-img"
      onError={() => setFailed(true)}
      style={{ objectFit: 'contain' }}
    />
  );
}

// Country flag + FA emblem pair
function TeamBadges({ code, size = 26 }) {
  const t = TEAMS[code];
  return (
    <div className="team-badges">
      <span className="team-flag-lg" title={t?.name}>{t?.flag}</span>
      <FAEmblem code={code} size={size} />
    </div>
  );
}

function MatchCard({ match, groupColor, now, liveData }) {
  const merged = mergeMatchData(match, liveData);
  const home = TEAMS[match.home];
  const away = TEAMS[match.away];

  const phase = merged.phase;
  const hasScore = merged.homeScore !== null;
  const isLive = isLivePhase(phase) || (merged.isLive && !isFinishedPhase(phase) && hasScore);
  const isFinished = isFinishedPhase(phase) || (hasScore && !isLive);

  const aest = (d) => d.toLocaleString('en-AU', { timeZone: 'Australia/Sydney', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
  const aestTime = (d) => d.toLocaleString('en-AU', { timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit', hour12: false });
  const aestDate = (d) => d.toLocaleString('en-AU', { timeZone: 'Australia/Sydney', weekday: 'short', day: 'numeric', month: 'short' });

  const kickoffMs = match.kickoffAEST.getTime();
  const isPastUnplayed = !hasScore && !isLive && now.getTime() > kickoffMs + 115 * 60000;

  return (
    <div className={`match-card ${isFinished ? 'mc--done' : ''} ${isLive ? 'mc--live' : ''}`} style={{ '--gc': groupColor }}>

      {/* Top bar */}
      <div className="mc-meta">
        <span className="mc-day">MD{match.matchday}</span>
        {isLive ? (
          <span className="mc-status mc-status--live">● {phaseLabel(phase) || 'LIVE'}</span>
        ) : isFinished ? (
          <span className="mc-status mc-status--ft">{phaseLabel(phase)}</span>
        ) : (
          <span className="mc-status mc-status--ns">{aestDate(match.kickoffAEST)}</span>
        )}
        <span className="mc-time">{aestTime(match.kickoffAEST)} AEST</span>
      </div>

      {/* Match body */}
      <div className="mc-body">

        {/* HOME */}
        <div className="mc-team mc-team--home">
          <TeamBadges code={match.home} />
          <span className="mc-name">{home?.name}</span>
          {merged.homeRed > 0 && (
            <span className="mc-reds">{'🟥'.repeat(Math.min(merged.homeRed, 3))}</span>
          )}
        </div>

        {/* SCORE */}
        <div className="mc-score-wrap">
          {hasScore || isLive ? (
            <div className={`mc-score ${isLive ? 'mc-score--live' : ''}`}>
              <span className="mc-score-num">{merged.homeScore ?? '?'}</span>
              <span className="mc-score-sep">–</span>
              <span className="mc-score-num">{merged.awayScore ?? '?'}</span>
            </div>
          ) : (
            <div className="mc-score mc-score--ns">
              <span className="mc-score-vs">VS</span>
            </div>
          )}
          <div className="mc-kick-time">{aestTime(match.kickoffAEST)}</div>
        </div>

        {/* AWAY */}
        <div className="mc-team mc-team--away">
          {merged.awayRed > 0 && (
            <span className="mc-reds">{'🟥'.repeat(Math.min(merged.awayRed, 3))}</span>
          )}
          <span className="mc-name mc-name--r">{away?.name}</span>
          <TeamBadges code={match.away} />
        </div>
      </div>

      {/* Venue */}
      <div className="mc-venue">🏟 {match.venue}</div>
    </div>
  );
}

function StandingsTable({ group, liveData }) {
  const rows = calcStandings(group, liveData);
  const hasData = rows.some(r => r.p > 0);

  return (
    <div className="standings">
      <div className="st-head">
        <span className="st-h-team">Team</span>
        <span>P</span><span>W</span><span>D</span><span>L</span>
        <span>GF</span><span>GA</span><span>GD</span>
        <span className="st-h-pts">PTS</span>
      </div>
      {rows.map((row, i) => {
        const t = TEAMS[row.team];
        const gd = row.gf - row.ga;
        const qualify = i < 2 && hasData && row.pts > 0;
        return (
          <div key={row.team}
            className={`st-row ${qualify ? 'st-row--q' : ''}`}
            style={qualify ? { '--gc': GROUP_COLORS[group] } : {}}>
            <span className="st-pos">{i + 1}</span>
            <span className="st-flag">{t?.flag}</span>
            <span className="st-emblem"><FAEmblem code={row.team} size={20} /></span>
            <span className="st-name">{t?.name}</span>
            <span>{row.p}</span><span>{row.w}</span><span>{row.d}</span><span>{row.l}</span>
            <span>{row.gf}</span><span>{row.ga}</span>
            <span>{gd > 0 ? '+' : ''}{gd}</span>
            <span className="st-pts">{row.pts}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function GroupPanel({ group, now, liveData }) {
  const [tab, setTab] = useState('matches');
  const color = GROUP_COLORS[group];
  const groupMatches = MATCHES.filter(m => m.group === group);

  return (
    <div className="group-panel" style={{ '--gc': color }}>
      <div className="gp-header">
        <div className="gp-label">
          <span className="gp-letter" style={{ color }}>GROUP {group}</span>
          <div className="gp-flags">
            {GROUP_TEAMS[group].map(code => (
              <span key={code} className="gp-flag-item" title={`${TEAMS[code]?.name} · ${FA_NAMES[code]}`}>
                <span>{TEAMS[code]?.flag}</span>
                <FAEmblem code={code} size={18} />
              </span>
            ))}
          </div>
        </div>
        <div className="gp-tabs">
          <button className={`gt-btn ${tab === 'matches' ? 'gt-btn--on' : ''}`}
            onClick={() => setTab('matches')} style={tab === 'matches' ? { color } : {}}>Matches</button>
          <button className={`gt-btn ${tab === 'table' ? 'gt-btn--on' : ''}`}
            onClick={() => setTab('table')} style={tab === 'table' ? { color } : {}}>Table</button>
        </div>
      </div>

      {tab === 'matches' ? (
        <div className="gp-matches">
          {groupMatches.map(m => (
            <MatchCard key={m.id} match={m} groupColor={color} now={now} liveData={liveData} />
          ))}
        </div>
      ) : (
        <StandingsTable group={group} liveData={liveData} />
      )}
    </div>
  );
}
