import React, { useState, useEffect } from 'react';
import { MATCHES, GROUP_COLORS, TEAMS } from './data';
import { KNOCKOUT_MATCHES } from './knockoutData';
import { useLiveScores, isLivePhase, phaseLabel } from './useLiveScores';
import { getTimeMode, setTimeMode, fmtTime, fmtDateLong, fmtDateTime, modeLabel } from './timeUtils';
import Groups from './Groups';
import MyTeams from './MyTeams';
import Bracket from './Bracket';
import GoldenBoot from './GoldenBoot';
import './App.css';

// ── MATCH DETAIL PANEL ──
function MatchDetail({ match, liveData, onClose, timeMode }) {
  if (!match) return null;
  const home = TEAMS[match.home];
  const away = TEAMS[match.away];
  const key = `${match.home}_${match.away}`;
  const live = liveData?.[key];
  const homeScore = live?.homeScore ?? match.homeScore;
  const awayScore = live?.awayScore ?? match.awayScore;
  const phase = live?.phase || (match.homeScore !== null ? 'FT' : 'PRE');
  const isLive = isLivePhase(phase);
  const isDone = homeScore !== null && !isLive;
  const color = match.group ? GROUP_COLORS[match.group] : '#7c3aed';

  const staticGoalsList = match.goals || [];
  const liveGoalsList = live?.goals || [];
  const allGoals = staticGoalsList.length > 0 ? staticGoalsList : liveGoalsList;
  const homeGoals = allGoals.filter(g => g.team === match.home);
  const awayGoals = allGoals.filter(g => g.team === match.away);

  return (
    <div className="md-overlay" onClick={onClose}>
      <div className="md-panel" onClick={e => e.stopPropagation()}>
        <button className="md-close" onClick={onClose}>✕</button>
        <div className="md-group-tag" style={{ color }}>
          {match.group ? `GROUP ${match.group} · MD${match.matchday}` : match.roundLabel}
        </div>

        <div className="md-scoreboard">
          <div className="md-team">
            <span className="md-flag">{home?.flag}</span>
            <span className="md-tname">{home?.name}</span>
          </div>
          <div className="md-score-block">
            {isDone || isLive ? (
              <div className="md-score">{homeScore ?? '?'} – {awayScore ?? '?'}</div>
            ) : (
              <div className="md-time-big">{fmtTime(match.kickoffUTC, timeMode)}</div>
            )}
            <div className={`md-status ${isLive ? 'md-status--live' : isDone ? 'md-status--ft' : ''}`}>
              {isLive ? `● ${phaseLabel(phase)}` : isDone ? 'Full Time' : modeLabel(timeMode)}
            </div>
          </div>
          <div className="md-team md-team--right">
            <span className="md-tname">{away?.name}</span>
            <span className="md-flag">{away?.flag}</span>
          </div>
        </div>

        {(homeGoals.length > 0 || awayGoals.length > 0) && (
          <div className="md-goals">
            <div className="md-goals-col">
              {homeGoals.map((g, i) => (
                <div key={i} className="md-goal-row md-goal-row--home">
                  <span className="md-goal-icon">⚽</span>
                  <span className="md-goal-text">{g.player} {g.og ? '(OG)' : g.pen ? '(P)' : ''} {g.minute}'</span>
                </div>
              ))}
            </div>
            <div className="md-goals-col md-goals-col--right">
              {awayGoals.map((g, i) => (
                <div key={i} className="md-goal-row md-goal-row--away">
                  <span className="md-goal-text">{g.minute}' {g.player} {g.og ? '(OG)' : g.pen ? '(P)' : ''}</span>
                  <span className="md-goal-icon">⚽</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(match.homeRed > 0 || match.awayRed > 0) && (
          <div className="md-cards">
            {match.homeRed > 0 && <span>{home?.name} {'🟥'.repeat(match.homeRed)}</span>}
            {match.awayRed > 0 && <span>{away?.name} {'🟥'.repeat(match.awayRed)}</span>}
          </div>
        )}

        <div className="md-meta">
          <div>🏟 {match.venue}</div>
          <div>🕐 {fmtDateTime(match.kickoffUTC, timeMode)} {modeLabel(timeMode)}</div>
        </div>
      </div>
    </div>
  );
}

// ── MATCH ROW ──
export function MatchRow({ match, liveData, onPress, timeMode }) {
  const key = `${match.home}_${match.away}`;
  const live = liveData?.[key];
  const homeScore = live?.homeScore ?? match.homeScore;
  const awayScore = live?.awayScore ?? match.awayScore;
  const phase = live?.phase || (match.homeScore !== null ? 'FT' : 'PRE');
  const isLive = isLivePhase(phase);
  const isDone = homeScore !== null && !isLive;
  const home = TEAMS[match.home];
  const away = TEAMS[match.away];
  const color = match.group ? GROUP_COLORS[match.group] : '#7c3aed';
  const homeRed = live?.homeRed ?? match.homeRed ?? 0;
  const awayRed = live?.awayRed ?? match.awayRed ?? 0;

  const liveGoals = live?.goals || [];
  const staticGoals = match.goals || [];
  const allGoals = staticGoals.length > 0 ? staticGoals : liveGoals;
  const hasGoals = allGoals.length > 0;

  const homeGoalPlayers = allGoals.filter(g => g.team === match.home && !g.og).map(g => g.player.split(' ').pop());
  const awayGoalPlayers = allGoals.filter(g => g.team === match.away && !g.og).map(g => g.player.split(' ').pop());

  return (
    <div className={`match-row ${isLive ? 'match-row--live' : ''} ${(isDone || hasGoals) ? 'match-row--tappable' : ''}`}
      onClick={onPress}>
      <div className="mr-left">
        {isLive ? (
          <span className="mr-badge mr-badge--live">● {phaseLabel(phase)}</span>
        ) : isDone ? (
          <span className="mr-badge mr-badge--ft">FT</span>
        ) : (
          <span className="mr-time">{fmtTime(match.kickoffUTC, timeMode)}</span>
        )}
        <span className="mr-group" style={{ color }}>{match.group ? `GRP ${match.group}` : match.roundLabel}</span>
      </div>

      <div className="mr-centre">
        <div className="mr-team">
          <span className="mr-flag">{home?.flag}</span>
          <div className="mr-team-info">
            <span className={`mr-name ${isDone && homeScore > awayScore ? 'mr-name--win' : ''}`}>{home?.name}</span>
            {homeGoalPlayers.length > 0 && <span className="mr-scorers">{homeGoalPlayers.join(', ')}</span>}
          </div>
          {homeRed > 0 && <span className="mr-red">{'🟥'.repeat(Math.min(homeRed,2))}</span>}
        </div>
        <div className="mr-team">
          <span className="mr-flag">{away?.flag}</span>
          <div className="mr-team-info">
            <span className={`mr-name ${isDone && awayScore > homeScore ? 'mr-name--win' : ''}`}>{away?.name}</span>
            {awayGoalPlayers.length > 0 && <span className="mr-scorers">{awayGoalPlayers.join(', ')}</span>}
          </div>
          {awayRed > 0 && <span className="mr-red">{'🟥'.repeat(Math.min(awayRed,2))}</span>}
        </div>
      </div>

      <div className="mr-right">
        {homeScore !== null || isLive ? (
          <>
            <span className={`mr-score ${isDone && homeScore > awayScore ? 'mr-score--win' : ''}`}>{homeScore ?? '?'}</span>
            <span className={`mr-score ${isDone && awayScore > homeScore ? 'mr-score--win' : ''}`}>{awayScore ?? '?'}</span>
          </>
        ) : (
          <>
            <span className="mr-score mr-score--dash">–</span>
            <span className="mr-score mr-score--dash">–</span>
          </>
        )}
        {(isDone || hasGoals) && <span className="mr-chevron">›</span>}
      </div>
    </div>
  );
}

// ── SCHEDULE VIEW ──
function Schedule({ liveData, onMatchSelect, timeMode }) {
  const now = new Date();
  const todayStr = now.toLocaleDateString('en-AU', { timeZone: timeMode === 'AEST' ? 'Australia/Sydney' : undefined });

  const ROUND_LABELS = { r32: 'ROUND OF 32', r16: 'ROUND OF 16', qf: 'QUARTER-FINAL', sf: 'SEMI-FINAL', '3p': '3RD PLACE', f: 'FINAL' };
  const knockoutAsMatches = KNOCKOUT_MATCHES
    .filter(m => m.home !== 'TBD' && m.away !== 'TBD')
    .map(m => ({
      ...m,
      group: null,
      roundLabel: ROUND_LABELS[m.round] || m.round.toUpperCase(),
      matchday: null,
      goals: m.goals || [],
      homeRed: m.homeRed || 0,
      awayRed: m.awayRed || 0,
    }));

  const sorted = [...MATCHES, ...knockoutAsMatches].sort((a, b) => a.kickoffUTC - b.kickoffUTC);

  const hasTodayGames = sorted.some(m =>
    m.kickoffUTC.toLocaleDateString('en-AU', { timeZone: timeMode === 'AEST' ? 'Australia/Sydney' : undefined }) === todayStr
  );
  const hasLiveGames = sorted.some(m => {
    const key = `${m.home}_${m.away}`;
    return isLivePhase(liveData?.[key]?.phase);
  });
  const defaultFilter = hasLiveGames ? 'Live' : hasTodayGames ? 'Today' : 'Results';
  const [filter, setFilter] = useState(defaultFilter);
  const filters = ['All', 'Live', 'Today', 'Upcoming', 'Results'];

  const filtered = sorted.filter(m => {
    const key = `${m.home}_${m.away}`;
    const live = liveData?.[key];
    const hs = live?.homeScore ?? m.homeScore;
    const phase = live?.phase || (hs !== null ? 'FT' : 'PRE');
    const isLive = isLivePhase(phase);
    const isDone = hs !== null && !isLive;
    const matchDay = m.kickoffUTC.toLocaleDateString('en-AU', { timeZone: timeMode === 'AEST' ? 'Australia/Sydney' : undefined });
    if (filter === 'Live') return isLive;
    if (filter === 'Today') return matchDay === todayStr;
    if (filter === 'Upcoming') return !isDone && !isLive && m.kickoffUTC > now;
    if (filter === 'Results') return isDone;
    return true;
  });

  const byDate = {};
  filtered.forEach(m => {
    const d = fmtDateLong(m.kickoffUTC, timeMode);
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(m);
  });

  return (
    <div className="schedule-view">
      <div className="filter-row">
        {filters.map(f => (
          <button key={f} className={`filter-pill ${filter === f ? 'filter-pill--on' : ''}`} onClick={() => setFilter(f)}>
            {f === 'Live' ? '● Live' : f}
          </button>
        ))}
      </div>
      {Object.keys(byDate).length === 0 ? (
        <div className="empty-state"><p>No matches for this filter</p></div>
      ) : (
        <div className="schedule-grid">
          {Object.entries(byDate).map(([date, matches]) => (
            <div key={date} className="date-section">
              <div className="date-header">{date}</div>
              <div className="match-list-card">
                {matches.map((m, i) => (
                  <React.Fragment key={m.id}>
                    {i > 0 && <div className="match-divider" />}
                    <MatchRow match={m} liveData={liveData} onPress={() => onMatchSelect(m)} timeMode={timeMode} />
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──
export default function App() {
  const [tab, setTab] = useState('schedule');
  const [now, setNow] = useState(new Date());
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [timeMode, setTimeModeState] = useState(getTimeMode());
  const { liveData, status, refetch } = useLiveScores();
  const headerRef = React.useRef(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Keep CSS variables in sync with the header's real rendered height AND the
  // viewport orientation, so sticky rows beneath it never overlap content,
  // on any device, in either portrait or landscape.
  useEffect(() => {
    if (!headerRef.current) return;
    const setVars = () => {
      document.documentElement.style.setProperty('--header-h', `${headerRef.current.offsetHeight}px`);
      const isLandscape = window.innerWidth > window.innerHeight;
      document.documentElement.classList.toggle('is-landscape', isLandscape);
    };
    setVars();
    const ro = new ResizeObserver(setVars);
    ro.observe(headerRef.current);
    window.addEventListener('resize', setVars);
    window.addEventListener('orientationchange', setVars);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', setVars);
      window.removeEventListener('orientationchange', setVars);
    };
  }, [timeMode]);

  const toggleTimeMode = () => {
    const next = timeMode === 'AEST' ? 'LOCAL' : 'AEST';
    setTimeModeState(next);
    setTimeMode(next);
  };

  const liveCount = Object.values(liveData).filter(d => isLivePhase(d.phase)).length;
  const isOnline = status === 'ok';
  const statusClass = isOnline ? 'status-btn--online' : status === 'fetching' ? 'status-btn--checking' : 'status-btn--offline';
  const statusText = isOnline ? 'Online' : status === 'fetching' ? 'Checking…' : 'Offline';

  return (
    <div className="app">
      {selectedMatch && (
        <MatchDetail match={selectedMatch} liveData={liveData} onClose={() => setSelectedMatch(null)} timeMode={timeMode} />
      )}

      <header className="app-header" ref={headerRef}>
        <div className="app-header-inner">
          <div>
            <h1 className="app-title">World Cup 2026</h1>
            <p className="app-sub">{fmtDateTime(now, timeMode)} {modeLabel(timeMode)}</p>
          </div>
          <div className="app-header-right">
            {liveCount > 0 && <span className="live-indicator">● {liveCount} Live</span>}
            <button className={`status-btn ${statusClass}`} onClick={refetch}>
              <span className="status-dot" /> {statusText}
            </button>
            <button className="time-toggle-btn" onClick={toggleTimeMode} title="Switch time display">
              🌐 {timeMode === 'AEST' ? 'AEST' : 'Local'}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {tab === 'schedule' && <Schedule liveData={liveData} onMatchSelect={setSelectedMatch} timeMode={timeMode} />}
        {tab === 'groups'   && <Groups liveData={liveData} onMatchSelect={setSelectedMatch} timeMode={timeMode} />}
        {tab === 'bracket'  && <Bracket liveData={liveData} timeMode={timeMode} />}
        {tab === 'myteams'  && <MyTeams liveData={liveData} onMatchSelect={setSelectedMatch} timeMode={timeMode} />}
        {tab === 'golden'   && <GoldenBoot liveData={liveData} />}
      </main>

      <nav className="tab-bar">
        {[
          { id: 'schedule', icon: '📅', label: 'Schedule' },
          { id: 'groups',   icon: '⚽', label: 'Groups'   },
          { id: 'bracket',  icon: '🏆', label: 'Bracket'  },
          { id: 'myteams',  icon: '★',  label: 'My Teams' },
          { id: 'golden',   icon: '👟', label: 'Scorers'  },
        ].map(t => (
          <button key={t.id} className={`tab-item ${tab === t.id ? 'tab-item--active' : ''}`} onClick={() => setTab(t.id)}>
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
