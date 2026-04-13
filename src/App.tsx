/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LandingPage from './components/LandingPage';
import NumeroProtagonista from './components/abn/numeration/NumeroProtagonista';
import OperationsManager from './components/abn/operations/OperationsManager';
import GeneradorProblemas from './components/abn/problems/GeneradorProblemas';
import CasitaDescomposicion from './components/abn/numeration/CasitaDescomposicion';
import AmigosNumeros from './components/abn/numeration/AmigosNumeros';
import Tabla100 from './components/abn/numeration/Tabla100';
import SolDescomposicion from './components/abn/numeration/SolDescomposicion';
import PiramideCalculo from './components/abn/numeration/PiramideCalculo';
import { Hash, Calculator, BookOpen, BrainCircuit, Home, Heart, Grid3X3, Sun, Triangle } from 'lucide-react';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<'numeration' | 'operations' | 'problems' | 'amigos' | 'tabla'>('numeration');
  const [highContrast, setHighContrast] = useState(false);

  const getBgColor = () => {
    if (highContrast) return 'bg-white';
    switch (activeTab) {
      case 'numeration': return 'bg-pastel-indigo/60';
      case 'amigos': return 'bg-pastel-rose/60';
      case 'tabla': return 'bg-pastel-mauve/70';
      case 'operations': return 'bg-pastel-amber/60';
      case 'problems': return 'bg-pastel-emerald/60';
      default: return 'bg-pastel-blue/60';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${getBgColor()} ${highContrast ? 'text-black' : ''}`}>
      <AnimatePresence mode="wait">
        {showLanding ? (
          <LandingPage 
            onStart={() => setShowLanding(false)} 
            onNavigate={(tab) => {
              setActiveTab(tab);
              setShowLanding(false);
            }}
          />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {/* Navegación Superior */}
            <nav className={`${highContrast ? 'bg-black text-white' : 'bg-white/80 backdrop-blur-md shadow-sm border-b border-indigo-100'} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between py-2 md:h-16 items-center gap-2 md:gap-0">
            <button 
              onClick={() => setShowLanding(true)}
              className="flex items-center gap-1 md:gap-2 shrink-0 hover:opacity-80 transition-opacity"
            >
              <div className={`${highContrast ? 'bg-white text-black' : 'bg-indigo-600'} p-1.5 md:p-2 rounded-xl text-white shadow-lg shadow-indigo-100`}>
                <BookOpen size={18} className="md:w-6 md:h-6" />
              </div>
              <span className={`font-black text-base md:text-xl tracking-tighter ${highContrast ? 'text-white' : 'text-slate-800'}`}>
                ABN <span className={highContrast ? 'text-white underline' : 'text-indigo-600'}>Pro</span>
              </span>
            </button>
            
            <div className="flex flex-wrap md:flex-nowrap gap-1 py-1 md:py-2 flex-1 justify-center scroll-smooth px-2">
              <button 
                onClick={() => setShowLanding(true)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full font-black transition-all whitespace-nowrap shadow-sm ${highContrast ? 'text-white hover:bg-white/20' : 'text-slate-500 hover:bg-indigo-50'}`}
              >
                <Home size={16} className="md:w-[18px] md:h-[18px]" /> <span className="text-[10px] md:text-sm">Inicio</span>
              </button>
              <button 
                onClick={() => setActiveTab('numeration')}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full font-black transition-all whitespace-nowrap shadow-sm ${activeTab === 'numeration' ? (highContrast ? 'bg-white text-black' : 'bg-indigo-600 text-white scale-105 shadow-indigo-200') : (highContrast ? 'text-white hover:bg-white/20' : 'text-slate-500 hover:bg-indigo-50')}`}
              >
                <Hash size={16} className="md:w-[18px] md:h-[18px]" /> <span className="text-[10px] md:text-sm">Protagonista</span>
              </button>
              <button 
                onClick={() => setActiveTab('amigos')}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full font-black transition-all whitespace-nowrap shadow-sm ${activeTab === 'amigos' ? (highContrast ? 'bg-white text-black' : 'bg-rose-600 text-white scale-105 shadow-rose-200') : (highContrast ? 'text-white hover:bg-white/20' : 'text-slate-500 hover:bg-rose-50')}`}
              >
                <Heart size={16} className="md:w-[18px] md:h-[18px]" /> <span className="text-[10px] md:text-sm">Amigos</span>
              </button>
              <button 
                onClick={() => setActiveTab('tabla')}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full font-black transition-all whitespace-nowrap shadow-sm ${activeTab === 'tabla' ? (highContrast ? 'bg-white text-black' : 'bg-purple-600 text-white scale-105 shadow-purple-200') : (highContrast ? 'text-white hover:bg-white/20' : 'text-slate-500 hover:bg-purple-50')}`}
              >
                <Grid3X3 size={16} className="md:w-[18px] md:h-[18px]" /> <span className="text-[10px] md:text-sm">Tabla 100</span>
              </button>
              <button 
                onClick={() => setActiveTab('operations')}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full font-black transition-all whitespace-nowrap shadow-sm ${activeTab === 'operations' ? (highContrast ? 'bg-white text-black' : 'bg-orange-600 text-white scale-105 shadow-orange-200') : (highContrast ? 'text-white hover:bg-white/20' : 'text-slate-500 hover:bg-orange-50')}`}
              >
                <Calculator size={16} className="md:w-[18px] md:h-[18px]" /> <span className="text-[10px] md:text-sm">Operaciones</span>
              </button>
              <button 
                onClick={() => setActiveTab('problems')}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full font-black transition-all whitespace-nowrap shadow-sm ${activeTab === 'problems' ? (highContrast ? 'bg-white text-black' : 'bg-emerald-600 text-white scale-105 shadow-emerald-200') : (highContrast ? 'text-white hover:bg-white/20' : 'text-slate-500 hover:bg-emerald-50')}`}
              >
                <BrainCircuit size={16} className="md:w-[18px] md:h-[18px]" /> <span className="text-[10px] md:text-sm">Problemas</span>
              </button>
            </div>

            <div className="flex items-center md:ml-2">
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`p-2 rounded-xl font-black text-xs flex flex-col items-center gap-1 transition-all ${highContrast ? 'bg-white text-black' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                title="Alternar Contraste Alto"
              >
                <Sun size={16} />
                <span className="hidden lg:inline">Contraste</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="py-4 md:py-8 px-2 md:px-4 overflow-x-hidden">
        {activeTab === 'numeration' && <NumeroProtagonista />}
        {activeTab === 'amigos' && <AmigosNumeros />}
        {activeTab === 'tabla' && <Tabla100 />}
        {activeTab === 'operations' && <OperationsManager />}
        {activeTab === 'problems' && <GeneradorProblemas />}
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
