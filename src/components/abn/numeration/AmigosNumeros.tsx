/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function AmigosNumeros() {
  const [mode, setMode] = useState<10 | 100>(10);
  const [target, setTarget] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const generateGame = () => {
    const newTarget = Math.floor(Math.random() * mode);
    setTarget(newTarget);
    
    // Generar opciones (una correcta y tres incorrectas)
    const correct = mode - newTarget;
    const others = new Set<number>();
    while(others.size < 3) {
      const rand = Math.floor(Math.random() * mode);
      if (rand !== correct) others.add(rand);
    }
    
    setOptions([...Array.from(others), correct].sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  useEffect(() => {
    generateGame();
  }, [mode]);

  const handleSelect = (val: number) => {
    if (val + target === mode) {
      setScore(score + 1);
      setFeedback('correct');
      setTimeout(generateGame, 1000);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-pastel-rose/80 rounded-[2rem] md:rounded-3xl shadow-xl border-4 border-rose-100">
      <header className="text-center mb-6 md:mb-10">
        <h2 className="text-xl md:text-3xl font-black text-rose-600 flex items-center justify-center gap-2 md:gap-3 leading-tight">
          <Heart size={24} fill="currentColor" className="md:w-8 md:h-8" />
          Los Amigos del {mode}
        </h2>
        <div className="flex justify-center gap-4 mt-6">
          <button 
            onClick={() => setMode(10)}
            className={`px-8 py-3 rounded-2xl font-black transition-all text-lg shadow-lg ${mode === 10 ? 'bg-rose-600 text-white scale-105 shadow-rose-200' : 'bg-white text-rose-600 border-2 border-rose-100 hover:bg-rose-50'}`}
          >
            Amigos del 10
          </button>
          <button 
            onClick={() => setMode(100)}
            className={`px-8 py-3 rounded-2xl font-black transition-all text-lg shadow-lg ${mode === 100 ? 'bg-rose-600 text-white scale-105 shadow-rose-200' : 'bg-white text-rose-600 border-2 border-rose-100 hover:bg-rose-50'}`}
          >
            Amigos del 100
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-rose-50/50 p-4 rounded-2xl border border-rose-100 max-w-2xl mx-auto"
        >
          <p className="text-rose-700 font-medium text-sm md:text-base">
            <span className="font-black">¿Cómo jugar?</span> ¡Encuentra a la pareja perfecta! Elige el número que, sumado al que aparece a la izquierda, complete exactamente el <span className="font-black text-rose-600">{mode}</span>.
          </p>
        </motion.div>
      </header>

      <main className="flex flex-col items-center gap-8 md:gap-12">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <motion.div 
            key={target}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 md:w-32 md:h-32 bg-rose-50 rounded-2xl md:rounded-3xl border-4 border-rose-200 flex items-center justify-center text-3xl md:text-5xl font-black text-rose-600 shadow-inner"
          >
            {target}
          </motion.div>
          <div className="text-2xl md:text-4xl font-black text-slate-300">+</div>
          <div className="w-20 h-20 md:w-32 md:h-32 bg-slate-50 rounded-2xl md:rounded-3xl border-4 border-dashed border-slate-200 flex items-center justify-center text-3xl md:text-5xl font-black text-slate-300">
            ?
          </div>
          <div className="text-2xl md:text-4xl font-black text-slate-300">=</div>
          <div className="w-20 h-20 md:w-32 md:h-32 bg-rose-600 rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-5xl font-black text-white shadow-lg">
            {mode}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(opt)}
              className="bg-white border-4 border-slate-100 p-6 rounded-2xl text-3xl font-black text-slate-700 hover:border-rose-300 hover:text-rose-600 transition-all shadow-sm"
            >
              {opt}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={`text-2xl font-black flex items-center gap-2 ${feedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'}`}
            >
              {feedback === 'correct' ? (
                <><CheckCircle2 /> ¡Genial! Son amigos.</>
              ) : (
                <><RotateCcw /> ¡Vuelve a intentarlo!</>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-rose-600 text-white px-8 py-3 rounded-full font-black flex items-center gap-3 shadow-lg shadow-rose-100">
          <Sparkles className="text-amber-400" />
          Puntuación: {score}
        </div>
      </main>
    </div>
  );
}
