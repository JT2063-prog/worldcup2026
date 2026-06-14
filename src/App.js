import React, { useState, useEffect } from 'react';
import { MATCHES, GROUPS, GROUP_COLORS, TEAMS } from './data';
import { useLiveScores, isLivePhase, isFinishedPhase, phaseLabel } from './useLiveScores';
import Groups from './Groups';
import MyTeams from './MyTeams';
import Bracket from './Bracket';
import GoldenBoot from './GoldenBoot';
import './App.css';

// ── MATCH DETAIL PANEL ──
function MatchDetail({ match, liveData, onClose }) {
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
  const color = GROUP_COLORS[match.group];

  // Prefer live goals (from API) over static goals (from data.js)
  const allGoals = (live?.goals?.length > 0 ? live.goals : match.goals) || [];
  const homeGoals = allGoals.filter(g => g.team === match.home);
  const awayGoals = allGoals.filter(g => g.team === match.away);

  const aestFull = match.kickoffAEST.toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney',
    weekday: 'short', day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit', hour12: false
  });

  return (
    <div className="md-overlay" onClick={onClose}>
      <div className="md-panel" onClick={e => e.stopPropagation()}>
        <button className="md-close" onClick={onClose}>✕</button>

        {/* Group tag */}
        <div className="md-group-tag" style={{ color }}>GROUP {match.group} · MD{match.matchday}</div>

        {/* Teams & score */}
        <div className="md-scoreboard">
          <div className="md-team">
            <span className="md-flag">{home?.flag}</span>
            <span className="md-tname">{home?.name}</span>
          </div>
          <div className="md-score-block">
            {isDone || isLive ? (
              <div className="md-score">{homeScore ?? '?'} – {awayScore ?? '?'}</div>
            ) : (
              <div className="md-time-big">
                {match.kickoffAEST.toLocaleString('en-AU', { timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit', hour12: false })}
              </div>
            )}
            <div className={`md-status ${isLive ? 'md-status--live' : isDone ? 'md-status--ft' : ''}`}>
              {isLive ? `● ${phaseLabel(phase)}` : isDone ? 'Full Time' : 'AEST'}
            </div>
          </div>
          <div className="md-team md-team--right">
            <span className="md-tname">{away?.name}</span>
            <span className="md-flag">{away?.flag}</span>
          </div>
        </div>

        {/* Goal scorers */}
        {(homeGoals.length > 0 || awayGoals.length > 0) && (
          <div className="md-goals">
            <div className="md-goals-col">
              {homeGoals.map((g, i) => (
                <div key={i} className="md-goal-row md-goal-row--home">
                  <span className="md-goal-icon">⚽</span>
                  <span className="md-goal-text">
                    {g.player} {g.og ? '(OG)' : g.pen ? '(P)' : ''} {g.minute}'
                  </span>
                </div>
              ))}
            </div>
            <div className="md-goals-col md-goals-col--right">
              {awayGoals.map((g, i) => (
                <div key={i} className="md-goal-row md-goal-row--away">
                  <span className="md-goal-text">
                    {g.minute}' {g.player} {g.og ? '(OG)' : g.pen ? '(P)' : ''}
                  </span>
                  <span className="md-goal-icon">⚽</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Red cards */}
        {(match.homeRed > 0 || match.awayRed > 0) && (
          <div className="md-cards">
            {match.homeRed > 0 && <span>{home?.name} {'🟥'.repeat(match.homeRed)}</span>}
            {match.awayRed > 0 && <span>{away?.name} {'🟥'.repeat(match.awayRed)}</span>}
          </div>
        )}

        {/* Venue & date */}
        <div className="md-meta">
          <div>🏟 {match.venue}</div>
          <div>🕐 {aestFull} AEST</div>
        </div>
      </div>
    </div>
  );
}

// ── MATCH ROW ──
export function MatchRow({ match, liveData, onPress }) {
  const key = `${match.home}_${match.away}`;
  const live = liveData?.[key];
  const homeScore = live?.homeScore ?? match.homeScore;
  const awayScore = live?.awayScore ?? match.awayScore;
  const phase = live?.phase || (match.homeScore !== null ? 'FT' : 'PRE');
  const isLive = isLivePhase(phase);
  const isDone = homeScore !== null && !isLive;
  const home = TEAMS[match.home];
  const away = TEAMS[match.away];
  const color = GROUP_COLORS[match.group];
  const homeRed = live?.homeRed ?? match.homeRed ?? 0;
  const awayRed = live?.awayRed ?? match.awayRed ?? 0;
  const liveGoals = live?.goals || [];
  const allGoals = liveGoals.length > 0 ? liveGoals : (match.goals || []);
  const hasGoals = allGoals.length > 0;

  const aestTime = match.kickoffAEST.toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit', hour12: false
  });

  const homeGoalPlayers = allGoals.filter(g => g.team === match.home && !g.og).map(g => g.player.split(' ').pop());
  const awayGoalPlayers = allGoals.filter(g => g.team === match.away && !g.og).map(g => g.player.split(' ').pop());

  return (
    <div className={`match-row ${isLive ? 'match-row--live' : ''} ${(isDone || hasGoals) ? 'match-row--tappable' : ''}`}
      onClick={onPress}>
      {/* Left: time/status */}
      <div className="mr-left">
        {isLive ? (
          <span className="mr-badge mr-badge--live">● {phaseLabel(phase)}</span>
        ) : isDone ? (
          <span className="mr-badge mr-badge--ft">FT</span>
        ) : (
          <span className="mr-time">{aestTime}</span>
        )}
        <span className="mr-group" style={{ color }}>GRP {match.group}</span>
      </div>

      {/* Centre */}
      <div className="mr-centre">
        <div className="mr-team">
          <span className="mr-flag">{home?.flag}</span>
          <div className="mr-team-info">
            <span className={`mr-name ${isDone && homeScore > awayScore ? 'mr-name--win' : ''}`}>{home?.name}</span>
            {homeGoalPlayers.length > 0 && (
              <span className="mr-scorers">{homeGoalPlayers.join(', ')}</span>
            )}
          </div>
          {homeRed > 0 && <span className="mr-red">{'🟥'.repeat(Math.min(homeRed,2))}</span>}
        </div>
        <div className="mr-team">
          <span className="mr-flag">{away?.flag}</span>
          <div className="mr-team-info">
            <span className={`mr-name ${isDone && awayScore > homeScore ? 'mr-name--win' : ''}`}>{away?.name}</span>
            {awayGoalPlayers.length > 0 && (
              <span className="mr-scorers">{awayGoalPlayers.join(', ')}</span>
            )}
          </div>
          {awayRed > 0 && <span className="mr-red">{'🟥'.repeat(Math.min(awayRed,2))}</span>}
        </div>
      </div>

      {/* Right: score */}
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
function Schedule({ liveData, onMatchSelect }) {
  const [filter, setFilter] = useState('All');
  const now = new Date();
  const filters = ['All', 'Live', 'Today', 'Upcoming', 'Results'];
  const sorted = [...MATCHES].sort((a, b) => a.kickoffAEST - b.kickoffAEST);
  const todayStr = now.toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' });

  const filtered = sorted.filter(m => {
    const key = `${m.home}_${m.away}`;
    const live = liveData?.[key];
    const hs = live?.homeScore ?? m.homeScore;
    const phase = live?.phase || (hs !== null ? 'FT' : 'PRE');
    const isLive = isLivePhase(phase);
    const isDone = hs !== null && !isLive;
    const matchDay = m.kickoffAEST.toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' });
    if (filter === 'Live') return isLive;
    if (filter === 'Today') return matchDay === todayStr;
    if (filter === 'Upcoming') return !isDone && !isLive && m.kickoffAEST > now;
    if (filter === 'Results') return isDone;
    return true;
  });

  const byDate = {};
  filtered.forEach(m => {
    const d = m.kickoffAEST.toLocaleDateString('en-AU', {
      timeZone: 'Australia/Sydney', weekday: 'long', day: 'numeric', month: 'long'
    });
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(m);
  });

  return (
    <div className="schedule-view">
      <div className="filter-row">
        {filters.map(f => (
          <button key={f}
            className={`filter-pill ${filter === f ? 'filter-pill--on' : ''}`}
            onClick={() => setFilter(f)}>
            {f === 'Live' ? '● Live' : f}
          </button>
        ))}
      </div>
      {Object.keys(byDate).length === 0 ? (
        <div className="empty-state"><p>No matches for this filter</p></div>
      ) : (
        Object.entries(byDate).map(([date, matches]) => (
          <div key={date} className="date-section">
            <div className="date-header">{date}</div>
            <div className="match-list-card">
              {matches.map((m, i) => (
                <React.Fragment key={m.id}>
                  {i > 0 && <div className="match-divider" />}
                  <MatchRow match={m} liveData={liveData} onPress={() => onMatchSelect(m)} />
                </React.Fragment>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ── MAIN APP ──
export default function App() {
  const [tab, setTab] = useState('schedule');
  const [now, setNow] = useState(new Date());
  const [selectedMatch, setSelectedMatch] = useState(null);
  const { liveData, status, refetch } = useLiveScores();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const liveCount = Object.values(liveData).filter(d => isLivePhase(d.phase)).length;

  const statusLabel = { ok: '🟢', fetching: '🟡', error: '🔴', loading: '⚪' }[status] || '⚪';

  return (
    <div className="app">
      {selectedMatch && (
        <MatchDetail match={selectedMatch} liveData={liveData} onClose={() => setSelectedMatch(null)} />
      )}

      <header className="app-header">
        <div className="app-header-inner">
          <div>
            <h1 className="app-title">World Cup 2026</h1>
            <p className="app-sub">
              {now.toLocaleString('en-AU', {
                timeZone: 'Australia/Sydney',
                weekday: 'short', day: 'numeric', month: 'short',
                hour: '2-digit', minute: '2-digit', hour12: false
              })} AEST
            </p>
          </div>
          <div className="app-header-right">
            {liveCount > 0 && <span className="live-indicator">● {liveCount} Live</span>}
            <button className="status-btn" onClick={refetch}>{statusLabel} Live</button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {tab === 'schedule'  && <Schedule liveData={liveData} onMatchSelect={setSelectedMatch} />}
        {tab === 'groups'    && <Groups liveData={liveData} onMatchSelect={setSelectedMatch} />}
        {tab === 'bracket'   && <Bracket />}
        {tab === 'myteams'   && <MyTeams liveData={liveData} onMatchSelect={setSelectedMatch} />}
        {tab === 'golden'    && <GoldenBoot liveData={liveData} />}
      </main>

      <nav className="tab-bar">
        {[
          { id: 'schedule', icon: '📅', label: 'Schedule' },
          { id: 'groups',   icon: '⚽', label: 'Groups'   },
          { id: 'bracket',  icon: '🏆', label: 'Bracket'  },
          { id: 'myteams',  icon: '★',  label: 'My Teams' },
          { id: 'golden',   icon: '👟', label: 'Top Scorers' },
        ].map(t => (
          <button key={t.id}
            className={`tab-item ${tab === t.id ? 'tab-item--active' : ''}`}
            onClick={() => setTab(t.id)}>
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
