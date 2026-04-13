/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Grid3X3, Search, Eye, EyeOff, Trophy, LayoutGrid, RefreshCcw, ArrowLeftCircle } from 'lucide-react';

export default function Tabla100() {
  const [mode, setMode] = useState<'explore' | 'hide' | 'cruci' | 'path' | 'retro'>('explore');
  const [hiddenNumbers, setHiddenNumbers] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [markedNumbers, setMarkedNumbers] = useState<number[]>([]);
  const [correctMarked, setCorrectMarked] = useState<number[]>([]);
  const [wrongMarked, setWrongMarked] = useState<number[]>([]);
  
  // Crucinúmeros state
  const [cruciTarget, setCruciTarget] = useState<number | null>(null);
  const [cruciInputs, setCruciInputs] = useState<{[key: string]: string}>({});

  // Path Challenge state
  const [pathChallenge, setPathChallenge] = useState<{
    start: number;
    moves: { label: string; value: number }[];
    target: number;
  } | null>(null);
  const [pathFeedback, setPathFeedback] = useState<'correct' | 'incorrect' | 'none'>('none');

  // Retrocuenta state
  const [retroTarget, setRetroTarget] = useState<number | null>(null);
  const [retroStart, setRetroStart] = useState<number | null>(null);
  const [retroCount, setRetroCount] = useState(0);

  const startHideChallenge = () => {
    const hidden = new Set<number>();
    while(hidden.size < 10) {
      hidden.add(Math.floor(Math.random() * 100) + 1);
    }
    setHiddenNumbers(Array.from(hidden));
    setRevealed([]);
    setSelected(null);
    setMarkedNumbers([]);
    setCorrectMarked([]);
    setWrongMarked([]);
    setMode('hide');
  };

  const startCruciChallenge = () => {
    const target = Math.floor(Math.random() * 80) + 11; // Evitar bordes extremos
    setCruciTarget(target);
    setCruciInputs({});
    setMode('cruci');
    setPathChallenge(null);
    setMarkedNumbers([]);
    setCorrectMarked([]);
    setWrongMarked([]);
  };

  const startPathChallenge = () => {
    let current = Math.floor(Math.random() * 90) + 5;
    const start = current;
    const moves: { label: string; value: number }[] = [];
    const numMoves = Math.floor(Math.random() * 3) + 2; // 2 to 4 moves
    
    for (let i = 0; i < numMoves; i++) {
      // Random value between 1 and 30
      const valAmount = Math.floor(Math.random() * 29) + 2; 
      const direction = Math.random() > 0.5 ? 1 : -1;
      const val = valAmount * direction;
      
      // Check bounds
      if (current + val >= 1 && current + val <= 100) {
        current += val;
        moves.push({ 
          label: direction > 0 ? `+${valAmount}` : `-${valAmount}`, 
          value: val 
        });
      }
    }

    if (moves.length === 0) return startPathChallenge(); // Retry if no valid moves

    setPathChallenge({ start, moves, target: current });
    setPathFeedback('none');
    setMode('path');
    setCruciTarget(null);
    setMarkedNumbers([]);
    setCorrectMarked([]);
    setWrongMarked([]);
  };

  const startRetroChallenge = () => {
    const start = Math.floor(Math.random() * 80) + 20;
    setRetroStart(start);
    setRetroTarget(start);
    setRetroCount(0);
    setMode('retro');
    setMarkedNumbers([]);
    setCorrectMarked([]);
    setWrongMarked([]);
  };

  const handleCellClick = (num: number) => {
    if (mode === 'explore') {
      setMarkedNumbers(prev => 
        prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
      );
    }

    if (mode === 'retro' && retroTarget !== null) {
      if (num === retroTarget) {
        setCorrectMarked(prev => [...new Set([...prev, num])]);
        setRetroTarget(num - 1);
        setRetroCount(prev => prev + 1);
      } else if (!correctMarked.includes(num)) {
        setWrongMarked(prev => [...new Set([...prev, num])]);
        // Auto-remove wrong mark after a bit
        setTimeout(() => {
          setWrongMarked(prev => prev.filter(n => n !== num));
        }, 1000);
      }
    }

    if (mode === 'cruci' && cruciTarget) {
      let type = '';
      if (num === cruciTarget - 10) type = 'up';
      if (num === cruciTarget + 10) type = 'down';
      if (num === cruciTarget - 1) type = 'left';
      if (num === cruciTarget + 1) type = 'right';

      if (type) {
        setCruciInputs(prev => ({ ...prev, [type]: num.toString() }));
        setCorrectMarked(prev => [...new Set([...prev, num])]);
      } else if (num !== cruciTarget) {
        setWrongMarked(prev => [...new Set([...prev, num])]);
      }
    }

    if (mode === 'path' && pathChallenge) {
      if (num === pathChallenge.target) {
        setCorrectMarked(prev => [...new Set([...prev, num])]);
        setPathFeedback('correct');
      } else if (num !== pathChallenge.start) {
        setWrongMarked(prev => [...new Set([...prev, num])]);
        setPathFeedback('incorrect');
      }
    }

    if (mode === 'hide' && hiddenNumbers.includes(num) && !revealed.includes(num)) {
      setSelected(num);
    }
  };

  const checkPathResult = () => {
    if (!pathChallenge) return;
    // Check if the target is among the marked numbers
    // Usually the user would mark the path and the destination.
    // We'll check if the target is marked. 
    // To be more precise, we could check if it's the LAST marked number.
    const isCorrect = markedNumbers.includes(pathChallenge.target);
    setPathFeedback(isCorrect ? 'correct' : 'incorrect');
  };

  const handleGuess = (val: string) => {
    const n = parseInt(val);
    if (n === selected) {
      setRevealed([...revealed, n]);
      setSelected(null);
    }
  };

  const checkCruci = (type: string, val: string) => {
    if (!cruciTarget) return 'neutral';
    const numVal = parseInt(val);
    if (isNaN(numVal)) return 'neutral';
    
    let expected;
    switch(type) {
      case 'up': expected = cruciTarget - 10; break;
      case 'down': expected = cruciTarget + 10; break;
      case 'left': expected = cruciTarget - 1; break;
      case 'right': expected = cruciTarget + 1; break;
    }
    return numVal === expected ? 'correct' : 'incorrect';
  };

  return (
    <div className="max-w-5xl mx-auto p-3 md:p-6 bg-pastel-mauve/70 rounded-[1.5rem] md:rounded-[3rem] shadow-2xl border-4 border-purple-50">
      <header className="flex flex-col items-center gap-6 mb-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-purple-600 p-4 rounded-2xl text-white shadow-xl shadow-purple-100">
            <Grid3X3 size={32} />
          </div>
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight">Tabla del 100</h2>
            <div className="flex items-center justify-center gap-3 mt-2">
              <div className="h-1.5 w-12 bg-purple-500 rounded-full"></div>
              <p className="text-purple-700 font-black text-sm md:text-xl italic tracking-tight">Familias y pandillas</p>
              <div className="h-1.5 w-12 bg-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-[2rem] border-2 border-purple-100 shadow-inner">
          <button 
            onClick={() => setMode('explore')}
            className={`px-6 py-3 rounded-2xl font-black transition-all shadow-sm ${mode === 'explore' ? 'bg-purple-600 text-white scale-105 shadow-purple-200' : 'text-slate-500 hover:bg-white'}`}
          >
            Explorar
          </button>
          <button 
            onClick={startHideChallenge}
            className={`px-6 py-3 rounded-2xl font-black transition-all flex items-center gap-2 shadow-sm ${mode === 'hide' ? 'bg-purple-600 text-white scale-105 shadow-purple-200' : 'text-slate-500 hover:bg-white'}`}
          >
            <EyeOff size={20} /> Escondite
          </button>
          <button 
            onClick={startCruciChallenge}
            className={`px-6 py-3 rounded-2xl font-black transition-all flex items-center gap-2 shadow-sm ${mode === 'cruci' ? 'bg-purple-600 text-white scale-105 shadow-purple-200' : 'text-slate-500 hover:bg-white'}`}
          >
            <LayoutGrid size={20} /> Crucinúmero
          </button>
          <button 
            onClick={startPathChallenge}
            className={`px-6 py-3 rounded-2xl font-black transition-all flex items-center gap-2 shadow-sm ${mode === 'path' ? 'bg-purple-600 text-white scale-105 shadow-purple-200' : 'text-slate-500 hover:bg-white'}`}
          >
            <RefreshCcw size={20} /> Camino
          </button>
          <button 
            onClick={startRetroChallenge}
            className={`px-6 py-3 rounded-2xl font-black transition-all flex items-center gap-2 shadow-sm ${mode === 'retro' ? 'bg-purple-600 text-white scale-105 shadow-purple-200' : 'text-slate-500 hover:bg-white'}`}
          >
            <ArrowLeftCircle size={20} /> Retrocuenta
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-6 md:gap-8">
        {/* La Tabla */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-10 gap-1 md:gap-2 bg-slate-50 p-1 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border-2 border-slate-100 min-w-[280px]">
            {Array.from({ length: 100 }).map((_, i) => {
              const num = i + 1;
              const isHidden = mode === 'hide' && hiddenNumbers.includes(num) && !revealed.includes(num);
              const isFound = mode === 'hide' && revealed.includes(num);
              const isSelected = selected === num;
              const isMarked = markedNumbers.includes(num);
              const isCorrect = correctMarked.includes(num);
              const isWrong = wrongMarked.includes(num);
              
              // Highlight for Crucinúmero
              const isCruciTarget = mode === 'cruci' && cruciTarget === num;

              // Highlight for Path
              const isPathStart = mode === 'path' && pathChallenge?.start === num;
              
              return (
                <motion.div
                  key={num}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  animate={isWrong ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  onClick={() => handleCellClick(num)}
                  className={`
                    aspect-square flex items-center justify-center text-[10px] md:text-sm font-black rounded-md md:rounded-lg cursor-pointer transition-all border md:border-2
                    ${isHidden ? 'bg-slate-800 border-slate-900 text-transparent' : 
                      isFound ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg' :
                      isCorrect ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg scale-110' :
                      isWrong ? 'bg-rose-500 border-rose-600 text-white shadow-lg' :
                      isCruciTarget ? 'bg-violet-600 border-violet-700 text-white shadow-lg scale-110' :
                      isPathStart ? 'bg-amber-500 border-amber-600 text-white shadow-lg scale-110' :
                      isMarked ? 'bg-amber-100 border-amber-400 text-amber-700 shadow-sm' :
                      'bg-white border-slate-100 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}
                    ${isSelected ? 'ring-4 ring-indigo-500 z-20' : ''}
                  `}
                >
                  {isHidden ? '?' : num}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Panel Lateral de Retos (Ahora abajo) */}
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {mode === 'explore' && (
            <div className="bg-indigo-50 p-6 rounded-3xl border-2 border-indigo-100">
              <h3 className="font-black text-indigo-800 mb-4 flex items-center gap-2">
                <Search size={20} /> ¿Sabías que...?
              </h3>
              <ul className="space-y-4 text-sm text-indigo-700 font-medium">
                <li className="flex gap-2">
                  <span className="bg-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm">🏠</span>
                  Las filas son las <b>Familias</b>. Todos empiezan por la misma decena.
                </li>
                <li className="flex gap-2">
                  <span className="bg-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm">🤝</span>
                  Las columnas son las <b>Pandillas</b>. Todos terminan en la misma unidad.
                </li>
              </ul>
            </div>
          )}

          {mode === 'hide' && (
            <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100">
              <h3 className="font-black text-emerald-800 mb-2">Reto de Escondite</h3>
              <p className="text-emerald-700 text-sm mb-4">¡Encuentra los números ocultos!</p>
              
              {selected ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                  <h4 className="text-sm font-bold text-emerald-600 text-center">¿Qué número es?</h4>
                  <input 
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoFocus
                    className="w-full p-4 text-3xl font-black text-center rounded-2xl border-4 border-white focus:border-emerald-500 outline-none shadow-sm"
                    onChange={(e) => handleGuess(e.target.value)}
                  />
                </motion.div>
              ) : (
                <div className="text-3xl font-black text-emerald-600 text-center py-8">
                  {revealed.length} / 10
                </div>
              )}

              {revealed.length === 10 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center mt-4">
                  <Trophy className="mx-auto text-amber-500 mb-2" size={48} />
                  <p className="font-black text-emerald-800">¡Increíble!</p>
                  <button onClick={startHideChallenge} className="mt-4 text-emerald-600 font-bold hover:underline">Jugar otra vez</button>
                </motion.div>
              )}
            </div>
          )}

          {mode === 'cruci' && cruciTarget && (
            <div className="bg-violet-50 p-6 rounded-3xl border-2 border-violet-100">
              <h3 className="font-black text-violet-800 mb-4">Crucinúmero</h3>
              <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto">
                <div />
                <CruciInput 
                  value={cruciInputs.up || ''} 
                  onChange={(v) => setCruciInputs({...cruciInputs, up: v})}
                  status={checkCruci('up', cruciInputs.up || '')}
                />
                <div />
                
                <CruciInput 
                  value={cruciInputs.left || ''} 
                  onChange={(v) => setCruciInputs({...cruciInputs, left: v})}
                  status={checkCruci('left', cruciInputs.left || '')}
                />
                <div className="bg-violet-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">
                  {cruciTarget}
                </div>
                <CruciInput 
                  value={cruciInputs.right || ''} 
                  onChange={(v) => setCruciInputs({...cruciInputs, right: v})}
                  status={checkCruci('right', cruciInputs.right || '')}
                />
                
                <div />
                <CruciInput 
                  value={cruciInputs.down || ''} 
                  onChange={(v) => setCruciInputs({...cruciInputs, down: v})}
                  status={checkCruci('down', cruciInputs.down || '')}
                />
                <div />
              </div>
              <button 
                onClick={startCruciChallenge}
                className="w-full mt-6 bg-violet-600 text-white py-3 rounded-xl font-bold hover:bg-violet-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <RefreshCcw size={18} /> Otro Crucinúmero
              </button>
            </div>
          )}

          {mode === 'path' && pathChallenge && (
            <div className="bg-purple-50 p-6 rounded-3xl border-2 border-purple-100">
              <h3 className="font-black text-purple-800 mb-4 flex items-center gap-2">
                <RefreshCcw size={20} /> Camino Numérico
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-purple-600 uppercase">Inicio:</span>
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-lg font-black">{pathChallenge.start}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {pathChallenge.moves.map((move, i) => (
                    <div key={i} className="bg-white border-2 border-purple-200 px-3 py-2 rounded-xl flex flex-col items-center shadow-sm">
                      <span className="text-[10px] text-purple-400 font-bold">Mueve</span>
                      <span className="text-lg font-black text-purple-700">{move.label}</span>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-purple-700 font-medium italic">
                  Marca el camino en la tabla y pulsa el botón al llegar al destino.
                </p>
              </div>

              <button 
                onClick={checkPathResult}
                className="w-full mb-4 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                ¡He llegado!
              </button>

              {pathFeedback !== 'none' && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  className={`p-4 rounded-2xl text-center font-black mb-4 ${
                    pathFeedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700 animate-shake'
                  }`}
                >
                  {pathFeedback === 'correct' ? '¡Excelente puntería!' : '¡Casi! Inténtalo de nuevo'}
                </motion.div>
              )}

              <button 
                onClick={startPathChallenge}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <RefreshCcw size={18} /> Nuevo Camino
              </button>
            </div>
          )}

          {mode === 'retro' && retroStart !== null && (
            <div className="bg-purple-50 p-6 rounded-3xl border-2 border-purple-100">
              <h3 className="font-black text-purple-800 mb-4 flex items-center gap-2">
                <ArrowLeftCircle size={20} /> Retrocuenta
              </h3>
              
              <div className="text-center space-y-4">
                <p className="text-sm text-purple-700 font-medium">
                  Cuenta hacia atrás desde el <b>{retroStart}</b>.
                </p>
                
                <div className="flex justify-center items-center gap-4">
                  <div className="bg-white p-4 rounded-2xl border-2 border-purple-200 shadow-sm">
                    <span className="text-xs block text-purple-400 font-bold uppercase">Siguiente</span>
                    <span className="text-3xl font-black text-purple-600">{retroTarget}</span>
                  </div>
                </div>

                <div className="text-purple-600 font-black text-xl">
                  Pasos: {retroCount}
                </div>

                {retroTarget === 0 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center mt-4">
                    <Trophy className="mx-auto text-amber-500 mb-2" size={48} />
                    <p className="font-black text-purple-800">¡Misión Cumplida!</p>
                  </motion.div>
                )}

                <button 
                  onClick={startRetroChallenge}
                  className="w-full mt-4 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <RefreshCcw size={18} /> Reiniciar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CruciInput({ value, onChange, status }: any) {
  return (
    <input 
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-12 h-12 text-center font-black rounded-xl border-2 outline-none transition-all
        ${status === 'correct' ? 'bg-emerald-50 border-emerald-400 text-emerald-700' :
          status === 'incorrect' ? 'bg-rose-50 border-rose-400 text-rose-700' :
          'bg-white border-violet-200 focus:border-violet-500'}
      `}
      placeholder="?"
    />
  );
}
