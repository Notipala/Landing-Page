import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, Sparkles, Terminal, Shield, Cpu, Info, 
  HelpCircle, ChevronLeft, ChevronRight, CornerDownLeft, Undo, Command,
  Twitter, Github
} from "lucide-react";
import { AppView, DashboardTab } from "./types";
import ShaderBackground from "./components/ShaderBackground";
import Mascot from "./components/Mascot";
import BentoGrid from "./components/BentoGrid";
import InteractivePlayground from "./components/InteractivePlayground";
import Navigation from "./components/Navigation";
import WaterDropBackground from "./components/WaterDropBackground";
import CursorFollower from "./components/CursorFollower";

export default function App() {
  const [currentView, setView] = useState<AppView>(AppView.LANDING);
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.CICD);
  const [typedHeadlineLength, setTypedHeadlineLength] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = window.localStorage.getItem("notipala-theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    window.localStorage.setItem("notipala-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const headlinePrefix = "Organize Knowledge. ";
  const headlineAccent = "Connect";
  const headlineSuffix = " Ideas.";
  const headlineText = `${headlinePrefix}${headlineAccent}${headlineSuffix}`;
  const typedHeadline = headlineText.slice(0, typedHeadlineLength);
  const typedPrefix = typedHeadline.slice(0, Math.min(typedHeadline.length, headlinePrefix.length));
  const typedAccent = typedHeadline.slice(headlinePrefix.length, headlinePrefix.length + headlineAccent.length);
  const typedSuffix = typedHeadline.slice(headlinePrefix.length + headlineAccent.length);

  useEffect(() => {
    if (currentView !== AppView.LANDING) return;

    let animationTimer: number | undefined;
    let nextLength = 0;

    const schedule = (callback: () => void, delay: number) => {
      animationTimer = window.setTimeout(callback, delay);
    };

    const eraseHeadline = () => {
      nextLength -= 1;
      setTypedHeadlineLength(nextLength);

      if (nextLength > 0) {
        schedule(eraseHeadline, 18);
      } else {
        schedule(typeHeadline, 500);
      }
    };

    const typeHeadline = () => {
      nextLength += 1;
      setTypedHeadlineLength(nextLength);

      if (nextLength < headlineText.length) {
        const naturalPause = /[:,.]/.test(headlineText[nextLength - 1]) ? 180 : 36;
        schedule(typeHeadline, naturalPause);
      } else {
        schedule(eraseHeadline, 2400);
      }
    };

    setTypedHeadlineLength(0);
    schedule(typeHeadline, 250);

    return () => {
      if (animationTimer) window.clearTimeout(animationTimer);
    };
  }, [currentView, headlineText.length]);

  const handleSelectBentoTab = (tab: "CICD" | "LATENCY" | "VAULT" | "DOCS") => {
    // Maps the Bento clicks directly into dashboard core views
    if (tab === "CICD") setActiveTab(DashboardTab.CICD);
    if (tab === "LATENCY") setActiveTab(DashboardTab.LATENCY);
    if (tab === "VAULT") setActiveTab(DashboardTab.VAULT);
    if (tab === "DOCS") setActiveTab(DashboardTab.DOCS);
    
    // Smooth scroll back to top to view dashboard tabs beautifully
    window.scrollTo({ top: 0, behavior: "smooth" });
    setView(AppView.DASHBOARD);
  };

  return (
    <div className={`min-h-screen bg-background text-on-background font-sans relative selection:bg-primary-container selection:text-on-primary-container film-grain overflow-x-hidden transition-colors duration-300 ${isDarkMode ? "dark" : ""}`}>
      <div className="fixed inset-0 -z-30 bg-background transition-colors duration-300"></div>
      <div className="fixed inset-0 -z-20 opacity-20 dark:opacity-18 pointer-events-none">
        <ShaderBackground />
      </div>
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <WaterDropBackground className="opacity-55 dark:opacity-85" />
      </div>
      <div className="fixed inset-0 -z-10 pointer-events-none modern-page-vignette"></div>
      <CursorFollower />
      
      {/* Dynamic Header */}
      <Navigation 
        currentView={currentView} 
        setView={setView} 
        onSelectTab={setActiveTab} 
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((value) => !value)}
      />

      {/* Main Container */}
      <main className="pt-20 relative z-10 w-full">
        <AnimatePresence mode="wait">
          
          {/* ==========================================
              PERSPECTIVE A: LANDING SHOWCASE PAGE
             ========================================== */}
          {currentView === AppView.LANDING && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1] }}
            >
              
              {/* 1. HERO SECTION */}
              <section className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-6 md:px-12 py-12 md:py-16 relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent"></div>
                <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center modern-hero-shell rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 lg:p-12">
                  
                  {/* Left Column Content */}
                  <div className="z-10 text-left space-y-6 md:space-y-8 hero-reveal">
                    {/* Living beta badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 select-none">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      <span className="font-mono text-[10px] text-primary uppercase tracking-widest font-bold">
                        Early Access Now Open
                      </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-on-surface leading-[1.05] tracking-tight font-sans min-h-[8rem] md:min-h-[10rem] lg:min-h-[12rem]">
                      <span>{typedPrefix}</span>
                      <span className="text-primary italic font-serif">{typedAccent}</span>
                      <span>{typedSuffix}</span>
                      <span className="typing-cursor" aria-hidden="true"></span>
                    </h1>

                    <p className="text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed select-none hero-reveal hero-reveal-delay-1">
                      Turn scattered conversations, documents, and notes into a connected knowledge system. Notipala helps researchers, students, consultants, and knowledge workers collect information, organize it automatically, and discover meaningful connections between ideas.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2 hero-reveal hero-reveal-delay-2">
                      <button 
                        onClick={() => {
                          setView(AppView.DASHBOARD);
                          setActiveTab(DashboardTab.CICD);
                        }}
                        className="px-8 py-4 rounded-xl aluminum-button text-primary font-bold text-base flex items-center gap-3 shadow-md border border-glass-edge select-none scale-100 hover:scale-103 cursor-pointer"
                      >
                        Join Waitlist
                        <ArrowRight className="w-5 h-5" />
                      </button>

                      <button 
                        onClick={() => {
                          setView(AppView.DASHBOARD);
                          setActiveTab(DashboardTab.DOCS);
                        }}
                        className="px-8 py-4 rounded-xl glass-card text-on-background font-bold text-base border border-glass-edge select-none scale-100 hover:scale-103 cursor-pointer"
                      >
                        See How It Works
                      </button>

                    </div>
                  </div>

                  {/* Right Column Mascot Canvas */}
                  <div className="relative hero-reveal hero-reveal-delay-3">
                    <Mascot />
                  </div>
                </div>
              </section>

              {/* 2. BENTO FEATURES SECTION */}
              <section id="features-section" className="py-24 px-6 md:px-12 bg-surface-container-low/30 border-y border-glass-edge">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
                    <div className="max-w-2xl text-left space-y-4">
                      <h2 className="text-3xl md:text-5xl font-black font-sans text-on-surface tracking-tight">
                        Why Notipala?
                      </h2>
                      <p className="text-sm md:text-base text-on-surface-variant font-sans leading-relaxed select-none">
                        Knowledge today is fragmented across chats, documents, PDFs, websites, and notes. Notipala creates a persistent workspace where everything stays connected and searchable.
                      </p>
                    </div>

                    {/* Small horizontal carousel chevrons */}
                    <div className="flex gap-3 select-none">
                      <button 
                        onClick={() => {
                          setView(AppView.DASHBOARD);
                          setActiveTab(DashboardTab.CICD);
                        }}
                        className="w-12 h-12 rounded-full aluminum-button flex items-center justify-center cursor-pointer border border-glass-edge shadow-sm"
                      >
                        <ChevronLeft className="w-5 h-5 text-primary" />
                      </button>
                      <button 
                        onClick={() => {
                          setView(AppView.DASHBOARD);
                          setActiveTab(DashboardTab.DOCS);
                        }}
                        className="w-12 h-12 rounded-full aluminum-button flex items-center justify-center cursor-pointer border border-glass-edge shadow-sm"
                      >
                        <ChevronRight className="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </div>

                  {/* Bento Grid layout */}
                  <BentoGrid onSelectTab={handleSelectBentoTab} />
                </div>
              </section>

              {/* 3. PRODUCT DESCRIPTION SECTION */}
              <section className="py-24 px-6 md:px-12 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                  <h2 className="text-3xl md:text-5xl font-black font-sans text-on-surface tracking-tight">
                    Stop Relearning What You Already Know
                  </h2>
                  <div className="glass-card rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden border border-white/60 shadow-lg text-left bg-white/70">
                    <div className="absolute inset-0 bg-primary/5 -z-10 pointer-events-none"></div>
                    
                    <p className="text-zinc-800 text-sm md:text-base leading-relaxed md:leading-loose font-sans">
                      Your knowledge should compound over time. Instead of searching through old chats, documents, and folders, Notipala helps you build a connected knowledge system that grows with you. Import sources, structure them into topics and projects, and surface the context you need when a new question appears.
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. CALL TO ACTION SECTION */}
              <section className="py-10 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {["Researchers", "Consultants", "Analysts", "Graduate Students", "Founders", "Knowledge Workers"].map((audience) => (
                      <div
                        key={audience}
                        className="glass-card rounded-2xl px-4 py-5 text-center border border-glass-edge text-sm font-bold text-on-surface shadow-sm"
                      >
                        {audience}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 5. CALL TO ACTION SECTION */}
              <section className="py-20 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                  <div className="machined-surface rounded-[3.5rem] p-8 md:p-20 text-center relative overflow-hidden border border-white/40 shadow-inner group">
                    <div className="absolute inset-0 w-full h-full opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                      <ShaderBackground />
                    </div>

                    <div className="relative z-10 max-w-2xl mx-auto space-y-6 md:space-y-8">
                      <h2 className="text-3xl md:text-5xl font-black font-sans text-on-surface leading-none tracking-tight">
                        Get Early Access
                      </h2>
                      <p className="text-sm md:text-base text-on-surface-variant font-sans max-w-xl mx-auto leading-relaxed select-none">
                        Join the waitlist and help shape the future of knowledge management for researchers, consultants, analysts, students, founders, and knowledge workers.
                      </p>

                      <div className="flex justify-center pt-2">
                        <button 
                          onClick={() => {
                            setView(AppView.DASHBOARD);
                            setActiveTab(DashboardTab.CICD);
                          }}
                          className="px-8 md:px-12 py-5 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl scale-100 hover:scale-105 active:scale-95 transition-all outline-none border border-primary/10 select-none cursor-pointer"
                        >
                          Join the Waitlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            </motion.div>
          )}

          {/* ==========================================
              PERSPECTIVE B: THE DYNAMIC LIVE DASHBOARD
             ========================================== */}
          {currentView === AppView.DASHBOARD && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto px-6 md:px-12 py-10"
            >
              {/* Dashboard Jumbotron Head */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-8 mb-8 gap-6 text-left select-none">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                    <Command className="w-3 h-3" /> Console Work-space v2.0
                  </div>
                  <h2 className="text-3xl font-black text-zinc-900 tracking-tight font-sans">
                    Notipala Knowledge Workspace
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Collect, connect, and retrieve knowledge across projects, clients, research topics, and teams.
                  </p>
                </div>

                {/* Back quick link */}
                <button
                  onClick={() => setView(AppView.LANDING)}
                  className="aluminum-button px-5 py-2.5 rounded-xl text-xs font-bold font-sans flex items-center gap-2 border border-gray-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
                >
                  <Undo className="w-4 h-4 text-primary" />
                  <span>Return to Landing Page</span>
                </button>
              </div>

              {/* Embedded Interactive Knowledge Workspace */}
              <InteractivePlayground initialTab={activeTab} />

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="w-full py-16 bg-white border-t border-glass-edge mt-12 select-none">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 max-w-7xl mx-auto gap-8 text-left md:text-center">
          
          <div className="flex flex-col items-center md:items-start gap-4">
            <div 
              onClick={() => setView(AppView.LANDING)}
              className="text-xl font-black text-on-surface tracking-tight cursor-pointer hover:text-primary transition-colors"
            >
              Notipala
            </div>
            <p className="text-gray-500 font-sans text-xs max-w-xs text-center md:text-left leading-normal">
              A connected knowledge system for researchers, consultants, analysts, founders, students, and knowledge workers.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors text-xs font-semibold font-sans">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors text-xs font-semibold font-sans">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors text-xs font-semibold font-sans flex items-center gap-1">
              <Twitter className="w-3.5 h-3.5 fill-current" /> Twitter
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors text-xs font-semibold font-sans flex items-center gap-1">
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          </div>

          <div className="text-gray-400 font-sans text-xs">
            © 2026 Notipala. Built for connected thinking.
          </div>
        </div>
      </footer>
    </div>
  );
}
