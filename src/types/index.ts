// SafeScan Type Definitions

export type ThreatLevel = 'safe' | 'suspicious' | 'malicious' | 'simulation';

export type ScanStatus = 
  | 'idle'
  | 'scanning'
  | 'analyzing'
  | 'url_extracted'
  | 'checking_reputation'
  | 'checking_patterns'
  | 'complete';

export interface ThreatIntelligence {
  level: ThreatLevel;
  score: number; // 0-100, higher is safer
  source: string;
  details: ThreatDetail[];
  destination: {
    url: string;
    domain: string;
    redirectsTo?: string;
  };
  flags: {
    googleSafeBrowsing: boolean;
    proofpointIntelligence: boolean;
    sslValid: boolean;
    domainAge: 'new' | 'established' | 'unknown';
  };
  simulation?: SimulationInfo;
}

export interface ThreatDetail {
  type: 'google_safebrowsing' | 'proofpoint' | 'ssl' | 'domain' | 'pattern';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface SimulationInfo {
  isSimulation: true;
  campaignId: string;
  trainingMessage: string;
  source: string;
}

export interface ScanResult {
  id: string;
  timestamp: Date;
  originalUrl: string;
  threat: ThreatIntelligence;
  userAction?: 'proceeded' | 'blocked' | 'reported';
}

export interface UserSecurityProfile {
  score: number;
  totalScans: number;
  threatsBlocked: number;
  simulationsCaught: number;
  simulationsMissed: number;
  lastScanDate?: Date;
}

export type NavigationScreen = 
  | 'Scanner'
  | 'Analyzing'
  | 'SimulationDetected'
  | 'Success'
  | 'MaliciousPhish'
  | 'SafeLink'
  | 'IsolatedBrowser'
  | 'Settings';

export interface AnalyzingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete' | 'error';
}
