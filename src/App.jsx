import Plot from 'react-plotly.js';
import './App.css';

const concepts = [
  { name: 'Cooking', x: 3, y: 2, z: 1 },
  { name: 'Driving', x: 6, y: 3, z: 2 },
  { name: 'Counting / Native language', x: 8, y: 1, z: 0 },
  { name: 'Programming (traditional)', x: 7, y: 6, z: 5 },
  { name: 'Programming (with AI)', x: 7, y: 4, z: 3 },
  { name: "Relativity (Einstein's era)", x: 1, y: 9, z: 9 },
  { name: 'Relativity (textbook)', x: 7, y: 6, z: 8 },
  { name: 'Wave theory (SI/traditional)', x: 7, y: 7, z: 8 },
  { name: 'Wave theory (B1C3 integer)', x: 5, y: 4, z: 4 },
  { name: 'Arabic script (Swedish speaker)', x: 3, y: 5, z: 8 },
  { name: 'Arabic (with transliteration)', x: 5, y: 3, z: 4 },
  { name: 'Imaginary numbers (notation)', x: 6, y: 7, z: 9 },
  { name: 'Imaginary numbers (POV explanation)', x: 6, y: 3, z: 3 },
  { name: 'Logarithms (notation)', x: 7, y: 6, z: 7 },
  { name: 'Logarithms (plain language)', x: 7, y: 3, z: 2 },
  // Rodney Mullen skateboarding innovation
  { name: 'Skateboarding tricks (pre-Mullen)', x: 2, y: 9, z: 7 },
  { name: 'Skateboarding tricks (Mullen/physics)', x: 4, y: 6, z: 4 },
  // Candidate data points for corners 2, 3, 6, 8
  // Corner 2: Low X, Low Y, High Z
  // Corner 3: Low X, High Y, Low Z
  { name: 'Improvisational jazz (high skill, intuitive, unstructured)', x: 1, y: 9, z: 1 },
  // Corner 6: High X, Low Y, High Z
  // Corner 8: High X, High Y, High Z
  { name: 'Quantum field theory', x: 9, y: 9, z: 9 },
  // User-supplied concepts
  { name: 'Fairytales for kids', x: 8, y: 3, z: 2 },
  { name: 'Predatory shaman', x: 2, y: 8, z: 9 },
  { name: 'Actual shamanic medicine', x: 3, y: 7, z: 3 },
];

// Shift pairs: [from, to]
const shifts = [
  ['Wave theory (SI/traditional)', 'Wave theory (B1C3 integer)'],
  ['Arabic script (Swedish speaker)', 'Arabic (with transliteration)'],
  ['Imaginary numbers (notation)', 'Imaginary numbers (POV explanation)'],
  ['Logarithms (notation)', 'Logarithms (plain language)'],
  ["Relativity (Einstein's era)", 'Relativity (textbook)'],
  ['Programming (traditional)', 'Programming (with AI)'],
  // Rodney Mullen shift
  ['Skateboarding tricks (pre-Mullen)', 'Skateboarding tricks (Mullen/physics)'],
];

function getConceptByName(name) {
  return concepts.find((c) => c.name === name);
}


function App() {
  // Data points
  const scatter = {
    x: concepts.map((c) => c.x),
    y: concepts.map((c) => c.y),
    z: concepts.map((c) => c.z),
    text: concepts.map((c) => c.name),
    mode: 'markers+text',
    type: 'scatter3d',
    marker: { size: 8, color: '#1f77b4' },
    textposition: 'top center',
    name: 'Concepts',
  };

  // Arrows for shifts
  const arrows = shifts.map(([from, to]) => {
    const c1 = getConceptByName(from);
    const c2 = getConceptByName(to);
    if (!c1 || !c2) return null;
    return {
      type: 'scatter3d',
      mode: 'lines',
      x: [c1.x, c2.x],
      y: [c1.y, c2.y],
      z: [c1.z, c2.z],
      line: { color: '#d62728', width: 4, dash: 'dot' },
      hoverinfo: 'none',
      showlegend: false,
    };
  }).filter(Boolean);

  // Convex hull (valid region) using mesh3d
  // For simplicity, use all concept points as vertices
  const mesh = {
    type: 'mesh3d',
    x: concepts.map((c) => c.x),
    y: concepts.map((c) => c.y),
    z: concepts.map((c) => c.z),
    opacity: 0.15,
    color: '#1f77b4',
    name: 'Valid Region',
    showscale: false,
    hoverinfo: 'skip',
  };

  return (
    <div className="App">
      <h1 style={{ textAlign: 'center', marginBottom: '0.5em', fontSize: '2.2em' }}>Concept Space</h1>
      <Plot
        data={[mesh, scatter, ...arrows]}
        layout={{
          width: 900,
          height: 700,
          scene: {
            xaxis: {
              title: {
                text: 'Concensus (meme coverage) (none → full)',
                font: { size: 18 },
                standoff: 20,
              },
              range: [0, 10],
              titlefont: { size: 18 },
            },
            yaxis: {
              title: {
                text: 'Gamma (Cognitive Engagement) (low → high)',
                font: { size: 18 },
                standoff: 20,
              },
              range: [0, 10],
              titlefont: { size: 18 },
            },
            zaxis: {
              title: {
                text: 'Cognitive Distance (near → far)',
                font: { size: 18 },
                standoff: 20,
              },
              range: [0, 10],
              autorange: false,
              titlefont: { size: 18 },
            },
          },
          margin: { l: 0, r: 0, b: 0, t: 40 },
          hovermode: 'closest',
        }}
        config={{ displayModeBar: true, responsive: true }}
      />
      <div style={{ maxWidth: 700, margin: '2em auto', fontSize: '1.08em', background: '#f8f8fa', borderRadius: 8, padding: '1.5em', boxShadow: '0 2px 8px #0001' }}>
        <b>X axis:</b> Concensus (meme coverage) — How much structure or formalism exists for the concept. 0 = none, 10 = fully consensual.<br />
        <b>Y axis:</b> Gamma (Cognitive Engagement) — The level of cognitive effort or abstraction needed. 0 = low, 10 = high.<br />
        <b>Z axis:</b> Cognitive Distance — How far the concept is from human-native experience. 0 = near/intuitive, 10 = far/abstract.<br />
        <br />
        <span style={{ color: '#d62728', fontWeight: 500 }}>Red dashed lines</span> represent shifts where communication improvements reduced cognitive distance and intelligence requirements without losing accuracy.
      </div>
    </div>
  );
}

export default App;
