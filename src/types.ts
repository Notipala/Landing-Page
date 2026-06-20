export enum AppView {
  LANDING = "LANDING",
  DASHBOARD = "DASHBOARD",
}

export enum DashboardTab {
  CICD = "CICD",
  LATENCY = "LATENCY",
  VAULT = "VAULT",
  DOCS = "DOCS",
}

export interface PipelineStep {
  id: string;
  name: string;
  status: "idle" | "running" | "success" | "failed";
  duration: number; // in sec
  logs: string[];
}

export interface SecretItem {
  id: string;
  key: string;
  encryptedValue: string;
}

export interface DocsPage {
  id: string;
  title: string;
  description: string;
  method: "GET" | "POST" | "DELETE" | "PUT";
  endpoint: string;
  requestSnippet: string;
  responseSnippet: string;
}
