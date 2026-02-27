import React from 'react';
import { useBehaviorGuard } from 'react-behavior-guard';

function App() {
  const { riskScore, warnings, analytics } = useBehaviorGuard({
    trackTabSwitch: true,
    trackCopyPaste: true,
    trackIdleTime: true,
    trackRapidClick: true,
    trackMouseActivity: true,
    idleTimeoutMs: 10000 
  });

  const getScoreColor = () => {
    if (riskScore < 30) return '#62756f'; 
    if (riskScore < 70) return '#f59e0b'; 
    return '#ef4444'; 
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px 5%',
      color: '#1f2937',
      userSelect: 'none'
    }}>
      
      {/* Header - Compact */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: '0 0 5px 0', color: '#111827' }}>
          Exam Proctoring Dashboard 🛡️
        </h1>
        <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>
          Live anti-cheating behavior monitor
        </p>
      </div>

      {/* Risk Score Card - Reduced Padding */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        padding: '20px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        marginBottom: '20px',
        borderTop: `6px solid ${getScoreColor()}`,
        transition: 'all 0.3s ease'
      }}>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#374151' }}>Current Risk Score</h2>
        <div style={{ fontSize: '3.5rem', fontWeight: '900', color: getScoreColor() }}>
          {riskScore}<span style={{ fontSize: '1.5rem', color: '#9ca3af' }}>/100</span>
        </div>
        <p style={{ marginTop: '5px', fontSize: '1rem', fontWeight: '600', color: getScoreColor() }}>
          {riskScore < 30 ? '✅ Normal' : riskScore < 70 ? '⚠️ Suspicious' : '🚨 High Risk'}
        </p>
      </div>

      {/* Analytics & Logs - Compact Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        
        {/* Analytics Panel */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '10px', marginTop: 0, fontSize: '1.2rem' }}>📊 Live Analytics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
            <div style={statRowStyle}><span>Tab Switches</span> <strong>{analytics.tabSwitches}</strong></div>
            <div style={statRowStyle}><span>Copy/Paste Attempts</span> <strong>{analytics.copyPasteCount}</strong></div>
            <div style={statRowStyle}><span>Rapid Clicks</span> <strong>{analytics.rapidClicks}</strong></div>
            <div style={statRowStyle}><span>Idle Incidents</span> <strong>{analytics.idleIncidents}</strong></div>
            <div style={statRowStyle}><span>Mouse Left Window</span> <strong>{analytics.mouseLeaveCount}</strong></div>
          </div>
        </div>

        {/* Warnings Log */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '10px', marginTop: 0, fontSize: '1.2rem' }}>⚠️ Activity Log</h3>
          <div style={{ 
            backgroundColor: '#f9fafb', 
            borderRadius: '8px', 
            padding: '10px', 
            height: '180px', 
            overflowY: 'auto',
            border: '1px solid #e5e7eb'
          }}>
            {warnings.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: '60px' }}>Clean behavior.</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#b91c1c', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {warnings.map((warn, idx) => (
                  <li key={idx} style={{ marginBottom: '5px' }}>{warn}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Testing Playground - Compact */}
      <div style={{ 
        marginTop: '20px', 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        padding: '20px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
      }}>
        <h3 style={{ marginTop: 0, fontSize: '1.2rem' }}>🧪 Testing Playground</h3>
        <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '10px' }}>Try copy-pasting or switching tabs to test.</p>
        <textarea 
          rows={3} 
          placeholder="Type or paste here..." 
          style={{ 
            width: '100%', 
            padding: '10px', 
            borderRadius: '6px', 
            border: '1px solid #d1d5db',
            fontSize: '1rem',
            userSelect: 'auto',
            boxSizing: 'border-box'
          }} 
        />
      </div>

    </div>
  );
}

const statRowStyle: React.CSSProperties = {
  display: 'flex', 
  justifyContent: 'space-between', 
  padding: '6px 0', 
  borderBottom: '1px dashed #e5e7eb',
  fontSize: '1rem'
};

export default App;