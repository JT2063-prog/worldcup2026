import React, { useState, useEffect } from 'react';
import { MATCHES, TEAMS, GROUP_COLORS } from './data';
import { calcGoldenBoot } from './GoldenBoot';
import { isLivePhase, isFinishedPhase, phaseLabel } from './useLiveScores';
import { saveTipper, loadTipper, loadAllTippers, countActiveSince } from './firebase';
import { fmtTime, fmtDateTime } from './timeUtils';
import './Tipping.css';

const LS_PREFIX = 'wc2026_tip_';
const RESULT_PTS = { correct: 3, draw: 1, exactScore: 2, goldenBoot: 5 };

function getResult(homeScore, awayScore) {
  if (homeScore === null || awayScore === null) return null;
  if (homeScore > awayScore) return 'H';
  if (awayScore > homeScore) return 'A';
  return 'D';
}

function load(key) {
  try { return JSON.parse(localStorage.getItem(LS_PREFIX + key)) || null; } catch { return null; }
}
function save(key, val) {
  try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(val)); } catch {}
}

function TipCard({ match, tip, onTip, liveData, disabled, timeMode }) {
  const home = TEAMS[match.home];
  const away = TEAMS[match.away];
  const color = GROUP_COLORS[match.group];
  const key = `${match.home}_${match.away}`;
  const live = liveData?.[key];
  const homeScore = live?.homeScore ?? match.homeScore;
  const awayScore = live?.awayScore ?? match.awayScore;

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const isDone = homeScore !== null;
  const phase = live?.phase || (isDone ? 'FT' : 'PRE');
  const isLive = isLivePhase(phase);
  const locked = disabled || isDone || isLive || now >= match.kickoffUTC;

  const actualResult = isDone ? getResult(homeScore, awayScore) : null;
  const tipResult = tip?.result || null;
  const tipHome = tip?.homeScore ?? '';
  const tipAway = tip?.awayScore ?? '';

  const correct = isDone && tipResult && actualResult === tipResult;
  const exactScore = correct && isDone && parseInt(tipHome) === homeScore && parseInt(tipAway) === awayScore;

  const pts = isDone && tipResult
    ? (exactScore ? RESULT_PTS.correct + RESULT_PTS.exactScore
      : correct ? (tipResult === 'D' ? RESULT_PTS.draw : RESULT_PTS.correct) : 0)
    : null;

  return (
    <div className={`tip-card ${locked ? 'tip-card--locked' : ''} ${correct ? 'tip-card--correct' : isDone && tipResult ? 'tip-card--wrong' : ''}`}
      style={{ '--gc': color }}>
      <div className="tip-card-meta">
        <span className="tip-group" style={{ color }}>GRP {match.group}</span>
        <span className="tip-kickoff">{fmtTime(match.kickoffUTC, timeMode)}</span>
        {locked && !isDone && <span className="tip-locked-badge">🔒 Locked</span>}
        {isDone && (
          <span className={`tip-pts-badge ${pts > 0 ? 'tip-pts-badge--scored' : 'tip-pts-badge--zero'}`}>
            {pts !== null ? `${pts > 0 ? '+' : ''}${pts} pts` : ''}
          </span>
        )}
      </div>

      <div className="tip-teams">
        <div className={`tip-team ${tipResult === 'H' ? 'tip-team--selected' : ''}`}
          onClick={() => !locked && onTip(match.id, 'H', tipHome, tipAway)}>
          <span className="tip-flag">{home?.flag}</span>
          <span className="tip-name">{home?.name}</span>
          {isDone && <span className="tip-actual-score">{homeScore}</span>}
        </div>

        <div className="tip-centre">
          <button className={`tip-draw-btn ${tipResult === 'D' ? 'tip-draw-btn--on' : ''}`}
            disabled={locked}
            onClick={() => !locked && onTip(match.id, 'D', tipHome, tipAway)}>D</button>
          {isDone && <span className="tip-vs-score">–</span>}
        </div>

        <div className={`tip-team tip-team--away ${tipResult === 'A' ? 'tip-team--selected' : ''}`}
          onClick={() => !locked && onTip(match.id, 'A', tipHome, tipAway)}>
          {isDone && <span className="tip-actual-score">{awayScore}</span>}
          <span className="tip-name tip-name--r">{away?.name}</span>
          <span className="tip-flag">{away?.flag}</span>
        </div>
      </div>

      {tipResult && !locked && (
        <div className="tip-score-input">
          <span className="tip-score-label">Predict exact score for bonus +2pts</span>
          <div className="tip-score-row">
            <input type="number" min="0" max="20" className="tip-score-box" placeholder="–" value={tipHome}
              onChange={e => onTip(match.id, tipResult, e.target.value, tipAway)} />
            <span className="tip-score-dash">–</span>
            <input type="number" min="0" max="20" className="tip-score-box" placeholder="–" value={tipAway}
              onChange={e => onTip(match.id, tipResult, tipHome, e.target.value)} />
          </div>
        </div>
      )}

      {tipResult && locked && (tipHome !== '' || tipAway !== '') && (
        <div className="tip-locked-score">
          Your tip: {tipResult === 'H' ? home?.name : tipResult === 'A' ? away?.name : 'Draw'}
          {tipHome !== '' && tipAway !== '' && ` · ${tipHome}–${tipAway}`}
          {exactScore && <span className="tip-exact-badge"> ⚡ Exact!</span>}
        </div>
      )}
    </div>
  );
}

