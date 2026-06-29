import React, { useState, useEffect } from 'react';
import { TEAMS } from './data';
import { KNOCKOUT_MATCHES } from './knockoutData';
import { fmtDateTime, fmtTime, modeLabel } from './timeUtils';
import './PathToFinal.css';

// The 4 quarters of the real FIFA draw — verified against the official match-number
// bracket tree (M73-M104). Each quarter is self-contained until the semis.
// Quarter A: R32-1,3,4,6 -> R16-1,2 -> QF-1 -> feeds SF-1 (top half)
// Quarter B: R32-9,10,11,12 -> R16-5,6 -> QF-2 -> feeds SF-1 (top half)
// Quarter C: R32-2,5,7,8 -> R16-3,4 -> QF-3 -> feeds SF-2 (bottom half)
// Quarter D: R32-13,14,15,16 -> R16-7,8 -> QF-4 -> feeds SF-2 (bottom half)
const QUARTERS = [
  { id: 'QA', label: 'Quarter A', accent: '#1a56db', r32: ['R32-1','R32-4','R32-3','R32-6'], r16: ['R16-2','R16-1'], qf: ['QF-1'] },
  { id: 'QB', label: 'Quarter B', accent: '#0f9d58', r32: ['R32-12','R32-11','R32-10','R32-9'], r16: ['R16-5','R16-6'], qf: ['QF-2'] },
  { id: 'QC', label: 'Quarter C', accent: '#d97706', r32: ['R32-5','R32-2','R32-7','R32-8'], r16: ['R16-3','R16-4'], qf: ['QF-3'] },
  { id: 'QD', label: 'Quarter D', accent: '#dc2626', r32: ['R32-13','R32-16','R32-15','R32-14'], r16: ['R16-8','R16-7'], qf: ['QF-4'] },
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

function useIsLandscape() {
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : false
  );
  useEffect(() => {
    const check = () => setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);
  return isLandscape;
}

function TeamPill({ code, isWinner, isLive, compact }) {
  const t = code ? TEAMS[code] : null;
  return (
    <div className={`ptf-pill ${isWinner ? 'ptf-pill--win' : ''} ${!code ? 'ptf-pill--pending' : ''} ${compact ? 'ptf-pill--compact' : ''}`}>
      <span className="ptf-flag">{t ? t.flag : '❔'}</span>
      <span className="ptf-name">{t ? t.name : 'TBD'}</span>
      {isLive && <span className="ptf-live-dot">●</span>}
    </div>
  );
}

function MatchBox({ matchId, byId, accent, timeMode, compact }) {
  const m = byId[matchId];
  if (!m) return null;
  const homeCode = resolveSlot(m, 'home', byId);
  const awayCode = resolveSlot(m, 'away', byId);
  const hasScore = m.homeScore !== null && m.awayScore !== null;
  const homeWin = hasScore && m.homeScore > m.awayScore;
  const awayWin = hasScore && m.awayScore > m.homeScore;

  return (
    <div className={`ptf-match ${compact ? 'ptf-match--compact' : ''}`} style={{ '--ac': accent }}>
      {!hasScore && m.kickoffUTC && (
        <div className="ptf-match-time">
          {compact ? fmtTime(m.kickoffUTC, timeMode) : `${fmtDateTime(m.kickoffUTC, timeMode)} ${modeLabel(timeMode)}`}
        </div>
      )}
      <div className="ptf-match-row">
        <TeamPill code={homeCode} isWinner={homeWin} compact={compact} />
        {hasScore && <span className="ptf-score">{m.homeScore}</span>}
      </div>
      <div className="ptf-match-row">
        <TeamPill code={awayCode} isWinner={awayWin} compact={compact} />
        {hasScore && <span className="ptf-score">{m.awayScore}</span>}
      </div>
    </div>
  );
}

function QuarterBracket({ quarter, byId, timeMode, compact, mirror }) {
  const cols = [
    <div className="ptf-mini-col" key="r32">
      <div className="ptf-mini-title">R32</div>
      <div className="ptf-mini-matches ptf-mini-matches--r32">
        {quarter.r32.map(id => <MatchBox key={id} matchId={id} byId={byId} accent={quarter.accent} timeMode={timeMode} compact={compact} />)}
      </div>
    </div>,
    <div className="ptf-mini-col" key="r16">
      <div className="ptf-mini-title">R16</div>
      <div className="ptf-mini-matches ptf-mini-matches--r16">
        {quarter.r16.map(id => <MatchBox key={id} matchId={id} byId={byId} accent={quarter.accent} timeMode={timeMode} compact={compact} />)}
      </div>
    </div>,
    <div className="ptf-mini-col" key="qf">
      <div className="ptf-mini-title">QF</div>
      <div className="ptf-mini-matches ptf-mini-matches--qf">
        {quarter.qf.map(id => <MatchBox key={id} matchId={id} byId={byId} accent={quarter.accent} timeMode={timeMode} compact={compact} />)}
      </div>
    </div>,
  ];

  return (
    <div className="ptf-quarter" style={{ '--ac': quarter.accent }}>
      <div className="ptf-quarter-label">{quarter.label}</div>
      <div className={`ptf-quarter-rounds ${mirror ? 'ptf-quarter-rounds--mirror' : ''}`}>
        {mirror ? cols.slice().reverse() : cols}
      </div>
    </div>
  );
}

// ── FULL BRACKET — all 4 quarters + semis + final visible at once.
// Used automatically in landscape to make use of the extra width.
function FullBracket({ byId, timeMode, champion }) {
  const qa = QUARTERS.find(q => q.id === 'QA');
  const qb = QUARTERS.find(q => q.id === 'QB');
  const qc = QUARTERS.find(q => q.id === 'QC');
  const qd = QUARTERS.find(q => q.id === 'QD');

  return (
    <div className="ptf-full">
      <div className="ptf-full-row ptf-full-row--top">
        <QuarterBracket quarter={qa} byId={byId} timeMode={timeMode} compact />
        <div className="ptf-full-converge">
          <div className="ptf-full-converge-label">SF 1</div>
          <MatchBox matchId="SF-1" byId={byId} accent="#dc2626" timeMode={timeMode} compact />
        </div>
        <QuarterBracket quarter={qb} byId={byId} timeMode={timeMode} compact mirror />
      </div>

      <div className="ptf-full-final">
        <div className="ptf-full-converge-label">Final</div>
        <MatchBox matchId="F-1" byId={byId} accent="#d97706" timeMode={timeMode} compact />
        {champion && (
          <div className="ptf-full-champion">
            🏆 {TEAMS[champion]?.flag} {TEAMS[champion]?.name}
          </div>
        )}
      </div>

      <div className="ptf-full-row ptf-full-row--bottom">
        <QuarterBracket quarter={qc} byId={byId} timeMode={timeMode} compact />
        <div className="ptf-full-converge">
          <div className="ptf-full-converge-label">SF 2</div>
          <MatchBox matchId="SF-2" byId={byId} accent="#dc2626" timeMode={timeMode} compact />
        </div>
        <QuarterBracket quarter={qd} byId={byId} timeMode={timeMode} compact mirror />
      </div>
    </div>
  );
}

export default function PathToFinal({ liveData, timeMode }) {
  const byId = buildResolvedMatches(liveData);
  const [activeQ, setActiveQ] = useState('QA');
  const isLandscape = useIsLandscape();

  const fin = KNOCKOUT_MATCHES.filter(m => m.round === 'f')[0];

  const finalResolved = fin ? byId[fin.id] : null;
  const champion = finalResolved && finalResolved.homeScore !== null && finalResolved.awayScore !== null
    ? (finalResolved.homeScore > finalResolved.awayScore
        ? resolveSlot(fin, 'home', byId)
        : resolveSlot(fin, 'away', byId))
    : null;

  // Landscape: show the complete bracket, all 4 quarters converging to the final, at once.
  if (isLandscape) {
    return (
      <div className="ptf-view ptf-view--landscape">
        <FullBracket byId={byId} timeMode={timeMode} champion={champion} />
        <p className="ptf-note">Full bracket view · rotate to portrait to focus on one quarter at a time</p>
      </div>
    );
  }

  // Portrait: one quarter at a time, with semis/final below.
  return (
    <div className="ptf-view">
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

      <QuarterBracket quarter={QUARTERS.find(q => q.id === activeQ)} byId={byId} timeMode={timeMode} />

      <div className="ptf-converge-label">Semi-finals converge here</div>
      <div className="ptf-sf-row">
        <div className="ptf-sf-item">
          <div className="ptf-sf-tag" style={{ color: '#1a56db' }}>Quarter A + Quarter B winners</div>
          <MatchBox matchId="SF-1" byId={byId} accent="#dc2626" timeMode={timeMode} />
        </div>
        <div className="ptf-sf-item">
          <div className="ptf-sf-tag" style={{ color: '#d97706' }}>Quarter C + Quarter D winners</div>
          <MatchBox matchId="SF-2" byId={byId} accent="#dc2626" timeMode={timeMode} />
        </div>
      </div>

      <div className="ptf-final-wrap">
        <div className="ptf-converge-label">Final</div>
        <MatchBox matchId="F-1" byId={byId} accent="#d97706" timeMode={timeMode} />
      </div>

      {champion && (
        <div className="ptf-champion">
          🏆 <span className="ptf-flag">{TEAMS[champion]?.flag}</span> {TEAMS[champion]?.name} are 2026 World Cup Champions!
        </div>
      )}

      <p className="ptf-note">Each quarter plays out independently until the semis · rotate for full bracket view</p>
    </div>
  );
}
