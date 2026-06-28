import React, { useState } from 'react';
import { TEAMS } from './data';
import { KNOCKOUT_MATCHES } from './knockoutData';
import { isLivePhase, phaseLabel } from './useLiveScores';
import { fmtDateTime, modeLabel } from './timeUtils';
import './Bracket.css';

const ROUNDS = ['r32','r16','qf','sf','f'];
const ROUND_NAMES = { r32:'Round of 32', r16:'Round of 16', qf:'Quarter-finals', sf:'Semi-finals', '3p':'3rd Place', f:'Final' };
const ROUND_COLORS = { r32:'#1a56db', r16:'#7c3aed', qf:'#d97706', sf:'#dc2626', '3p':'#6b7280', f:'#d97706' };

function TeamSlot({ code, label, score, win, isLive }) {
  const t = code && code !== 'TBD' ? TEAMS[code] : null;
  return (
    <div className={`bs-row ${win ? 'bs-row--win' : ''} ${!t ? 'bs-row--tbd' : ''}`}>
      <span className="bs-flag">{t ? t.flag : '🏳️'}</span>
      <span className="bs-name">{t ? t.name : (label || 'TBD')}</span>
      {(score !== null && score !== undefined) && (
        <span className={`bs-score ${win ? 'bs-score--win' : ''} ${isLive ? 'bs-score--live' : ''}`}>{score}</span>
      )}
    </div>
  );
}

export default function Bracket({ liveData, timeMode }) {
  const [round, setRound] = useState('r32');
  const all = [...ROUNDS, '3p'];
  const matches = KNOCKOUT_MATCHES.filter(m => m.round === round);

  return (
    <div className="bracket-view">
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

      <div className="br-list">
        {matches.length === 0 ? (
          <div className="br-empty">
            <p>Matchups confirmed once earlier rounds finish</p>
          </div>
        ) : (
          matches.map(m => {
            const key = `${m.home}_${m.away}`;
            const live = liveData?.[key];
            const hs = live?.homeScore ?? m.homeScore;
            const as = live?.awayScore ?? m.awayScore;
            const phase = live?.phase || (hs !== null ? 'FT' : 'PRE');
            const isLive = isLivePhase(phase);
            const hWin = hs !== null && hs > as;
            const aWin = as !== null && as > hs;
            const color = ROUND_COLORS[m.round];
            return (
              <div key={m.id} className="br-card" style={{ '--rc': color }}>
                <div className="br-card-date">
                  {fmtDateTime(m.kickoffUTC, timeMode)} {modeLabel(timeMode)}
                  {isLive && <span className="br-live-tag"> · ● {phaseLabel(phase)}</span>}
                </div>
                <TeamSlot code={m.home} label={m.homeLabel} score={hs} win={hWin} isLive={isLive} />
                <div className="br-card-divider" />
                <TeamSlot code={m.away} label={m.awayLabel} score={as} win={aWin} isLive={isLive} />
              </div>
            );
          })
        )}
      </div>

      {round === 'f' && (
        <div className="br-final-note">🏆 FIFA World Cup 2026 Final — 19 July, MetLife Stadium</div>
      )}
    </div>
  );
}
