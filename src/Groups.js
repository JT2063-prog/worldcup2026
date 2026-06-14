import React, { useState } from 'react';
import { MATCHES, TEAMS, GROUP_TEAMS, GROUP_COLORS, GROUPS, calcStandings } from './data';
import { MatchRow } from './App';
import './Groups.css';

export default function Groups({ liveData, onMatchSelect }) {
  const [activeGroup, setActiveGroup] = useState('A');
  const [tab, setTab] = useState('matches');

  const color = GROUP_COLORS[activeGroup];
  const groupMatches = MATCHES
    .filter(m => m.group === activeGroup)
    .sort((a, b) => a.kickoffAEST - b.kickoffAEST);
  const standings = calcStandings(activeGroup, liveData);

  return (
    <div className="groups-view">
      {/* Group selector */}
      <div className="group-selector">
        {GROUPS.map(g => (
          <button key={g}
            className={`gs-btn ${activeGroup === g ? 'gs-btn--active' : ''}`}
            style={activeGroup === g ? { '--gc': GROUP_COLORS[g] } : {}}
            onClick={() => setActiveGroup(g)}>
            {g}
          </button>
        ))}
      </div>

      {/* Group header */}
      <div className="group-hero" style={{ borderColor: color }}>
        <div className="gh-title">
          <span className="gh-label" style={{ color }}>Group {activeGroup}</span>
          <div className="gh-flags">
            {GROUP_TEAMS[activeGroup].map(code => (
              <span key={code} className="gh-flag" title={TEAMS[code]?.name}>
                {TEAMS[code]?.flag}
              </span>
            ))}
          </div>
        </div>

        {/* Matches / Table tabs */}
        <div className="gh-tabs">
          <button className={`gh-tab ${tab === 'matches' ? 'gh-tab--on' : ''}`}
            style={tab === 'matches' ? { color, borderColor: color } : {}}
            onClick={() => setTab('matches')}>Matches</button>
          <button className={`gh-tab ${tab === 'table' ? 'gh-tab--on' : ''}`}
            style={tab === 'table' ? { color, borderColor: color } : {}}
            onClick={() => setTab('table')}>Table</button>
        </div>
      </div>

      {/* Content */}
      <div className="group-content">
        {tab === 'matches' ? (
          <div className="match-list-card" style={{ margin: '16px 20px 0' }}>
            {groupMatches.map((m, i) => (
              <React.Fragment key={m.id}>
                {i > 0 && <div className="match-divider" />}
                <MatchRow match={m} liveData={liveData} onPress={() => onMatchSelect && onMatchSelect(m)} />
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="standings-card">
            <div className="st-head-row">
              <span className="st-h-team">Team</span>
              <span>P</span><span>W</span><span>D</span><span>L</span>
              <span>GD</span><span className="st-h-pts">PTS</span>
            </div>
            {standings.map((row, i) => {
              const t = TEAMS[row.team];
              const gd = row.gf - row.ga;
              const qualify = i < 2 && row.pts > 0;
              return (
                <div key={row.team}
                  className={`st-row ${qualify ? 'st-row--q' : ''}`}
                  style={qualify ? { '--gc': color } : {}}>
                  <span className="st-pos">{i + 1}</span>
                  <span className="st-flag">{t?.flag}</span>
                  <span className="st-name">{t?.name}</span>
                  <span>{row.p}</span><span>{row.w}</span>
                  <span>{row.d}</span><span>{row.l}</span>
                  <span>{gd > 0 ? '+' : ''}{gd}</span>
                  <span className="st-pts">{row.pts}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
