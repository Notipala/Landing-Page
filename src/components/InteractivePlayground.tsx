import { useState, useEffect, useRef } from "react";
import { 
  Terminal, Bolt, Shield, BookOpen, 
  Play, RefreshCw, Layers, Copy, Check, Lock, Unlock, ArrowRight,
  Sparkles, CheckCircle, AlertTriangle, HelpCircle, HardDrive, Cpu, Wifi
} from "lucide-react";
import { DashboardTab, PipelineStep, SecretItem, DocsPage } from "../types";

interface InteractivePlaygroundProps {
  initialTab: DashboardTab;
}

export default function InteractivePlayground({ initialTab }: InteractivePlaygroundProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);

  // Synchronization with external changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // ==========================================
  // VIEW: 1. KNOWLEDGE IMPORT ORGANIZER
  // ==========================================
  const [preset, setPreset] = useState<string>("Research-Library");
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([
    { id: "1", name: "Importing conversations, notes, and documents", status: "idle", duration: 1.2, logs: [] },
    { id: "2", name: "Extracting key people, topics, and entities", status: "idle", duration: 1.5, logs: [] },
    { id: "3", name: "Clustering sources into projects and themes", status: "idle", duration: 2.2, logs: [] },
    { id: "4", name: "Building cross-document idea connections", status: "idle", duration: 1.8, logs: [] },
    { id: "5", name: "Indexing knowledge for natural language search", status: "idle", duration: 2.5, logs: [] },
    { id: "6", name: "Publishing workspace with source-grounded context", status: "idle", duration: 1.5, logs: [] }
  ]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [consoleLogs]);

  const addConsoleLog = (text: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setConsoleLogs(prev => [...prev, `[${timestamp}] ${text}`]);
  };

  const handleRunPipeline = async () => {
    if (isBuilding) return;
    setIsBuilding(true);
    setProgress(0);
    setCurrentStepIndex(0);
    setConsoleLogs([]);
    
    // Set all idle
    setPipelineSteps(prev => prev.map(s => ({ ...s, status: "idle" })));
    
    addConsoleLog(`Starting knowledge organization for workspace: [${preset}]`);
    addConsoleLog(`Reading source library and preparing semantic index`);
    
    for (let i = 0; i < pipelineSteps.length; i++) {
      setCurrentStepIndex(i);
      setPipelineSteps(prev => {
        const next = [...prev];
        next[i].status = "running";
        return next;
      });
      
      addConsoleLog(`Processing: ${pipelineSteps[i].name}...`);
      
      // Simulate step duration
      const durationMs = pipelineSteps[i].duration * 600; 
      await new Promise(resolve => setTimeout(resolve, durationMs));
      
      setPipelineSteps(prev => {
        const next = [...prev];
        next[i].status = "success";
        return next;
      });
      
      const percent = Math.round(((i + 1) / pipelineSteps.length) * 100);
      setProgress(percent);
      addConsoleLog(`Completed: [${pipelineSteps[i].name}] in ${pipelineSteps[i].duration}s`);
    }
    
    setCurrentStepIndex(-1);
    setIsBuilding(false);
    addConsoleLog(`Knowledge workspace organized in 10.7s.`);
    addConsoleLog(`Ready: ${preset.toLowerCase()} now has searchable topics, projects, and connections.`);
  };

  // ==========================================
  // VIEW: 2. CONNECTED IDEAS EXPLORER
  // ==========================================
  const [bufferSize, setBufferSize] = useState<number>(32); // KB
  const [cpuCores, setCpuCores] = useState<number>(4);
  const [windowScale, setWindowScale] = useState<number>(16); // scaling multiplier
  const [latency, setLatency] = useState<number>(1.2);
  const [pings, setPings] = useState<string[]>([]);
  const pingIntervalRef = useRef<any>(null);

  // Dynamic Latency math
  useEffect(() => {
    const calculatedLatency = Math.max(0.38, 1.45 - (cpuCores * 0.08) - (windowScale * 0.02) + (bufferSize / 256 * 0.3));
    setLatency(Number(calculatedLatency.toFixed(2)));
  }, [bufferSize, cpuCores, windowScale]);

  // Generate simulated ping results in real time
  useEffect(() => {
    setPings([
      `Found link: market research -> customer interviews, strength=${(latency * 0.98).toFixed(2)}`,
      `Found link: thesis chapter -> citation notes, strength=${(latency * 1.01).toFixed(2)}`,
      `Found link: client brief -> meeting transcript, strength=${(latency * 0.95).toFixed(2)}`
    ]);

    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    
    pingIntervalRef.current = setInterval(() => {
      setPings(prev => {
        const seq = prev.length + 1;
        const offset = (Math.random() * 0.1 - 0.05);
        const timeVal = Math.max(0.35, latency + offset).toFixed(2);
        const nextPing = `Surfaced connection #${seq}: related idea score=${timeVal}`;
        return [...prev.slice(-4), nextPing];
      });
    }, 1500);

    return () => clearInterval(pingIntervalRef.current);
  }, [latency]);


  // ==========================================
  // VIEW: 3. AI-POWERED SEARCH
  // ==========================================
  const [secKey, setSecKey] = useState<string>("");
  const [secValue, setSecValue] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string>("");
  const [encrypting, setEncrypting] = useState<boolean>(false);
  const [vaultSecrets, setVaultSecrets] = useState<SecretItem[]>([
    { id: "1", key: "How did customers describe onboarding friction?", encryptedValue: "Sources: Interview Notes, March Call, Product Memo" },
    { id: "2", key: "What themes repeat across climate policy PDFs?", encryptedValue: "Sources: IPCC Summary, Thesis Notes, Seminar Transcript" }
  ]);

  const handleEncrypt = () => {
    if (!secKey || !secValue) return;
    setEncrypting(true);
    
    // Simulate adding a natural-language knowledge query
    setTimeout(() => {
      const containerValue = `Sources: ${secValue}`;
      
      const newItem: SecretItem = {
        id: Date.now().toString(),
        key: secKey.toUpperCase().replace(/\s+/g, '_'),
        encryptedValue: containerValue
      };

      setVaultSecrets(prev => [newItem, ...prev]);
      setSecKey("");
      setSecValue("");
      setEncrypting(false);
    }, 1200);
  };

  const handleDeleteSecret = (id: string) => {
    setVaultSecrets(prev => prev.filter(s => s.id !== id));
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };


  // ==========================================
  // VIEW: 4. PROJECT WORKSPACE BROWSER
  // ==========================================
  const [activeDocIndex, setActiveDocIndex] = useState<number>(0);
  const [queryInput, setQueryInput] = useState<string>('What are the strongest recurring themes across this project?');
  const [testResult, setTestResult] = useState<string>("");
  const [executingTest, setExecutingTest] = useState<boolean>(false);

  const docsArticles: DocsPage[] = [
    {
      id: "intro",
      title: "Research Library",
      description: "Collect papers, PDFs, annotations, and seminar notes into one searchable workspace that preserves long-term context.",
      method: "GET",
      endpoint: "12 sources / 48 linked ideas",
      requestSnippet: `Ask: "Which notes support my argument about institutional memory?"\n\nNotipala searches papers, highlights, transcripts, and saved chats together.`,
      responseSnippet: `{\n  "answer": "Three sources repeatedly connect institutional memory with onboarding quality.",\n  "sources": ["Seminar notes", "Interview transcript", "Literature review"],\n  "next_connections": ["knowledge retention", "team rituals", "handoff quality"]\n}`
    },
    {
      id: "client",
      title: "Client Strategy Workspace",
      description: "Keep client briefs, calls, research, and recommendations connected so insights stay findable across engagements.",
      method: "POST",
      endpoint: "8 projects / 133 notes",
      requestSnippet: `Ask: "What did this client care about most in the last three calls?"\n\nNotipala grounds the answer in transcripts, decks, and your private notes.`,
      responseSnippet: `{\n  "answer": "The strongest repeated needs are faster reporting, clearer ownership, and better onboarding documentation.",\n  "sources": ["Discovery call", "Q2 planning deck", "Account notes"],\n  "suggested_project": "Reporting Workflow Redesign"\n}`
    },
    {
      id: "founder",
      title: "Founder Memory Base",
      description: "Connect investor feedback, customer discovery, product notes, and strategy docs into a compounding operating memory.",
      method: "GET",
      endpoint: "21 interviews / 6 opportunity areas",
      requestSnippet: `Ask: "Which customer pains keep appearing across interviews?"\n\nNotipala links raw notes to themes, decisions, and open questions.`,
      responseSnippet: `{\n  "answer": "Customers repeatedly mention context switching, lost decisions, and duplicated research.",\n  "sources": ["Interview 04", "Interview 09", "Roadmap notes"],\n  "connected_ideas": ["knowledge fragmentation", "decision memory", "AI retrieval"]\n}`
    }
  ];

  const handleTestAPI = () => {
    setExecutingTest(true);
    setTestResult("");
    
    setTimeout(() => {
      setExecutingTest(false);
      if (activeDocIndex === 0) {
        setTestResult(docsArticles[0].responseSnippet);
      } else if (activeDocIndex === 1) {
        setTestResult(JSON.stringify({
          question: queryInput,
          answer: "The strongest recurring themes are information fragmentation, repeated context rebuilding, and the need for source-grounded summaries.",
          grounded_sources: ["Client discovery call", "Research notes", "Follow-up memo"],
          suggested_connections: ["knowledge reuse", "team memory", "client onboarding"]
        }, null, 2));
      } else {
        setTestResult(docsArticles[2].responseSnippet);
      }
    }, 1000);
  };


  return (
    <div className="w-full">
      {/* Tab Selectors */}
      <div className="flex flex-wrap gap-2 md:gap-4 justify-center border-b border-white/50 pb-6 mb-8">
        <button
          onClick={() => setActiveTab(DashboardTab.CICD)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold font-sans text-sm border transition-all scale-95 duration-200 ${
            activeTab === DashboardTab.CICD 
              ? "aluminum-button text-primary border-primary/20 shadow-md scale-100" 
              : "border-transparent text-on-surface-variant hover:text-primary hover:bg-primary/5"
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Organize Knowledge</span>
        </button>

        <button
          onClick={() => setActiveTab(DashboardTab.LATENCY)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold font-sans text-sm border transition-all scale-95 duration-200 ${
            activeTab === DashboardTab.LATENCY 
              ? "aluminum-button text-primary border-primary/20 shadow-md scale-100" 
              : "border-transparent text-on-surface-variant hover:text-primary hover:bg-primary/5"
          }`}
        >
          <Bolt className="w-4 h-4" />
          <span>Connected Ideas</span>
        </button>

        <button
          onClick={() => setActiveTab(DashboardTab.VAULT)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold font-sans text-sm border transition-all scale-95 duration-200 ${
            activeTab === DashboardTab.VAULT 
              ? "aluminum-button text-primary border-primary/20 shadow-md scale-100" 
              : "border-transparent text-on-surface-variant hover:text-primary hover:bg-primary/5"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>AI Search</span>
        </button>

        <button
          onClick={() => setActiveTab(DashboardTab.DOCS)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold font-sans text-sm border transition-all scale-95 duration-200 ${
            activeTab === DashboardTab.DOCS 
              ? "aluminum-button text-primary border-primary/20 shadow-md scale-100" 
              : "border-transparent text-on-surface-variant hover:text-primary hover:bg-primary/5"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Workspaces</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="w-full">
        {/* TAB 1: KNOWLEDGE ORGANIZATION */}
        {activeTab === DashboardTab.CICD && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card rounded-2xl p-6 border border-white/50 bg-white/40">
                <h4 className="text-lg font-bold text-on-background mb-4 font-sans flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Import Settings
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-on-surface-variant mb-1 font-semibold uppercase tracking-wide">
                      Select Knowledge Workspace
                    </label>
                    <select
                      value={preset}
                      onChange={(e) => setPreset(e.target.value)}
                      disabled={isBuilding}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary disabled:opacity-50"
                    >
                      <option value="Research-Library">Research Library</option>
                      <option value="Client-Strategy">Client Strategy Workspace</option>
                      <option value="Graduate-Thesis">Graduate Thesis Notes</option>
                      <option value="Founder-Memory">Founder Memory Base</option>
                    </select>
                  </div>

                  <button
                    onClick={handleRunPipeline}
                    disabled={isBuilding}
                    className="w-full px-6 py-4 rounded-xl font-bold bg-primary text-white flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
                  >
                    {isBuilding ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Organizing Knowledge ({progress}%)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 text-white fill-white" />
                        <span>Organize Sample Sources</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Flow Checklist */}
              <div className="glass-card rounded-2xl p-6 border border-white/50 bg-white/40">
                <h4 className="text-sm font-mono font-bold text-on-surface-variant mb-4 uppercase tracking-wider">
                  Organization Progress
                </h4>
                
                <div className="space-y-4">
                  {pipelineSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {step.status === "idle" && (
                          <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                            <span className="text-[10px] text-gray-400 font-mono">{index + 1}</span>
                          </div>
                        )}
                        {step.status === "running" && (
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                            <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" />
                          </div>
                        )}
                        {step.status === "success" && (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <span className={`text-xs font-sans font-medium leading-none ${
                        step.status === "running" ? "text-primary font-bold animate-pulse" : 
                        step.status === "success" ? "text-on-background line-through opacity-60" : "text-gray-500"
                      }`}>
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Terminal Panel */}
            <div className="lg:col-span-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                {/* Screen Header */}
                <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500 block"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono font-semibold ml-2">
                      workspace://notipala/{preset.toLowerCase()}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-primary font-bold tracking-widest bg-primary/10 px-2 py-0.5 rounded uppercase border border-primary/20">
                    Live Index
                  </span>
                </div>

                {/* Console Outputs */}
                <div className="p-6 h-[400px] overflow-y-auto font-mono text-xs space-y-2 bg-slate-900 text-slate-300">
                  {consoleLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-center space-y-2">
                      <Terminal className="w-8 h-8 text-zinc-600 block animate-bounce" />
                      <p className="max-w-xs text-xs font-sans leading-relaxed">
                        Ready. Click <span className="text-primary font-semibold">"Organize"</span> to turn scattered sources into connected topics and searchable context.
                      </p>
                    </div>
                  ) : (
                    consoleLogs.map((log, logIndex) => (
                      <div key={logIndex} className="leading-relaxed hover:bg-white/5 px-2 py-0.5 rounded transition-colors whitespace-pre-wrap">
                        {log.startsWith("[") ? (
                          <>
                            <span className="text-zinc-500 select-none mr-2">{log.substring(0, 10)}</span>
                            <span>{log.substring(10)}</span>
                          </>
                        ) : (
                          log
                        )}
                      </div>
                    ))
                  )}
                  <div ref={consoleEndRef} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONNECTED IDEAS */}
        {activeTab === DashboardTab.LATENCY && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card rounded-2xl p-6 border border-white/50 bg-white/40">
                <h4 className="text-lg font-bold text-on-background mb-6 font-sans">
                  Tune Idea Discovery
                </h4>

                <div className="space-y-6">
                  {/* Slider 1 */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-mono text-on-surface-variant font-bold uppercase tracking-wider">
                        Source Diversity
                      </label>
                      <span className="text-sm font-mono font-bold text-primary">{bufferSize} sources</span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={256}
                      step={8}
                      value={bufferSize}
                      onChange={(e) => setBufferSize(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      More source types help Notipala connect ideas across chats, documents, PDFs, and notes.
                    </p>
                  </div>

                  {/* Slider 2 */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-mono text-on-surface-variant font-bold uppercase tracking-wider">
                        Concept Sensitivity
                      </label>
                      <span className="text-sm font-mono font-bold text-primary">{cpuCores} levels</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={16}
                      step={1}
                      value={cpuCores}
                      onChange={(e) => setCpuCores(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Higher sensitivity surfaces broader relationships between people, themes, and decisions.
                    </p>
                  </div>

                  {/* Slider 3 */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-mono text-on-surface-variant font-bold uppercase tracking-wider">
                        Context Window
                      </label>
                      <span className="text-sm font-mono font-bold text-primary">{windowScale}x</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={64}
                      step={1}
                      value={windowScale}
                      onChange={(e) => setWindowScale(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Larger context windows help preserve long-term project memory across work sessions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Latency Indicators */}
            <div className="lg:col-span-7 space-y-6">
              {/* Score Display Card */}
              <div className="machined-surface rounded-[2rem] p-8 border border-white/40 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-md">
                <div className="absolute top-4 right-4 animate-pulse flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full text-[10px] text-green-700 font-mono font-bold uppercase tracking-widest">
                  <Wifi className="w-3.5 h-3.5" /> status: optimized
                </div>

                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest font-bold mb-2">
                  Connection Strength Score
                </span>

                <div className="relative my-4 flex items-center justify-center">
                  <span className="text-6xl md:text-8xl font-black font-sans text-primary tracking-tight font-extrabold select-none">
                    {latency}
                  </span>
                  <span className="text-lg md:text-2xl font-bold text-on-surface ml-1 font-mono">x</span>
                </div>

                <div className="max-w-md mx-auto mt-2">
                  {latency <= 0.5 ? (
                    <p className="text-xs font-sans text-green-700 bg-green-500/10 px-4 py-2 rounded-xl font-medium border border-green-500/20">
                      Strong: Notipala is surfacing meaningful connections across your knowledge base.
                    </p>
                  ) : (
                    <p className="text-xs font-sans text-gray-600">
                      Increase source diversity and context window to reveal deeper cross-project relationships.
                    </p>
                  )}
                </div>
              </div>

              {/* ICMP Tracer Terminal */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 overflow-hidden">
                <h5 className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold mb-4 flex items-center gap-1.5 select-none">
                  <span className="w-2 h-2 rounded-full bg-primary block animate-ping"></span>
                  live idea connection stream
                </h5>

                <div className="font-mono text-xs text-slate-400 space-y-1.5">
                  {pings.map((p, idx) => (
                    <div key={idx} className="flex justify-between hover:bg-slate-800/40 px-2 py-0.5 rounded transition-all">
                      <span className="text-slate-300">{p}</span>
                      <span className="text-[10px] text-gray-500 select-none">linked</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AI SEARCH */}
        {activeTab === DashboardTab.VAULT && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Query Box */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card rounded-2xl p-6 border border-white/50 bg-white/40">
                <h4 className="text-lg font-bold text-on-background mb-4 font-sans flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Ask Your Knowledge
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-on-surface-variant font-bold mb-1 uppercase tracking-wider">
                      Question
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. What did customers repeat most often?"
                      value={secKey}
                      onChange={(e) => setSecKey(e.target.value)}
                      disabled={encrypting}
                      className="w-full text-sm rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-primary disabled:opacity-50 uppercase placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-on-surface-variant font-bold mb-1 uppercase tracking-wider">
                      Grounding Sources
                    </label>
                    <textarea
                      placeholder="Interview notes, PDFs, meeting transcripts..."
                      value={secValue}
                      onChange={(e) => setSecValue(e.target.value)}
                      disabled={encrypting}
                      className="w-full text-sm rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-primary disabled:opacity-50 font-mono placeholder:text-gray-400 h-24"
                    />
                  </div>

                  <button
                    onClick={handleEncrypt}
                    disabled={encrypting || !secKey || !secValue}
                    className="w-full px-6 py-4 rounded-xl font-bold bg-primary text-white flex items-center justify-center gap-2 shadow-md hover:bg-primary/95 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
                  >
                    {encrypting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Searching sources...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 text-white" />
                        <span>Save Knowledge Query</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Answer Container */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass-card rounded-2xl p-6 border border-white/50 bg-white/40 h-full">
                <h4 className="text-sm font-mono font-bold text-on-surface-variant mb-4 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-primary" />
                  Saved Knowledge Questions
                </h4>

                <div className="space-y-3">
                  {vaultSecrets.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-sans text-sm space-y-2">
                      <Unlock className="w-8 h-8 text-gray-300 mx-auto block" />
                      <p>No saved questions yet. Ask Notipala something grounded in your sources.</p>
                    </div>
                  ) : (
                    vaultSecrets.map((v) => (
                      <div
                        key={v.id}
                        className="machined-surface rounded-xl p-4 border border-white/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-mono font-bold text-primary block leading-none">
                            {v.key}
                          </span>
                          <span className="text-[11px] font-mono text-gray-500 block break-all leading-tight">
                            {v.encryptedValue}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleCopyText(v.encryptedValue, v.id)}
                            className="p-2 rounded-lg bg-white/60 hover:bg-white text-gray-500 hover:text-primary transition-all border border-gray-200"
                            title="Copy source list"
                          >
                            {copiedId === v.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteSecret(v.id)}
                            className="p-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 transition-all text-xs font-bold px-3 font-sans"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-primary-container/20 border border-primary/10 text-xs font-sans text-primary leading-relaxed flex items-start gap-2">
                  <Shield className="w-5 h-5 flex-shrink-0 text-primary mt-0.5" />
                  <div>
                    <strong>Source-grounded answers:</strong> Notipala retrieves context from your own notes, documents, PDFs, websites, and conversations so responses stay tied to the knowledge you collected.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROJECT WORKSPACES */}
        {activeTab === DashboardTab.DOCS && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Guide List */}
            <div className="lg:col-span-4 space-y-3">
              <h5 className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold mb-3 px-1 select-none">
                Project Workspace Browser
              </h5>

              {docsArticles.map((doc, idx) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setActiveDocIndex(idx);
                    setTestResult("");
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all scale-95 duration-200 ${
                    activeDocIndex === idx
                      ? "machined-surface border-primary/20 text-on-background scale-100 font-semibold shadow-sm"
                      : "border-transparent text-on-surface-variant hover:bg-white/40 hover:text-primary hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 font-bold rounded ${
                      doc.method === "GET" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {doc.method}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">{doc.endpoint}</span>
                  </div>
                  <h6 className="text-sm font-bold font-sans text-zinc-900 select-none">
                    {doc.title}
                  </h6>
                </button>
              ))}
            </div>

            {/* Workspace Detail and Live Question Client */}
            <div className="lg:col-span-8 space-y-6">
              <div className="glass-card rounded-2xl p-6 border border-white/50 bg-white/40">
                <h4 className="text-xl font-bold text-zinc-900 mb-2 font-sans">
                  {docsArticles[activeDocIndex].title}
                </h4>
                <p className="text-sm text-zinc-600 mb-6 font-sans leading-relaxed">
                  {docsArticles[activeDocIndex].description}
                </p>

                {/* Request code block */}
                <div className="relative mb-6">
                  <div className="absolute top-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-800/80 px-2.5 py-1 rounded font-bold uppercase tracking-widest">
                      Example Knowledge Query
                    </span>
                  </div>
                  <pre className="bg-slate-900 text-zinc-200 p-5 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed border border-slate-800">
                    {docsArticles[activeDocIndex].requestSnippet}
                  </pre>
                </div>

                {/* Live Sandbox Interactive Form */}
                <div className="p-5 rounded-2xl bg-white/80 border border-gray-200 space-y-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary block animate-ping"></span>
                      <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">
                        Notipala Knowledge Query Simulator
                      </span>
                    </div>

                    <button
                      onClick={handleTestAPI}
                      disabled={executingTest}
                      className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold shadow transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                    >
                      {executingTest ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Reading sources...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Ask Workspace</span>
                        </>
                      )}
                    </button>
                  </div>

                  {activeDocIndex === 1 && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                        Ask a question across this workspace:
                      </label>
                      <textarea
                        value={queryInput}
                        onChange={(e) => setQueryInput(e.target.value)}
                        className="w-full text-xs font-mono rounded-xl p-3 bg-gray-50 border border-gray-200 block text-zinc-800 h-20 outline-none focus:border-primary"
                      />
                    </div>
                  )}

                  {/* Knowledge response block */}
                  {testResult && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-green-700 uppercase tracking-widest block font-bold">
                        Source-Grounded Response
                      </span>
                      <pre className="bg-slate-900 text-green-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                        {testResult}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
