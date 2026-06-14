import React, { useState } from 'react';
import { TEAMS } from './data';
import { KNOCKOUT_MATCHES } from './knockoutData';
import './Bracket.css';

const toAEST = (d, t) => {
  const [y,mo,day] = d.split('-').map(Number);
  const [h,mi] = t.split(':').map(Number);
  return new Date(Date.UTC(y,mo-1,day,h+4,mi));
};

const ROUNDS = ['r32','r16','qf','sf','f'];
const ROUND_NAMES = { r32:'Round of 32', r16:'Round of 16', qf:'Quarter-finals', sf:'Semi-finals', '3p':'3rd Place', f:'Final' };
const ROUND_COLORS = { r32:'#1a56db', r16:'#7c3aed', qf:'#d97706', sf:'#dc2626', '3p':'#6b7280', f:'#d97706' };

function TeamSlot({ code, label, score, win }) {
  const t = code && code !== 'TBD' ? TEAMS[code] : null;
  return (
    <div className={`bs-row ${win ? 'bs-row--win' : ''} ${!t ? 'bs-row--tbd' : ''}`}>
      <span className="bs-flag">{t ? t.flag : '🏳️'}</span>
      <span className="bs-name">{t ? t.name : (label || 'TBD')}</span>
      {score !== null && score !== undefined && (
        <span className={`bs-score ${win ? 'bs-score--win' : ''}`}>{score}</span>
      )}
    </div>
  );
}

export default function Bracket() {
  const [round, setRound] = useState('r32');
  const all = [...ROUNDS, '3p'];
  const matches = KNOCKOUT_MATCHES.filter(m => m.round === round);

  return (
    <div className="bracket-view">
      {/* Round tabs */}
      <div className="br-tabs">
        {all.map(r => (
          <button key={r}
            className={`br-pill ${round === r ? 'br-pill--on' : ''}`}
            style={round === r ? { '--rc': ROUND_COLORS[r] } : {}}
            onClick={() => setRound(r)}>
            {ROUND_NAMES[r]}
          </button>
        ))}
      </div>

      {/* Matches */}
      <div className="br-list">
        {matches.length === 0 ? (
          <div className="br-empty">
            <p>Matches confirmed after group stage</p>
            <p>Check back from 28 June</p>
          </div>
        ) : (
          matches.map(m => {
            const aest = toAEST(m.date, m.timeET);
            const dateStr = aest.toLocaleString('en-AU', {
              timeZone: 'Australia/Sydney',
              weekday: 'short', day: 'numeric', month: 'short',
              hour: '2-digit', minute: '2-digit', hour12: false
            });
            const hs = m.homeScore, as = m.awayScore;
            const hWin = hs !== null && hs > as;
            const aWin = as !== null && as > hs;
            const color = ROUND_COLORS[m.round];
            return (
              <div key={m.id} className="br-card" style={{ '--rc': color }}>
                <div className="br-card-date">{dateStr} AEST</div>
                <TeamSlot code={m.home} label={m.homeLabel} score={hs} win={hWin} />
                <div className="br-card-divider" />
                <TeamSlot code={m.away} label={m.awayLabel} score={as} win={aWin} />
              </div>
            );
          })
        )}
      </div>

      {round === 'f' && (
        <div className="br-final-note">🏆 FIFA World Cup 2026 Final — 19 July 2026</div>
      )}
    </div>
  );
}
