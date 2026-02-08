// SafeScan Navigation Types

export type RootStackParamList = {
  Scanner: undefined;
  Analyzing: undefined;
  SimulationDetected: undefined;
  Success: undefined;
  MaliciousPhish: undefined;
  SafeLink: undefined;
  IsolatedBrowser: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
