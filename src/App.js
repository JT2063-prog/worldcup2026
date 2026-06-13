import React, { useState, useEffect } from 'react';
import { GROUPS, GROUP_COLORS } from './data';
import GroupPanel from './GroupPanel';
import { useLiveScores } from './useLiveScores';
import './App.css';

const LS_KEY = 'wc2026_api_key';

export default function App() {
  const [activeGroup, setActiveGroup] = useState('ALL');
  const [now, setNow] = useState(new Date());
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(LS_KEY) || '');
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [draftKey, setDraftKey] = useState('');

  const { liveData, status, lastFetched, requestsUsed, refetch } = useLiveScores(apiKey);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const saveKey = () => {
    const k = draftKey.trim();
    localStorage.setItem(LS_KEY, k);
    setApiKey(k);
    setShowApiSetup(false);
  };

  const clearKey = () => {
    localStorage.removeItem(LS_KEY);
    setApiKey('');
    setShowApiSetup(false);
  };

  const displayGroups = activeGroup === 'ALL' ? GROUPS : [activeGroup];

  const statusDot = {
    ok: '🟢', fetching: '🟡', error: '🔴', 'no-key': '⚪',
    'rate-limited': '🟠', idle: '⚪',
  }[status] || '⚪';

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="trophy-icon">🏆</div>
            <div>
              <h1 className="header-title">FIFA World Cup 2026™</h1>
              <p className="header-sub">Group Stage · All times AEST (UTC+10)</p>
            </div>
          </div>
          <div className="header-right">
            <div className="header-clock">
              <span className="clock-label">AEST</span>
              <span className="clock-time">
                {now.toLocaleString('en-AU', {
                  timeZone: 'Australia/Sydney',
                  day: '2-digit', month: 'short',
                  hour: '2-digit', minute: '2-digit',
                  hour12: false
                })}
              </span>
            </div>
            <button className="api-btn" onClick={() => { setDraftKey(apiKey); setShowApiSetup(s => !s); }}
              title={apiKey ? `Live data: ${status} · ${requestsUsed} req used` : 'Set up live scores'}>
              {statusDot} {apiKey ? 'Live' : 'Static'}
            </button>
          </div>
        </div>

        {/* API Key Setup Panel */}
        {showApiSetup && (
          <div className="api-setup">
            <div className="api-setup-inner">
              <div className="api-setup-header">
                <h3>Live Score API Key</h3>
                <p>Get a free key at <a href="https://www.wc2026api.com" target="_blank" rel="noopener noreferrer">wc2026api.com</a> (100 req/day free)</p>
              </div>
              <div className="api-setup-row">
                <input
                  className="api-input"
                  type="text"
                  placeholder="wc2026_your_key_here"
                  value={draftKey}
                  onChange={e => setDraftKey(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveKey()}
                />
                <button className="api-save-btn" onClick={saveKey}>Save</button>
                {apiKey && <button className="api-clear-btn" onClick={clearKey}>Remove</button>}
              </div>
              {apiKey && (
                <div className="api-status-row">
                  <span>{statusDot} Status: {status}</span>
                  {lastFetched && <span>· Last updated: {lastFetched.toLocaleTimeString('en-AU', { timeZone: 'Australia/Sydney', hour12: false })}</span>}
                  <span>· {requestsUsed} req used today</span>
                  <button className="api-refresh-btn" onClick={refetch}>↻ Refresh now</button>
                </div>
              )}
              <p className="api-note">Your key is stored only in your browser. Without a key, scores are from the static dataset and update when you redeploy.</p>
            </div>
          </div>
        )}

        <nav className="group-nav">
          <button
            className={`gn-btn ${activeGroup === 'ALL' ? 'gn-btn--active' : ''}`}
            onClick={() => setActiveGroup('ALL')}
            style={activeGroup === 'ALL' ? { '--gc': '#c9a84c' } : {}}>
            ALL
          </button>
          {GROUPS.map(g => (
            <button key={g}
              className={`gn-btn ${activeGroup === g ? 'gn-btn--active' : ''}`}
              onClick={() => setActiveGroup(g)}
              style={activeGroup === g ? { '--gc': GROUP_COLORS[g] } : {}}>
              {g}
            </button>
          ))}
        </nav>
      </header>

      <main className="main">
        <div className={`groups-grid ${activeGroup !== 'ALL' ? 'groups-grid--single' : ''}`}>
          {displayGroups.map(g => (
            <GroupPanel key={g} group={g} now={now} liveData={liveData} />
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>All times AEST · Live data via <a href="https://www.wc2026api.com" target="_blank" rel="noopener noreferrer">wc2026api.com</a> · Not affiliated with FIFA</p>
      </footer>
    </div>
  );
}
