// .github/scripts/update-scores.js
// Fetches live scores from wc2026api.com and patches src/data.js
// Runs in GitHub Actions every hour

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.WC_API_KEY;
const DATA_FILE = path.join(__dirname, '../../src/data.js');

// Map API team names → our codes (same as useLiveScores.js)
const NAME_MAP = {
  'Mexico': 'MEX', 'South Africa': 'RSA', 'South Korea': 'KOR', 'Korea Republic': 'KOR',
  'Czechia': 'CZE', 'Czech Republic': 'CZE',
  'Canada': 'CAN', 'Bosnia and Herzegovina': 'BIH', 'Bosnia & Herzegovina': 'BIH',
  'Qatar': 'QAT', 'Switzerland': 'SUI',
  'Brazil': 'BRA', 'Morocco': 'MAR', 'Haiti': 'HAI', 'Scotland': 'SCO',
  'USA': 'USA', 'United States': 'USA', 'Paraguay': 'PAR', 'Australia': 'AUS',
  'Turkey': 'TUR', 'Türkiye': 'TUR',
  'Germany': 'GER', 'Curaçao': 'CUW', 'Curacao': 'CUW',
  "Ivory Coast": 'CIV', "Côte d'Ivoire": 'CIV',
  'Ecuador': 'ECU', 'Netherlands': 'NED', 'Japan': 'JPN', 'Sweden': 'SWE', 'Tunisia': 'TUN',
  'Belgium': 'BEL', 'Egypt': 'EGY', 'Iran': 'IRN', 'New Zealand': 'NZL',
  'Spain': 'ESP', 'Cape Verde': 'CPV', 'Saudi Arabia': 'KSA', 'Uruguay': 'URU',
  'France': 'FRA', 'Senegal': 'SEN', 'Iraq': 'IRQ', 'Norway': 'NOR',
  'Argentina': 'ARG', 'Algeria': 'ALG', 'Austria': 'AUT', 'Jordan': 'JOR',
  'Portugal': 'POR', 'Colombia': 'COL', 'Uzbekistan': 'UZB', 'DR Congo': 'COD',
  'Democratic Republic of Congo': 'COD', 'Congo DR': 'COD',
  'England': 'ENG', 'Croatia': 'CRO', 'Panama': 'PAN', 'Ghana': 'GHA',
};

function fetchJSON(url, apiKey) {
  return new Promise((resolve, reject) => {
    const opts = {
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/json' }
    };
    https.get(url, opts, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error(`Parse error: ${data.slice(0,200)}`)); }
      });
    }).on('error', reject);
  });
}

// Parse red cards from events array
function countRedCards(events, teamCode) {
  if (!events || !Array.isArray(events)) return 0;
  return events.filter(e => {
    const isRed = e.type === 'red_card' || e.type === 'RED_CARD' || e.card === 'red';
    if (!isRed) return false;
    const code = NAME_MAP[e.team] || NAME_MAP[e.team?.trim()];
    return code === teamCode;
  }).length;
}

async function main() {
  if (!API_KEY) {
    console.log('No WC_API_KEY set — skipping score update');
    process.exit(0);
  }

  console.log('Fetching scores from wc2026api.com...');

  let matches;
  try {
    const data = await fetchJSON('https://api.wc2026api.com/matches', API_KEY);
    matches = Array.isArray(data) ? data : (data.matches || data.data || []);
    console.log(`Got ${matches.length} matches`);
  } catch(e) {
    console.error('API fetch failed:', e.message);
    process.exit(0); // Don't fail the action, just skip
  }

  // Build lookup: "HOME_AWAY" → {homeScore, awayScore, homeRed, awayRed}
  const scoreMap = {};
  matches.forEach(m => {
    const home = NAME_MAP[m.home_team || m.home] ;
    const away = NAME_MAP[m.away_team || m.away];
    if (!home || !away) return;

    const phase = m.phase || m.status || '';
    const finished = ['FT', 'FT_PEN'].includes(phase);
    if (!finished) return; // Only update completed matches

    const hs = m.home_score ?? m.homeScore ?? m.score?.home;
    const as = m.away_score ?? m.awayScore ?? m.score?.away;
    if (hs === null || hs === undefined) return;

    scoreMap[`${home}_${away}`] = {
      homeScore: hs,
      awayScore: as,
      homeRed: countRedCards(m.events, home),
      awayRed: countRedCards(m.events, away),
    };
  });

  console.log(`Found ${Object.keys(scoreMap).length} completed matches`);

  // Read data.js
  let src = fs.readFileSync(DATA_FILE, 'utf8');
  let updates = 0;

  // Update each M() call that has null scores
  // Pattern: M('XX', 'X', 'HOME', 'AWAY', 'date', 'time', null, null, N, N, 'venue', N)
  src = src.replace(
    /M\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(null|[\d]+),\s*(null|[\d]+),\s*(\d+),\s*(\d+),/g,
    (match, id, group, home, away, date, time, hs, as, hr, ar) => {
      const key = `${home}_${away}`;
      const s = scoreMap[key];
      if (!s) return match; // No data yet
      if (hs !== 'null' && as !== 'null') return match; // Already has score
      updates++;
      console.log(`  ${home} ${s.homeScore}-${s.awayScore} ${away}`);
      return `M('${id}', '${group}', '${home}', '${away}', '${date}', '${time}', ${s.homeScore}, ${s.awayScore}, ${s.homeRed}, ${s.awayRed},`;
    }
  );

  if (updates > 0) {
    fs.writeFileSync(DATA_FILE, src);
    console.log(`✓ Updated ${updates} match scores in data.js`);
  } else {
    console.log('No new scores to update');
  }
}

main().catch(e => { console.error(e); process.exit(0); });
