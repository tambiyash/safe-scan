// SafeScan Global State Management with Zustand

import { create } from 'zustand';
import { 
  ScanStatus, 
  ScanResult, 
  ThreatIntelligence, 
  UserSecurityProfile,
  AnalyzingStep 
} from '../types';

interface ScanState {
  // Current scan state
  status: ScanStatus;
  currentUrl: string | null;
  currentResult: ScanResult | null;
  analyzingSteps: AnalyzingStep[];
  
  // User profile
  userProfile: UserSecurityProfile;
  
  // History
  scanHistory: ScanResult[];
  
  // Actions
  startScan: (url: string) => void;
  updateStatus: (status: ScanStatus) => void;
  updateAnalyzingStep: (stepId: string, stepStatus: AnalyzingStep['status']) => void;
  completeScan: (result: ScanResult) => void;
  resetScan: () => void;
  recordUserAction: (action: ScanResult['userAction']) => void;
  updateUserProfile: (updates: Partial<UserSecurityProfile>) => void;
}

const initialAnalyzingSteps: AnalyzingStep[] = [
  { id: 'url', label: 'URL extracted', status: 'pending' },
  { id: 'reputation', label: 'Domain reputation check', status: 'pending' },
  { id: 'patterns', label: 'Phishing pattern analysis', status: 'pending' },
];

const initialUserProfile: UserSecurityProfile = {
  score: 85,
  totalScans: 0,
  threatsBlocked: 0,
  simulationsCaught: 0,
  simulationsMissed: 0,
};

export const useScanStore = create<ScanState>((set, get) => ({
  // Initial state
  status: 'idle',
  currentUrl: null,
  currentResult: null,
  analyzingSteps: [...initialAnalyzingSteps],
  userProfile: initialUserProfile,
  scanHistory: [],

  // Actions
  startScan: (url: string) => {
    set({
      status: 'scanning',
      currentUrl: url,
      currentResult: null,
      analyzingSteps: initialAnalyzingSteps.map(step => ({ ...step, status: 'pending' })),
    });
  },

  updateStatus: (status: ScanStatus) => {
    set({ status });
  },

  updateAnalyzingStep: (stepId: string, stepStatus: AnalyzingStep['status']) => {
    set(state => ({
      analyzingSteps: state.analyzingSteps.map(step =>
        step.id === stepId ? { ...step, status: stepStatus } : step
      ),
    }));
  },

  completeScan: (result: ScanResult) => {
    const { userProfile, scanHistory } = get();
    
    // Update user profile based on result
    const newProfile = { ...userProfile };
    newProfile.totalScans += 1;
    newProfile.lastScanDate = new Date();
    
    if (result.threat.level === 'malicious') {
      newProfile.threatsBlocked += 1;
    }
    
    if (result.threat.simulation) {
      newProfile.simulationsCaught += 1;
      // Increase score for catching simulation
      newProfile.score = Math.min(100, newProfile.score + 2);
    }

    set({
      status: 'complete',
      currentResult: result,
      scanHistory: [result, ...scanHistory].slice(0, 50), // Keep last 50
      userProfile: newProfile,
    });
  },

  resetScan: () => {
    set({
      status: 'idle',
      currentUrl: null,
      currentResult: null,
      analyzingSteps: initialAnalyzingSteps.map(step => ({ ...step, status: 'pending' })),
    });
  },

  recordUserAction: (action: ScanResult['userAction']) => {
    const { currentResult, userProfile } = get();
    if (!currentResult) return;

    const updatedResult = { ...currentResult, userAction: action };
    
    // Penalize if user proceeded with malicious link
    let newProfile = { ...userProfile };
    if (action === 'proceeded' && currentResult.threat.level === 'malicious') {
      newProfile.score = Math.max(0, newProfile.score - 5);
    }
    
    // Penalize if user proceeded with simulation (missed training)
    if (action === 'proceeded' && currentResult.threat.simulation) {
      newProfile.simulationsMissed += 1;
      newProfile.simulationsCaught -= 1; // Reverse the earlier increment
      newProfile.score = Math.max(0, newProfile.score - 3);
    }

    set({
      currentResult: updatedResult,
      userProfile: newProfile,
    });
  },

  updateUserProfile: (updates: Partial<UserSecurityProfile>) => {
    set(state => ({
      userProfile: { ...state.userProfile, ...updates },
    }));
  },
}));
