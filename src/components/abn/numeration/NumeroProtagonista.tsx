/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hash, ArrowLeftRight, LayoutGrid, Pencil, CheckCircle2, XCircle, Info, RotateCcw, Plus, Home, Sun, Triangle, HelpCircle, Trash2, Divide, Zap, Minus, BookOpen } from 'lucide-react';
import CasitaDescomposicion from './CasitaDescomposicion';
import SolDescomposicion from './SolDescomposicion';
import PiramideCalculo from './PiramideCalculo';

type SubTab = 'base' | 'casita' | 'sol' | 'piramide';

export default function NumeroProtagonista() {
  const [number, setNumber] = useState<number>(25);
  const [inputValue, setInputValue] = useState<string>("25");
  const [showPalillos, setShowPalillos] = useState(true);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('base');
  const [showInstructions, setShowInstructions] = useState(false);

  // Estado para los retos del alumno
  const [userNeighbors, setUserNeighbors] = useState({
    ant: "", post: "", ant10: "", post10: ""
  });
  const [userDecomp, setUserDecomp] = useState({ hundreds: "", tens: "", units: "" });
  const [userDoubleHalf, setUserDoubleHalf] = useState({ double: "", half: "" });
  const [userDecenas, setUserDecenas] = useState(0);
  const [userUnidades, setUserUnidades] = useState(0);
  const [userCentenas, setUserCentenas] = useState(0);

  const handleNumberChange = (val: string) => {
    if (isChallengeMode) return; // No permitir cambiar el número en modo reto
    setInputValue(val);
    const n = parseInt(val);
    if (!isNaN(n) && n >= 0 && n <= 1000) {
      setNumber(n);
      resetChallenges();
    }
  };

  const resetChallenges = () => {
    setUserNeighbors({ ant: "", post: "", ant10: "", post10: "" });
    setUserDecomp({ hundreds: "", tens: "", units: "" });
    setUserDoubleHalf({ double: "", half: "" });
    setUserDecenas(0);
    setUserUnidades(0);
    setUserCentenas(0);
  };

  const generateRandomChallenge = () => {
    const randomNum = Math.floor(Math.random() * 490) + 11; // Números entre 11 y 500 para incluir centenas
    setNumber(randomNum);
    setInputValue(randomNum.toString());
    resetChallenges();
    setIsChallengeMode(true);
  };

  const centenas = Math.floor(number / 100);
  const decenas = Math.floor((number % 100) / 10);
  const unidades = number % 10;

  // Validación de vecinos
  const checkNeighbor = (val: string, expected: number) => {
    if (val === "") return "neutral";
    return parseInt(val) === expected ? "correct" : "incorrect";
  };

  const getStatusColor = (status: string) => {
    if (status === "correct") return "border-emerald-400 bg-pastel-emerald text-emerald-900";
    if (status === "incorrect") return "border-rose-400 bg-pastel-rose text-rose-900";
    return "border-pastel-slate-dark bg-pastel-slate text-slate-600";
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 font-sans selection:bg-indigo-100">
      <header className="max-w-4xl mx-auto mb-6 md:mb-8 relative px-10 md:px-12">
        <button 
          onClick={() => setShowInstructions(true)}
          className="absolute top-1/2 -translate-y-1/2 right-0 p-1 md:p-2 text-indigo-400 hover:text-indigo-600 transition-colors focus:ring-4 focus:ring-indigo-200 rounded-full"
          aria-label="Ver instrucciones de uso"
          title="Instrucciones"
        >
          <HelpCircle size={24} className="md:w-8 md:h-8" />
        </button>
        <div className="text-center">
          <h1 className="text-xl md:text-5xl font-black text-indigo-700 mb-1 md:mb-2 tracking-tight leading-tight">El Número Protagonista</h1>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <button 
            onClick={() => setIsChallengeMode(false)}
            className={`px-8 py-3 rounded-2xl font-black transition-all text-lg shadow-lg ${!isChallengeMode ? 'bg-indigo-600 text-white scale-105 shadow-indigo-200' : 'bg-white text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-50'}`}
            aria-pressed={!isChallengeMode}
          >
            Modo Libre
          </button>
          <button 
            onClick={generateRandomChallenge}
            className={`px-8 py-3 rounded-2xl font-black transition-all text-lg flex items-center gap-3 shadow-lg ${isChallengeMode ? 'bg-amber-500 text-white scale-105 shadow-amber-200' : 'bg-white text-amber-600 border-2 border-amber-100 hover:bg-amber-50'}`}
            aria-pressed={isChallengeMode}
          >
            <RotateCcw size={22} className={isChallengeMode ? 'animate-spin-slow' : ''} />
            ¡Nuevo Reto!
          </button>
        </div>
      </header>

      {/* Sub-Navegación */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 bg-white/80 p-2 md:p-3 rounded-[2rem] backdrop-blur-md border-2 border-white max-w-fit mx-auto shadow-xl relative z-20">
        <button 
          onClick={() => setActiveSubTab('base')}
          className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-black transition-all flex items-center gap-2 text-base md:text-lg shadow-sm ${activeSubTab === 'base' ? 'bg-indigo-600 text-white scale-105 shadow-indigo-200' : 'text-slate-500 hover:bg-indigo-50'}`}
          aria-label="Ver representación base"
        >
          <Hash size={18} className="md:w-5 md:h-5" /> Base
        </button>
        <button 
          onClick={() => setActiveSubTab('casita')}
          className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-black transition-all flex items-center gap-2 text-base md:text-lg shadow-sm ${activeSubTab === 'casita' ? 'bg-indigo-600 text-white scale-105 shadow-indigo-200' : 'text-slate-500 hover:bg-indigo-50'}`}
          aria-label="Ver casita de descomposición"
        >
          <Home size={18} className="md:w-5 md:h-5" /> Casita
        </button>
        <button 
          onClick={() => setActiveSubTab('sol')}
          className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-black transition-all flex items-center gap-2 text-base md:text-lg shadow-sm ${activeSubTab === 'sol' ? 'bg-amber-500 text-white scale-105 shadow-amber-200' : 'text-slate-500 hover:bg-amber-50'}`}
          aria-label="Ver sol de descomposición"
        >
          <Sun size={18} className="md:w-5 md:h-5" /> Sol
        </button>
        <button 
          onClick={() => setActiveSubTab('piramide')}
          className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-black transition-all flex items-center gap-2 text-base md:text-lg shadow-sm ${activeSubTab === 'piramide' ? 'bg-indigo-600 text-white scale-105 shadow-indigo-200' : 'text-slate-500 hover:bg-indigo-50'}`}
          aria-label="Ver pirámide de cálculo"
        >
          <Triangle size={18} className="md:w-5 md:h-5" /> Pirámide
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'base' && (
          <motion.div 
            key="base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Panel Central: Entrada y Crucinúmero */}
            <section className="lg:col-span-1 space-y-8">
              <div className={`bg-pastel-indigo p-8 rounded-[2.5rem] shadow-xl border-4 transition-all ${isChallengeMode ? 'border-amber-300' : 'border-indigo-200'}`}>
                <label className="block text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">
                  {isChallengeMode ? 'Número del Reto' : 'Número Protagonista'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => handleNumberChange(e.target.value)}
                    readOnly={isChallengeMode}
                    aria-label="Introduce el número protagonista"
                    className={`w-full text-5xl md:text-7xl font-black text-center py-4 md:py-6 rounded-3xl transition-all outline-none border-4 ${isChallengeMode ? 'bg-white border-amber-200 text-amber-700' : 'bg-white border-indigo-100 text-indigo-700 focus:border-indigo-400 focus:ring-8 focus:ring-indigo-100'}`}
                    min="0"
                    max="1000"
                  />
                  <Hash className={`absolute top-4 md:top-6 left-4 md:left-6 ${isChallengeMode ? 'text-amber-200' : 'text-indigo-200'}`} size={32} />
                </div>
              </div>

              {/* Crucinúmero Interactivo */}
              <div className="bg-pastel-slate p-8 rounded-[2.5rem] shadow-xl border-4 border-pastel-slate-dark">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <LayoutGrid size={24} className="text-indigo-500" />
                  ¿Quiénes son sus vecinos?
                </h3>
                <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto">
                  <div className="col-start-2">
                    <input
                      type="number"
                      placeholder="-10"
                      aria-label="Vecino de arriba: número menos diez"
                      value={userNeighbors.ant10}
                      onChange={(e) => setUserNeighbors({...userNeighbors, ant10: e.target.value})}
                      className={`w-full p-4 rounded-2xl border-4 text-center text-2xl font-black transition-all outline-none ${getStatusColor(checkNeighbor(userNeighbors.ant10, number - 10))}`}
                    />
                  </div>
                  <div className="col-start-1 row-start-2">
                    <input
                      type="number"
                      placeholder="-1"
                      aria-label="Vecino de la izquierda: número menos uno"
                      value={userNeighbors.ant}
                      onChange={(e) => setUserNeighbors({...userNeighbors, ant: e.target.value})}
                      className={`w-full p-4 rounded-2xl border-4 text-center text-2xl font-black transition-all outline-none ${getStatusColor(checkNeighbor(userNeighbors.ant, number - 1))}`}
                    />
                  </div>
                  <div className="col-start-2 row-start-2 bg-indigo-600 p-4 rounded-2xl text-center text-white font-black shadow-xl flex items-center justify-center text-3xl">
                    {number}
                  </div>
                  <div className="col-start-3 row-start-2">
                    <input
                      type="number"
                      placeholder="+1"
                      aria-label="Vecino de la derecha: número más uno"
                      value={userNeighbors.post}
                      onChange={(e) => setUserNeighbors({...userNeighbors, post: e.target.value})}
                      className={`w-full p-4 rounded-2xl border-4 text-center text-2xl font-black transition-all outline-none ${getStatusColor(checkNeighbor(userNeighbors.post, number + 1))}`}
                    />
                  </div>
                  <div className="col-start-2 row-start-3">
                    <input
                      type="number"
                      placeholder="+10"
                      aria-label="Vecino de abajo: número más diez"
                      value={userNeighbors.post10}
                      onChange={(e) => setUserNeighbors({...userNeighbors, post10: e.target.value})}
                      className={`w-full p-4 rounded-2xl border-4 text-center text-2xl font-black transition-all outline-none ${getStatusColor(checkNeighbor(userNeighbors.post10, number + 10))}`}
                    />
                  </div>
                </div>
                <button 
                  onClick={resetChallenges}
                  className="mt-8 w-full py-3 text-sm font-black text-slate-500 hover:text-rose-600 hover:bg-pastel-rose rounded-xl flex items-center justify-center gap-2 transition-all border-2 border-transparent hover:border-rose-200"
                >
                  <Trash2 size={18} /> Borrar respuestas
                </button>
              </div>

              {/* Doble y Mitad */}
              <div className="bg-pastel-amber/80 p-8 rounded-[2.5rem] shadow-xl border-4 border-pastel-amber-dark">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <Zap size={24} className="text-amber-500" />
                  Doble y Mitad
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">El Doble (x2)</label>
                    <input
                      type="number"
                      placeholder="?"
                      aria-label="Calcula el doble del número"
                      value={userDoubleHalf.double}
                      onChange={(e) => setUserDoubleHalf({...userDoubleHalf, double: e.target.value})}
                      className={`w-full p-4 rounded-2xl border-4 text-center text-2xl font-black transition-all outline-none ${getStatusColor(checkNeighbor(userDoubleHalf.double, number * 2))}`}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">La Mitad (/2)</label>
                    <input
                      type="number"
                      placeholder="?"
                      aria-label="Calcula la mitad del número"
                      value={userDoubleHalf.half}
                      onChange={(e) => setUserDoubleHalf({...userDoubleHalf, half: e.target.value})}
                      className={`w-full p-4 rounded-2xl border-4 text-center text-2xl font-black transition-all outline-none ${getStatusColor(checkNeighbor(userDoubleHalf.half, number / 2))}`}
                    />
                  </div>
                </div>
              </div>

              {/* Series y Retrocuenta */}
              <div className="bg-pastel-rose/80 p-8 rounded-[2.5rem] shadow-xl border-4 border-pastel-rose-dark">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <ArrowLeftRight size={24} className="text-rose-500" />
                  Series y Retrocuenta
                </h3>
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sigue la serie desde el {number}</p>
                  <div className="flex flex-col gap-3">
                    <SeriesChallenge startNum={number} />
                  </div>
                </div>
              </div>
            </section>

            {/* Panel Derecho: Representación Manipulativa Interactiva */}
            <section className="lg:col-span-2 space-y-8">
              <div className="bg-pastel-emerald/60 p-8 md:p-12 rounded-[3rem] shadow-xl border-4 border-pastel-emerald-dark min-h-[500px]">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
                  <h3 className="text-3xl font-black text-emerald-800 flex items-center gap-3">
                    <ArrowLeftRight size={32} />
                    Representación ABN
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {number >= 100 && (
                      <div className="flex items-center gap-2 bg-pastel-emerald p-2 rounded-2xl border-2 border-emerald-300">
                        <button onClick={() => setUserCentenas(Math.max(0, userCentenas - 1))} className="p-2 bg-white rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm"><Minus size={20}/></button>
                        <span className="font-black text-emerald-800 px-2">Centenas</span>
                        <button onClick={() => setUserCentenas(userCentenas + 1)} className="p-2 bg-white rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm"><Plus size={20}/></button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-pastel-rose p-2 rounded-2xl border-2 border-rose-300">
                      <button onClick={() => setUserDecenas(Math.max(0, userDecenas - 1))} className="p-2 bg-white rounded-xl text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"><Minus size={20}/></button>
                      <span className="font-black text-rose-800 px-2">Decenas</span>
                      <button onClick={() => setUserDecenas(userDecenas + 1)} className="p-2 bg-white rounded-xl text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"><Plus size={20}/></button>
                    </div>
                    <div className="flex items-center gap-2 bg-pastel-blue p-2 rounded-2xl border-2 border-blue-300">
                      <button onClick={() => setUserUnidades(Math.max(0, userUnidades - 1))} className="p-2 bg-white rounded-xl text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"><Minus size={20}/></button>
                      <span className="font-black text-blue-800 px-2">Unidades</span>
                      <button onClick={() => setUserUnidades(userUnidades + 1)} className="p-2 bg-white rounded-xl text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"><Plus size={20}/></button>
                    </div>
                  </div>
                </div>

                <div className={`grid grid-cols-1 ${number >= 100 ? 'lg:grid-cols-3' : 'md:grid-cols-2'} gap-6 md:gap-10`}>
                  {number >= 100 && (
                    <div className="bg-pastel-emerald p-6 md:p-8 rounded-[2rem] border-4 border-dashed border-emerald-300 min-h-[200px]">
                      <h4 className="text-center font-black text-emerald-800 mb-6 uppercase tracking-widest text-sm">Placas de 100 ({userCentenas})</h4>
                      {userCentenas === 0 && <p className="text-emerald-400 font-bold italic text-lg text-center w-full mb-4">Añade centenas verdes</p>}
                      <div className="flex flex-wrap gap-4 justify-center items-center min-h-[120px]">
                        {Array.from({ length: userCentenas }).map((_, i) => (
                          <motion.div
                            key={`centena-${i}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="relative w-32 h-32 bg-emerald-100 rounded-2xl border-4 border-emerald-400 flex items-center justify-center shadow-lg overflow-hidden"
                          >
                            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 p-1">
                              {Array.from({ length: 100 }).map((_, j) => (
                                <div key={j} className="border-[0.5px] border-emerald-300/30" />
                              ))}
                            </div>
                            <span className="relative z-20 font-black text-emerald-900 text-3xl bg-white/90 px-4 py-2 rounded-full shadow-md">100</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-pastel-rose p-6 md:p-8 rounded-[2rem] border-4 border-dashed border-rose-300 min-h-[200px]">
                    <h4 className="text-center font-black text-rose-800 mb-6 uppercase tracking-widest text-sm">Paquetes de 10 ({userDecenas})</h4>
                    {userDecenas === 0 && <p className="text-rose-400 font-bold italic text-lg text-center w-full mb-4">Añade decenas rojas</p>}
                    <div className="flex flex-wrap gap-4 md:gap-8 justify-center items-center min-h-[120px]">
                      {Array.from({ length: userDecenas }).map((_, i) => (
                        <motion.div
                          key={`decena-${i}`}
                          initial={{ scale: 0, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="relative w-16 md:w-20 h-28 md:h-32 bg-rose-100 rounded-2xl border-4 border-rose-400 flex items-center justify-center shadow-lg overflow-hidden"
                        >
                          <div className="absolute inset-0 flex justify-center gap-1 px-3">
                             {Array.from({ length: 10 }).map((_, j) => (
                               <div key={j} className="w-1.5 h-full bg-rose-500/40 rounded-full" />
                             ))}
                          </div>
                          <div className="absolute w-full h-4 bg-rose-600 shadow-md z-10 top-1/2 -translate-y-1/2" />
                          <span className="relative z-20 font-black text-rose-900 text-xl md:text-2xl bg-white/90 px-2 md:px-3 py-1 rounded-full shadow-md">10</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-pastel-blue p-6 md:p-8 rounded-[2rem] border-4 border-dashed border-blue-300 min-h-[200px]">
                    <h4 className="text-center font-black text-blue-800 mb-6 uppercase tracking-widest text-sm">Palillos Sueltos ({userUnidades})</h4>
                    {userUnidades === 0 && <p className="text-blue-400 font-bold italic text-lg text-center w-full mb-4">Añade unidades azules</p>}
                    <div className="flex flex-wrap gap-2 md:gap-4 justify-center items-end min-h-[120px]">
                      {Array.from({ length: userUnidades }).map((_, i) => (
                        <motion.div
                          key={`unidad-${i}`}
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="w-2 md:w-3 h-16 md:h-24 bg-blue-500 rounded-full shadow-md border-2 border-blue-600"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Validación de la representación */}
                <div className="mt-8 flex justify-center">
                  <div className={`px-10 py-4 rounded-full font-black text-xl flex items-center gap-4 transition-all shadow-xl ${
                    (userCentenas * 100 + userDecenas * 10 + userUnidades) === number ? 'bg-emerald-500 text-white scale-110' : 'bg-pastel-slate text-slate-400 border-4 border-pastel-slate-dark'
                  }`}>
                    { (userCentenas * 100 + userDecenas * 10 + userUnidades) === number ? (
                      <>
                        <CheckCircle2 size={32} />
                        ¡Representación Correcta!
                      </>
                    ) : (
                      <>
                        <Info size={32} className="text-indigo-300" />
                        Representa el número {number}
                      </>
                    )}
                  </div>
                </div>

                {/* Descomposición Interactiva */}
                <div className="mt-12 md:mt-16 bg-pastel-indigo p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border-4 border-indigo-200">
                  <h3 className="text-xl md:text-2xl font-black text-indigo-800 mb-6 md:mb-8 flex items-center gap-3">
                    <Pencil size={24} className="md:w-7 md:h-7" />
                    ¿Cómo se descompone?
                  </h3>
                  <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-2xl md:text-3xl font-black">
                    {number >= 100 && (
                      <>
                        <div className="flex flex-col items-center gap-2">
                          <input
                            type="number"
                            placeholder="?"
                            aria-label="Número de centenas multiplicado por cien"
                            value={userDecomp.hundreds}
                            onChange={(e) => setUserDecomp({...userDecomp, hundreds: e.target.value})}
                            className={`w-24 md:w-32 p-3 md:p-5 rounded-2xl md:rounded-3xl border-4 text-center outline-none transition-all ${
                              userDecomp.hundreds === "" ? 'border-emerald-200 bg-emerald-50' : getStatusColor(checkNeighbor(userDecomp.hundreds, centenas * 100))
                            }`}
                          />
                          <span className="text-[10px] md:text-xs font-black text-emerald-600 uppercase tracking-widest">Centenas</span>
                        </div>
                        <Plus className="text-indigo-400 shrink-0" size={24} />
                      </>
                    )}
                    <div className="flex flex-col items-center gap-2">
                      <input
                        type="number"
                        placeholder="?"
                        aria-label="Número de decenas multiplicado por diez"
                        value={userDecomp.tens}
                        onChange={(e) => setUserDecomp({...userDecomp, tens: e.target.value})}
                        className={`w-24 md:w-32 p-3 md:p-5 rounded-2xl md:rounded-3xl border-4 text-center outline-none transition-all ${
                          userDecomp.tens === "" ? 'border-rose-200 bg-rose-50' : getStatusColor(checkNeighbor(userDecomp.tens, decenas * 10))
                        }`}
                      />
                      <span className="text-[10px] md:text-xs font-black text-rose-600 uppercase tracking-widest">Decenas</span>
                    </div>
                    <Plus className="text-indigo-400 shrink-0" size={24} />
                    <div className="flex flex-col items-center gap-2">
                      <input
                        type="number"
                        placeholder="?"
                        aria-label="Número de unidades sueltas"
                        value={userDecomp.units}
                        onChange={(e) => setUserDecomp({...userDecomp, units: e.target.value})}
                        className={`w-24 md:w-32 p-3 md:p-5 rounded-2xl md:rounded-3xl border-4 text-center outline-none transition-all ${
                          userDecomp.units === "" ? 'border-blue-200 bg-blue-50' : getStatusColor(checkNeighbor(userDecomp.units, unidades))
                        }`}
                      />
                      <span className="text-[10px] md:text-xs font-black text-blue-600 uppercase tracking-widest">Unidades</span>
                    </div>
                    <span className="text-indigo-400 mx-1 md:mx-4 text-3xl md:text-5xl">=</span>
                    <div className="bg-indigo-700 text-white px-6 md:px-10 py-3 md:py-6 rounded-2xl md:rounded-3xl shadow-xl text-3xl md:text-5xl transform hover:scale-105 transition-transform">
                      {number}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeSubTab === 'casita' && (
          <motion.div key="casita" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <CasitaDescomposicion targetNumber={number} />
          </motion.div>
        )}

        {activeSubTab === 'sol' && (
          <motion.div key="sol" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <SolDescomposicion targetNumber={number} />
          </motion.div>
        )}

        {activeSubTab === 'piramide' && (
          <motion.div key="piramide" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PiramideCalculo targetNumber={number} />
          </motion.div>
        )}

      </AnimatePresence>

      <footer className="max-w-6xl mx-auto mt-12 flex justify-center">
        <div className="bg-pastel-indigo/50 px-6 py-3 rounded-full shadow-md flex items-center gap-3 text-slate-500 text-sm">
          <Info size={16} className="text-indigo-400" />
          <span>En ABN, los paquetes (fardos) de 10 son la base para comprender el sistema decimal.</span>
        </div>
      </footer>

      {/* Modal de Instrucciones */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              <div className="bg-indigo-600 p-8 text-white relative">
                <button 
                  onClick={() => setShowInstructions(false)}
                  className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
                >
                  <XCircle size={32} />
                </button>
                <h2 className="text-3xl font-black flex items-center gap-3">
                  <HelpCircle size={32} />
                  ¿Cómo jugar?
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-slate-800">Elige tu número</h4>
                    <p className="text-slate-500 text-sm">Escribe el número que quieras investigar o pulsa "¡Nuevo Reto!" para que la app elija uno por ti.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-slate-800">Explora sus vecinos</h4>
                    <p className="text-slate-500 text-sm">Completa el crucinúmero: ¿qué número va arriba (-10), abajo (+10), a la izquierda (-1) y a la derecha (+1)?</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-black shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-slate-800">Doble y Mitad</h4>
                    <p className="text-slate-500 text-sm">Calcula cuánto es el doble (multiplicar por 2) y la mitad (dividir entre 2) de tu número protagonista.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black shrink-0">4</div>
                  <div>
                    <h4 className="font-bold text-slate-800">Usa las herramientas</h4>
                    <p className="text-slate-500 text-sm">Cambia de pestaña para ver la Casita, el Sol o la Pirámide. ¡Todas se actualizan con tu número!</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowInstructions(false)}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all mt-4"
                >
                  ¡Entendido!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SeriesChallenge({ startNum }: { startNum: number }) {
  const [challenge, setChallenge] = useState<{ op: string, val: number, target: number }[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  useEffect(() => {
    generateSeries();
  }, [startNum]);

  const generateSeries = () => {
    let current = startNum;
    const newChallenge = [];
    for (let i = 0; i < 3; i++) {
      const isAdd = Math.random() > 0.5;
      const val = Math.floor(Math.random() * 15) + 2;
      const op = isAdd ? '+' : '-';
      const target = isAdd ? current + val : current - val;
      if (target < 0) { // Evitar negativos
        newChallenge.push({ op: '+', val, target: current + val });
        current += val;
      } else {
        newChallenge.push({ op, val, target });
        current = target;
      }
    }
    setChallenge(newChallenge);
    setUserAnswers(['', '', '']);
  };

  return (
    <div className="space-y-4">
      {challenge.map((step, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="bg-rose-100 text-rose-700 w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-sm">
            {step.op}{step.val}
          </div>
          <div className="text-slate-400 font-black">→</div>
          <input
            type="number"
            value={userAnswers[i]}
            onChange={(e) => {
              const newAns = [...userAnswers];
              newAns[i] = e.target.value;
              setUserAnswers(newAns);
            }}
            placeholder="?"
            className={`w-full p-3 rounded-xl border-4 text-center font-black text-xl transition-all outline-none ${
              userAnswers[i] === "" ? 'border-slate-100 bg-slate-50' :
              parseInt(userAnswers[i]) === step.target ? 'border-emerald-400 bg-emerald-50 text-emerald-700' :
              'border-rose-400 bg-rose-50 text-rose-700'
            }`}
          />
        </div>
      ))}
      <button 
        onClick={generateSeries}
        className="w-full py-2 text-xs font-black text-rose-500 hover:bg-rose-50 rounded-lg transition-all flex items-center justify-center gap-2"
      >
        <RotateCcw size={14} /> Cambiar serie
      </button>
    </div>
  );
}

function NeighborInput({ label, value, onChange, status }: { label: string, value: string, onChange: (v: string) => void, status: 'correct' | 'incorrect' | 'neutral' }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
      <input 
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-16 h-16 text-center font-black text-xl rounded-2xl border-4 transition-all outline-none ${
          status === 'correct' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' :
          status === 'incorrect' ? 'border-rose-400 bg-rose-50 text-rose-700' :
          'border-slate-100 focus:border-indigo-400 bg-slate-50'
        }`}
        placeholder="?"
      />
    </div>
  );
}
