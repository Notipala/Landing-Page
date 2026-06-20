import { useState, FormEvent } from "react";
import { AppView, DashboardTab } from "../types";
import { 
  X, Check, Lock, Shield, Cpu, Sparkles, 
  RefreshCw, Terminal, CheckCircle, Github, Twitter, Info,
  Moon, Sun
} from "lucide-react";

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onSelectTab: (tab: DashboardTab) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Navigation({ currentView, setView, onSelectTab, isDarkMode, onToggleDarkMode }: NavigationProps) {
  const [activeModal, setActiveModal] = useState<"none" | "signin" | "pricing" | "changelog">("none");
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPass) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthSuccess(true);
      setTimeout(() => {
        setAuthSuccess(false);
        setActiveModal("none");
        setAuthEmail("");
        setAuthPass("");
        setView(AppView.DASHBOARD);
      }, 1000);
    }, 1300);
  };

  const handleSelectPricingTier = (tierName: string) => {
    setActiveModal("none");
    setView(AppView.DASHBOARD);
    onSelectTab(DashboardTab.VAULT);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-glass-edge shadow-sm h-20 flex items-center select-none">
        <nav className="flex justify-between items-center w-full px-6 md:px-12 max-w-7xl mx-auto">
          {/* Logo */}
          <div 
            onClick={() => setView(AppView.LANDING)}
            className="text-2xl font-black font-sans text-primary tracking-tight cursor-pointer hover:opacity-85 transition-opacity"
          >
            Notipala
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-10">
            {currentView === AppView.LANDING ? (
              <a 
                href="#features-section" 
                className="text-primary font-bold border-b-2 border-primary pb-1 font-sans text-sm tracking-wide"
              >
                Features
              </a>
            ) : (
              <button 
                onClick={() => setView(AppView.LANDING)}
                className="text-on-surface-variant font-medium hover:text-primary transition-colors text-sm font-sans"
              >
                Landing Page
              </button>
            )}

            <button 
              onClick={() => {
                setView(AppView.DASHBOARD);
                onSelectTab(DashboardTab.DOCS);
              }}
              className="text-on-surface-variant font-semibold hover:text-primary transition-colors text-sm font-sans"
            >
              Workspaces
            </button>

            <button 
              onClick={() => setActiveModal("pricing")}
              className="text-on-surface-variant font-semibold hover:text-primary transition-colors text-sm font-sans"
            >
              Early Access
            </button>

            <button 
              onClick={() => setActiveModal("changelog")}
              className="text-on-surface-variant font-semibold hover:text-primary transition-colors text-sm font-sans"
            >
              Roadmap
            </button>

            {currentView === AppView.DASHBOARD && (
              <span className="h-4 w-px bg-zinc-300"></span>
            )}
            {currentView === AppView.DASHBOARD && (
              <button
                onClick={() => setView(AppView.DASHBOARD)}
                className="font-bold font-mono text-xs bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full uppercase tracking-widest"
              >
                Knowledge Mode
              </button>
            )}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleDarkMode}
              className="h-10 w-10 rounded-xl aluminum-button text-primary border border-glass-edge shadow-sm flex items-center justify-center active:scale-95"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={isDarkMode ? "Light mode" : "Dark mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => setActiveModal("signin")}
              className="px-5 py-2 rounded-xl text-on-surface-variant font-bold text-sm hover:text-primary transition-all scale-95 active:scale-90"
            >
              Sign In
            </button>
            <button 
              onClick={() => setView(currentView === AppView.LANDING ? AppView.DASHBOARD : AppView.LANDING)}
              className="px-5 py-2.5 rounded-xl aluminum-button text-primary font-bold border border-glass-edge shadow-sm text-sm scale-95 active:scale-92"
            >
              {currentView === AppView.LANDING ? "Join Waitlist" : "View Landing"}
            </button>
          </div>
        </nav>
      </header>

      {/* ==========================================
          MODAL: SIGN IN / REGISTER
         ========================================== */}
      {activeModal === "signin" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-md">
          <div className="glass-card rounded-[2rem] w-full max-w-md border border-white/60 p-8 shadow-2xl relative overflow-hidden bg-white/80 animate-[float_4s_ease-out_1]">
            <button 
              onClick={() => setActiveModal("none")}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center border border-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest block mb-1">
              Welcome to Notipala
            </span>
            <h3 className="text-2xl font-black font-sans text-zinc-900 tracking-tight mb-6">
              Access Knowledge Workspace
            </h3>

            {authSuccess ? (
              <div className="py-12 text-center text-zinc-900 space-y-3 font-sans">
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto animate-bounce border border-green-400">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold">Successfully Logged In</h4>
                <p className="text-xs text-gray-500">Opening your connected knowledge workspace...</p>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="space-y-4 font-sans">
                <div>
                  <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest font-semibold mb-1">
                    Work Email
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. saimoehein@gmail.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest font-semibold mb-1">
                    Password
                  </label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={authPass}
                    onChange={(e) => setAuthPass(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div className="text-right">
                  <a href="#" className="text-xs text-primary font-bold hover:underline">
                    Restore access?
                  </a>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl font-bold bg-primary text-white flex items-center justify-center gap-2 shadow-md hover:bg-primary/95 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Preparing workspace...</span>
                    </>
                  ) : (
                    <span>Request Access</span>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-5 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500 font-sans">
              <span>Local Time: 17:19 UTC</span>
              <span className="font-mono text-primary font-bold">SECURE TLS 1.3</span>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: PRICING PLANS
         ========================================== */}
      {activeModal === "pricing" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
          <div className="glass-card rounded-[2.5rem] w-full max-w-4xl border border-white/60 p-8 md:p-10 shadow-2xl relative bg-white/90 my-8">
            <button 
              onClick={() => setActiveModal("none")}
              className="absolute top-6 right-6 h-8 w-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center border border-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center max-w-lg mx-auto mb-8 font-sans">
              <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest block mb-1">
                Early Access
              </span>
              <h3 className="text-3xl font-black text-zinc-950 tracking-tight">
                Plans for connected knowledge work
              </h3>
              <p className="text-xs text-gray-600 mt-2">
                Start free, organize your sources, and scale into shared research, client, and team workspaces.
              </p>

              {/* Monthly / Yearly Toggle */}
              <div className="inline-flex items-center gap-2 mt-4 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !isYearly ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    isYearly ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Yearly
                  <span className="bg-green-100 text-green-800 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
              {/* Box 1: Sandbox */}
              <div className="bg-white/60 rounded-2xl p-6 border border-gray-200 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-zinc-800 uppercase tracking-wide">Personal Knowledge</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">For students, researchers, and solo knowledge workers.</p>
                  <div className="my-5 flex items-baseline">
                    <span className="text-3xl font-black text-zinc-950 tracking-tight">$0</span>
                    <span className="text-xs text-gray-500 font-mono ml-1">/ forever</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-gray-600 border-t border-zinc-100 pt-4">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary" /> Import notes and documents</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary" /> Automatic topic organization</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary" /> Natural language knowledge search</li>
                  </ul>
                </div>
                <button 
                  onClick={() => handleSelectPricingTier("Sandbox")}
                  className="mt-6 w-full py-2.5 rounded-xl border border-gray-300 text-primary hover:bg-primary hover:text-white font-bold text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Join Free Waitlist
                </button>
              </div>

              {/* Box 2: Premium Professional */}
              <div className="machined-surface rounded-2xl p-6 border border-primary/20 flex flex-col justify-between relative shadow-md">
                <div className="absolute top-4 right-4 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Popular
                </div>
                <div>
                  <h4 className="text-base font-bold text-primary uppercase tracking-wide">Pro Workspace</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-snug">For consultants, analysts, founders, and graduate teams.</p>
                  <div className="my-5 flex items-baseline">
                    <span className="text-4xl font-black text-zinc-950 tracking-tight">
                      ${isYearly ? 24 : 30}
                    </span>
                    <span className="text-xs text-gray-500 font-mono ml-1">/ month</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-gray-700 border-t border-primary/10 pt-4">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary fill-primary/10" /> Unlimited project workspaces</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary fill-primary/10" /> Cross-document idea graph</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary fill-primary/10" /> Contextual AI answers from your sources</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary fill-primary/10" /> Shared client and research spaces</li>
                  </ul>
                </div>
                <button 
                  onClick={() => handleSelectPricingTier("Pro Workspace")}
                  className="mt-6 w-full py-3 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  Request Pro Access
                </button>
              </div>

              {/* Box 3: Enterprise */}
              <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-900 text-white flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-gray-200 uppercase tracking-wide">Team Knowledge OS</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-snug">For organizations building durable institutional memory.</p>
                  <div className="my-5 flex items-baseline">
                    <span className="text-3xl font-black text-gray-100 tracking-tight">Custom</span>
                    <span className="text-xs text-gray-400 font-mono ml-1">/ contracts</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-gray-400 border-t border-zinc-800 pt-4">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Team-wide knowledge permissions</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Private source-grounded AI retrieval</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Dedicated onboarding and migration</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Long-term context governance</li>
                  </ul>
                </div>
                <button 
                  onClick={() => handleSelectPricingTier("Enterprise")}
                  className="mt-6 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-gray-100 font-bold text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Talk to Us
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CHANGELOG TIMELINE
         ========================================== */}
      {activeModal === "changelog" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
          <div className="glass-card rounded-[2.5rem] w-full max-w-2xl border border-white/60 p-8 shadow-2xl relative bg-white/90 my-8">
            <button 
              onClick={() => setActiveModal("none")}
              className="absolute top-6 right-6 h-8 w-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center border border-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-8 font-sans">
              <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest block mb-1">
                Product roadmap
              </span>
              <h3 className="text-3xl font-black text-zinc-950 tracking-tight">
                Notipala Milestones
              </h3>
            </div>

            {/* Timeline Stream */}
            <div className="space-y-8 relative before:absolute before:top-2 before:bottom-0 before:left-3 px-1 before:w-0.5 before:bg-gray-200 font-sans">
              
              {/* Release 1 */}
              <div className="relative pl-10">
                <span className="absolute left-1 top-2.5 p-1 rounded-full bg-primary ring-4 ring-white border border-primary text-white block"></span>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-sm font-black text-primary font-mono bg-primary/10 px-2.5 py-0.5 rounded uppercase">v2.0 Beta</span>
                  <span className="text-xs text-gray-400">• June 18, 2026</span>
                </div>
                <h4 className="text-base font-bold text-zinc-900">Connected Knowledge Graph</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  New graph layer links repeated themes, people, projects, and ideas across imported notes, chats, documents, and PDFs.
                </p>
              </div>

              {/* Release 2 */}
              <div className="relative pl-10">
                <span className="absolute left-1.5 top-2 p-1.5 rounded-full bg-zinc-400 block ring-4 ring-white border border-transparent"></span>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-sm font-semibold text-zinc-600 font-mono bg-zinc-100 px-2.5 py-0.5 rounded uppercase">v1.9 Stable</span>
                  <span className="text-xs text-gray-400">• April 02, 2026</span>
                </div>
                <h4 className="text-base font-bold text-zinc-800">Source-Grounded AI Search</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Ask natural-language questions and receive contextual answers grounded in your own knowledge base with source references.
                </p>
              </div>

              {/* Release 3 */}
              <div className="relative pl-10">
                <span className="absolute left-1.5 top-2 p-1.5 rounded-full bg-zinc-400 block ring-4 ring-white border border-transparent"></span>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-sm font-semibold text-zinc-600 font-mono bg-zinc-100 px-2.5 py-0.5 rounded uppercase">v1.5 Main</span>
                  <span className="text-xs text-gray-400">• December 14, 2025</span>
                </div>
                <h4 className="text-base font-bold text-zinc-800">Project Workspaces</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Organize long-running research, consulting, analysis, and founder workflows into persistent spaces that preserve context over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
