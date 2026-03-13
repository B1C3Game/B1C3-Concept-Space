
import Plot from 'react-plotly.js';
import './App.css';
import { useEffect, useState } from 'react';

function getConceptByName(concepts, name) {
  return concepts.find((c) => c.name === name);
}

function App() {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('./nodes.json')
      .then((res) => res.json())
      .then((data) => {
        setConcepts(data);
        setLoading(false);
      });
  }, []);
  if (loading) return <div>Loading nodes...</div>;

// Shift pairs: [from, to]
const shifts = [
    // ADHD support shift
    ['ADHD without help', 'ADHD with help (cognitive offloading, tools, structure)'],
  ['Wave theory (SI/traditional)', 'Wave theory (B1C3 integer)'],
  ['Arabic script (Swedish speaker)', 'Arabic (with transliteration)'],
  ['Imaginary numbers (notation)', 'Imaginary numbers (POV explanation)'],
  ['Logarithms (notation)', 'Logarithms (plain language)'],
  ["Relativity (Einstein's era)", 'Relativity (textbook)'],
  ['Programming (traditional)', 'Programming (with AI)'],
  // Rodney Mullen shift
  ['Skateboarding tricks (pre-Mullen)', 'Skateboarding tricks (Mullen/physics)'],
];





  // Data points
  const scatter = {
    x: concepts.map((c) => c.x),
    y: concepts.map((c) => c.y),
    z: concepts.map((c) => c.z),
    text: concepts.map((c) => c.name),
    customdata: concepts.map((c) => c.argument),
    mode: 'markers+text',
    type: 'scatter3d',
    marker: { size: 8, color: '#1f77b4' },
    textposition: 'top center',
    name: 'Concepts',
    hovertemplate:
      '<b>%{text}</b><br>' +
      'X: %{x}<br>' +
      'Y: %{y}<br>' +
      'Z: %{z}<br>' +
      '<br><i>%{customdata}</i><extra></extra>',
  };

  // Arrows for shifts
  const arrows = shifts.map(([from, to]) => {
    const c1 = getConceptByName(concepts, from);
    const c2 = getConceptByName(concepts, to);
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2em', marginTop: '2em' }}>
        {/* Left column: axis descriptions */}
        <div style={{ minWidth: 320, maxWidth: 340, fontSize: '1.08em', background: '#f8f8fa', borderRadius: 8, padding: '1.5em', boxShadow: '0 2px 8px #0001', marginTop: 0 }}>
          <b>X:</b> Concensus (meme coverage) — How much structure or formalism exists for the concept. 0 = none, 10 = fully consensual.<br />
          <b>Y:</b> Gamma (Cognitive Engagement) — The level of cognitive effort or abstraction needed. 0 = low, 10 = high.<br />
          <b>Z:</b> Cognitive Distance — How far the concept is from human-native experience. 0 = near/intuitive, 10 = far/abstract.<br />
          <br />
          <span style={{ color: '#d62728', fontWeight: 500 }}>Red dashed lines</span> represent shifts where communication improvements reduced cognitive distance and intelligence requirements without losing accuracy.
        </div>
        {/* Right column: plot */}
        <div>
          <Plot
            data={[mesh, scatter, ...arrows]}
            layout={{
              width: 900,
              height: 700,
              scene: {
                xaxis: {
                  title: {
                    text: 'X',
                    font: { size: 18 },
                    standoff: 20,
                  },
                  range: [0, 10],
                  titlefont: { size: 18 },
                },
                yaxis: {
                  title: {
                    text: 'Y',
                    font: { size: 18 },
                    standoff: 20,
                  },
                  range: [0, 10],
                  titlefont: { size: 18 },
                },
                zaxis: {
                  title: {
                    text: 'Z',
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
        </div>
      </div>
    </div>
  );
}

export default App;
