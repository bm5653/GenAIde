import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ConditionInfo } from '../data/chapter5Notes';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Wind, 
  Scale, 
  Users, 
  HeartHandshake, 
  Dna, 
  Compass, 
  Sliders
} from 'lucide-react';

interface ConditionAnimatedVisualProps {
  condition: ConditionInfo;
  allConditions: ConditionInfo[];
  onSelectCondition: (cond: ConditionInfo) => void;
}

export const ConditionAnimatedVisual: React.FC<ConditionAnimatedVisualProps> = ({
  condition,
  allConditions,
  onSelectCondition
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simulationState, setSimulationState] = useState<'equilibrium' | 'violated'>('equilibrium');

  // Condition icons lookup
  const getConditionIcon = (id: number) => {
    switch (id) {
      case 1: return <Users className="w-4 h-4" />;
      case 2: return <HeartHandshake className="w-4 h-4" />;
      case 3: return <Dna className="w-4 h-4" />;
      case 4: return <Compass className="w-4 h-4" />;
      case 5: return <Scale className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 5 Conditions Quick Tab Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {allConditions.map((cond) => {
          const isSelected = cond.id === condition.id;
          return (
            <button
              key={cond.id}
              onClick={() => {
                onSelectCondition(cond);
                setSimulationState('equilibrium');
              }}
              className={`p-2.5 rounded-xl text-left transition-all border relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-900 text-white border-purple-950 shadow-md ring-2 ring-purple-400/40'
                  : 'bg-white hover:bg-purple-50/80 text-purple-900 border-purple-200'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800'
                }`}>
                  Condition {cond.id}
                </span>
                <span className={isSelected ? 'text-purple-300' : 'text-purple-500'}>
                  {getConditionIcon(cond.id)}
                </span>
              </div>
              <div className="text-xs font-bold leading-tight line-clamp-2">
                {cond.shortTitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Animated Photo Showcase Card */}
      <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-sm overflow-hidden">
        {/* Top Control Bar */}
        <div className="p-4 bg-purple-900 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-800/80 text-purple-200 border border-purple-700">
              {getConditionIcon(condition.id)}
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-wide uppercase text-purple-300">
                Hardy-Weinberg Assumption #{condition.id}
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {condition.condition}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Play/Pause Animation Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-2.5 py-1.5 rounded-lg bg-purple-800 hover:bg-purple-700 text-xs font-semibold text-purple-100 flex items-center gap-1.5 transition-colors border border-purple-700"
              title={isPlaying ? "Pause photo animation" : "Play photo animation"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Motion' : 'Play Motion'}</span>
            </button>

            {/* Equilibrium vs Violated Mode Toggle */}
            <div className="flex rounded-lg p-0.5 bg-purple-950/80 border border-purple-800 text-xs font-bold">
              <button
                onClick={() => setSimulationState('equilibrium')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  simulationState === 'equilibrium'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Equilibrium</span>
              </button>
              <button
                onClick={() => setSimulationState('violated')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  simulationState === 'violated'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Violated!</span>
              </button>
            </div>
          </div>
        </div>

        {/* The Animated Photographic Stage */}
        <div className="relative w-full h-80 sm:h-96 bg-purple-950 overflow-hidden select-none">
          {/* Animated Background Photo with gentle Ken-Burns breathing effect */}
          <motion.img
            key={condition.imageUrl}
            src={condition.imageUrl}
            alt={condition.condition}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            animate={isPlaying ? {
              scale: [1, 1.05, 1],
              x: [0, 4, -4, 0],
            } : { scale: 1, x: 0 }}
            transition={{
              repeat: Infinity,
              duration: 16,
              ease: "easeInOut"
            }}
          />

          {/* Vignette & Contrast Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-purple-950/25 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/40 via-transparent to-purple-950/40 pointer-events-none" />

          {/* Dynamic Animated Biological Overlays based on Condition ID */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Condition 1: Large Population Size (Allele swarm particles) */}
            {condition.id === 1 && (
              <>
                {isPlaying && Array.from({ length: 14 }).map((_, i) => (
                  <motion.div
                    key={`allele-particle-${i}`}
                    className={`absolute rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg backdrop-blur-xs border ${
                      i % 2 === 0 
                        ? 'bg-emerald-500/80 text-white border-emerald-300' 
                        : 'bg-amber-400/80 text-amber-950 border-amber-200'
                    }`}
                    style={{
                      width: 22 + (i % 3) * 6,
                      height: 22 + (i % 3) * 6,
                      left: `${(i * 7.5 + 5) % 90}%`,
                      top: `${(i * 13 + 10) % 75}%`,
                    }}
                    animate={{
                      y: [0, -25 - (i % 4) * 8, 0],
                      x: [0, (i % 2 === 0 ? 18 : -18), 0],
                      scale: [1, 1.15, 1],
                      opacity: [0.65, 0.95, 0.65],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3 + (i % 4),
                      ease: "easeInOut",
                      delay: i * 0.25,
                    }}
                  >
                    {i % 2 === 0 ? 'p' : 'q'}
                  </motion.div>
                ))}

                {/* Status Indicator */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 left-4 bg-purple-950/85 backdrop-blur-md border border-purple-400/50 text-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-xs"
                >
                  <Users className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <div>
                    <div className="font-extrabold text-emerald-300">N &gt; 50,000 Organisms</div>
                    <div className="text-[10px] text-purple-200">Chance fluctuations are negligible</div>
                  </div>
                </motion.div>
              </>
            )}

            {/* Condition 2: Random Mating / Random Fertilization */}
            {condition.id === 2 && (
              <>
                {isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Pulsing gamete union ring */}
                    <motion.div
                      className="w-44 h-44 rounded-full border-2 border-dashed border-pink-300/60 flex items-center justify-center"
                      animate={{ rotate: 360, scale: [1, 1.08, 1] }}
                      transition={{ rotate: { repeat: Infinity, duration: 20, ease: "linear" }, scale: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}
                    >
                      <motion.div 
                        className="w-32 h-32 rounded-full bg-pink-500/20 backdrop-blur-xs border border-pink-400/40 flex items-center justify-center"
                        animate={{ scale: [0.95, 1.05, 0.95] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      />
                    </motion.div>

                    {/* Approaching gametes p (sperm) and q (egg) */}
                    <motion.div
                      className="absolute px-3 py-1.5 bg-blue-500/90 text-white font-black text-xs rounded-full border border-blue-300 shadow-lg flex items-center gap-1"
                      animate={{
                        x: [-120, -20, -120],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    >
                      <span>♂ Gamete (p)</span>
                    </motion.div>

                    <motion.div
                      className="absolute px-3 py-1.5 bg-rose-500/90 text-white font-black text-xs rounded-full border border-rose-300 shadow-lg flex items-center gap-1"
                      animate={{
                        x: [120, 20, 120],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    >
                      <span>♀ Gamete (q)</span>
                    </motion.div>
                  </div>
                )}

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 left-4 bg-purple-950/85 backdrop-blur-md border border-pink-400/50 text-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-xs"
                >
                  <HeartHandshake className="w-4 h-4 text-pink-400 animate-bounce" />
                  <div>
                    <div className="font-extrabold text-pink-300">Equal Mating Opportunity</div>
                    <div className="text-[10px] text-purple-200">No phenotypic or sexual selection bias</div>
                  </div>
                </motion.div>
              </>
            )}

            {/* Condition 3: No Mutation */}
            {condition.id === 3 && (
              <>
                {isPlaying && (
                  <>
                    {/* Glowing DNA scanning wave */}
                    <motion.div
                      className="absolute top-0 bottom-0 w-1.5 bg-cyan-400 shadow-[0_0_20px_#22d3ee]"
                      animate={{
                        left: ['0%', '100%', '0%'],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 5,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Luminous base pair nodes */}
                    {[20, 40, 60, 80].map((topPos, idx) => (
                      <motion.div
                        key={`dna-node-${idx}`}
                        className="absolute left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 text-[11px] font-mono font-bold shadow-md backdrop-blur-xs"
                        style={{ top: `${topPos}%` }}
                        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ repeat: Infinity, duration: 2.5, delay: idx * 0.4 }}
                      >
                        {idx === 0 ? 'A = T (Conserved)' : idx === 1 ? 'G ≡ C (Conserved)' : idx === 2 ? 'T = A (Conserved)' : 'C ≡ G (Conserved)'}
                      </motion.div>
                    ))}
                  </>
                )}

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 left-4 bg-purple-950/85 backdrop-blur-md border border-cyan-400/50 text-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <div>
                    <div className="font-extrabold text-cyan-300">Replication Fidelity: 100%</div>
                    <div className="text-[10px] text-purple-200">Zero new alleles introduced via mutation</div>
                  </div>
                </motion.div>
              </>
            )}

            {/* Condition 4: No Migration (Geographic Isolation) */}
            {condition.id === 4 && (
              <>
                {isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Animated protective ocean boundary */}
                    <motion.div
                      className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-2 border-dashed border-emerald-400/60 flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.9, 0.5] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    >
                      <div className="text-emerald-300 font-extrabold text-[11px] tracking-wider uppercase bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
                        Isolated Gene Pool Boundary
                      </div>
                    </motion.div>

                    {/* Blocked incoming immigrant indicator */}
                    <motion.div
                      className="absolute right-8 top-16 px-2.5 py-1 bg-red-900/90 text-red-200 border border-red-500 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-lg"
                      animate={{ x: [10, -5, 10] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      <Wind className="w-3 h-3 text-red-400" />
                      <span>No Gene Flow ✕</span>
                    </motion.div>
                  </div>
                )}

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 left-4 bg-purple-950/85 backdrop-blur-md border border-emerald-400/50 text-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-xs"
                >
                  <Compass className="w-4 h-4 text-emerald-400 animate-spin" />
                  <div>
                    <div className="font-extrabold text-emerald-300">Geographical Isolation</div>
                    <div className="text-[10px] text-purple-200">No immigration in, no emigration out</div>
                  </div>
                </motion.div>
              </>
            )}

            {/* Condition 5: No Natural Selection (Equal Fitness) */}
            {condition.id === 5 && (
              <>
                {isPlaying && (
                  <div className="absolute inset-x-4 top-20 flex justify-center">
                    {/* Balanced Fitness Beam */}
                    <motion.div 
                      className="bg-purple-950/90 border border-amber-400/60 p-3 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 sm:gap-6 text-xs text-white"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                    >
                      <div className="text-center">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">w(AA)</span>
                        <div className="font-black text-emerald-400">100%</div>
                        <div className="text-[9px] text-purple-300">Survival</div>
                      </div>
                      <div className="h-6 w-px bg-purple-700" />
                      <div className="text-center">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold text-[10px]">w(Aa)</span>
                        <div className="font-black text-emerald-400">100%</div>
                        <div className="text-[9px] text-purple-300">Survival</div>
                      </div>
                      <div className="h-6 w-px bg-purple-700" />
                      <div className="text-center">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold text-[10px]">w(aa)</span>
                        <div className="font-black text-emerald-400">100%</div>
                        <div className="text-[9px] text-purple-300">Survival</div>
                      </div>
                    </motion.div>
                  </div>
                )}

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 left-4 bg-purple-950/85 backdrop-blur-md border border-amber-400/50 text-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-xs"
                >
                  <Scale className="w-4 h-4 text-amber-400 animate-pulse" />
                  <div>
                    <div className="font-extrabold text-amber-300">Equal Reproductive Fitness</div>
                    <div className="text-[10px] text-purple-200">Selection coefficient s = 0 across all genotypes</div>
                  </div>
                </motion.div>
              </>
            )}
          </div>

          {/* Bottom Photo Caption & Interactive State Banner */}
          <div className="absolute bottom-3 inset-x-3 sm:inset-x-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-purple-950/85 backdrop-blur-md rounded-xl border border-purple-800 text-white text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="text-purple-200">{condition.imageCaption}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1 ${
                simulationState === 'equilibrium'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {simulationState === 'equilibrium' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>H-W Equilibrium Held</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    <span>Evolution Triggered!</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Biological Analysis Box */}
        <div className="p-5 space-y-4 bg-purple-50/50">
          <AnimatePresence mode="wait">
            {simulationState === 'equilibrium' ? (
              <motion.div
                key="equilibrium-mode"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-3"
              >
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950 space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Why Condition #{condition.id} is Essential for Equilibrium:</span>
                  </div>
                  <p className="text-emerald-900/90 leading-relaxed pl-5">
                    {condition.explanation}
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-purple-200 rounded-xl text-xs sm:text-sm text-purple-950 flex items-start gap-2.5">
                  <span className="text-base shrink-0">💡</span>
                  <div>
                    <strong>Biological Real-World Example:</strong> {condition.miniExample}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="violated-mode"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-3"
              >
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-950 space-y-1">
                  <div className="font-bold text-red-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Violation Effect & Evolutionary Consequence:</span>
                  </div>
                  <p className="text-red-900/90 leading-relaxed pl-5">
                    {condition.violationEffect}
                  </p>
                </div>

                <div className="p-3.5 bg-purple-900 text-white rounded-xl text-xs sm:text-sm space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Associated Evolutionary Factor:</span>
                  </div>
                  <p className="text-purple-200 pl-5">
                    <strong>{condition.relatedEvolutionFactor}</strong> directly changes allele frequencies over successive generations, breaking genetic equilibrium and driving evolutionary divergence.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