function Leaderboard({ tippers, liveData }) {
  const scores = tippers.map(t => {
    let pts = 0;
    const tips = t.tips || {};
    const gbTip = t.goldenBootPick || '';

    MATCHES.forEach(m => {
      const tip = tips[m.id];
      if (!tip?.result) return;
      const key = `${m.home}_${m.away}`;
      const live = liveData?.[key];
      const hs = live?.homeScore ?? m.homeScore;
      const as = live?.awayScore ?? m.awayScore;
      if (hs === null) return;
      const actual = getResult(hs, as);
      const correct = actual === tip.result;
      const exactScore = correct && parseInt(tip.homeScore) === hs && parseInt(tip.awayScore) === as;
      let matchPts = 0;
      if (correct) {
        matchPts = tip.result === 'D' ? RESULT_PTS.draw : RESULT_PTS.correct;
        if (exactScore) matchPts += RESULT_PTS.exactScore;
      }
      pts += matchPts;
    });

    if (gbTip) {
      const topScorers = calcGoldenBoot(liveData);
      const topGoals = topScorers[0]?.goals || 0;
      const isTop = topGoals > 0 && topScorers.filter(s => s.goals === topGoals).some(s => s.player === gbTip);
      if (isTop) pts += RESULT_PTS.goldenBoot;
    }
    return { tipper: t.name, pts, gbTip };
  }).sort((a, b) => b.pts - a.pts);

  if (scores.length === 0) return <div className="lb-empty"><p>No players yet — join the competition!</p></div>;

  return (
    <div className="leaderboard">
      {scores.map((s, i) => (
        <div key={s.tipper} className={`lb-row ${i === 0 ? 'lb-row--first' : ''}`}>
          <span className="lb-rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}`}</span>
          <div className="lb-info">
            <span className="lb-name">{s.tipper}</span>
            {s.gbTip && <span className="lb-gb">👟 {s.gbTip}</span>}
          </div>
          <span className="lb-pts">{s.pts}<span className="lb-pts-label"> pts</span></span>
        </div>
      ))}
    </div>
  );
}

