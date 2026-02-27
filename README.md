# react-behavior-guard 🛡️

A production-ready React library to detect suspicious behavioral patterns in online exams, assessments, or secure web apps and generate a real-time risk score.


## Features
- ⚡️ **Lightweight & Tree-shakable**: Built with Vite library mode for minimal bundle size.
- 🔒 **Tab/Focus Tracking**: Tracks tab switches, window blur, and visibility changes.
- ✂️ **Clipboard Guard**: Detects copy and paste events.
- 🖱️ **Interaction Monitor**: Tracks rapid click bursts and mouse movement out of window.
- ⏳ **Inactivity Detection**: Detects idle time and penalizes accordingly.
- 🛡️ **Risk Scoring**: Automatically calculates a risk score (0–100) based on severity.

## Installation

```bash
npm install react-behavior-guard
# or
yarn add react-behavior-guard
```

## Usage Example

```tsx
import React from 'react';
import { useBehaviorGuard } from 'react-behavior-guard';

function ExamPortal() {
  const { riskScore, warnings, analytics } = useBehaviorGuard({
    trackTabSwitch: true,
    trackCopyPaste: true,
    trackIdleTime: true,
    idleTimeoutMs: 30000 // 30 seconds
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Secure Online Exam</h1>
      
      <div style={{ 
        padding: '10px', 
        color: riskScore > 50 ? 'white' : 'black',
        backgroundColor: riskScore > 50 ? 'red' : 'lightgreen' 
      }}>
        Current Risk Score: **{riskScore} / 100**
      </div>
      
      <h3>Activity Logs</h3>
      <ul>
        {warnings.map((msg, i) => <li key={i}>{msg}</li>)}
      </ul>
    </div>
  );
}

export default ExamPortal;
```

## API Reference

### `useBehaviorGuard(options)`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `trackTabSwitch` | `boolean` | `true` | Tracks when user switches tabs or minimizes window. |
| `trackMouseActivity` | `boolean` | `true` | Tracks if the mouse leaves the browser window area. |
| `trackCopyPaste` | `boolean` | `true` | Monitors clipboard copy and paste actions. |
| `trackRapidClick` | `boolean` | `true` | Detects suspicious rapid clicking (click bursts). |
| `trackIdleTime` | `boolean` | `true` | Penalizes if user is inactive for a set duration. |
| `idleTimeoutMs` | `number` | `30000` | Inactivity threshold in milliseconds. |

### Analytics Object
The hook returns an `analytics` object containing:
- `tabSwitches`: Total number of focus/visibility losses.
- `copyPasteCount`: Number of clipboard events.
- `rapidClicks`: Number of rapid click incidents.
- `idleIncidents`: Number of inactivity timeouts.
- `mouseLeaveCount`: Number of times the mouse left the window.

## API Reference

### `useBehaviorGuard(options)`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `trackTabSwitch` | `boolean` | `true` | Tracks when user switches tabs or minimizes window. |
| `trackMouseActivity` | `boolean` | `true` | Tracks if the mouse leaves the browser window area. |
| `trackCopyPaste` | `boolean` | `true` | Monitors clipboard copy and paste actions. |
| `trackRapidClick` | `boolean` | `true` | Detects suspicious rapid clicking (click bursts). |
| `trackIdleTime` | `boolean` | `true` | Penalizes if user is inactive for a set duration. |
| `idleTimeoutMs` | `number` | `30000` | Inactivity threshold in milliseconds. |

### Analytics Object
The hook returns an `analytics` object containing:
- `tabSwitches`: Total number of focus/visibility losses.
- `copyPasteCount`: Number of clipboard events.
- `rapidClicks`: Number of rapid click incidents.
- `idleIncidents`: Number of inactivity timeouts.
- `mouseLeaveCount`: Number of times the mouse left the window.

## Risk Scoring System

The risk score is cumulative and capped at **100**. 

- **Tab Switch/Blur**: +10 to +15 points per incident.
- **Copy/Paste**: +20 points (high severity for exams).
- **Rapid Clicks**: +5 points per burst.
- **Idle Timeout**: +10 points.
- **Mouse Out**: +5 to +15 points.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a PR.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.
