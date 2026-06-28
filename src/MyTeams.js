import React, { useState, useEffect } from 'react';
import { MATCHES, TEAMS } from './data';
import { MatchRow } from './App';
import './MyTeams.css';

const LS_KEY = 'wc2026_followed';

const ALL_BY_CONF = {
  'UEFA': ['ENG','FRA','GER','ESP','POR','NED','BEL','CRO','SWE','NOR','AUT','SUI','CZE','SCO','TUR','BIH'],
  'CONMEBOL': ['ARG','BRA','COL','URU','ECU','PAR'],
  'CAF': ['MAR','SEN','EGY','GHA','TUN','RSA','ALG','CIV','CPV','COD'],
  'AFC': ['AUS','JPN','KOR','KSA','IRN','IRQ','JOR','UZB'],
  'CONCACAF': ['USA','MEX','CAN','PAN','HAI','CUW'],
  'OFC': ['NZL'],
};

export default function MyTeams({ liveData, onMatchSelect, timeMode }) {
  const [followed, setFollowed] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || ['AUS']; }
    catch { return ['AUS']; }
  });
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(followed));
  }, [followed]);

  const toggle = code => setFollowed(prev =>
    prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
  );

  const myMatches = MATCHES
    .filter(m => followed.includes(m.home) || followed.includes(m.away))
    .sort((a, b) => a.kickoffUTC - b.kickoffUTC);

  return (
    <div className="myteams-view">
      <div className="mt-topbar">
        <div className="mt-followed">
          {followed.length === 0
            ? <span className="mt-empty-label">No teams selected</span>
            : followed.map(c => (
                <span key={c} className="mt-pill">{TEAMS[c]?.flag} {TEAMS[c]?.name}</span>
              ))
          }
        </div>
        <button className="mt-edit" onClick={() => setShowPicker(p => !p)}>
          {showPicker ? 'Done' : 'Edit'}
        </button>
      </div>

      {showPicker && (
        <div className="mt-picker">
          {Object.entries(ALL_BY_CONF).map(([conf, codes]) => (
            <div key={conf} className="mt-conf-section">
              <div className="mt-conf-label">{conf}</div>
              <div className="mt-conf-grid">
                {codes.map(code => (
                  <button key={code}
                    className={`mt-team-btn ${followed.includes(code) ? 'mt-team-btn--on' : ''}`}
                    onClick={() => toggle(code)}>
                    <span>{TEAMS[code]?.flag}</span>
                    <span className="mt-team-btn-name">{TEAMS[code]?.name}</span>
                    {followed.includes(code) && <span className="mt-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!showPicker && (
        followed.length === 0 ? (
          <div className="mt-no-teams"><p>Tap <strong>Edit</strong> to follow your teams</p></div>
        ) : myMatches.length === 0 ? (
          <div className="mt-no-teams"><p>No matches found</p></div>
        ) : (
          <div className="mt-matches">
            {followed.map(code => {
              const t = TEAMS[code];
              const matches = myMatches.filter(m => m.home === code || m.away === code);
              if (matches.length === 0) return null;
              return (
                <div key={code} className="mt-team-section">
                  <div className="mt-team-header">
                    <span className="mt-team-flag">{t?.flag}</span>
                    <span className="mt-team-name">{t?.name}</span>
                  </div>
                  <div className="match-list-card" style={{ margin: '0 20px' }}>
                    {matches.map((m, i) => (
                      <React.Fragment key={m.id}>
                        {i > 0 && <div className="match-divider" />}
                        <MatchRow match={m} liveData={liveData} onPress={() => onMatchSelect && onMatchSelect(m)} timeMode={timeMode} />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