export default function Tipping({ liveData }) {
  const [name, setName] = useState(() => load('my_name') || '');
  const [draftName, setDraftName] = useState('');
  const [tippers, setTippers] = useState([]);
  const [tips, setTips] = useState({});
  const [gbPick, setGbPick] = useState('');
  const [subTab, setSubTab] = useState(load('my_name') ? 'tips' : 'join');
  const [syncing, setSyncing] = useState(false);
  const [loadingLadder, setLoadingLadder] = useState(true);

  const topScorers = calcGoldenBoot(liveData);

  useEffect(() => {
    const savedName = load('my_name');
    if (!savedName) return;
    (async () => {
      const record = await loadTipper(savedName);
      if (record) {
        setTips(record.tips || {});
        setGbPick(record.goldenBootPick || '');
      }
    })();
  }, []);

  useEffect(() => {
    if (subTab !== 'leaderboard') return;
    setLoadingLadder(true);
    loadAllTippers().then(all => {
      setTippers(all);
      setLoadingLadder(false);
    });
  }, [subTab]);

  const joinComp = async () => {
    const n = draftName.trim();
    if (!n) return;
    save('my_name', n);
    setName(n);
    setSyncing(true);
    const existing = await loadTipper(n);
    if (existing) {
      setTips(existing.tips || {});
      setGbPick(existing.goldenBootPick || '');
    } else {
      await saveTipper(n, {}, '');
      setTips({});
      setGbPick('');
    }
    setSyncing(false);
    setSubTab('tips');
  };

  const handleTip = async (matchId, result, homeScore, awayScore) => {
    const updated = { ...tips, [matchId]: { result, homeScore, awayScore } };
    setTips(updated);
    await saveTipper(name, updated, gbPick);
  };

  const handleGBPick = async (player) => {
    setGbPick(player);
    await saveTipper(name, tips, player);
  };

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const allMatches = [...MATCHES].sort((a, b) => a.kickoffUTC - b.kickoffUTC);
  const pastMatches = allMatches.filter(m => m.kickoffUTC <= now).sort((a, b) => b.kickoffUTC - a.kickoffUTC);
  const futureMatches = allMatches.filter(m => m.kickoffUTC > now);

  return (
    <div className="tipping-view">
      <div className="tip-subtabs">
        {['join','tips','golden','leaderboard'].map(t => (
          <button key={t} className={`tip-subtab ${subTab === t ? 'tip-subtab--on' : ''}`} onClick={() => setSubTab(t)}>
            {t === 'join' ? '👤 Join' : t === 'tips' ? '✏️ My Tips' : t === 'golden' ? '👟 Boot Pick' : '🏅 Ladder'}
          </button>
        ))}
      </div>

      {subTab === 'join' && (
        <div className="tip-join">
          {name ? (
            <div className="tip-joined">
              <span className="tip-joined-icon">✅</span>
              <p>You're in as <strong>{name}</strong></p>
            </div>
          ) : (
            <>
              <h2 className="tip-join-title">Join the Tipping Comp</h2>
              <p className="tip-join-sub">Enter your name to start tipping. Tips lock at kickoff.</p>
              <div className="tip-join-row">
                <input className="tip-name-input" type="text" placeholder="Your name" value={draftName}
                  onChange={e => setDraftName(e.target.value)} onKeyDown={e => e.key === 'Enter' && joinComp()} />
                <button className="tip-join-btn" onClick={joinComp} disabled={syncing}>{syncing ? 'Joining…' : 'Join →'}</button>
              </div>
            </>
          )}
          <div className="tip-rules">
            <h3>Scoring Rules</h3>
            <div className="tip-rule"><span>✅ Correct result (W or L)</span><span className="tip-rule-pts">3 pts</span></div>
            <div className="tip-rule"><span>🤝 Correct draw result</span><span className="tip-rule-pts">1 pt</span></div>
            <div className="tip-rule"><span>⚡ Exact score prediction</span><span className="tip-rule-pts">+2 bonus</span></div>
            <div className="tip-rule"><span>👟 Correct Golden Boot pick</span><span className="tip-rule-pts">5 pts</span></div>
          </div>
        </div>
      )}

      {subTab === 'tips' && (
        <div className="tip-matches">
          {!name && (
            <div className="tip-no-name">
              <p>Please <button className="tip-inline-btn" onClick={() => setSubTab('join')}>join the competition</button> first</p>
            </div>
          )}
          {name && (
            <>
              {pastMatches.length > 0 && (
                <>
                  <div className="tip-section-label">
                    Results — {pastMatches.filter(m => {
                      const key = `${m.home}_${m.away}`;
                      const hs = liveData?.[key]?.homeScore ?? m.homeScore;
                      return hs !== null;
                    }).length} completed
                  </div>
                  {pastMatches.map(m => (
                    <TipCard key={m.id} match={m} tip={tips[m.id]} onTip={handleTip} liveData={liveData} disabled={!name} timeMode="AEST" />
                  ))}
                </>
              )}
              {futureMatches.length > 0 && (
                <>
                  <div className="tip-section-label">Upcoming — tip before kickoff</div>
                  {futureMatches.map(m => (
                    <TipCard key={m.id} match={m} tip={tips[m.id]} onTip={handleTip} liveData={liveData} disabled={!name} timeMode="AEST" />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}

      {subTab === 'golden' && (
        <div className="tip-gb">
          <div className="tip-gb-header">
            <span className="tip-gb-icon">👟</span>
            <div><h2>Golden Boot Pick</h2><p>Pick the tournament top scorer. Worth 5 pts if correct.</p></div>
          </div>
          {!name ? (
            <div className="tip-no-name">
              <p>Please <button className="tip-inline-btn" onClick={() => setSubTab('join')}>join</button> first</p>
            </div>
          ) : (
            <>
              {gbPick && (
                <div className="tip-gb-current">
                  Your pick: <strong>{gbPick}</strong> {topScorers.find(s => s.player === gbPick) && `· ${topScorers.find(s=>s.player===gbPick).goals} goal${topScorers.find(s=>s.player===gbPick).goals!==1?'s':''} so far`}
                </div>
              )}
              <div className="tip-gb-list">
                {topScorers.length > 0 && (
                  <>
                    <div className="tip-gb-section">Current top scorers</div>
                    {topScorers.slice(0, 10).map(s => {
                      const t = TEAMS[s.team];
                      return (
                        <button key={`${s.player}_${s.team}`}
                          className={`tip-gb-player ${gbPick === s.player ? 'tip-gb-player--on' : ''}`}
                          onClick={() => handleGBPick(s.player)}>
                          <span>{t?.flag}</span>
                          <span className="tip-gb-player-name">{s.player}</span>
                          <span className="tip-gb-goals">{s.goals}⚽</span>
                          {gbPick === s.player && <span className="tip-gb-tick">★</span>}
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {subTab === 'leaderboard' && (
        <div className="tip-ladder">
          <div className="tip-ladder-header">
            <h2>Ladder</h2>
            <div className="tip-ladder-stats">
              <span className="tip-player-count">{tippers.length} player{tippers.length !== 1 ? 's' : ''}</span>
              <span className="tip-active-count">● {countActiveSince(tippers, 24)} active today</span>
            </div>
          </div>
          {loadingLadder ? (
            <div className="lb-empty"><p>Loading ladder…</p></div>
          ) : (
            <Leaderboard tippers={tippers} liveData={liveData} />
          )}
          <p className="tip-ladder-note">Tips lock at kickoff · Points auto-update after each match</p>
        </div>
      )}
    </div>
  );
}
