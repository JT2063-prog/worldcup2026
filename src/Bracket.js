import React, { useState } from 'react';
import { TEAMS } from './data';
import { KNOCKOUT_MATCHES } from './knockoutData';
import './Bracket.css';

const ET_TO_AEST = (dateStr, timeStr) => {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  const utcMs = Date.UTC(y, mo - 1, d, h + 5, mi);
  return new Date(utcMs + 10 * 3600 * 1000);
};

const ROUND_ORDER = ['r32', 'r16', 'qf', 'sf', 'f'];
const ROUND_NAMES = {
  r32: 'Round of 32', r16: 'Round of 16',
  qf: 'Quarter-finals', sf: 'Semi-finals',
  '3p': '3rd Place', f: '🏆 Final',
};
const ROUND_COLORS = {
  r32: '#3498db', r16: '#9b59b6', qf: '#e67e22',
  sf: '#e74c3c', '3p': '#7f8c8d', f: '#c9a84c',
};

function TeamSlot({ code, label, score, isWinner }) {
  const t = code && code !== 'TBD' ? TEAMS[code] : null;
  return (
    <div className={`bs-team ${isWinner ? 'bs-team--win' : ''} ${!t ? 'bs-team--tbd' : ''}`}>
      <span className="bs-flag">{t ? t.flag : '🏳️'}</span>
      <span className="bs-name">{t ? t.name : (label || 'TBD')}</span>
      <span className="bs-score">{score !== null && score !== undefined ? score : ''}</span>
    </div>
  );
}

function BracketMatch({ match }) {
  const aest = ET_TO_AEST(match.date, match.timeET);
  const dateStr = aest.toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney',
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  const hasScore = match.homeScore !== null;
  const homeWin = hasScore && match.homeScore > match.awayScore;
  const awayWin = hasScore && match.awayScore > match.homeScore;
  const color = ROUND_COLORS[match.round] || '#c9a84c';

  return (
    <div className="bm" style={{ '--rc': color }}>
      <div className="bm-date">{dateStr} AEST</div>
      <TeamSlot code={match.home} label={match.homeLabel} score={match.homeScore} isWinner={homeWin} />
      <div className="bm-divider" />
      <TeamSlot code={match.away} label={match.awayLabel} score={match.awayScore} isWinner={awayWin} />
    </div>
  );
}

export default function Bracket() {
  const [activeRound, setActiveRound] = useState('r32');

  const rounds = [...ROUND_ORDER, '3p'];
  const roundMatches = KNOCKOUT_MATCHES.filter(m => m.round === activeRound);

  return (
    <div className="bracket">
      {/* Round tabs */}
      <div className="bracket-tabs">
        {rounds.map(r => (
          <button
            key={r}
            className={`br-tab ${activeRound === r ? 'br-tab--on' : ''}`}
            onClick={() => setActiveRound(r)}
            style={activeRound === r ? { '--rc': ROUND_COLORS[r] || '#c9a84c' } : {}}
          >
            {ROUND_NAMES[r]}
          </button>
        ))}
      </div>

      {/* Matches grid */}
      <div className="bracket-grid">
        {roundMatches.length === 0 ? (
          <div className="bracket-empty">
            <p>Matches for this round are not yet scheduled.</p>
            <p>Check back after the group stage ends on 27 June.</p>
          </div>
        ) : (
          roundMatches.map(m => <BracketMatch key={m.id} match={m} />)
        )}
      </div>

      {/* Finals special layout */}
      {activeRound === 'f' && (
        <div className="final-banner">
          <span>🏆</span>
          <span>FIFA World Cup 2026 Final · 19 July · New York/New Jersey Stadium</span>
          <span>🏆</span>
        </div>
      )}
    </div>
  );
}
