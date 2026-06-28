import React, { useState } from 'react';
import { TEAMS } from './data';
import { KNOCKOUT_MATCHES } from './knockoutData';
import './PathToFinal.css';

// The 4 quarters of the draw — each is self-contained until the semis.
// Quarter 1: R32-1..4 -> R16-1,2 -> QF-1 -> feeds SF-1
// Quarter 2: R32-5..8 -> R16-3,4 -> QF-2 -> feeds SF-1
// Quarter 3: R32-9..12 -> R16-5,6 -> QF-3 -> feeds SF-2
// Quarter 4: R32-13..16 -> R16-7,8 -> QF-4 -> feeds SF-2
const QUARTERS = [
  { id: 'Q1', label: 'Quarter 1', accent: '#1a56db', r32: ['R32-1','R32-2','R32-3','R32-4'], r16: ['R16-1','R16-2'], qf: ['QF-1'] },
  { id: 'Q2', label: 'Quarter 2', accent: '#0f9d58', r32: ['R32-5','R32-6','R32-7','R32-8'], r16: ['R16-3','R16-4'], qf: ['QF-2'] },
  { id: 'Q3', label: 'Quarter 3', accent: '#d97706', r32: ['R32-9','R32-10','R32-11','R32-12'], r16: ['R16-5','R16-6'], qf: ['QF-3'] },
  { id: 'Q4', label: 'Quarter 4', accent: '#dc2626', r32: ['R32-13','R32-14','R32-15','R32-16'], r16: ['R16-7','R16-8'], qf: ['QF-4'] },
];

function buildResolvedMatches(liveData) {
  const byId = {};
  KNOCKOUT_MATCHES.forEach(m => {
    const key = `${m.home}_${m.away}`;
    const live = liveData?.[key];
    byId[m.id] = {
      ...m,
      homeScore: live?.homeScore ?? m.homeScore,
      awayScore: live?.awayScore ?? m.awayScore,
    };
  });
  return byId;
}

function resolveSlot(match, side, byId, depth = 0) {
  if (depth > 6) return null;
  const directCode = side === 'home' ? match.home : match.away;
  if (directCode && directCode !== 'TBD') return directCode;

  const label = side === 'home' ? match.homeLabel : match.awayLabel;
  if (!label) return null;

  const refId = (label.match(/R32-\d+|R16-\d+|QF-\d+|SF-\d+/) || [])[0];
  if (!refId) return null;
  const ref = byId[refId];
  if (!ref) return null;

  const wantsWinner = label.startsWith('W ');
  if (ref.homeScore === null || ref.awayScore === null) return null;

  const refWinner = ref.homeScore > ref.awayScore ? ref.home : ref.away;
  const refLoser = ref.homeScore > ref.awayScore ? ref.away : ref.home;
  return wantsWinner ? refWinner : refLoser;
}

function TeamPill({ code, isWinner, isLive }) {
  const t = code ? TEAMS[code] : null;
  return (
    <div className={`ptf-pill ${isWinner ? 'ptf-pill--win' : ''} ${!code ? 'ptf-pill--pending' : ''}`}>
      <span className="ptf-flag">{t ? t.flag : '❔'}</span>
      <span className="ptf-name">{t ? t.name : 'TBD'}</span>
      {isLive && <span className="ptf-live-dot">●</span>}
    </div>
  );
}

function MatchBox({ matchId, byId, accent }) {
  const m = byId[matchId];
  if (!m) return null;
  const homeCode = resolveSlot(m, 'home', byId);
  const awayCode = resolveSlot(m, 'away', byId);
  const hasScore = m.homeScore !== null && m.awayScore !== null;
  const homeWin = hasScore && m.homeScore > m.awayScore;
  const awayWin = hasScore && m.awayScore > m.homeScore;

  return (
    <div className="ptf-match" style={{ '--ac': accent }}>
      <div className="ptf-match-row">
        <TeamPill code={homeCode} isWinner={homeWin} />
        {hasScore && <span className="ptf-score">{m.homeScore}</span>}
      </div>
      <div className="ptf-match-row">
        <TeamPill code={awayCode} isWinner={awayWin} />
        {hasScore && <span className="ptf-score">{m.awayScore}</span>}
      </div>
    </div>
  );
}

