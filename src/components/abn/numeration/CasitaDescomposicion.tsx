/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Plus, Trash2, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';

interface Floor {
  id: string;
  left: string;
  right: string;
}

interface Props {
  targetNumber?: number;
}

export default function CasitaDescomposicion({ targetNumber: propTarget }: Props) {
  const [targetNumber, setTargetNumber] = useState(propTarget || 10);
  const [floors, setFloors] = useState<Floor[]>([
    { id: '1', left: '', right: '' }
  ]);

  useEffect(() => {
    if (propTarget !== undefined) {
      setTargetNumber(propTarget);
      setFloors([{ id: '1', left: '', right: '' }]);
    }
  }, [propTarget]);

  const addFloor = () => {
    setFloors([...floors, { id: Math.random().toString(36).substr(2, 9), left: '', right: '' }]);
  };

  const removeFloor = (id: string) => {
    setFloors(floors.filter(f => f.id !== id));
  };

  const updateFloor = (id: string, side: 'left' | 'right', value: string) => {
    setFloors(floors.map(f => f.id === id ? { ...f, [side]: value } : f));
  };

  const checkFloor = (floor: Floor) => {
    const l = parseInt(floor.left);
    const r = parseInt(floor.right);
    if (isNaN(l) || isNaN(r)) return 'neutral';
    return l + r === targetNumber ? 'correct' : 'incorrect';
  };

  const generateChallenge = () => {
    const nums = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 12, 25, 50];
    setTargetNumber(nums[Math.floor(Math.random() * nums.length)]);
    setFloors([{ id: '1', left: '', right: '' }]);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-pastel-indigo/60 rounded-[3rem] border-4 border-pastel-indigo-dark shadow-inner">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-indigo-800 flex items-center justify-center gap-4">
          <Home size={40} className="text-indigo-600" />
          Casita de Descomposición
        </h2>
        <p className="text-indigo-900 font-black text-xl mt-3">Busca todas las formas de formar el {targetNumber}</p>
        <button 
          onClick={generateChallenge}
          className="mt-6 bg-amber-500 text-white px-8 py-3 rounded-2xl font-black text-lg hover:bg-amber-600 transition-all flex items-center gap-3 mx-auto shadow-xl shadow-amber-100 active:scale-95"
          aria-label="Cambiar el número objetivo de la casita"
        >
          <RotateCcw size={22} /> ¡Cambiar Número!
        </button>
      </div>

      <div className="relative">
        {/* Tejado */}
        <div className="relative z-10 flex justify-center">
          <div className="w-0 h-0 border-l-[140px] border-l-transparent border-r-[140px] border-r-transparent border-b-[100px] border-b-indigo-700 relative drop-shadow-2xl">
            <div className="absolute top-[50px] left-1/2 -translate-x-1/2 text-white text-5xl font-black tracking-tighter">
              {targetNumber}
            </div>
          </div>
        </div>

        {/* Cuerpo de la casa */}
        <div className="bg-pastel-slate p-6 rounded-b-[3rem] border-x-[12px] border-b-[12px] border-indigo-700 min-h-[250px] -mt-2 shadow-2xl">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {floors.map((floor, index) => {
                const status = checkFloor(floor);
                return (
                  <motion.div 
                    key={floor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-4 transition-all ${
                      status === 'correct' ? 'bg-pastel-emerald border-emerald-400 text-emerald-900' : 
                      status === 'incorrect' ? 'bg-pastel-rose border-rose-400 text-rose-900' : 
                      'bg-pastel-slate border-pastel-slate-dark text-slate-800'
                    }`}
                  >
                    <input 
                      type="number"
                      value={floor.left}
                      onChange={(e) => updateFloor(floor.id, 'left', e.target.value)}
                      placeholder="?"
                      aria-label="Primer sumando del piso"
                      className="w-full p-4 text-center text-3xl font-black rounded-xl border-4 border-white focus:border-indigo-400 outline-none bg-white/80"
                    />
                    <Plus className="text-indigo-300" size={32} />
                    <input 
                      type="number"
                      value={floor.right}
                      onChange={(e) => updateFloor(floor.id, 'right', e.target.value)}
                      placeholder="?"
                      aria-label="Segundo sumando del piso"
                      className="w-full p-4 text-center text-3xl font-black rounded-xl border-4 border-white focus:border-indigo-400 outline-none bg-white/80"
                    />
                    
                    <div className="flex gap-2">
                      {status === 'correct' && <CheckCircle2 className="text-emerald-600" size={32} />}
                      {status === 'incorrect' && <AlertCircle className="text-rose-600" size={32} />}
                      <button 
                        onClick={() => removeFloor(floor.id)}
                        className="p-3 text-slate-400 hover:text-rose-600 hover:bg-white rounded-full transition-all"
                        aria-label="Eliminar este piso"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button 
            onClick={addFloor}
            className="w-full mt-8 py-5 border-4 border-dashed border-indigo-200 rounded-[2rem] text-indigo-400 font-black text-xl hover:border-indigo-400 hover:text-indigo-600 hover:bg-pastel-indigo transition-all flex items-center justify-center gap-3 group"
            aria-label="Añadir un nuevo piso a la casita"
          >
            <Plus className="group-hover:scale-125 transition-transform" size={28} />
            Añadir Piso
          </button>
        </div>
      </div>

      <div className="mt-10 bg-white/60 p-6 rounded-[2rem] border-2 border-indigo-100 text-indigo-900 text-lg font-black italic text-center shadow-sm">
        "En la casita, cada piso es una pareja de amigos que forman el número del tejado."
      </div>
    </div>
  );
}
