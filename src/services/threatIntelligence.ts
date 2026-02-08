// SafeScan Threat Intelligence Service
// This simulates threat checking - in production, connect to real APIs

import { ThreatIntelligence, ThreatLevel, ThreatDetail } from '../types';

// Simulated delay for realistic UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Demo URLs for testing different scenarios
const DEMO_SCENARIOS: Record<string, Partial<ThreatIntelligence>> = {
  // Simulation/Training URLs
  'training.proofpoint.com': {
    level: 'simulation',
    score: 50,
    source: 'Proofpoint Training',
    simulation: {
      isSimulation: true,
      campaignId: 'campaign-2024',
      trainingMessage: 'This QR code was created by your security team to test your awareness. Great job scanning it safely!',
      source: 'Proofpoint Training',
    },
  },
  'phish-sim': {
    level: 'simulation',
    score: 50,
    source: 'Proofpoint Training',
    simulation: {
      isSimulation: true,
      campaignId: 'sim-2024-q1',
      trainingMessage: 'This is a simulated phishing attempt from your IT security team.',
      source: 'Security Awareness Training',
    },
  },
  
  // Malicious URLs
  'malicious-site-example.xyz': {
    level: 'malicious',
    score: 5,
    source: 'Google SafeBrowsing',
    details: [
      {
        type: 'google_safebrowsing',
        title: 'Google SafeBrowsing',
        description: 'Flagged as malicious',
        severity: 'critical',
      },
      {
        type: 'proofpoint',
        title: 'Proofpoint Intelligence',
        description: 'Known credential harvester',
        severity: 'critical',
      },
      {
        type: 'ssl',
        title: 'SSL Certificate',
        description: 'Invalid or self-signed certificate',
        severity: 'warning',
      },
    ],
    flags: {
      googleSafeBrowsing: true,
      proofpointIntelligence: true,
      sslValid: false,
      domainAge: 'new',
    },
  },
  
  // Safe URLs
  'example-company.com': {
    level: 'safe',
    score: 95,
    source: 'Verified Business',
    details: [
      {
        type: 'google_safebrowsing',
        title: 'Google SafeBrowsing',
        description: 'No threats detected',
        severity: 'info',
      },
      {
        type: 'ssl',
        title: 'SSL Certificate',
        description: 'Valid certificate from trusted CA',
        severity: 'info',
      },
      {
        type: 'domain',
        title: 'Domain Reputation',
        description: 'Established business domain',
        severity: 'info',
      },
    ],
    flags: {
      googleSafeBrowsing: false,
      proofpointIntelligence: false,
      sslValid: true,
      domainAge: 'established',
    },
  },
};

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname;
  } catch {
    return url.split('/')[0];
  }
}

function findMatchingScenario(url: string): Partial<ThreatIntelligence> | null {
  const lowerUrl = url.toLowerCase();
  
  for (const [pattern, scenario] of Object.entries(DEMO_SCENARIOS)) {
    if (lowerUrl.includes(pattern.toLowerCase())) {
      return scenario;
    }
  }
  
  return null;
}

function generateRandomThreatLevel(): ThreatLevel {
  const rand = Math.random();
  if (rand < 0.7) return 'safe';
  if (rand < 0.85) return 'suspicious';
  if (rand < 0.95) return 'malicious';
  return 'simulation';
}

export async function analyzeUrl(url: string): Promise<ThreatIntelligence> {
  const domain = extractDomain(url);
  
  // Check for demo scenarios first
  const matchedScenario = findMatchingScenario(url);
  
  if (matchedScenario) {
    // Simulate analysis time
    await delay(800);
    
    return {
      level: matchedScenario.level || 'safe',
      score: matchedScenario.score || 50,
      source: matchedScenario.source || 'Unknown',
      details: matchedScenario.details || [],
      destination: {
        url: url,
        domain: domain,
        redirectsTo: matchedScenario.level === 'simulation' 
          ? `https://training.proofpoint.com/phish-sim/campaign-2024`
          : undefined,
      },
      flags: matchedScenario.flags || {
        googleSafeBrowsing: false,
        proofpointIntelligence: false,
        sslValid: true,
        domainAge: 'unknown',
      },
      simulation: matchedScenario.simulation,
    };
  }
  
  // For unknown URLs, generate a realistic response
  await delay(1200);
  
  const level = generateRandomThreatLevel();
  const score = level === 'safe' ? 85 + Math.floor(Math.random() * 15) :
                level === 'suspicious' ? 40 + Math.floor(Math.random() * 30) :
                level === 'malicious' ? Math.floor(Math.random() * 20) :
                50;
  
  const details: ThreatDetail[] = [];
  
  if (level === 'malicious') {
    details.push({
      type: 'google_safebrowsing',
      title: 'Google SafeBrowsing',
      description: 'Potential phishing site detected',
      severity: 'critical',
    });
  }
  
  if (level === 'suspicious') {
    details.push({
      type: 'domain',
      title: 'Domain Analysis',
      description: 'Recently registered domain',
      severity: 'warning',
    });
  }
  
  if (level === 'safe') {
    details.push({
      type: 'google_safebrowsing',
      title: 'Google SafeBrowsing',
      description: 'No threats detected',
      severity: 'info',
    });
  }
  
  return {
    level,
    score,
    source: level === 'safe' ? 'Verified' : 'Threat Intelligence',
    details,
    destination: {
      url,
      domain,
    },
    flags: {
      googleSafeBrowsing: level === 'malicious',
      proofpointIntelligence: level === 'malicious',
      sslValid: level !== 'malicious',
      domainAge: level === 'safe' ? 'established' : 'new',
    },
  };
}

export async function performAnalysisSteps(
  url: string,
  onStepComplete: (stepId: string) => void
): Promise<ThreatIntelligence> {
  // Step 1: URL Extraction
  await delay(400);
  onStepComplete('url');
  
  // Step 2: Domain Reputation Check
  await delay(600);
  onStepComplete('reputation');
  
  // Step 3: Phishing Pattern Analysis
  const result = await analyzeUrl(url);
  onStepComplete('patterns');
  
  return result;
}
