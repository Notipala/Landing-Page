import { motion } from "motion/react";
import { Terminal, Bolt, Shield, BookOpen, ArrowRight } from "lucide-react";

interface BentoGridProps {
  onSelectTab: (tab: "CICD" | "LATENCY" | "VAULT" | "DOCS") => void;
}

export default function BentoGrid({ onSelectTab }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-10">
      {/* Feature 1: Smart Organization - Large */}
      <motion.div
        whileHover={{ y: -8, scale: 1.01 }}
        onClick={() => onSelectTab("CICD")}
        className="md:col-span-8 bento-cell group cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="glass-card scroll-reveal-card rounded-[2rem] p-10 h-full flex flex-col justify-between overflow-hidden relative border border-white/50 bg-white/40 shadow-sm">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 scroll-reveal-line">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Terminal className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono bg-primary/15 text-primary px-3 py-1 rounded-full uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                Smart Organization
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold font-sans text-on-background mb-4 tracking-tight scroll-reveal-line scroll-reveal-delay-1">
              Smart Knowledge Organization
            </h3>
            <p className="text-on-surface-variant font-sans max-w-lg mb-6 leading-relaxed scroll-reveal-line scroll-reveal-delay-2">
              Import documents, notes, and conversations, then let Notipala structure them into topics, projects, and a growing personal knowledge base.
            </p>
            <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:translate-x-2 transition-transform duration-300 scroll-reveal-line scroll-reveal-delay-3">
              Organize sources <ArrowRight className="w-4 h-4" />
            </div>
          </div>
          
          {/* Subtle liquid background icon */}
          <div className="absolute right-0 bottom-0 w-1/2 h-full translate-x-1/4 translate-y-1/4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 flex items-end justify-end pointer-events-none">
            <span className="material-symbols-outlined text-[240px] text-primary select-none">hub</span>
          </div>
        </div>
      </motion.div>

      {/* Feature 2: Connected Ideas - Small */}
      <motion.div
        whileHover={{ y: -8, scale: 1.01 }}
        onClick={() => onSelectTab("LATENCY")}
        className="md:col-span-4 bento-cell group cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="glass-card scroll-reveal-card rounded-[2rem] p-8 h-full machined-surface flex flex-col justify-between border border-white/50 relative overflow-hidden">
          <div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-6 border border-orange-500/10 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 scroll-reveal-line">
              <Bolt className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-sans text-on-background mb-2 tracking-tight scroll-reveal-line scroll-reveal-delay-1">
              Connected Ideas
            </h3>
            <p className="text-on-surface-variant font-sans text-sm leading-relaxed mb-6 scroll-reveal-line scroll-reveal-delay-2">
              Discover relationships between concepts and visualize how information connects across research, clients, and long-running work.
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto scroll-reveal-line scroll-reveal-delay-3">
            <span className="text-xs font-mono bg-orange-500/10 text-orange-700 px-2.5 py-0.5 rounded-md font-semibold">
              Idea graph
            </span>
            <div className="flex items-center gap-1 text-primary text-xs font-bold group-hover:underline">
              Map links <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature 3: AI Search - Small */}
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        onClick={() => onSelectTab("VAULT")}
        className="md:col-span-4 bento-cell group cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="glass-card scroll-reveal-card rounded-[2rem] p-8 h-full bg-white/40 text-on-background border border-white/50 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 scroll-reveal-line">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-sans mb-3 tracking-tight scroll-reveal-line scroll-reveal-delay-1">
              AI-Powered Search
            </h3>
            <p className="text-on-surface-variant font-sans text-sm leading-relaxed mb-6 scroll-reveal-line scroll-reveal-delay-2">
              Ask questions in natural language and retrieve grounded answers from your own documents, notes, PDFs, and conversations.
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-glass-edge scroll-reveal-line scroll-reveal-delay-3">
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-700 px-2.5 py-1 rounded-md font-semibold font-mono tracking-widest">
              Grounded AI
            </span>
            <div className="flex items-center gap-1 text-primary text-xs font-bold group-hover:underline">
              Ask knowledge <ArrowRight className="w-3 h-3" />
            </div>
          </div>
          
          {/* Subtle overlay shading for Skeuomorphic depth */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/8 via-transparent to-primary/8 pointer-events-none rounded-[2rem] border border-white/20"></div>
        </div>
      </motion.div>

      {/* Feature 4: Project Workspaces - Large */}
      <motion.div
        whileHover={{ y: -8, scale: 1.01 }}
        onClick={() => onSelectTab("DOCS")}
        className="md:col-span-8 bento-cell group cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="glass-card scroll-reveal-card rounded-[2rem] p-10 h-full flex flex-col lg:flex-row gap-8 items-center border border-white/50 bg-white/40 shadow-sm relative overflow-hidden">
          <div className="flex-1">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center mb-6 scroll-reveal-line">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-sans text-on-background mb-4 tracking-tight scroll-reveal-line scroll-reveal-delay-1">
              Project Workspaces
            </h3>
            <p className="text-on-surface-variant font-sans mb-6 text-sm leading-relaxed max-w-md scroll-reveal-line scroll-reveal-delay-2">
              Organize knowledge by project, client, research topic, or team. Keep context structured and easy to navigate across work sessions.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectTab("DOCS");
              }}
              className="aluminum-button px-6 py-3 rounded-xl text-primary font-bold text-sm border border-glass-edge shadow-md hover:shadow-lg transition-all scroll-reveal-line scroll-reveal-delay-3"
            >
              Explore Workspaces
            </button>
          </div>
          <div className="hidden lg:block w-48 h-48 rounded-2xl bg-surface-variant/30 border border-white/60 shadow-inner flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
            <BookOpen className="w-16 h-16 text-primary/30 group-hover:text-primary/70 transition-colors duration-300" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              ✓
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