function QuarterBracket({ quarter, byId }) {
  return (
    <div className="ptf-quarter" style={{ '--ac': quarter.accent }}>
      <div className="ptf-quarter-label">{quarter.label}</div>
      <div className="ptf-quarter-rounds">
        <div className="ptf-mini-col">
          <div className="ptf-mini-title">R32</div>
          <div className="ptf-mini-matches ptf-mini-matches--r32">
            {quarter.r32.map(id => <MatchBox key={id} matchId={id} byId={byId} accent={quarter.accent} />)}
          </div>
        </div>
        <div className="ptf-mini-col">
          <div className="ptf-mini-title">R16</div>
          <div className="ptf-mini-matches ptf-mini-matches--r16">
            {quarter.r16.map(id => <MatchBox key={id} matchId={id} byId={byId} accent={quarter.accent} />)}
          </div>
        </div>
        <div className="ptf-mini-col">
          <div className="ptf-mini-title">QF</div>
          <div className="ptf-mini-matches ptf-mini-matches--qf">
            {quarter.qf.map(id => <MatchBox key={id} matchId={id} byId={byId} accent={quarter.accent} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PathToFinal({ liveData }) {
  const byId = buildResolvedMatches(liveData);
  const [activeQ, setActiveQ] = useState('Q1');

  const sf = KNOCKOUT_MATCHES.filter(m => m.round === 'sf');
  const fin = KNOCKOUT_MATCHES.filter(m => m.round === 'f')[0];

  const finalResolved = fin ? byId[fin.id] : null;
  const champion = finalResolved && finalResolved.homeScore !== null && finalResolved.awayScore !== null
    ? (finalResolved.homeScore > finalResolved.awayScore
        ? resolveSlot(fin, 'home', byId)
        : resolveSlot(fin, 'away', byId))
    : null;

  return (
    <div className="ptf-view">
      {/* Quarter selector */}
      <div className="ptf-q-tabs">
        {QUARTERS.map(q => (
          <button key={q.id}
            className={`ptf-q-tab ${activeQ === q.id ? 'ptf-q-tab--on' : ''}`}
            style={activeQ === q.id ? { '--ac': q.accent } : {}}
            onClick={() => setActiveQ(q.id)}>
            {q.label}
          </button>
        ))}
      </div>

      {/* Active quarter bracket */}
      <QuarterBracket quarter={QUARTERS.find(q => q.id === activeQ)} byId={byId} />

      {/* Convergence: semis + final */}
      <div className="ptf-converge-label">Semi-finals converge here</div>
      <div className="ptf-sf-row">
        <div className="ptf-sf-item">
          <div className="ptf-sf-tag" style={{ color: '#1a56db' }}>Q1 + Q2 winners</div>
          <MatchBox matchId="SF-1" byId={byId} accent="#dc2626" />
        </div>
        <div className="ptf-sf-item">
          <div className="ptf-sf-tag" style={{ color: '#d97706' }}>Q3 + Q4 winners</div>
          <MatchBox matchId="SF-2" byId={byId} accent="#dc2626" />
        </div>
      </div>

      <div className="ptf-final-wrap">
        <div className="ptf-converge-label">Final</div>
        <MatchBox matchId="F-1" byId={byId} accent="#d97706" />
      </div>

      {champion && (
        <div className="ptf-champion">
          🏆 <span className="ptf-flag">{TEAMS[champion]?.flag}</span> {TEAMS[champion]?.name} are 2026 World Cup Champions!
        </div>
      )}

      <p className="ptf-note">Each quarter plays out independently until the semis · auto-updates as results confirm</p>
    </div>
  );
}
