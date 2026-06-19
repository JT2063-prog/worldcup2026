import React, { useState } from 'react';
import { MATCHES, TEAMS, GROUP_COLORS } from './data';
import { isLivePhase, isFinishedPhase, phaseLabel } from './useLiveScores';
import './NextGames.css';

const FILTERS = ['All', 'Live', 'Today', 'Upcoming', 'Results'];

export default function NextGames({ liveData, onMatchClick, fullPage }) {
  const [filter, setFilter] = useState('All');
  const now = new Date();

  const sorted = [...MATCHES].sort((a, b) => a.kickoffAEST - b.kickoffAEST);

  const todayAEST = now.toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' });

  const filtered = sorted.filter(m => {
    const key = `${m.home}_${m.away}`;
    const live = liveData[key];
    const hs = live?.homeScore ?? m.homeScore;
    const phase = live?.phase || (hs !== null ? 'FT' : 'PRE');
    const isLive = isLivePhase(phase);
    const isDone = hs !== null && !isLive;
    const matchDate = m.kickoffAEST.toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' });
    const isToday = matchDate === todayAEST;

    if (filter === 'Live') return isLive;
    if (filter === 'Today') return isToday;
    if (filter === 'Upcoming') return !isDone && !isLive && m.kickoffAEST > now;
    if (filter === 'Results') return isDone;
    return true;
  });

  return (
    <div className="schedule">
      {/* Filter pills */}
      <div className="sch-filters">
        {FILTERS.map(f => (
          <button key={f}
            className={`sch-pill ${filter === f ? 'sch-pill--on' : ''}`}
            onClick={() => setFilter(f)}>
            {f === 'Live' ? '● Live' : f}
          </button>
        ))}
      </div>

      {/* Match list */}
      {filtered.length === 0 ? (
        <div className="sch-empty">
          <p>No matches for this filter right now.</p>
        </div>
      ) : (
        <div className="sch-list">
          {filtered.map((m, i) => {
            const key = `${m.home}_${m.away}`;
            const live = liveData[key];
            const homeScore = live?.homeScore ?? m.homeScore;
            const awayScore = live?.awayScore ?? m.awayScore;
            const phase = live?.phase || (m.homeScore !== null ? 'FT' : 'PRE');
            const isLive = isLivePhase(phase);
            const isDone = homeScore !== null && !isLive;
            const home = TEAMS[m.home];
            const away = TEAMS[m.away];
            const color = GROUP_COLORS[m.group];

            const aestDate = m.kickoffAEST.toLocaleDateString('en-AU', {
              timeZone: 'Australia/Sydney', weekday: 'short', day: 'numeric', month: 'short'
            });
            const aestTime = m.kickoffAEST.toLocaleTimeString('en-AU', {
              timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit', hour12: false
            });

            // Show date divider
            const prevDate = i > 0 ? filtered[i-1].kickoffAEST.toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' }) : null;
            const thisDate = m.kickoffAEST.toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' });
            const showDivider = thisDate !== prevDate;

            return (
              <React.Fragment key={m.id}>
                {showDivider && (
                  <div className="sch-date-divider">{aestDate}</div>
                )}
                <button
                  className={`sch-match ${isLive ? 'sch-match--live' : ''} ${isDone ? 'sch-match--done' : ''}`}
                  style={{ '--gc': color }}
                  onClick={() => onMatchClick && onMatchClick(m)}
                >
                  <div className="sch-group-tag" style={{ color }}>GRP {m.group}</div>

                  <div className="sch-row">
                    {/* Home */}
                    <div className="sch-team sch-team--home">
                      <span className="sch-flag">{home?.flag}</span>
                      <span className="sch-name">{home?.name}</span>
                    </div>

                    {/* Score / time */}
                    <div className="sch-middle">
                      {homeScore !== null || isLive ? (
                        <span className={`sch-score ${isLive ? 'sch-score--live' : ''}`}>
                          {homeScore ?? '?'} – {awayScore ?? '?'}
                        </span>
                      ) : (
                        <span className="sch-time">{aestTime}</span>
                      )}
                      {isLive && <span className="sch-live-dot">● {phaseLabel(phase)}</span>}
                      {isDone && <span className="sch-ft">FT</span>}
                    </div>

                    {/* Away */}
                    <div className="sch-team sch-team--away">
                      <span className="sch-name sch-name--r">{away?.name}</span>
                      <span className="sch-flag">{away?.flag}</span>
                    </div>
                  </div>

                  <div className="sch-venue">{m.venue}</div>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
