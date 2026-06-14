import React, { useState, useEffect } from 'react';
import { MATCHES, GROUPS, GROUP_COLORS, TEAMS } from './data';
import { useLiveScores } from './useLiveScores';
import { isLivePhase, isFinishedPhase, phaseLabel } from './useLiveScores';
import Groups from './Groups';
import MyTeams from './MyTeams';
import Bracket from './Bracket';
import './App.css';

const LS_KEY = 'wc2026_api_key';

// ── MATCH ROW (transaction-list style) ──
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

  const aestTime = match.kickoffAEST.toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney',
    hour: '2-digit', minute: '2-digit', hour12: false
  });

  const homeRed = live?.homeRed ?? match.homeRed ?? 0;
  const awayRed = live?.awayRed ?? match.awayRed ?? 0;

  return (
    <div className={`match-row ${isLive ? 'match-row--live' : ''}`} onClick={onPress}>
      {/* Left: time / status */}
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

      {/* Centre: teams */}
      <div className="mr-centre">
        <div className="mr-team">
          <span className="mr-flag">{home?.flag}</span>
          <span className={`mr-name ${isDone && homeScore > awayScore ? 'mr-name--win' : ''}`}>{home?.name}</span>
          {homeRed > 0 && <span className="mr-red">{'🟥'.repeat(Math.min(homeRed,2))}</span>}
        </div>
        <div className="mr-team">
          <span className="mr-flag">{away?.flag}</span>
          <span className={`mr-name ${isDone && awayScore > homeScore ? 'mr-name--win' : ''}`}>{away?.name}</span>
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
      </div>
    </div>
  );
}

// ── SCHEDULE VIEW ──
function Schedule({ liveData }) {
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

  // Group by date
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
      {/* Filter pills */}
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
        <div className="empty-state">
          <p>No matches for this filter</p>
        </div>
      ) : (
        Object.entries(byDate).map(([date, matches]) => (
          <div key={date} className="date-section">
            <div className="date-header">{date}</div>
            <div className="match-list-card">
              {matches.map((m, i) => (
                <React.Fragment key={m.id}>
                  {i > 0 && <div className="match-divider" />}
                  <MatchRow match={m} liveData={liveData} />
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
  const [apiKey] = useState(() => localStorage.getItem(LS_KEY) || '');
  const { liveData, status } = useLiveScores(apiKey);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const liveCount = Object.values(liveData).filter(d => isLivePhase(d.phase)).length;

  return (
    <div className="app">
      {/* ── HEADER ── */}
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
            {liveCount > 0 && (
              <span className="live-indicator">● {liveCount} Live</span>
            )}
            <span className="api-status">{status === 'ok' ? '🟢' : status === 'no-key' ? '⚪' : '🟡'}</span>
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className="app-main">
        {tab === 'schedule' && <Schedule liveData={liveData} />}
        {tab === 'groups'   && <Groups liveData={liveData} />}
        {tab === 'bracket'  && <Bracket />}
        {tab === 'myteams'  && <MyTeams liveData={liveData} />}
      </main>

      {/* ── BOTTOM TABS ── */}
      <nav className="tab-bar">
        {[
          { id: 'schedule', icon: '📅', label: 'Schedule' },
          { id: 'groups',   icon: '⚽', label: 'Groups'   },
          { id: 'bracket',  icon: '🏆', label: 'Bracket'  },
          { id: 'myteams',  icon: '★',  label: 'My Teams' },
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
