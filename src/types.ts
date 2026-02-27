export interface BehaviorOptions {
  // Toggle tracking features
  trackTabSwitch?: boolean;
  trackMouseActivity?: boolean;
  trackCopyPaste?: boolean;
  trackRapidClick?: boolean;
  trackIdleTime?: boolean;

  // Configuration values
  idleTimeoutMs?: number; 

  // Customizable penalties (newly added)
  penaltyTabSwitch?: number;
  penaltyWindowBlur?: number;
  penaltyCopyPaste?: number;
  penaltyRapidClick?: number;
  penaltyIdle?: number;
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