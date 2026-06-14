import React from 'react';
import { MATCHES, TEAMS } from './data';
import './GoldenBoot.css';

export function calcGoldenBoot() {
  const scorers = {};
  MATCHES.forEach(m => {
    (m.goals || []).forEach(g => {
      if (g.og) return; // exclude own goals
      const key = `${g.player}__${g.team}`;
      if (!scorers[key]) scorers[key] = { player: g.player, team: g.team, goals: 0, pens: 0, matches: new Set() };
      scorers[key].goals++;
      if (g.pen) scorers[key].pens++;
      scorers[key].matches.add(m.id);
    });
  });
  return Object.values(scorers)
    .sort((a, b) => b.goals - a.goals || a.pens - b.pens)
    .map(s => ({ ...s, matches: s.matches.size }));
}

export default function GoldenBoot() {
  const scorers = calcGoldenBoot();
  const top = scorers[0]?.goals || 0;

  return (
    <div className="gb-view">
      <div className="gb-header">
        <div className="gb-title-row">
          <span className="gb-boot">👟</span>
          <div>
            <h2 className="gb-title">Golden Boot</h2>
            <p className="gb-sub">Top goalscorers · 2026 World Cup</p>
          </div>
        </div>
      </div>

      {scorers.length === 0 ? (
        <div className="gb-empty">
          <p>No goals scored yet</p>
          <p>Check back after the first matches</p>
        </div>
      ) : (
        <div className="gb-list">
          {scorers.map((s, i) => {
            const t = TEAMS[s.team];
            const isTop = s.goals === top;
            const barWidth = Math.round((s.goals / top) * 100);
            return (
              <div key={`${s.player}__${s.team}`}
                className={`gb-row ${isTop && i === 0 ? 'gb-row--gold' : ''}`}>
                <span className="gb-rank">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                </span>
                <span className="gb-flag">{t?.flag}</span>
                <div className="gb-info">
                  <div className="gb-name-row">
                    <span className="gb-player">{s.player}</span>
                    {s.pens > 0 && <span className="gb-pen-tag">{s.pens}P</span>}
                  </div>
                  <div className="gb-bar-wrap">
                    <div className="gb-bar" style={{ width: `${barWidth}%` }} />
                  </div>
                  <span className="gb-nation">{t?.name}</span>
                </div>
                <div className="gb-goals">
                  <span className="gb-goals-num">{s.goals}</span>
                  <span className="gb-goals-label">goal{s.goals !== 1 ? 's' : ''}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="gb-note">
        <p>P = penalty goal · Own goals not counted · Updated after each match</p>
      </div>
    </div>
  );
}
