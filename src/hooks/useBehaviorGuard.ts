import { useState, useEffect, useCallback } from 'react';
import { BehaviorOptions, BehaviorResult, Analytics } from '../types';
import { calculateScore } from '../utils/scoreCalculator';

const DEFAULT_OPTIONS: BehaviorOptions = {
  trackTabSwitch: true,
  trackMouseActivity: true,
  trackCopyPaste: true,
  trackRapidClick: true,
  trackIdleTime: true,
  idleTimeoutMs: 30000,
};

export function useBehaviorGuard(options?: BehaviorOptions): BehaviorResult {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  const [riskScore, setRiskScore] = useState<number>(0);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    tabSwitches: 0,
    copyPasteCount: 0,
    rapidClicks: 0,
    idleIncidents: 0,
    mouseLeaveCount: 0,
  });

  const addWarning = useCallback((message: string, penalty: number) => {
    setWarnings((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    setRiskScore((prev) => calculateScore(prev, penalty));
  }, []);

  // 1. Tab Switch / Visibility Tracker
  useEffect(() => {
    if (!config.trackTabSwitch) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAnalytics((prev) => ({ ...prev, tabSwitches: prev.tabSwitches + 1 }));
        addWarning('User switched tab or minimized window', 15);
      }
    };
    
    const handleBlur = () => {
      setAnalytics((prev) => ({ ...prev, tabSwitches: prev.tabSwitches + 1 }));
      addWarning('Window lost focus', 10);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [config.trackTabSwitch, addWarning]);

  // 2. Copy/Paste Tracker
  useEffect(() => {
    if (!config.trackCopyPaste) return;

    const handleCopyPaste = (e: ClipboardEvent) => {
      setAnalytics((prev) => ({ ...prev, copyPasteCount: prev.copyPasteCount + 1 }));
      addWarning(`Clipboard action detected: ${e.type}`, 20);
    };

    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);

    return () => {
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
    };
  }, [config.trackCopyPaste, addWarning]);

  // 3. Rapid Click Tracker
  useEffect(() => {
    if (!config.trackRapidClick) return;
    
    let clickTimestamps: number[] = [];

    const handleClick = () => {
      const now = Date.now();
      clickTimestamps.push(now);
      // Keep only clicks from the last 2 seconds
      clickTimestamps = clickTimestamps.filter((t) => now - t < 2000);

      if (clickTimestamps.length > 5) { // More than 5 clicks in 2 seconds
        setAnalytics((prev) => ({ ...prev, rapidClicks: prev.rapidClicks + 1 }));
        addWarning('Rapid clicking detected', 5);
        clickTimestamps = []; // Reset after warning
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [config.trackRapidClick, addWarning]);

  // 4. Idle Time Tracker
  useEffect(() => {
    if (!config.trackIdleTime) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetIdle = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setAnalytics((prev) => ({ ...prev, idleIncidents: prev.idleIncidents + 1 }));
        addWarning('User inactive for too long', 10);
      }, config.idleTimeoutMs);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, resetIdle));
    resetIdle(); // init

    return () => {
      clearTimeout(timeoutId);
      events.forEach((evt) => window.removeEventListener(evt, resetIdle));
    };
  }, [config.trackIdleTime, config.idleTimeoutMs, addWarning]);

  return { riskScore, warnings, analytics };
}