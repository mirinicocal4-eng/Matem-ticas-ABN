/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Plus, Trash2, CheckCircle2, RotateCcw, HelpCircle, XCircle, Minus, X } from 'lucide-react';

interface Ray {
  id: string;
  value1: string;
  value2: string;
}

interface Props {
  targetNumber?: number;
}

type OperationType = 'sum' | 'sub' | 'mult';

export default function SolDescomposicion({ targetNumber: propTarget }: Props) {
  const [targetNumber, setTargetNumber] = useState(propTarget || 12);
  const [operation, setOperation] = useState<OperationType>('sum');
  const [showInstructions, setShowInstructions] = useState(false);
  const [rays, setRays] = useState<Ray[]>([
    { id: '1', value1: '', value2: '' },
    { id: '2', value1: '', value2: '' }
  ]);

  useEffect(() => {
    if (propTarget !== undefined) {
      setTargetNumber(propTarget);
      resetRays();
    }
  }, [propTarget]);

  const resetRays = () => {
    setRays([{ id: '1', value1: '', value2: '' }, { id: '2', value1: '', value2: '' }]);
  };

  const addRay = () => {
    if (rays.length >= 12) return; // Límite para accesibilidad cognitiva y visual
    setRays([...rays, { id: Math.random().toString(36).substr(2, 9), value1: '', value2: '' }]);
  };

  const removeRay = (id: string) => {
    setRays(rays.filter(r => r.id !== id));
  };

  const updateRay = (id: string, field: 'value1' | 'value2', val: string) => {
    setRays(rays.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const checkRay = (ray: Ray) => {
    const v1 = parseInt(ray.value1);
    const v2 = parseInt(ray.value2);
    if (isNaN(v1) || isNaN(v2)) return 'neutral';
    
    if (operation === 'sum') return v1 + v2 === targetNumber ? 'correct' : 'incorrect';
    if (operation === 'sub') return v1 - v2 === targetNumber ? 'correct' : 'incorrect';
    if (operation === 'mult') return v1 * v2 === targetNumber ? 'correct' : 'incorrect';
    return 'neutral';
  };

  const getOpSymbol = () => {
    if (operation === 'sum') return '+';
    if (operation === 'sub') return '-';
    if (operation === 'mult') return 'x';
    return '+';
  };

  const generateChallenge = () => {
    const nums = [10, 12, 15, 20, 24, 30, 50, 100];
    setTargetNumber(nums[Math.floor(Math.random() * nums.length)]);
    resetRays();
  };

    return (
      <>
        <div className="max-w-5xl mx-auto p-8 bg-pastel-amber/60 rounded-[3rem] border-4 border-pastel-amber-dark min-h-[700px] flex flex-col shadow-inner">
      <div className="text-center mb-6 relative z-40">
        <button 
          onClick={() => setShowInstructions(true)}
          className="absolute top-0 right-0 p-3 text-amber-600 hover:text-amber-800 transition-colors focus:ring-4 focus:ring-amber-200 rounded-full"
          aria-label="Ver instrucciones del sol de descomposición"
        >
          <HelpCircle size={32} />
        </button>
        <h2 className="text-4xl md:text-5xl font-black text-amber-700 flex items-center justify-center gap-4">
          <Sun size={48} className="animate-spin-slow text-amber-500" />
          Sol de Descomposición
        </h2>
        <p className="text-amber-900 font-black text-xl mt-3">¡Completa los rayos para el número {targetNumber}!</p>
        
        {/* Selector de Operación */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <button 
            onClick={() => { setOperation('sum'); resetRays(); }}
            className={`px-6 py-3 rounded-2xl font-black flex items-center gap-3 transition-all text-lg ${operation === 'sum' ? 'bg-amber-500 text-white shadow-xl scale-105' : 'bg-white text-amber-700 border-2 border-pastel-amber-dark'}`}
            aria-pressed={operation === 'sum'}
          >
            <Plus size={22} /> Sumas
          </button>
          <button 
            onClick={() => { setOperation('sub'); resetRays(); }}
            className={`px-6 py-3 rounded-2xl font-black flex items-center gap-3 transition-all text-lg ${operation === 'sub' ? 'bg-amber-500 text-white shadow-xl scale-105' : 'bg-white text-amber-700 border-2 border-pastel-amber-dark'}`}
            aria-pressed={operation === 'sub'}
          >
            <Minus size={22} /> Restas
          </button>
          <button 
            onClick={() => { setOperation('mult'); resetRays(); }}
            className={`px-6 py-3 rounded-2xl font-black flex items-center gap-3 transition-all text-lg ${operation === 'mult' ? 'bg-amber-500 text-white shadow-xl scale-105' : 'bg-white text-amber-700 border-2 border-pastel-amber-dark'}`}
            aria-pressed={operation === 'mult'}
          >
            <X size={22} /> Multiplicaciones
          </button>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center min-h-[600px] mt-16 mb-16">
        {/* Núcleo del Sol (Capa base) */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="z-30 w-48 h-48 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full border-8 border-white flex flex-col items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.4)] relative"
        >
          <span className="text-sm font-black text-amber-900/50 uppercase tracking-widest">Número</span>
          <span className="text-6xl font-black text-amber-900 drop-shadow-sm">{targetNumber}</span>
        </motion.div>

        {/* Contenedor de Rayos (Capa inferior de interacción) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          {rays.map((ray, index) => {
            const angle = (index / rays.length) * 360;
            const status = checkRay(ray);
            return (
              <div
                key={ray.id}
                style={{ 
                  transform: `rotate(${angle}deg)`,
                  height: '560px', // Aumentado para alejar más los cuadros y evitar que tapen el centro
                  position: 'absolute',
                  width: '2px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}
                className="pointer-events-auto"
              >
                {/* El componente del rayo al final del eje */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ transform: `rotate(-${angle}deg)` }}
                  className={`${rays.length > 6 ? 'p-2 gap-2' : 'p-4 gap-3'} rounded-[1.5rem] border-4 transition-all shadow-2xl flex items-center bg-white relative z-50 ${
                    status === 'correct' ? 'border-emerald-400 ring-8 ring-emerald-100' : 
                    status === 'incorrect' ? 'border-rose-400 animate-shake' : 
                    'border-amber-200'
                  }`}
                >
                  <input 
                    type="number"
                    value={ray.value1}
                    onChange={(e) => updateRay(ray.id, 'value1', e.target.value)}
                    aria-label="Primer número de la operación"
                    className={`${rays.length > 6 ? 'w-14 text-xl' : 'w-20 text-2xl'} text-center font-black text-amber-900 bg-pastel-amber rounded-xl outline-none p-3 border-2 border-transparent focus:border-amber-400`}
                    placeholder="?"
                  />
                  <span className="text-amber-500 font-black text-2xl">{getOpSymbol()}</span>
                  <input 
                    type="number"
                    value={ray.value2}
                    onChange={(e) => updateRay(ray.id, 'value2', e.target.value)}
                    aria-label="Segundo número de la operación"
                    className={`${rays.length > 6 ? 'w-14 text-xl' : 'w-20 text-2xl'} text-center font-black text-amber-900 bg-pastel-amber rounded-xl outline-none p-3 border-2 border-transparent focus:border-amber-400`}
                    placeholder="?"
                  />
                  <button 
                    onClick={() => removeRay(ray.id)}
                    className="ml-2 p-2 text-slate-300 hover:text-rose-600 hover:bg-pastel-rose rounded-full transition-all"
                    aria-label="Eliminar este rayo"
                  >
                    <Trash2 size={24} />
                  </button>
                </motion.div>
                
                {/* Línea visual del rayo que conecta con el centro */}
                <div className={`w-1.5 h-40 mt-2 rounded-full ${status === 'correct' ? 'bg-emerald-300' : 'bg-amber-200'} shadow-sm`} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-6 relative z-40">
        <div className="flex flex-wrap justify-center gap-6">
          <button 
            onClick={addRay}
            disabled={rays.length >= 12}
            className={`bg-amber-600 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-amber-700 transition-all flex items-center gap-4 shadow-2xl shadow-amber-200 active:scale-95 ${rays.length >= 12 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Plus size={32} /> Añadir Rayo
          </button>
          <button 
            onClick={generateChallenge}
            className="bg-white border-4 border-pastel-amber-dark text-amber-700 px-8 py-5 rounded-[2rem] font-black text-xl hover:bg-pastel-amber transition-all flex items-center gap-4 shadow-xl active:scale-95"
          >
            <RotateCcw size={28} /> Nuevo Número
          </button>
        </div>
        <p className="text-amber-900/70 text-lg font-black italic bg-white/50 px-6 py-2 rounded-full">
          "Cada rayo es una forma distinta de ver el mismo número."
        </p>
      </div>
    </div>

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
              <div className="bg-amber-500 p-8 text-white relative">
                <button 
                  onClick={() => setShowInstructions(false)}
                  className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
                >
                  <XCircle size={32} />
                </button>
                <h2 className="text-3xl font-black flex items-center gap-3">
                  <HelpCircle size={32} />
                  El Sol de Descomposición
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-black shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-slate-800">El núcleo es el objetivo</h4>
                    <p className="text-slate-500 text-sm">El número que ves en el centro del sol es el resultado que debes conseguir en cada rayo.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-black shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-slate-800">Elige tu operación</h4>
                    <p className="text-slate-500 text-sm">Puedes elegir si quieres completar el sol con sumas, restas o incluso multiplicaciones.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-black shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-slate-800">Completa los rayos</h4>
                    <p className="text-slate-500 text-sm">Escribe dos números en cada rayo. Si la operación es correcta, el rayo se volverá verde y brillará.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-black shrink-0">4</div>
                  <div>
                    <h4 className="font-bold text-slate-800">Borrar y Resetear</h4>
                    <p className="text-slate-500 text-sm">Usa la papelera para quitar un rayo o el botón de "Nuevo Número" para empezar de cero.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowInstructions(false)}
                  className="w-full bg-amber-500 text-white py-4 rounded-2xl font-black text-xl shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all mt-4"
                >
                  ¡A brillar!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
