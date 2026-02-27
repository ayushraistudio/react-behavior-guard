export interface BehaviorOptions {
  trackTabSwitch?: boolean;
  trackMouseActivity?: boolean;
  trackCopyPaste?: boolean;
  trackRapidClick?: boolean;
  trackIdleTime?: boolean;
  idleTimeoutMs?: number; 
}

export interface Analytics {
  tabSwitches: number;
  copyPasteCount: number;
  rapidClicks: number;
  idleIncidents: number;
  mouseLeaveCount: number;
}

export interface BehaviorResult {
  riskScore: number; // 0 to 100
  warnings: string[];
  analytics: Analytics;
}