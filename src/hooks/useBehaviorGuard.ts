import { useState, useEffect, useCallback } from 'react';
import { BehaviorOptions, BehaviorResult, Analytics } from '../types';
import { calculateScore } from '../utils/scoreCalculator';

// Standard fallback values for the hook
const DEFAULT_OPTIONS: Required<BehaviorOptions> = {
  trackTabSwitch: true,
  trackMouseActivity: true,
  trackCopyPaste: true,
  trackRapidClick: true,
  trackIdleTime: true,
  idleTimeoutMs: 30000,
  penaltyTabSwitch: 15,
  penaltyWindowBlur: 10,
  penaltyCopyPaste: 20,
  penaltyRapidClick: 5,
  penaltyIdle: 10,
};

export function useBehaviorGuard(options?: BehaviorOptions): BehaviorResult {
  // Merge user options with default configuration
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

  /**
   * Helper function to log warnings and update the risk score
   */
  const addWarning = useCallback((message: string, penalty: number) => {
    const timestamp = new Date().toLocaleTimeString();
    setWarnings((prev) => [...prev, `${timestamp}: ${message}`]);
    setRiskScore((prev) => calculateScore(prev, penalty));
  }, []);

  // 1. Tab Switch & Visibility Tracker
  useEffect(() => {
    if (!config.trackTabSwitch) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAnalytics((prev) => ({ ...prev, tabSwitches: prev.tabSwitches + 1 }));
        addWarning('User switched tab or minimized window', config.penaltyTabSwitch);
      }
    };
    
    const handleBlur = () => {
      setAnalytics((prev) => ({ ...prev, tabSwitches: prev.tabSwitches + 1 }));
      addWarning('Window lost focus', config.penaltyWindowBlur);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [config.trackTabSwitch, config.penaltyTabSwitch, config.penaltyWindowBlur, addWarning]);

  // 2. Clipboard Action Tracker (Copy/Paste)
  useEffect(() => {
    if (!config.trackCopyPaste) return;

    const handleCopyPaste = (e: ClipboardEvent) => {
      setAnalytics((prev) => ({ ...prev, copyPasteCount: prev.copyPasteCount + 1 }));
      addWarning(`Clipboard action detected: ${e.type}`, config.penaltyCopyPaste);
    };

    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);

    return () => {
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
    };
  }, [config.trackCopyPaste, config.penaltyCopyPaste, addWarning]);

  // 3. Rapid Click Tracker (Anti-Bot/Automation)
  useEffect(() => {
    if (!config.trackRapidClick) return;
    
    let clickTimestamps: number[] = [];

    const handleClick = () => {
      const now = Date.now();
      clickTimestamps.push(now);
      
      // Keep only clicks that occurred in the last 2 seconds
      clickTimestamps = clickTimestamps.filter((t) => now - t < 2000);

      // Warning triggered if more than 5 clicks in 2 seconds
      if (clickTimestamps.length > 5) {
        setAnalytics((prev) => ({ ...prev, rapidClicks: prev.rapidClicks + 1 }));
        addWarning('Rapid clicking detected', config.penaltyRapidClick);
        clickTimestamps = []; // Reset sequence after warning
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [config.trackRapidClick, config.penaltyRapidClick, addWarning]);

  // 4. Idle/Inactivity Tracker
  useEffect(() => {
    if (!config.trackIdleTime) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetIdle = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setAnalytics((prev) => ({ ...prev, idleIncidents: prev.idleIncidents + 1 }));
        addWarning('User inactive for too long', config.penaltyIdle);
      }, config.idleTimeoutMs);
    };

    const userActivityEvents = ['mousemove', 'keydown', 'scroll', 'touchstart'];
    userActivityEvents.forEach((evt) => window.addEventListener(evt, resetIdle));
    
    resetIdle(); // Start the first idle timer

    return () => {
      clearTimeout(timeoutId);
      userActivityEvents.forEach((evt) => window.removeEventListener(evt, resetIdle));
    };
  }, [config.trackIdleTime, config.idleTimeoutMs, config.penaltyIdle, addWarning]);

  return { riskScore, warnings, analytics };
}